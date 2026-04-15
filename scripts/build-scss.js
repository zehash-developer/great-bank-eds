/* eslint-disable no-console, import/no-extraneous-dependencies */
/**
 * SCSS Build Script
 * Compiles all .scss files in blocks/ and styles/ directories to .css files
 * with enhanced minification via cssnano
 */

import { compile } from 'sass';
import { writeFile, readdir, mkdir } from 'fs/promises';
import postcss from 'postcss';
import cssnano from 'cssnano';
import { dirname, join, basename, extname } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Recursively find all .scss files in a directory (excluding partials starting with _)
 * @param {string} dir - Directory to search
 * @param {string[]} files - Accumulator array
 * @returns {Promise<string[]>} Array of scss file paths
 */
async function findScssFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  const processEntry = async (entry) => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await findScssFiles(fullPath, files);
    } else if (
      entry.isFile() &&
      extname(entry.name) === '.scss' &&
      !basename(entry.name).startsWith('_')
    ) {
      files.push(fullPath);
    }
  };

  await Promise.all(entries.map((entry) => processEntry(entry)));

  return files;
}

/**
 * Create a postcss processor: cssnano minification.
 * @returns {postcss.Processor}
 */
function createCssProcessor() {
  return postcss([
    cssnano({
      preset: [
        'default',
        {
          reduceIdents: false,
          mergeLonghand: false,
          calc: true,
          colormin: true,
          convertValues: true,
          discardComments: { removeAll: true },
          discardDuplicates: true,
          discardEmpty: true,
          minifyFontValues: true,
          minifyGradients: true,
          minifySelectors: false,
          normalizeCharset: true,
          normalizeDisplayValues: true,
          normalizePositions: true,
          normalizeRepeatStyle: true,
          normalizeString: true,
          normalizeTimingFunctions: true,
          normalizeUnicode: true,
          normalizeUrl: false,
          normalizeWhitespace: true,
          orderedValues: true,
          reduceInitial: true,
          reduceTransforms: true,
          svgo: true,
          uniqueSelectors: false,
          mergeRules: false,
        },
      ],
    }),
  ]);
}

/**
 * Minify CSS content using a reusable postcss processor
 * @param {string} css - CSS content to minify
 * @param {string} cssPath - Path to the CSS file (for postcss processing)
 * @param {postcss.Processor} processor - Reusable postcss processor
 * @returns {Promise<string>} Minified CSS content
 */
async function minifyCss(css, cssPath, processor) {
  const postcssResult = await processor.process(css, { from: cssPath, to: cssPath });

  let minifiedCss = postcssResult.css;

  // Round numeric values to 4 decimal places to prevent stylelint errors
  // SASS generates 5+ decimal places, we need to round them
  minifiedCss = minifiedCss.replace(/(\d*\.\d{5,})/g, (match) => {
    const num = parseFloat(match);
    const rounded = num.toFixed(4);
    // Remove trailing zeros after decimal point
    return rounded.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  });

  return minifiedCss;
}

/**
 * Compile a single SCSS file to CSS
 * @param {string} scssPath - Path to scss file
 * @param {postcss.Processor} processor - Reusable postcss processor
 * @returns {Promise<{success: boolean, path: string, error?: Error}>}
 */
async function compileScss(scssPath, processor) {
  try {
    const result = compile(scssPath, {
      style: 'compressed',
      loadPaths: [join(rootDir, 'styles'), dirname(scssPath)],
    });

    // Use .css for blocks, .min.css for styles; all styles/ outputs go to styles/dist/
    const isStyles = scssPath.startsWith(join(rootDir, 'styles'));
    const isMin = isStyles && !scssPath.includes('fonts');
    const cssFilename = basename(scssPath, '.scss') + (isMin ? '.min.css' : '.css');
    const outputDir = isStyles ? join(rootDir, 'styles', 'dist') : dirname(scssPath);
    const cssPath = join(outputDir, cssFilename);

    const finalCss =
      result.css.trim() !== '' ? await minifyCss(result.css, cssPath, processor) : '';

    await writeFile(cssPath, finalCss);

    console.log(`✓ Compiled: ${scssPath.replace(rootDir, '').replace(/\\/g, '/')}`);
    return { success: true, path: scssPath };
  } catch (error) {
    console.error(`✗ Error compiling ${scssPath}:`, error.message);
    return { success: false, path: scssPath, error };
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('\n🎨 Building SCSS files...\n');

  const startTime = Date.now();
  const scssFiles = [];

  // Ensure styles/dist/ exists
  const distDir = join(rootDir, 'styles', 'dist');
  await mkdir(distDir, { recursive: true });

  // Find SCSS files in blocks/ and styles/
  const blocksDir = join(rootDir, 'blocks');
  const stylesDir = join(rootDir, 'styles');

  try {
    await findScssFiles(blocksDir, scssFiles);
  } catch (err) {
    // blocks directory might not have scss files yet
  }

  try {
    await findScssFiles(stylesDir, scssFiles);
  } catch (err) {
    // styles directory might not have scss files yet
  }

  if (scssFiles.length === 0) {
    console.log('No SCSS files found to compile.\n');
    return;
  }

  // SCSS files use cssnano for minification
  const cssProcessor = createCssProcessor();

  // Compile all files
  const results = await Promise.all(scssFiles.map((file) => compileScss(file, cssProcessor)));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const elapsed = Date.now() - startTime;

  console.log(`\n📦 Build complete in ${elapsed}ms`);
  console.log(`   ${successful} file(s) compiled successfully`);

  if (failed > 0) {
    console.log(`   ${failed} file(s) failed`);
    process.exit(1);
  }

  console.log('');
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
