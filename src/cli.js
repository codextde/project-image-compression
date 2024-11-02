#!/usr/bin/env node

const { processImages } = require('./index');
const { loadConfig } = require('./config');
const chalk = require('chalk');
const ora = require('ora');

async function run() {
  try {
    const config = await loadConfig();
    const spinner = ora('Processing images...').start();
    
    const stats = await processImages(config);
    
    spinner.succeed(chalk.green('Image compression completed!'));
    console.log(chalk.blue('\nStats:'));
    console.log(chalk.yellow(`- Images processed: ${stats.processed}`));
    console.log(chalk.yellow(`- Total size reduced: ${stats.sizeSaved} MB`));
    console.log(chalk.yellow(`- Average compression: ${stats.averageCompression}%`));
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

run();

// src/config.js
const fs = require('fs').promises;
const path = require('path');

const defaultConfig = {
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  convertToWebp: false,
  folder: './images',
  skipExisting: true,
  createBackup: true,
  outputFolder: null // if null, overwrites original files
};

async function loadConfig() {
  try {
    const configPath = path.join(process.cwd(), 'img.config.json');
    const configFile = await fs.readFile(configPath, 'utf8');
    const userConfig = JSON.parse(configFile);
    
    return { ...defaultConfig, ...userConfig };
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(chalk.yellow('No img.config.json found, using default settings'));
      return defaultConfig;
    }
    throw new Error(`Failed to load config: ${error.message}`);
  }
}

module.exports = { loadConfig, defaultConfig };

// src/index.js
const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs').promises;

async function processImages(config) {
  const stats = {
    processed: 0,
    sizeSaved: 0,
    averageCompression: 0
  };

  const imageFiles = glob.sync(path.join(config.folder, '**/*.{jpg,jpeg,png,webp}'));
  const totalSizesBefore = [];
  const totalSizesAfter = [];

  for (const file of imageFiles) {
    try {
      const originalSize = (await fs.stat(file)).size;
      totalSizesBefore.push(originalSize);

      const image = sharp(file);
      const metadata = await image.metadata();

      // Resize if needed
      if (metadata.width > config.maxWidth || metadata.height > config.maxHeight) {
        image.resize(config.maxWidth, config.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Determine output format
      const outputFormat = config.convertToWebp ? 'webp' : metadata.format;
      const outputOptions = {
        quality: config.quality
      };

      // Determine output path
      let outputPath = file;
      if (config.outputFolder) {
        const relativePath = path.relative(config.folder, file);
        outputPath = path.join(config.outputFolder, relativePath);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
      }

      if (config.createBackup) {
        await fs.copyFile(file, `${file}.backup`);
      }

      // Process the image
      await image[outputFormat](outputOptions)
        .toFile(`${outputPath}.tmp`);

      // Replace original with processed version
      await fs.unlink(file);
      await fs.rename(`${outputPath}.tmp`, outputPath);

      const newSize = (await fs.stat(outputPath)).size;
      totalSizesAfter.push(newSize);
      stats.processed++;

    } catch (error) {
      console.error(`Failed to process ${file}:`, error.message);
    }
  }

  // Calculate statistics
  const totalBefore = totalSizesBefore.reduce((a, b) => a + b, 0);
  const totalAfter = totalSizesAfter.reduce((a, b) => a + b, 0);
  stats.sizeSaved = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(2);
  stats.averageCompression = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);

  return stats;
}

module.exports = { processImages };