#!/usr/bin/env node

/**
 * ============================================================================
 *  SEED STOCK PHOTOS — Upload processed files to B2 + create MongoDB docs
 * ============================================================================
 *
 *  Reads the output folder from processStockPhotos.ps1 and:
 *    1. (Optionally) deletes all existing Photo documents from MongoDB
 *    2. Uploads preview WebP + 5K JPG to Backblaze B2
 *    3. Creates Photo documents in MongoDB with SEO metadata
 *
 *  Expected folder structure (output of processStockPhotos.ps1):
 *    <source>/
 *      <category-slug>/
 *        category.json   ← {folderName, slug, dbCategory}
 *        preview/        ← .webp files
 *        5k/             ← .jpg files
 *
 * ============================================================================
 *  USAGE
 * ============================================================================
 *
 *  Dry run (no uploads, no DB writes):
 *    node scripts/seedStockPhotos.js --source "D:\EzyCV_OUTPUT\stock-photos" --dry
 *
 *  Live run (delete dummy data + upload + seed):
 *    node scripts/seedStockPhotos.js --source "D:\EzyCV_OUTPUT\stock-photos" --clear
 *
 *  Single category only:
 *    node scripts/seedStockPhotos.js --source "D:\EzyCV_OUTPUT\stock-photos" --category business-professional
 *
 *  Resume (skip already-uploaded slugs):
 *    node scripts/seedStockPhotos.js --source "D:\EzyCV_OUTPUT\stock-photos"
 *
 * ============================================================================
 */

const path = require('path');
const fs   = require('fs');
const sharp      = require('sharp');
const mongoose   = require('mongoose');
const dotenv     = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload }   = require('@aws-sdk/lib-storage');

// ─── PARSE CLI ARGS ──────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const out  = { source: null, category: null, dry: false, clear: false, batchDelay: 0 };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source':   out.source   = args[++i]; break;
      case '--category': out.category = args[++i]; break;
      case '--dry':      out.dry      = true;       break;
      case '--clear':    out.clear    = true;       break;
      case '--delay':    out.batchDelay = parseInt(args[++i]) || 0; break;
    }
  }
  return out;
}

// ─── B2 CLIENT ──────────────────────────────────────────────────────────────

let _s3 = null;
function getS3() {
  if (!_s3) {
    _s3 = new S3Client({
      endpoint:    process.env.B2_ENDPOINT,
      region:      'us-east-005',
      credentials: {
        accessKeyId:     process.env.B2_ACCESS_KEY_ID     || '',
        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY || ''
      },
      forcePathStyle: true
    });
  }
  return _s3;
}

