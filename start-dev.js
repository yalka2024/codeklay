const { spawn } = require('child_process');

console.log('Starting CodePal development server...');

const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
}); 