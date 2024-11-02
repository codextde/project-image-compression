
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