#!/usr/bin/env node

/**
 * ============================================================================
 *  SEED FROM OUTPUT — Upload processed files to B2 + create MongoDB docs
 * ============================================================================
 *
 *  Use this after the PowerShell script (processWallpapers.ps1) has generated
 *  the local output files. This script reads the output folder structure and:
 *    1. Uploads preview WebP + 5K JPG to Backblaze B2
 *    2. Creates Wallpaper documents in MongoDB
 *
 *  Expected folder structure:
 *    <source>/
 *      <category>/
 *        preview/   ← WebP files
 *        5k/        ← JPG files
 *
 * ============================================================================
 *  USAGE
 * ============================================================================
 *
 *  node scripts/seedFromOutput.js --source "D:\EzyCV_OUTPUT\wallpapers\desktop" --device desktop
 *  node scripts/seedFromOutput.js --source "D:\EzyCV_OUTPUT\wallpapers\mobile" --device mobile
 *  node scripts/seedFromOutput.js --source "D:\EzyCV_OUTPUT\wallpapers\desktop\nature" --device desktop --category nature
 *  node scripts/seedFromOutput.js --source "..." --device desktop --dry
 *
 * ============================================================================
 */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

// ─── CONFIG ─────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'nature', 'abstract', 'animals', 'architecture',
  'space', 'gaming', 'minimalist', 'dark', 'gradient'
];

// ─── PARSE ARGS ─────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { source: null, device: null, category: null, dry: false, batch: 50 };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source':   parsed.source   = args[++i]; break;
      case '--device':   parsed.device   = args[++i]; break;
      case '--category': parsed.category = args[++i]; break;
      case '--dry':      parsed.dry      = true; break;
      case '--batch':    parsed.batch    = parseInt(args[++i]) || 50; break;
    }
  }
  return parsed;
}

// ─── B2 CLIENT ──────────────────────────────────────────────────────────────

let _s3Client = null;

