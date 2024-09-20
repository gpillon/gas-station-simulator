const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..');

function startService(serviceName, command, args, cwd) {
  console.log(`Starting ${serviceName}...`);
  const child = spawn(command, args, {
    cwd: path.join(rootDir, cwd),
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`${serviceName} failed to start:`, error);
  });

  child.on('exit', (code, signal) => {
    if (code !== null) {
      console.log(`${serviceName} exited with code ${code}`);
    } else if (signal !== null) {
      console.log(`${serviceName} was killed with signal ${signal}`);
    }
  });

  return child;
}

const backend = startService('Backend', 'npm', ['run', 'start:dev'], 'packages/backend');
const frontend = startService('Frontend', 'npm', ['start'], 'packages/frontend');

process.on('SIGINT', () => {
  console.log('Stopping all services...');
  backend.kill();
  frontend.kill();
});