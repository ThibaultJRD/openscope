#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const showdown = require('showdown');

/**
 * Copy assets from source to destination directory
 */
function copyAssetsRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    
    if (!fs.existsSync(dest)) {
        mkdirp.sync(dest);
    }
    
    const items = fs.readdirSync(src);
    
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyAssetsRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Import existing functions from Gulp tasks
const jsonAssembler = require('../tools/tasks/jsonAssembler');
const markdownAssembler = require('../tools/tasks/markdownAssembler');
const copyChangelog = require('../tools/tasks/copyChangelog');

/**
 * Build script that handles custom asset generation for Vite
 * Replaces the custom Gulp tasks for JSON/Markdown assembly
 */
async function buildAssets() {
    console.log(colors.cyan('🔧 Building custom assets...'));
    
    try {
        // Create necessary directories
        mkdirp.sync('public/assets');
        mkdirp.sync('public/assets/aircraft');
        mkdirp.sync('public/assets/airlines');
        mkdirp.sync('public/assets/guides');
        
        console.log(colors.yellow('📝 Running JSON assembler...'));
        await jsonAssembler();
        
        console.log(colors.yellow('📚 Running Markdown assembler...'));
        await markdownAssembler();
        
        console.log(colors.yellow('📋 Copying changelog...'));
        await copyChangelog();
        
        console.log(colors.yellow('🖼️ Copying images and fonts...'));
        copyAssetsRecursive('assets/images', 'public/assets/images');
        copyAssetsRecursive('assets/fonts', 'public/assets/fonts');
        
        console.log(colors.green('✅ Custom assets built successfully!'));
        
    } catch (error) {
        console.error(colors.red('❌ Error building assets:'), error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    buildAssets();
}

module.exports = buildAssets;