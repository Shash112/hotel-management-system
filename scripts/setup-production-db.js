const { execSync } = require('child_process');

console.log('🚀 Setting up production database...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('🗄️ Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Seed the database
  console.log('🌱 Seeding database...');
  execSync('npx tsx prisma/simple-seed.ts', { stdio: 'inherit' });
  
  console.log('✅ Production database setup complete!');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}