function getS3Client() {
  if (!_s3Client) {
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

async function uploadFileToB2(filePath, key, contentType) {
  const client = getS3Client();
  const buffer = fs.readFileSync(filePath);

  const upload = new Upload({
    client,
    params: {
      Bucket: process.env.B2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000'
    }
  });

  await upload.done();
  return `${process.env.B2_PUBLIC_BASE}/${key}`;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function createSlug(fileName, category, device) {
  const base = path.basename(fileName, path.extname(fileName));
  const clean = base.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `${clean}-${category}-${device}`;
}

function createTitle(fileName) {
  const base = path.basename(fileName, path.extname(fileName));
  return base.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/\s+\d{4}$/, '').trim();
}

function extractTags(fileName, category) {
  const base = path.basename(fileName, path.extname(fileName));
  const parts = base.toLowerCase().replace(/[-_]+/g, ' ').split(/\s+/)
    .filter(p => p.length > 2 && !/^\d+$/.test(p) && !['5k', 'desktop', 'mobile'].includes(p));
  const tagSet = new Set([category, ...parts]);
  return [...tagSet].slice(0, 8);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ─── PROCESS ONE CATEGORY ───────────────────────────────────────────────────

async function seedCategory(sourceDir, device, category, options) {
  const { dry } = options;
  const Wallpaper = require('../models/Wallpaper');

  const previewDir = path.join(sourceDir, 'preview');
  const downloadDir = path.join(sourceDir, '5k');

  if (!fs.existsSync(previewDir) || !fs.existsSync(downloadDir)) {
    console.log(`  ⚠️  Missing preview/ or 5k/ subfolder in ${sourceDir}`);
    return { processed: 0, skipped: 0, failed: 0 };
  }

  // Get all preview files (they define the set)
  const previewFiles = fs.readdirSync(previewDir).filter(f => /\.(webp)$/i.test(f)).sort();
  console.log(`  📂 Found ${previewFiles.length} preview files in ${category}`);

  let processed = 0, skipped = 0, failed = 0;

  for (let i = 0; i < previewFiles.length; i++) {
    const previewFile = previewFiles[i];
    const baseName = path.basename(previewFile, '.webp');

    // Find matching 5k file
    const downloadFile = fs.readdirSync(downloadDir).find(f => path.basename(f, path.extname(f)) === baseName);
    if (!downloadFile) {
      console.log(`    [${i + 1}/${previewFiles.length}] ⚠️  No 5K match for ${previewFile}`);
      failed++;
      continue;
    }

    const slug = createSlug(baseName, category, device);

    // Check duplicate
    const existing = await Wallpaper.findOne({ slug });
    if (existing) {
      skipped++;
      continue;
    }

    if (dry) {
      const prevSize = fs.statSync(path.join(previewDir, previewFile)).size;
      const dlSize = fs.statSync(path.join(downloadDir, downloadFile)).size;
      console.log(`    [${i + 1}/${previewFiles.length}] 🔍 ${baseName} → preview: ${formatBytes(prevSize)} | 5K: ${formatBytes(dlSize)}`);
      processed++;
      continue;
    }

    try {
      // Upload preview
      const previewKey = `wallpapers/${device}/${category}/preview/${slug}.webp`;
      const previewUrl = await uploadFileToB2(path.join(previewDir, previewFile), previewKey, 'image/webp');

      // Upload 5K download
      const downloadKey = `wallpapers/${device}/${category}/5k/${slug}.jpg`;
      const downloadUrl = await uploadFileToB2(path.join(downloadDir, downloadFile), downloadKey, 'image/jpeg');

      // Get resolution from the 5K file
      const meta = await sharp(path.join(downloadDir, downloadFile)).metadata();
      const dlSize = fs.statSync(path.join(downloadDir, downloadFile)).size;

      // Create MongoDB document
      const title = createTitle(baseName);
      const tags = extractTags(baseName, category);

      const wallpaper = new Wallpaper({
        title,
        slug,
        description: `${title} - Free ${device} wallpaper in 5K resolution`,
        category,
        deviceType: device,
        imageUrl: downloadUrl,
        thumbnailUrl: previewUrl,
        previewUrl,
        downloadUrl,
        resolution: { width: meta.width, height: meta.height },
        fileSize: dlSize,
        tags,
        storageType: 'b2',
        storageKey: downloadKey,
        originalFileName: baseName
      });

      await wallpaper.save();
      console.log(`    [${i + 1}/${previewFiles.length}] ✅ ${baseName}`);
      processed++;

    } catch (err) {
      console.error(`    [${i + 1}/${previewFiles.length}] ❌ ${baseName}: ${err.message}`);
      failed++;
    }
  }

  return { processed, skipped, failed };
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  if (!args.source) { console.error('❌ --source required'); process.exit(1); }
  if (!args.device || !['desktop', 'mobile'].includes(args.device)) {
    console.error('❌ --device must be "desktop" or "mobile"');
    process.exit(1);
  }

  console.log(`\n🌱 SEED FROM OUTPUT`);
  console.log(`   Source: ${args.source}`);
  console.log(`   Device: ${args.device}`);
  console.log(`   Mode: ${args.dry ? 'DRY RUN' : 'LIVE'}\n`);

  // Connect MongoDB
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 5, serverSelectionTimeoutMS: 10000, socketTimeoutMS: 45000, family: 4
  });
  console.log('✅ MongoDB connected\n');

  // Determine categories
  let categoriesToProcess = [];

  if (args.category) {
    categoriesToProcess.push({ dir: args.source, category: args.category });
  } else {
    const entries = fs.readdirSync(args.source, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && VALID_CATEGORIES.includes(entry.name)) {
        categoriesToProcess.push({ dir: path.join(args.source, entry.name), category: entry.name });
      }
    }
  }

  if (categoriesToProcess.length === 0) {
    console.error('❌ No categories found');
    process.exit(1);
  }

  console.log(`📂 Categories: ${categoriesToProcess.map(c => c.category).join(', ')}\n`);

  const totals = { processed: 0, skipped: 0, failed: 0 };

  for (const cat of categoriesToProcess) {
    console.log(`\n── ${cat.category} ──`);
    const result = await seedCategory(cat.dir, args.device, cat.category, { dry: args.dry });
    console.log(`   Done: ${result.processed} processed, ${result.skipped} skipped, ${result.failed} failed`);
    totals.processed += result.processed;
    totals.skipped += result.skipped;
    totals.failed += result.failed;
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  🎉 SEED COMPLETE`);
  console.log(`  ✅ Processed: ${totals.processed}`);
  console.log(`  ⏭️  Skipped: ${totals.skipped}`);
  console.log(`  ❌ Failed: ${totals.failed}`);
  console.log(`${'═'.repeat(50)}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('💥', err); process.exit(1); });
