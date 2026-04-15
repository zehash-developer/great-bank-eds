/**
 * GEL Asset Extraction Script
 *
 * Fetches SVG icons, logos, and pictograms from the official GEL Design System
 * website and generates standalone SVG files + CSS classes for AEM Edge Delivery Services.
 *
 * Usage: npm run gel:extract-icons
 *
 * Source: Official GEL Design System asset downloads (no @westpac/ui required)
 *   - Icons: https://gel.westpacgroup.com.au/assets/GEL_Icons.zip
 *   - Logos: https://gel.westpacgroup.com.au/assets/GEL_Logos_Symbols.zip
 *   - Pictograms: https://gel.westpacgroup.com.au/assets/GEL_Pictograms.zip
 *
 * Output:
 *   - Icons: icons/filled/*.svg, icons/outlined/*.svg
 *   - Logos: icons/logos/*.svg
 *   - Pictograms: icons/pictograms/duo/*.svg, icons/pictograms/dark/*.svg, icons/pictograms/light/*.svg
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const unzipper = require('unzipper');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GEL Design System asset URLs (official downloads)
const ASSET_URLS = {
  icons: 'https://gel.westpacgroup.com.au/assets/GEL_Icons.zip',
  logos: 'https://gel.westpacgroup.com.au/assets/GEL_Logos_Symbols.zip',
  pictograms: 'https://gel.westpacgroup.com.au/assets/GEL_Pictograms.zip',
};

const ICON_OUTPUT_DIR = path.join(__dirname, '../icons');
const LOGO_OUTPUT_DIR = path.join(ICON_OUTPUT_DIR, 'logos');
const PICTOGRAM_OUTPUT_DIR = path.join(ICON_OUTPUT_DIR, 'pictograms');
const CSS_OUTPUT_DIR = path.join(__dirname, '../styles');
const MODELS_OUTPUT_DIR = path.join(__dirname, '../models/generated');

/**
 * Clean the icons directory and generated manifests to ensure fresh extraction
 */
function cleanIconsDirectory() {
  console.log('🧹 Cleaning icons directory and generated manifests...\n');

  let itemsCleaned = false;

  // Remove entire icons directory
  if (fs.existsSync(ICON_OUTPUT_DIR)) {
    fs.rmSync(ICON_OUTPUT_DIR, { recursive: true, force: true });
    console.log('   ✓ Removed icons/ directory');
    itemsCleaned = true;
  }

  // Remove entire models/generated directory
  if (fs.existsSync(MODELS_OUTPUT_DIR)) {
    fs.rmSync(MODELS_OUTPUT_DIR, { recursive: true, force: true });
    console.log('   ✓ Removed models/generated/ directory');
    itemsCleaned = true;
  }

  if (itemsCleaned) {
    console.log('✅ Cleanup complete\n');
  } else {
    console.log('   (no existing files to clean)\n');
  }
}

/**
 * Convert PascalCase to kebab-case
 * CloseIcon -> close, ArrowBackCircleIcon -> arrow-back-circle
 */
function pascalToKebab(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/_/g, '-') // Replace underscores with hyphens
    .toLowerCase();
}

/**
 * Extract icon/logo/pictogram name from filename
 * CloseIcon.svg -> close, WBCLogo.svg -> wbc-logo, ATMPictogram.svg -> atm
 */
function filenameToKebabName(filename, options = {}) {
  const base = filename.replace(/\.svg$/i, '');
  let name = pascalToKebab(base);
  if (!options.keepSuffix) {
    name = name.replace(/-icon$/, '');
    name = name.replace(/-pictogram$/, '');
    // Keep -logo for logos (bom-logo, wbc-logo)
  }
  return name;
}

/**
 * Download a URL and return the response (for streaming) or buffer
 */
async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Great-Bank-EDS-Extraction/1.0' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Extract zip buffer and yield { path, content } for each entry
 */