async function uploadToB2(filePath, key, contentType) {
  const buffer = fs.readFileSync(filePath);
  const upload = new Upload({
    client: getS3(),
    params: {
      Bucket:       process.env.B2_BUCKET,
      Key:          key,
      Body:         buffer,
      ContentType:  contentType,
      CacheControl: 'public, max-age=31536000, immutable'
    }
  });
  await upload.done();
  return `${process.env.B2_PUBLIC_BASE}/${key}`;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatBytes(n) {
  if (n < 1024)           return n + ' B';
  if (n < 1024 * 1024)    return (n / 1024).toFixed(0) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Build a human-friendly title from the seo base filename.
 * "business-professional-free-stock-photo-0001" → "Business Professional Stock Photo 0001"
 */
function buildTitle(seoBase, dbCategory) {
  return seoBase
    .replace(/-free-stock-photo-/, ' Stock Photo ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/**
 * Build SEO description for a photo.
 */
function buildDescription(title, dbCategory, seoSlug) {
  const catLabel = {
    business:   'business and professional',
    technology: 'technology and digital',
    people:     'people and portrait',
    nature:     'nature and landscape',
    food:       'food, drinks and cuisine',
    travel:     'travel and destination',
    fashion:    'fashion and style',
    sports:     'sports and fitness',
    health:     'health and wellness',
    education:  'education and learning',
    other:      'lifestyle'
  }[dbCategory] || dbCategory;

  return `${title} – free high-quality ${catLabel} stock photo. Download in 5K resolution for commercial and personal use. No attribution required.`;
}

/**
 * Extract relevant tags from the slug + category.
 */
function buildTags(seoBase, dbCategory, folderName) {
  const extraTagMap = {
    business:   ['business', 'professional', 'office', 'corporate', 'work'],
    technology: ['technology', 'digital', 'tech', 'innovation', 'computer'],
    people:     ['people', 'portrait', 'human', 'lifestyle', 'person'],
    nature:     ['nature', 'landscape', 'outdoor', 'scenic', 'environment'],
    food:       ['food', 'drinks', 'cuisine', 'beverage', 'meal', 'cooking'],
    travel:     ['travel', 'destination', 'tourism', 'adventure', 'explore'],
    fashion:    ['fashion', 'style', 'clothing', 'outfit', 'model'],
    sports:     ['sports', 'fitness', 'exercise', 'athletic', 'active'],
    health:     ['health', 'wellness', 'medical', 'fitness', 'lifestyle'],
    education:  ['education', 'learning', 'study', 'school', 'knowledge'],
    other:      ['lifestyle', 'stock', 'photo']
  };

  const baseTags = extraTagMap[dbCategory] || [dbCategory];
  const tagSet = new Set([...baseTags, 'free stock photo', 'high quality', '5k', 'download free']);
  return [...tagSet];
}

// ─── SEED ONE CATEGORY ───────────────────────────────────────────────────────

async function seedCategory(catDir, dry) {
  const Photo = require('../models/Photo');

  // Read category metadata
  const mapFile = path.join(catDir, 'category.json');
  if (!fs.existsSync(mapFile)) {
    console.warn(`  ⚠️  No category.json in ${catDir} — skipping`);
    return { processed: 0, skipped: 0, failed: 0 };
  }
  const { slug: catSlug, dbCategory, folderName } = JSON.parse(
    fs.readFileSync(mapFile, 'utf8').replace(/^\uFEFF/, '') // strip BOM if present
  );

  const previewDir  = path.join(catDir, 'preview');
  const downloadDir = path.join(catDir, '5k');

  if (!fs.existsSync(previewDir) || !fs.existsSync(downloadDir)) {
    console.warn(`  ⚠️  Missing preview/ or 5k/ in ${catDir}`);
    return { processed: 0, skipped: 0, failed: 0 };
  }

  const previewFiles = fs.readdirSync(previewDir)
    .filter(f => /\.webp$/i.test(f))
    .sort();

  console.log(`\n── ${catSlug} (${dbCategory}) ─────────────────────────────────`);
  console.log(`   📂 ${previewFiles.length} preview files`);

  let processed = 0, skipped = 0, failed = 0;

  for (let i = 0; i < previewFiles.length; i++) {
    const previewFile = previewFiles[i];
    const seoBase     = path.basename(previewFile, '.webp');
    const photoSlug   = seoBase; // already SEO-friendly

    // Check for 5K match
    const dlFile = fs.readdirSync(downloadDir)
      .find(f => path.basename(f, path.extname(f)) === seoBase);

    if (!dlFile) {
      console.log(`  [${i+1}/${previewFiles.length}] ⚠️  No 5K match for ${previewFile}`);
      failed++;
      continue;
    }

    // Skip if already in DB
    const existing = await Photo.findOne({ slug: photoSlug });
    if (existing) {
      skipped++;
      continue;
    }

    if (dry) {
      const prev = fs.statSync(path.join(previewDir, previewFile)).size;
      const dl   = fs.statSync(path.join(downloadDir, dlFile)).size;
      console.log(`  [${i+1}/${previewFiles.length}] 🔍 ${seoBase} → preview:${formatBytes(prev)} 5K:${formatBytes(dl)}`);
      processed++;
      continue;
    }

    try {
      // Upload preview WebP
      const previewKey = `stock-photos/${catSlug}/preview/${photoSlug}.webp`;
      const previewUrl = await uploadToB2(
        path.join(previewDir, previewFile), previewKey, 'image/webp'
      );

      // Upload 5K JPG
      const dlKey  = `stock-photos/${catSlug}/5k/${photoSlug}.jpg`;
      const dlUrl  = await uploadToB2(
        path.join(downloadDir, dlFile), dlKey, 'image/jpeg'
      );

      // Get actual resolution from 5K file
      const meta   = await sharp(path.join(downloadDir, dlFile)).metadata();
      const dlSize = fs.statSync(path.join(downloadDir, dlFile)).size;

      const title = buildTitle(seoBase, dbCategory);
      const desc  = buildDescription(title, dbCategory, catSlug);
      const tags  = buildTags(seoBase, dbCategory, folderName);

      await Photo.create({
        title,
        slug:             photoSlug,
        description:      desc,
        category:         dbCategory,
        imageUrl:         dlUrl,
        thumbnailUrl:     previewUrl,
        previewUrl,
        downloadUrl:      dlUrl,
        resolution:       { width: meta.width || 0, height: meta.height || 0 },
        fileSize:         dlSize,
        tags,
        storageType:      'b2',
        storageKey:       dlKey,
        previewKey,
        originalFileName: seoBase,
        license:          'free',
        featured:         i < 5  // first 5 of each category get featured
      });

      console.log(`  [${i+1}/${previewFiles.length}] ✅ ${seoBase}`);
      processed++;

    } catch (err) {
      console.error(`  [${i+1}/${previewFiles.length}] ❌ ${seoBase}: ${err.message}`);
      failed++;
    }
  }

  return { processed, skipped, failed };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  if (!args.source) {
    console.error('❌  --source is required\n  e.g. node scripts/seedStockPhotos.js --source "D:\\EzyCV_OUTPUT\\stock-photos"');
    process.exit(1);
  }

  console.log('\n📸  SEED STOCK PHOTOS');
  console.log(`   Source : ${args.source}`);
  console.log(`   Mode   : ${args.dry ? '🔍 DRY RUN (no uploads)' : '🚀 LIVE'}`);
  if (args.clear) console.log('   ⚠️  --clear: ALL existing Photo docs will be deleted first');
  console.log();

  // Connect MongoDB
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 60000,
    family: 4
  });
  console.log('✅ MongoDB connected\n');

  const Photo = require('../models/Photo');

  // Clear dummy/existing photos if requested
  if (args.clear && !args.dry) {
    const count = await Photo.countDocuments({});
    console.log(`🗑️  Deleting ${count} existing Photo documents...`);
    await Photo.deleteMany({});
    console.log('✅ Cleared\n');
  }

  // Discover category directories
  let catDirs = [];
  if (args.category) {
    const d = path.join(args.source, args.category);
    if (!fs.existsSync(d)) {
      console.error(`❌  Category folder not found: ${d}`);
      process.exit(1);
    }
    catDirs = [d];
  } else {
    catDirs = fs.readdirSync(args.source, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => path.join(args.source, e.name));
  }

  if (catDirs.length === 0) {
    console.error('❌  No category directories found in', args.source);
    process.exit(1);
  }

  const totals = { processed: 0, skipped: 0, failed: 0 };

  for (const catDir of catDirs) {
    const result = await seedCategory(catDir, args.dry);
    console.log(`   ✅ ${result.processed} uploaded  ⏭  ${result.skipped} skipped  ❌ ${result.failed} failed`);
    totals.processed += result.processed;
    totals.skipped   += result.skipped;
    totals.failed    += result.failed;

    // Optional delay between categories to avoid hammering B2
    if (args.batchDelay > 0 && !args.dry) {
      await new Promise(r => setTimeout(r, args.batchDelay));
    }
  }

  console.log(`\n${'═'.repeat(55)}`);
  console.log('  📸  SEED COMPLETE');
  console.log(`  ✅  Uploaded : ${totals.processed}`);
  console.log(`  ⏭   Skipped  : ${totals.skipped}  (already in DB)`);
  console.log(`  ❌  Failed   : ${totals.failed}`);
  console.log(`${'═'.repeat(55)}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('💥 Fatal error:', err.message);
  process.exit(1);
});
