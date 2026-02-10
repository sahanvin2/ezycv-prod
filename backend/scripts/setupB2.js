/**
 * B2 Storage Setup Script
 * Run this script to test your B2 connection
 * 
 * Usage: node scripts/setupB2.js
 */

require('dotenv').config();
const { checkConnection, uploadToB2 } = require('../utils/b2Storage');

async function testB2Connection() {
  console.log('\n🔧 B2 Storage Configuration Test\n');
  console.log('=' .repeat(50));
  
  // Check configuration
  const config = {
    endpoint: process.env.B2_ENDPOINT,
    accessKeyId: process.env.B2_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing',
    secretKey: process.env.B2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing',
    bucket: process.env.B2_BUCKET,
    publicBase: process.env.B2_PUBLIC_BASE
  };
  
  console.log('\nConfiguration:');
  console.log(`  Endpoint:    ${config.endpoint || '✗ Not set'}`);
  console.log(`  Access Key:  ${config.accessKeyId}`);
  console.log(`  Secret Key:  ${config.secretKey}`);
  console.log(`  Bucket:      ${config.bucket || '✗ Not set'}`);
  console.log(`  Public Base: ${config.publicBase || '✗ Not set'}`);
  
  if (!config.endpoint) {
    console.log('\n❌ B2 not configured. Add these to your .env file:');
    console.log(`
B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
B2_ACCESS_KEY_ID=your-key-id
B2_SECRET_ACCESS_KEY=your-secret-key
B2_BUCKET=your-bucket-name
B2_PUBLIC_BASE=https://f005.backblazeb2.com/file/your-bucket-name
`);
    return;
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('Testing connection...\n');
  
  const result = await checkConnection();
  
  if (result.connected) {
    console.log('✅ B2 Storage Connection: SUCCESS');
    console.log(`   Bucket: ${result.bucket}`);
    console.log('\nYour B2 storage is ready to use!');
  } else {
    console.log('❌ B2 Storage Connection: FAILED');
    console.log(`   Error: ${result.error}`);
    console.log('\nPlease check your credentials and try again.');
  }
  
  console.log('\n' + '=' .repeat(50));
}

testB2Connection().catch(console.error);
