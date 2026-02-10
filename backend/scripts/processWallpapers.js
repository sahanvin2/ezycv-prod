#!/usr/bin/env node

/**
 * ============================================================================
 *  WALLPAPER PROCESSING PIPELINE — All-in-One
 * ============================================================================
 * 
 *  Processes local wallpaper images (PNG/JPG) into optimized versions,
 *  uploads them to Backblaze B2, and creates MongoDB documents.
 * 
 *  For each source image it generates:
 *    1. Preview  → WebP (1280px desktop / 540px mobile), quality 75  (~80-200KB)
 *    2. Download → JPG  (original 5K dimensions),        quality 90  (~3-5MB)
 * 
 * ============================================================================
 *  USAGE
 * ============================================================================
 * 
 *  Process one category:
 *    node scripts/processWallpapers.js --source "D:\EzyCV_ASSETS\wallpapers\desktop\nature" --device desktop --category nature
 * 
 *  Process with custom batch size:
 *    node scripts/processWallpapers.js --source "D:\EzyCV_ASSETS\wallpapers\mobile\abstract" --device mobile --category abstract --batch 50
 * 
 *  Process ALL categories under a device folder:
 *    node scripts/processWallpapers.js --source "D:\EzyCV_ASSETS\wallpapers\desktop" --device desktop --all
 * 
 *  Dry run (no upload, no DB writes — just show what would happen):
 *    node scripts/processWallpapers.js --source "..." --device desktop --category nature --dry
 * 
 *  Save processed files locally too (in addition to B2 upload):
 *    node scripts/processWallpapers.js --source "..." --device desktop --category nature --output "D:\EzyCV_OUTPUT"
 * 
 * ============================================================================
 */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

// ─── CONFIGURATION ───────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'nature', 'abstract', 'animals', 'architecture',
  'space', 'gaming', 'minimalist', 'dark', 'gradient'
];

const VALID_DEVICES = ['desktop', 'mobile'];

const PREVIEW_CONFIG = {
  desktop: { width: 1280, format: 'webp', quality: 75 },
  mobile:  { width: 540,  format: 'webp', quality: 75 }
};

const DOWNLOAD_CONFIG = {
  format: 'jpeg',
  quality: 90,
  mozjpeg: true  // Better compression
};

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.tiff']);

// ─── PARSE CLI ARGUMENTS ────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    source: null,
    device: null,
    category: null,
    batch: 100,
    all: false,
    dry: false,
    output: null,
    skip: 0,
    limit: 0  // 0 = no limit
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source':  parsed.source   = args[++i]; break;
      case '--device':  parsed.device   = args[++i]; break;
      case '--category': parsed.category = args[++i]; break;
      case '--batch':   parsed.batch    = parseInt(args[++i]) || 100; break;
      case '--all':     parsed.all      = true; break;
      case '--dry':     parsed.dry      = true; break;
      case '--output':  parsed.output   = args[++i]; break;
      case '--skip':    parsed.skip     = parseInt(args[++i]) || 0; break;
      case '--limit':   parsed.limit    = parseInt(args[++i]) || 0; break;
      case '--help':    printUsage(); process.exit(0);
    }
  }

  return parsed;
}

function printUsage() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║          WALLPAPER PROCESSING PIPELINE                       ║
╚══════════════════════════════════════════════════════════════╝

USAGE:
  node scripts/processWallpapers.js [options]

OPTIONS:
  --source <path>     Source folder (required)
  --device <type>     "desktop" or "mobile" (required)
  --category <name>   Category name (required unless --all)
  --batch <number>    Images per batch (default: 100)
  --all               Process all category subfolders
  --dry               Dry run — no uploads or DB writes
  --output <path>     Also save processed files locally
  --skip <number>     Skip first N images
  --limit <number>    Process at most N images (0 = all)
  --help              Show this help

CATEGORIES:
  ${VALID_CATEGORIES.join(', ')}

EXAMPLES:
  node scripts/processWallpapers.js \\
    --source "D:\\EzyCV_ASSETS\\wallpapers\\desktop\\nature" \\
    --device desktop --category nature

  node scripts/processWallpapers.js \\
    --source "D:\\EzyCV_ASSETS\\wallpapers\\desktop" \\
    --device desktop --all --batch 50

  node scripts/processWallpapers.js \\
    --source "D:\\EzyCV_ASSETS\\wallpapers\\mobile\\dark" \\
    --device mobile --category dark --output "D:\\EzyCV_OUTPUT"
