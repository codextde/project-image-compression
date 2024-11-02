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
    console.log(chalk.yellow(`- Images processed: ${stats.processed || 0}`));
    console.log(chalk.yellow(`- Total size reduced: ${stats.sizeSaved || 0} MB`));
    console.log(chalk.yellow(`- Average compression: ${stats.averageCompression || 0}%`));
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

run();