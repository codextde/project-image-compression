# @codext/project-image-compression

A powerful and flexible CLI tool for bulk image compression and optimization. This tool helps you automatically compress and resize images in a directory while maintaining quality and optionally converting them to WebP format.

## Features

- 🖼️ Bulk image compression with customizable quality settings
- ↔️ Automatic image resizing while maintaining aspect ratio
- 🔄 Optional WebP conversion
- 📁 Custom output directory support
- 💾 Automatic backup creation
- 📊 Detailed compression statistics
- 🎯 Configurable via JSON file
- 🚀 Support for JPG, JPEG, PNG, and WebP formats

![image](https://github.com/user-attachments/assets/f5f6639c-61a7-49d3-a92b-f7ffa7a46898)


## Installation

```bash
npm install @codext/project-image-compression
```

## Quick Start

1. Add the script to your package.json:
```json
{
  "scripts": {
    "compress-images": "npx @codext/project-image-compression"
  }
}
```

2. Create an `img.config.json` file in your project root:
```json
{
  "quality": 80,
  "maxWidth": 1920,
  "maxHeight": 1080,
  "convertToWebp": false,
  "folder": "./images",
  "skipExisting": true,
  "createBackup": true,
  "outputFolder": null
}
```

3. Run the compression:
```bash
npm run compress-images
```

## Configuration

Create an `img.config.json` file in your project root with the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| quality | Number | 80 | Output image quality (0-100) |
| maxWidth | Number | 1920 | Maximum width of output images |
| maxHeight | Number | 1080 | Maximum height of output images |
| convertToWebp | Boolean | false | Convert images to WebP format |
| folder | String | "./images" | Source folder containing images to process |
| skipExisting | Boolean | true | Skip already processed images |
| createBackup | Boolean | true | Create backup of original images |
| outputFolder | String\|null | null | Custom output directory (null to overwrite originals) |

## Example Usage

### Basic Compression

For basic image compression with default settings:

```json
{
  "folder": "./images",
  "quality": 80
}
```

### Convert to WebP

To compress and convert all images to WebP format:

```json
{
  "folder": "./images",
  "quality": 85,
  "convertToWebp": true,
  "outputFolder": "./compressed"
}
```

### High-Quality Resize

For resizing large images while maintaining high quality:

```json
{
  "folder": "./images",
  "quality": 90,
  "maxWidth": 1920,
  "maxHeight": 1080,
  "createBackup": true
}
```

## CLI Output

The tool provides detailed statistics after processing:
- Number of images processed
- Total size reduced (in MB)
- Average compression percentage
- Processing status for each image

Example output:
```
✔ Image compression completed!

Stats:
- Images processed: 24
- Total size reduced: 15.7 MB
- Average compression: 65.3%
```

## Error Handling

- The tool creates backups by default (can be disabled)
- Failed image processing is reported but doesn't stop the batch
- Invalid configuration files trigger helpful error messages
- Missing source directory prompts for creation

## Requirements

- Node.js 12.0 or higher
- NPM or Yarn package manager

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Built with:
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Glob](https://github.com/isaacs/node-glob) - File pattern matching
- [Chalk](https://github.com/chalk/chalk) - Terminal string styling
- [Ora](https://github.com/sindresorhus/ora) - Terminal spinner