`);
}

// ─── B2 CLIENT ──────────────────────────────────────────────────────────────

let _s3Client = null;

function getS3Client() {
  if (!_s3Client) {
    if (!process.env.B2_ENDPOINT) {
      throw new Error('B2_ENDPOINT not set in .env');
    }
    _s3Client = new S3Client({
      endpoint: process.env.B2_ENDPOINT,
      region: 'us-east-005',
      credentials: {
        accessKeyId: process.env.B2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY || ''
      },
      forcePathStyle: true
    });
  }
  return _s3Client;
}

// ─── IMAGE PROCESSING ──────────────────────────────────────────────────────

/**
 * Create a WebP preview image
 */
async function createPreview(buffer, device) {
  const config = PREVIEW_CONFIG[device];
  const result = await sharp(buffer)
    .resize(config.width, null, {
      fit: 'inside',
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3
    })
    .webp({ quality: config.quality, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
    size: result.data.length
  };
}

/**
 * Create an optimized JPG download (keep original dimensions, strip metadata)
 */
async function createOptimizedDownload(buffer) {
  const result = await sharp(buffer)
    .jpeg({
      quality: DOWNLOAD_CONFIG.quality,
      mozjpeg: DOWNLOAD_CONFIG.mozjpeg,
      progressive: true
    })
    .withMetadata(false)  // strip EXIF
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
    size: result.data.length
  };
}

/**
 * Get image metadata without processing
 */
async function getImageMeta(filePath) {
  const meta = await sharp(filePath).metadata();
  return { width: meta.width, height: meta.height, format: meta.format, size: meta.size };
}

// ─── B2 UPLOAD ──────────────────────────────────────────────────────────────

async function uploadBufferToB2(buffer, key, contentType) {
  const client = getS3Client();
  const bucket = process.env.B2_BUCKET;

  const upload = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000'
    }
  });

  await upload.done();

  const publicBase = process.env.B2_PUBLIC_BASE;
  return `${publicBase}/${key}`;
}

// ─── SLUG GENERATION ────────────────────────────────────────────────────────

function createSlug(fileName, category, device) {
  // Remove extension and clean up
  const base = path.basename(fileName, path.extname(fileName));
  const clean = base
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${clean}-${category}-${device}`;
}

function createTitle(fileName) {
  const base = path.basename(fileName, path.extname(fileName));
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\s+\d{4}$/, '')  // remove trailing number like 0001
    .trim();
}

function extractTags(fileName, category) {
  const base = path.basename(fileName, path.extname(fileName));
  const parts = base
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(p => p.length > 2 && !/^\d+$/.test(p) && !['5k', 'desktop', 'mobile'].includes(p));

  const tagSet = new Set([category, ...parts]);
  return [...tagSet].slice(0, 8);
}

// ─── FORMAT HELPERS ─────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDuration(ms) {
  if (ms < 1000) return ms + 'ms';
  if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

// ─── MAIN PIPELINE ──────────────────────────────────────────────────────────