async function* iterateZipEntries(buffer) {
  const directory = await unzipper.Open.buffer(buffer);
  for (const entry of directory.files) {
    if (entry.type !== 'File' || !entry.path) continue;
    if (entry.path.endsWith('/')) continue; // skip dirs
    const content = await entry.buffer();
    yield { path: entry.path, content: content.toString('utf-8') };
  }
}

/**
 * Ensure SVG has fill="currentColor" for icons (mask-based usage)
 */
function ensureCurrentColor(svgContent) {
  // If SVG has no fill, add fill="currentColor" to root
  if (!/<svg[\s\S]*?fill=/i.test(svgContent) && !svgContent.includes('fill=')) {
    return svgContent.replace(/<svg/i, '<svg fill="currentColor"');
  }
  return svgContent;
}

/**
 * Download and extract icons from GEL_Icons.zip
 * Expected structure: Filled/*.svg, Outlined/*.svg (or similar)
 */
async function extractGelIcons() {
  console.log('🎨 Downloading GEL icons from gel.westpacgroup.com.au...\n');

  const buffer = await fetchBuffer(ASSET_URLS.icons);
  const filledDir = path.join(ICON_OUTPUT_DIR, 'filled');
  const outlinedDir = path.join(ICON_OUTPUT_DIR, 'outlined');

  fs.mkdirSync(filledDir, { recursive: true });
  fs.mkdirSync(outlinedDir, { recursive: true });

  let filledCount = 0;
  let outlinedCount = 0;

  for await (const { path: entryPath, content } of iterateZipEntries(buffer)) {
    const lowerPath = entryPath.toLowerCase();
    const lowerFile = path.basename(entryPath).toLowerCase();
    if (!lowerFile.endsWith('.svg')) continue;

    let targetDir = null;
    // Path-based: Filled/, Outlined/ or filled/, outlined/
    if (lowerPath.includes('filled') || lowerPath.includes('/fill/')) {
      targetDir = filledDir;
    } else if (
      lowerPath.includes('outlined')
      || lowerPath.includes('/outline/')
    ) {
      targetDir = outlinedDir;
    }
    // Filename-based fallback: CloseIconFilled.svg, CloseIconOutlined.svg
    if (!targetDir && lowerFile.includes('filled')) targetDir = filledDir;
    if (!targetDir && lowerFile.includes('outlined')) targetDir = outlinedDir;
    // Single-folder zip: assume filled (e.g. root or Icons/)
    if (!targetDir) targetDir = filledDir;

    const name = filenameToKebabName(path.basename(entryPath));
    const svg = ensureCurrentColor(content);
    const outPath = path.join(targetDir, `${name}.svg`);
    fs.writeFileSync(outPath, svg);

    if (targetDir === filledDir) filledCount++;
    else outlinedCount++;
  }

  console.log(`✅ Extracted: ${filledCount} filled, ${outlinedCount} outlined icons`);
  console.log(`📁 Saved to: ${filledDir}, ${outlinedDir}\n`);
}

/**
 * Download and extract logos from GEL_Logos_Symbols.zip
 */
async function extractGelLogos() {
  console.log('🏛️  Downloading GEL logos from gel.westpacgroup.com.au...\n');

  const buffer = await fetchBuffer(ASSET_URLS.logos);
  fs.mkdirSync(LOGO_OUTPUT_DIR, { recursive: true });

  let count = 0;
  for await (const { path: entryPath, content } of iterateZipEntries(buffer)) {
    const filename = path.basename(entryPath);
    if (!filename.toLowerCase().endsWith('.svg')) continue;

    const name = filenameToKebabName(filename);
    const outPath = path.join(LOGO_OUTPUT_DIR, `${name}.svg`);
    fs.writeFileSync(outPath, content);
    count++;
  }

  console.log(`✅ Extracted: ${count} logos`);
  console.log(`📁 Saved to: ${LOGO_OUTPUT_DIR}\n`);
}

