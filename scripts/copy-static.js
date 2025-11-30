/**
 * Copy Static Files Script
 * 
 * This script copies static assets to the dist folder during build.
 * Run with: npm run copy-static
 */

import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Directories to copy
const staticDirs = [
  'html',
  'css',
  'js',
  'views',
  'site-images',
  'Admin',
];

// Individual files to copy
const staticFiles = [
  'manifest.json',
  'service-worker.js',
];

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
  // Create destination directory
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  // Read source directory
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    // Skip node_modules and hidden files
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Main function
 */
function main() {
  const distDir = join(projectRoot, 'dist');
  
  console.log('📦 Copying static files to dist folder...\n');
  
  // Ensure dist directory exists
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }
  
  // Copy directories
  for (const dir of staticDirs) {
    const srcPath = join(projectRoot, dir);
    const destPath = join(distDir, dir);
    
    if (existsSync(srcPath)) {
      console.log(`  📁 Copying ${dir}/`);
      copyDir(srcPath, destPath);
    } else {
      console.log(`  ⚠️  Skipping ${dir}/ (not found)`);
    }
  }
  
  // Copy individual files
  for (const file of staticFiles) {
    const srcPath = join(projectRoot, file);
    const destPath = join(distDir, file);
    
    if (existsSync(srcPath)) {
      console.log(`  📄 Copying ${file}`);
      copyFileSync(srcPath, destPath);
    } else {
      console.log(`  ⚠️  Skipping ${file} (not found)`);
    }
  }
  
  console.log('\n✅ Static files copied successfully!\n');
}

// Run
main();