async function processCategory(sourceDir, device, category, options) {
  const { batch, dry, output, skip, limit } = options;

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Processing: ${category} (${device})`);
  console.log(`  Source: ${sourceDir}`);
  console.log(`  Mode: ${dry ? 'DRY RUN' : 'LIVE'}`);
  console.log(`${'═'.repeat(60)}\n`);

  // 1. Scan for images
  if (!fs.existsSync(sourceDir)) {
    console.error(`  ❌ Source directory not found: ${sourceDir}`);
    return { processed: 0, skipped: 0, failed: 0 };
  }

  let files = fs.readdirSync(sourceDir)
    .filter(f => SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort();

  console.log(`  📂 Found ${files.length} images`);

  // Apply skip/limit
  if (skip > 0) {
    files = files.slice(skip);
    console.log(`  ⏭️  Skipping first ${skip}, remaining: ${files.length}`);
  }
  if (limit > 0) {
    files = files.slice(0, limit);
    console.log(`  🔢 Limiting to ${limit} images`);
  }

  if (files.length === 0) {
    console.log('  ⚠️  No images to process.');
    return { processed: 0, skipped: 0, failed: 0 };
  }

  // 2. Load Wallpaper model for duplicate checking
  const Wallpaper = require('../models/Wallpaper');

  // 3. Create local output dirs if --output is set
  if (output) {
    const previewDir = path.join(output, 'wallpapers', device, category, 'preview');
    const downloadDir = path.join(output, 'wallpapers', device, category, '5k');
    fs.mkdirSync(previewDir, { recursive: true });
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  const startTime = Date.now();

  // 4. Process in batches
  for (let batchStart = 0; batchStart < files.length; batchStart += batch) {
    const batchFiles = files.slice(batchStart, batchStart + batch);
    const batchNum = Math.floor(batchStart / batch) + 1;
    const totalBatches = Math.ceil(files.length / batch);

    console.log(`\n  ── Batch ${batchNum}/${totalBatches} (${batchFiles.length} images) ──`);

    for (let i = 0; i < batchFiles.length; i++) {
      const fileName = batchFiles[i];
      const filePath = path.join(sourceDir, fileName);
      const globalIndex = batchStart + i + 1 + (options.skip || 0);
      const totalCount = files.length + (options.skip || 0);

      try {
        const slug = createSlug(fileName, category, device);

        // Check for duplicates
        const existing = await Wallpaper.findOne({ slug });
        if (existing) {
          process.stdout.write(`  [${globalIndex}/${totalCount}] ⏭️  ${fileName} (already exists)\r`);
          skipped++;
          continue;
        }

        const imageStart = Date.now();

        // Read source file
        const sourceBuffer = fs.readFileSync(filePath);
        const sourceMeta = await getImageMeta(filePath);

        // Generate preview (WebP)
        const preview = await createPreview(sourceBuffer, device);

        // Generate optimized download (JPG)  
        const download = await createOptimizedDownload(sourceBuffer);

        if (dry) {
          // Dry run — just log what would happen
          console.log(
            `  [${globalIndex}/${totalCount}] 🔍 ${fileName}` +
            ` → preview: ${formatBytes(preview.size)}` +
            ` | download: ${formatBytes(download.size)}` +
            ` (was ${formatBytes(sourceBuffer.length)})`
          );
          processed++;
          continue;
        }

        // Upload preview to B2
        const previewKey = `wallpapers/${device}/${category}/preview/${slug}.webp`;
        const previewUrl = await uploadBufferToB2(preview.buffer, previewKey, 'image/webp');

        // Upload download to B2
        const downloadKey = `wallpapers/${device}/${category}/5k/${slug}.jpg`;
        const downloadUrl = await uploadBufferToB2(download.buffer, downloadKey, 'image/jpeg');

        // Save locally if --output
        if (output) {
          const previewOut = path.join(output, 'wallpapers', device, category, 'preview', `${slug}.webp`);
          const downloadOut = path.join(output, 'wallpapers', device, category, '5k', `${slug}.jpg`);
          fs.writeFileSync(previewOut, preview.buffer);
          fs.writeFileSync(downloadOut, download.buffer);
        }

        // Create MongoDB document
        const title = createTitle(fileName);
        const tags = extractTags(fileName, category);

        const wallpaper = new Wallpaper({
          title,
          slug,
          description: `${title} - Free ${device} wallpaper in 5K resolution`,
          category,
          deviceType: device,
          imageUrl: downloadUrl,       // backward compat: full-res
          thumbnailUrl: previewUrl,     // backward compat: thumbnail
          previewUrl,                   // new: fast WebP preview
          downloadUrl,                 // new: optimized 5K JPG
          resolution: {
            width: sourceMeta.width,
            height: sourceMeta.height
          },
          fileSize: download.size,
          tags,
          storageType: 'b2',
          storageKey: downloadKey,
          originalFileName: fileName
        });

        await wallpaper.save();

        const elapsed = Date.now() - imageStart;
        console.log(
          `  [${globalIndex}/${totalCount}] ✅ ${fileName}` +
          ` → preview: ${formatBytes(preview.size)}` +
          ` | 5K: ${formatBytes(download.size)}` +
          ` (${formatDuration(elapsed)})`
        );

        processed++;

      } catch (err) {
        console.error(`  [${globalIndex}/${totalCount}] ❌ ${fileName}: ${err.message}`);
        failed++;
      }
    }

    // Log batch summary
    const elapsed = Date.now() - startTime;
    const rate = processed > 0 ? elapsed / processed : 0;
    const remaining = files.length - (batchStart + batchFiles.length);
    const eta = remaining > 0 ? formatDuration(rate * remaining) : 'done';
    console.log(`\n  📊 Batch ${batchNum} done | Total: ${processed} processed, ${skipped} skipped, ${failed} failed | ETA: ${eta}`);
  }

  const totalElapsed = Date.now() - startTime;
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ✅ CATEGORY COMPLETE: ${category} (${device})`);
  console.log(`  📊 Processed: ${processed} | Skipped: ${skipped} | Failed: ${failed}`);
  console.log(`  ⏱️  Total time: ${formatDuration(totalElapsed)}`);
  console.log(`${'─'.repeat(60)}\n`);

  return { processed, skipped, failed };
}