/**
 * Download and extract pictograms from GEL_Pictograms.zip
 * Expected structure: Duo/*.svg, Dark/*.svg, Light/*.svg
 */
async function extractGelPictograms() {
  console.log('🎨 Downloading GEL pictograms from gel.westpacgroup.com.au...\n');

  const buffer = await fetchBuffer(ASSET_URLS.pictograms);
  const modes = ['duo', 'dark', 'light'];
  const dirs = {};
  modes.forEach((m) => {
    dirs[m] = path.join(PICTOGRAM_OUTPUT_DIR, m);
    fs.mkdirSync(dirs[m], { recursive: true });
  });

  const counts = { duo: 0, dark: 0, light: 0 };

  for await (const { path: entryPath, content } of iterateZipEntries(buffer)) {
    const lowerPath = entryPath.toLowerCase();
    const filename = path.basename(entryPath);
    if (!filename.toLowerCase().endsWith('.svg')) continue;

    let mode = null;
    if (lowerPath.includes('duo') || lowerPath.includes('/duo/')) mode = 'duo';
    else if (lowerPath.includes('dark') || lowerPath.includes('/dark/')) { mode = 'dark'; } else if (lowerPath.includes('light') || lowerPath.includes('/light/')) { mode = 'light'; }
    if (!mode) continue;

    const name = filenameToKebabName(filename);
    const outPath = path.join(dirs[mode], `${name}.svg`);
    fs.writeFileSync(outPath, content);
    counts[mode]++;
  }

  console.log(
    `✅ Extracted: ${counts.duo} duo, ${counts.dark} dark, ${counts.light} light pictograms`,
  );
  console.log(`📁 Saved to: ${PICTOGRAM_OUTPUT_DIR}\n`);
}

/**
 * Convert SVG file content to base64 data URI for CSS
 */
function svgToDataUri(svgContent) {
  const optimized = svgContent
    .replace(/\n/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
  const encoded = encodeURIComponent(optimized)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Generate CSS/SCSS files from extracted SVG files
 */
async function generateIconCss() {
  console.log('🎨 Generating CSS/SCSS files for GEL assets...\n');

  const cssClasses = [];
  const scssVariables = [];
  const scssClasses = [];

  const baseIconStyles = `
/* Base icon styles */
.gel-icon,
.gel-logo,
.gel-pictogram {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
  background-color: currentcolor;
  mask-image:url('');
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

/* Default icon size (24px) */
.gel-icon {
  width: 24px;
  height: 24px;
}

/* Default logo size (auto width, 24px height) */
.gel-logo {
  width: auto;
  height: 24px;
}

/* Default pictogram size (78px) */
.gel-pictogram {
  width: 78px;
  height: 78px;
}

/* Size modifiers */
.gel-icon-xs,
.gel-logo-xs,
.gel-pictogram-xs {
  width: 16px;
  height: 16px;
}

.gel-icon-sm,
.gel-logo-sm,
.gel-pictogram-sm {
  width: 20px;
  height: 20px;
}

.gel-icon-md,
.gel-logo-md,
.gel-pictogram-md {
  width: 24px;
  height: 24px;
}

.gel-icon-lg,
.gel-logo-lg,
.gel-pictogram-lg {
  width: 32px;
  height: 32px;
}

.gel-icon-xl,
.gel-logo-xl,
.gel-pictogram-xl {
  width: 48px;
  height: 48px;
}

.gel-icon-2xl,
.gel-logo-2xl,
.gel-pictogram-2xl {
  width: 64px;
  height: 64px;
}

/* Accessibility helper - hide from screen readers if decorative */
.gel-icon[aria-hidden="true"],
.gel-logo[aria-hidden="true"],
.gel-pictogram[aria-hidden="true"] {
  pointer-events: none;
}
`;

  cssClasses.push(baseIconStyles);
  scssClasses.push(baseIconStyles);

  // Process filled icons
  const filledDir = path.join(ICON_OUTPUT_DIR, 'filled');
  if (fs.existsSync(filledDir)) {
    const files = fs
      .readdirSync(filledDir)
      .filter((f) => f.endsWith('.svg'))
      .sort();
    cssClasses.push('\n/* Filled Icons */');
    scssClasses.push('\n/* Filled Icons */');
    for (const file of files) {
      const rawName = file.replace('.svg', '');
      // Strip -filled suffix from class name
      const iconName = rawName.replace(/-filled$/, '');
      const svgContent = fs.readFileSync(path.join(filledDir, file), 'utf-8');
      const dataUri = svgToDataUri(svgContent);
      cssClasses.push(
        `.gel-icon-${iconName} {\n  mask-image: url('${dataUri}');\n}`,
      );
      scssVariables.push(`$gel-icon-${iconName}: '${dataUri}';`);
      scssClasses.push(
        `.gel-icon-${iconName} {\n  mask-image: url($gel-icon-${iconName});\n}`,
      );
    }
  }

  // Process outlined icons
  const outlinedDir = path.join(ICON_OUTPUT_DIR, 'outlined');
  if (fs.existsSync(outlinedDir)) {
    const files = fs
      .readdirSync(outlinedDir)
      .filter((f) => f.endsWith('.svg'))
      .sort();
    cssClasses.push('\n/* Outlined Icons */');
    scssClasses.push('\n/* Outlined Icons */');
    for (const file of files) {
      const iconName = file.replace('.svg', '');
      const svgContent = fs.readFileSync(path.join(outlinedDir, file), 'utf-8');
      const dataUri = svgToDataUri(svgContent);
      cssClasses.push(
        `.gel-icon-${iconName} {\n  mask-image: url('${dataUri}');\n}`,
      );
      scssVariables.push(`$gel-icon-${iconName}: '${dataUri}';`);
      scssClasses.push(
        `.gel-icon-${iconName} {\n  mask-image: url($gel-icon-${iconName});\n}`,
      );
    }
  }

  // Process logos
  if (fs.existsSync(LOGO_OUTPUT_DIR)) {
    const files = fs
      .readdirSync(LOGO_OUTPUT_DIR)
      .filter((f) => f.endsWith('.svg'))
      .sort();
    cssClasses.push('\n/* Logos */');
    scssClasses.push('\n/* Logos */');
    for (const file of files) {
      const logoName = file.replace('.svg', '');
      const svgContent = fs.readFileSync(
        path.join(LOGO_OUTPUT_DIR, file),
        'utf-8',
      );
      const dataUri = svgToDataUri(svgContent);
      cssClasses.push(
        `.gel-logo-${logoName} {\n  mask-image: url('${dataUri}');\n}`,
      );
      scssVariables.push(`$gel-logo-${logoName}: '${dataUri}';`);
      scssClasses.push(
        `.gel-logo-${logoName} {\n  mask-image: url($gel-logo-${logoName});\n}`,
      );
    }
  }

  // Process pictograms
  const modes = ['duo', 'dark', 'light'];
  for (const mode of modes) {
    const pictogramDir = path.join(PICTOGRAM_OUTPUT_DIR, mode);
    if (fs.existsSync(pictogramDir)) {
      const files = fs
        .readdirSync(pictogramDir)
        .filter((f) => f.endsWith('.svg'))
        .sort();
      cssClasses.push(`\n/* Pictograms - ${mode} mode */`);
      scssClasses.push(`\n/* Pictograms - ${mode} mode */`);
      for (const file of files) {
        const pictogramName = file.replace('.svg', '');
        const svgContent = fs.readFileSync(
          path.join(pictogramDir, file),
          'utf-8',
        );
        const dataUri = svgToDataUri(svgContent);
        const className = mode === 'duo'
          ? `gel-pictogram-${pictogramName}`
          : `gel-pictogram-${pictogramName}-${mode}`;
        cssClasses.push(
          `.${className} {\n  mask-image: url('${dataUri}');\n}`,
        );
        scssVariables.push(`$${className}: '${dataUri}';`);
        scssClasses.push(
          `.${className} {\n  mask-image: url($${className});\n}`,
        );
      }
    }
  }

  const cssOutput = `/**
 * GEL Icons, Logos, and Pictograms CSS
 *
 * Auto-generated by scripts/extract-gel-icons.js
 * Source: gel.westpacgroup.com.au (GEL Design System)
 * DO NOT EDIT THIS FILE MANUALLY
 *
 * Usage:
 *   <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
 *   <i class="gel-logo gel-logo-wbc" aria-label="Brand"></i>
 *   <i class="gel-pictogram gel-pictogram-atm" aria-hidden="true"></i>
 *
 * Size modifiers: -xs, -sm, -md, -lg, -xl, -2xl
 */

${cssClasses.join('\n\n')}
`;

  const scssOutput = `/**
 * GEL Icons, Logos, and Pictograms SCSS
 *
 * Auto-generated by scripts/extract-gel-icons.js
 * Source: gel.westpacgroup.com.au (GEL Design System)
 * DO NOT EDIT THIS FILE MANUALLY
 *
 * Usage:
 *   <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
 *   <i class="gel-logo gel-logo-wbc" aria-label="Brand"></i>
 *   <i class="gel-pictogram gel-pictogram-atm" aria-hidden="true"></i>
 *
 * Size modifiers: -xs, -sm, -md, -lg, -xl, -2xl
 */

/* SCSS Variables */
${scssVariables.join('\n')}

${scssClasses.join('\n\n')}
`;

  fs.writeFileSync(path.join(__dirname, '../styles/gel-icons.css'), cssOutput);
  fs.writeFileSync(path.join(__dirname, '../styles/gel-icons.scss'), scssOutput);

  const totalIcons = scssVariables.filter((v) => v.includes('$gel-icon-')).length;
  const totalLogos = scssVariables.filter((v) => v.includes('$gel-logo-')).length;
  const totalPictograms = scssVariables.filter((v) => v.includes('$gel-pictogram-')).length;

  console.log('✅ CSS/SCSS generation complete:');
  console.log(`   - Icons: ${totalIcons} classes`);
  console.log(`   - Logos: ${totalLogos} classes`);
  console.log(`   - Pictograms: ${totalPictograms} classes`);
  console.log(`   - Total: ${totalIcons + totalLogos + totalPictograms} classes`);
}

/**
 * Generate JSON manifest files for Universal Editor icon picker
 * Creates separate files for each icon category plus an all-icons combined file
 */
async function generateIconManifests() {
  console.log('\n📋 Generating JSON manifests for Universal Editor...\n');

  fs.mkdirSync(MODELS_OUTPUT_DIR, { recursive: true });

  const manifests = {
    'filled-icons': [],
    'outlined-icons': [],
    'pictograms-duo': [],
    'pictograms-dark': [],
    'pictograms-light': [],
    logos: [],
  };

  // Process filled icons
  const filledDir = path.join(ICON_OUTPUT_DIR, 'filled');
  if (fs.existsSync(filledDir)) {
    const files = fs
      .readdirSync(filledDir)
      .filter((f) => f.endsWith('.svg'))
      .sort();
    for (const file of files) {
      const rawName = file.replace('.svg', '');
      // Strip -filled suffix for both label and value
      const iconName = rawName.replace(/-filled$/, '');
      manifests['filled-icons'].push({
        name: iconName,
        value: iconName,
      });
    }
  }

  // Process outlined icons
  const outlinedDir = path.join(ICON_OUTPUT_DIR, 'outlined');
  if (fs.existsSync(outlinedDir)) {
    const files = fs
      .readdirSync(outlinedDir)
      .filter((f) => f.endsWith('.svg'))
      .sort();
    for (const file of files) {
      const iconName = file.replace('.svg', '');
      // Strip -outlined suffix for readable label
      const label = iconName.replace(/-outlined$/, '');
      manifests['outlined-icons'].push({
        name: label,
        value: iconName,
      });
    }
  }

  // Process logos
  if (fs.existsSync(LOGO_OUTPUT_DIR)) {
    const files = fs
      .readdirSync(LOGO_OUTPUT_DIR)
      .filter((f) => f.endsWith('.svg'))
      .sort();
    for (const file of files) {
      const logoName = file.replace('.svg', '');
      manifests.logos.push({
        name: logoName,
        value: logoName,
      });
    }
  }

  // Process pictograms
  const modes = ['duo', 'dark', 'light'];
  for (const mode of modes) {
    const pictogramDir = path.join(PICTOGRAM_OUTPUT_DIR, mode);
    if (fs.existsSync(pictogramDir)) {
      const files = fs
        .readdirSync(pictogramDir)
        .filter((f) => f.endsWith('.svg'))
        .sort();
      for (const file of files) {
        const pictogramName = file.replace('.svg', '');
        // Use base name for label, include mode in value
        const value = `${pictogramName}-${mode}`;
        manifests[`pictograms-${mode}`].push({
          name: pictogramName,
          value,
        });
      }
    }
  }

  // Write individual manifest files (with underscore prefix for UE conventions)
  for (const [name, options] of Object.entries(manifests)) {
    const filePath = path.join(MODELS_OUTPUT_DIR, `_${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(options, null, 2));
    console.log(`   ✅ _${name}.json (${options.length} items)`);
  }

  // Generate combined all-icons.json
  const allIcons = [
    ...manifests['filled-icons'],
    ...manifests['outlined-icons'],
    ...manifests.logos,
    ...manifests['pictograms-duo'],
    ...manifests['pictograms-dark'],
    ...manifests['pictograms-light'],
  ];
  const allIconsPath = path.join(MODELS_OUTPUT_DIR, '_all-icons.json');
  fs.writeFileSync(allIconsPath, JSON.stringify(allIcons, null, 2));
  console.log(`   ✅ _all-icons.json (${allIcons.length} items)`);

  console.log('\n📁 Manifests saved to:', MODELS_OUTPUT_DIR);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const manifestsOnly = args.includes('--manifests-only');

  console.log('🎨 GEL Asset Extraction (from gel.westpacgroup.com.au)\n');
  console.log('='.repeat(50));

  if (manifestsOnly) {
    console.log('\n📋 Running in manifests-only mode (using existing icons)\n');
    await generateIconCss();
    await generateIconManifests();
    console.log(`\n${'='.repeat(50)}`);
    console.log('\n✨ Manifest generation complete!\n');
    return;
  }

  console.log('\n');

  try {
    cleanIconsDirectory();
  } catch (err) {
    console.error('❌ Cleaning icons directory failed:', err.message);
    process.exit(1);
  }

  try {
    await extractGelIcons();
  } catch (err) {
    console.error('❌ Icon extraction failed:', err.message);
    process.exit(1);
  }

  console.log('='.repeat(50));
  console.log('\n');

  try {
    await extractGelLogos();
  } catch (err) {
    console.error('⚠️  Logo extraction failed:', err.message);
    console.log('   (continuing without logos)\n');
  }

  console.log('='.repeat(50));
  console.log('\n');

  try {
    await extractGelPictograms();
  } catch (err) {
    console.error('⚠️  Pictogram extraction failed:', err.message);
    console.log('   (continuing without pictograms)\n');
  }

  console.log('='.repeat(50));
  console.log('\n');

  await generateIconCss();
  await generateIconManifests();

  console.log(`\n${'='.repeat(50)}`);
  console.log('\n✨ Extraction complete!\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
