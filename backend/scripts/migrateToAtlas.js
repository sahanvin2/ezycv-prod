/**
 * Data Migration Script: Local MongoDB → MongoDB Atlas
 * Migrates all collections from local database to MongoDB Atlas
 */

const mongoose = require('mongoose');

// Local MongoDB connection
const LOCAL_URI = 'mongodb://127.0.0.1:27017/cv-wallpaper-db';

// MongoDB Atlas connection
const ATLAS_URI = 'mongodb+srv://ezycv22_db_user:z6sxbfaIYt8CLhxj@ezycv.gmcrohr.mongodb.net/ezycv-prod?retryWrites=true&w=majority&appName=ezycv';

// Create two separate connections
let localConn = null;
let atlasConn = null;

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...\n');

    // Connect to local MongoDB
    console.log('📡 Connecting to local MongoDB...');
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to local MongoDB\n');

    // Connect to MongoDB Atlas
    console.log('📡 Connecting to MongoDB Atlas...');
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to MongoDB Atlas\n');

    // Get all collection names from local database
    const collections = await localConn.db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections to migrate:\n`);
    
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');

    // Migrate each collection
    let totalDocuments = 0;
    for (const collection of collections) {
      const collectionName = collection.name;
      
      console.log(`\n📦 Migrating collection: ${collectionName}`);
      console.log('─'.repeat(50));

      // Get data from local collection
      const localCollection = localConn.collection(collectionName);
      const documents = await localCollection.find({}).toArray();
      
      if (documents.length === 0) {
        console.log(`   ⚠️  Collection is empty, skipping...`);
        continue;
      }

      console.log(`   📄 Found ${documents.length} documents`);

      // Get atlas collection
      const atlasCollection = atlasConn.collection(collectionName);

      // Clear existing data in atlas collection (optional)
      const existingCount = await atlasCollection.countDocuments();
      if (existingCount > 0) {
        console.log(`   🗑️  Clearing ${existingCount} existing documents...`);
        await atlasCollection.deleteMany({});
      }

      // Insert documents into Atlas
      console.log(`   ⬆️  Uploading documents...`);
      const result = await atlasCollection.insertMany(documents, { ordered: false });
      
      console.log(`   ✅ Successfully migrated ${result.insertedCount} documents`);
      totalDocuments += result.insertedCount;
    }

    console.log('\n' + '═'.repeat(50));
    console.log(`\n🎉 Migration Complete!`);
    console.log(`   Total collections: ${collections.length}`);
    console.log(`   Total documents migrated: ${totalDocuments}`);
    console.log('\n' + '═'.repeat(50));

    // Verify migration
    console.log('\n🔍 Verifying migration...\n');
    for (const collection of collections) {
      const collectionName = collection.name;
      const localCount = await localConn.collection(collectionName).countDocuments();
      const atlasCount = await atlasConn.collection(collectionName).countDocuments();
      
      const status = localCount === atlasCount ? '✅' : '⚠️';
      console.log(`   ${status} ${collectionName}: Local=${localCount}, Atlas=${atlasCount}`);
    }

    console.log('\n✨ Migration verification complete!\n');

  } catch (error) {
    console.error('\n❌ Migration Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Close connections
    if (localConn) {
      await localConn.close();
      console.log('🔌 Closed local MongoDB connection');
    }
    if (atlasConn) {
      await atlasConn.close();
      console.log('🔌 Closed MongoDB Atlas connection');
    }
  }
}

// Run migration
migrateData()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