// ─── ENTRY POINT ────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  // Validate arguments
  if (!args.source) {
    console.error('❌ --source is required. Use --help for usage.');
    process.exit(1);
  }

  if (!args.device || !VALID_DEVICES.includes(args.device)) {
    console.error(`❌ --device must be one of: ${VALID_DEVICES.join(', ')}`);
    process.exit(1);
  }

  if (!args.all && !args.category) {
    console.error('❌ --category is required (or use --all to process all subfolders)');
    process.exit(1);
  }

  if (args.category && !VALID_CATEGORIES.includes(args.category)) {
    console.error(`❌ Invalid category "${args.category}". Valid: ${VALID_CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║       🖼️  WALLPAPER PROCESSING PIPELINE                     ║
╠══════════════════════════════════════════════════════════════╣
║  Source:   ${args.source.padEnd(47)}║
║  Device:   ${args.device.padEnd(47)}║
║  Category: ${(args.all ? 'ALL' : args.category).padEnd(47)}║
║  Batch:    ${String(args.batch).padEnd(47)}║
║  Mode:     ${(args.dry ? 'DRY RUN' : 'LIVE').padEnd(47)}║
╚══════════════════════════════════════════════════════════════╝
`);

  // Connect to MongoDB
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4
  });
  console.log('✅ MongoDB connected\n');

  // Test B2 connection (unless dry run)
  if (!args.dry) {
    console.log('🔌 Testing B2 connection...');
    try {
      getS3Client();
      console.log('✅ B2 client ready\n');
    } catch (err) {
      console.error('❌ B2 connection failed:', err.message);
      process.exit(1);
    }
  }

  // Determine categories to process
  let categoriesToProcess = [];

  if (args.all) {
    // Process all category subfolders
    const entries = fs.readdirSync(args.source, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && VALID_CATEGORIES.includes(entry.name)) {
        categoriesToProcess.push({
          dir: path.join(args.source, entry.name),
          category: entry.name
        });
      }
    }
    if (categoriesToProcess.length === 0) {
      console.error('❌ No valid category subfolders found. Expected folder names:', VALID_CATEGORIES.join(', '));
      process.exit(1);
    }
    console.log(`📂 Found ${categoriesToProcess.length} categories: ${categoriesToProcess.map(c => c.category).join(', ')}\n`);
  } else {
    categoriesToProcess.push({
      dir: args.source,
      category: args.category
    });
  }

  // Process each category
  const totals = { processed: 0, skipped: 0, failed: 0 };

  for (const cat of categoriesToProcess) {
    const result = await processCategory(cat.dir, args.device, cat.category, {
      batch: args.batch,
      dry: args.dry,
      output: args.output,
      skip: args.skip,
      limit: args.limit
    });
    totals.processed += result.processed;
    totals.skipped += result.skipped;
    totals.failed += result.failed;
  }

  // Final summary
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🎉 PIPELINE COMPLETE                                       ║
╠══════════════════════════════════════════════════════════════╣
║  ✅ Processed: ${String(totals.processed).padEnd(43)}║
║  ⏭️  Skipped:   ${String(totals.skipped).padEnd(43)}║
║  ❌ Failed:    ${String(totals.failed).padEnd(43)}║
╚══════════════════════════════════════════════════════════════╝
`);

  await mongoose.disconnect();
  console.log('🔌 MongoDB disconnected. Done!');
  process.exit(0);
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
