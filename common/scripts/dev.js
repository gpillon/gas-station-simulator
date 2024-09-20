const { spawnSync } = require('child_process');
const open = require('open');

// Function to run a command
function runCommand(command, args, cwd) {
  return spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });
}

// Start Nest.js backend
console.log('Starting Nest.js backend...');
runCommand('rush', ['run', '-p', '@monorepo/backend', '-s', 'start:dev'], '.');

// Start React frontend
console.log('Starting React frontend...');
const frontendProcess = runCommand('rush', ['run', '-p', '@monorepo/frontend', '-s', 'start'], '.');

// Open browser after a delay to ensure the React app has started
setTimeout(() => {
  open('http://localhost:3000');
}, 5000);

// Keep the script running
process.stdin.resume();