const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function analyzeBundle() {
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.log('Build directory not found. Run "npm run build" first.');
    return;
  }
  
  const chunks = [];
  const jsDir = path.join(staticDir, 'chunks');
  
  if (fs.existsSync(jsDir)) {
    const files = fs.readdirSync(jsDir);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(jsDir, file);
        const stats = fs.statSync(filePath);
        chunks.push({
          name: file,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024 * 100) / 100
        });
      }
    });
  }
  
  chunks.sort((a, b) => b.size - a.size);
  
  console.log('\n📊 Bundle Analysis:');
  console.log('==================');
  
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  console.log(`Total JS Size: ${Math.round(totalSize / 1024 * 100) / 100} KB`);
  
  console.log('\n🔍 Largest Chunks:');
  chunks.slice(0, 10).forEach((chunk, index) => {
    console.log(`${index + 1}. ${chunk.name}: ${chunk.sizeKB} KB`);
  });
  
  const largeChunks = chunks.filter(chunk => chunk.sizeKB > 100);
  if (largeChunks.length > 0) {
    console.log('\n⚠️  Large Chunks (>100KB):');
    largeChunks.forEach(chunk => {
      console.log(`- ${chunk.name}: ${chunk.sizeKB} KB`);
    });
  }
  
  const report = {
    timestamp: new Date().toISOString(),
    totalSizeKB: Math.round(totalSize / 1024 * 100) / 100,
    chunkCount: chunks.length,
    largeChunks: largeChunks.length,
    chunks: chunks
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'bundle-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📄 Report saved to bundle-report.json');
  
  if (largeChunks.length > 0) {
    console.log('\n💡 Optimization suggestions:');
    console.log('- Consider code splitting for large components');
    console.log('- Use dynamic imports for heavy dependencies');
    console.log('- Enable tree shaking for unused code');
  }
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };
