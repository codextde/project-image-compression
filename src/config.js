
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