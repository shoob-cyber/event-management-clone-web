#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('\n═══════════════════════════════════════════════════════');
console.log('  Event Management Booking System - Development Mode');
console.log('═══════════════════════════════════════════════════════\n');

const isWindows = os.platform() === 'win32';
const shell = isWindows ? 'cmd' : '/bin/bash';
const shellFlag = isWindows ? '/c' : '-c';

// Backend command
const backendCmd = isWindows 
  ? 'cd booking-backend && npm start'
  : 'cd booking-backend && npm start';

// Frontend command  
const frontendCmd = isWindows
  ? 'cd booking-frontend && npm start'
  : 'cd booking-frontend && npm start';

console.log('🚀 Starting Backend Server...');
const backend = spawn(shell, [shellFlag, backendCmd], {
  stdio: 'inherit',
  cwd: path.join(__dirname)
});

console.log('⏳ Waiting 3 seconds before starting Frontend...\n');

setTimeout(() => {
  console.log('🚀 Starting Frontend Server...\n');
  const frontend = spawn(shell, [shellFlag, frontendCmd], {
    stdio: 'inherit',
    cwd: path.join(__dirname)
  });

  frontend.on('error', (err) => {
    console.error('Frontend error:', err);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\n\nShutting down...');
    frontend.kill();
    backend.kill();
    process.exit(0);
  });
}, 3000);

backend.on('error', (err) => {
  console.error('Backend error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down...');
  backend.kill();
  process.exit(0);
});

console.log('════════════════════════════════════════════════════════');
console.log('📋 Backend: http://localhost:3000');
console.log('📱 Frontend: http://localhost:3000 (or 3001)');
console.log('📚 API: http://localhost:3000/api');
console.log('════════════════════════════════════════════════════════');
console.log('Press Ctrl+C to stop both servers\n');
