#!/usr/bin/env node
/*!
 * Script to add missing translation keys from Russian (ru.js) to other language files
 * Usage: node add-missing-translations.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LANGS_DIR = path.join(__dirname, '../src/langs');
const TEMPLATE_LANG = 'ru.js'; // Source template language
const SKIP_LANGS = ['en.js', 'keys.js', 'i18n.test.js']; // Files to skip

/**
 * Extract translations object from a JS module file
 * @param {string} filePath
 * @returns {Object|null}
 */
function extractTranslations(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Parse the file content manually to extract the module.exports object
        const moduleExportsMatch = content.match(/module\.exports\s*=\s*(\{[\s\S]*?\});?\s*$/);
        if (!moduleExportsMatch) {
            console.error(`No module.exports found in ${filePath}`);
            return null;
        }

        const objectString = moduleExportsMatch[1];

        // Use eval in a controlled way to parse the object
        // This is safer than require() for files with syntax issues
        try {
            const translations = eval(`(${objectString})`);
            return translations;
        } catch (evalError) {
            console.error(`Error parsing translations from ${filePath}:`, evalError.message);
            return null;
        }

    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Extract the header comment from a file
 * @param {string} filePath
 * @returns {string}
 */
function extractHeader(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const headerMatch = content.match(/^(\/\*![\s\S]*?\*\/\s*)/);
        return headerMatch ? headerMatch[1] : '';
    } catch (error) {
        console.error(`Error reading header from ${filePath}:`, error.message);
        return '';
    }
}

/**
 * Detect the quote style used in the original file
 * @param {string} content
 * @returns {string} '"' or "'"
 */
function detectQuoteStyle(content) {
    // Count single and double quotes used for string values (not keys)
    const singleQuoteMatches = content.match(/:\s*'[^']*'/g) || [];
    const doubleQuoteMatches = content.match(/:\s*"[^"]*"/g) || [];

    return doubleQuoteMatches.length > singleQuoteMatches.length ? '"' : "'";
}

/**
 * Extract key-value pairs preserving original quote style for keys
 * @param {string} content
 * @returns {Object}
 */
function extractKeyQuoteStyles(content) {
    const keyQuotes = {};

    // Find all key definitions with their quote styles
    const keyMatches = content.matchAll(/(\s*)(['"'])([^'"]+)\2\s*:/g);
    for (const match of keyMatches) {
        const key = match[3];
        const quote = match[2];
        keyQuotes[key] = quote;
    }

    // Also find unquoted keys
    const unquotedMatches = content.matchAll(/(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g);
    for (const match of unquotedMatches) {
        const key = match[2];
        // Skip if this key was already found with quotes
        if (!(key in keyQuotes)) {
            keyQuotes[key] = null; // null means no quotes needed
        }
    }

    return keyQuotes;
}

/**
 * Format a JavaScript object for writing to file, preserving multiline strings and quote style
 * @param {Object} obj
 * @param {string} quoteChar
 * @param {Object} keyQuotes
 * @param {number} indent
 * @returns {string}
 */
function formatObject(obj, quoteChar = "'", keyQuotes = {}, indent = 1) {
    const indentStr = '\t'.repeat(indent);
    const entries = [];

    for (const [key, value] of Object.entries(obj)) {
        // Use preserved key quote style or determine if quotes are needed
        let quotedKey;
        if (key in keyQuotes) {
            const keyQuote = keyQuotes[key];
            if (keyQuote === null) {
                quotedKey = key; // No quotes needed
            } else {
                quotedKey = `${keyQuote}${key}${keyQuote}`;
            }
        } else {
            // For new keys, determine if quotes are needed
            const needsQuotes = key.includes(' ') || key.includes('-') || key.includes("'") || key.includes('"') || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
            if (needsQuotes) {
                // Use single quotes for keys with apostrophes, double quotes for others with special chars
                const keyQuoteChar = key.includes("'") ? '"' : "'";
                quotedKey = `${keyQuoteChar}${key}${keyQuoteChar}`;
            } else {
                quotedKey = key;
            }
        }

        if (typeof value === 'string') {
            // Escape quotes properly based on quote character
            const escapedValue = quoteChar === '"'
                ? value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
                : value.replace(/'/g, "\\'");

            // Handle multiline strings
            if (value.includes('\n')) {
                const lines = value.split('\n');
                const formattedValue = lines.map((line, index) => {
                    const escapedLine = quoteChar === '"'
                        ? line.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
                        : line.replace(/'/g, "\\'");
                    if (index === 0) return `${quoteChar}${escapedLine}${quoteChar}`;
                    return `${indentStr}\t${quoteChar}${escapedLine}${quoteChar}`;
                }).join(' +\n');
                entries.push(`${indentStr}${quotedKey}:\n${indentStr}\t${formattedValue}`);
            } else {
                entries.push(`${indentStr}${quotedKey}: ${quoteChar}${escapedValue}${quoteChar}`);
            }
        } else {
            entries.push(`${indentStr}${quotedKey}: ${JSON.stringify(value)}`);
        }
    }

    return entries.join(',\n');
}

/**
 * Write translations to file with proper formatting
 * @param {string} filePath
 * @param {Object} translations
 * @param {string} header
 * @param {string} quoteChar
 * @param {Object} keyQuotes
 */
function writeTranslationsFile(filePath, translations, header, quoteChar = "'", keyQuotes = {}) {
    const formattedContent = formatObject(translations, quoteChar, keyQuotes);
    const content = `${header}
module.exports = {
${formattedContent}
};
`;

    fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Merge translations, adding missing keys from template
 * @param {Object} existing
 * @param {Object} template
 * @returns {Object}
 */
function mergeTranslations(existing, template) {
    const merged = { ...existing };
    let addedCount = 0;

    for (const [key, value] of Object.entries(template)) {
        if (!(key in merged)) {
            // Add key with placeholder indicating it needs translation
            merged[key] = `[TRANSLATE: ${value}]`;
            addedCount++;
        }
    }

    return { merged, addedCount };
}

/**
 * Main function to process all language files
 */
function main() {
    console.log('🔄 Starting translation sync process...\n');

    const templatePath = path.join(LANGS_DIR, TEMPLATE_LANG);

    // Check if template file exists
    if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template file ${TEMPLATE_LANG} not found in ${LANGS_DIR}`);
        process.exit(1);
    }

    // Load template translations
    const templateTranslations = extractTranslations(templatePath);
    if (!templateTranslations) {
        console.error(`❌ Failed to load template translations from ${TEMPLATE_LANG}`);
        process.exit(1);
    }

    console.log(`📖 Loaded ${Object.keys(templateTranslations).length} keys from ${TEMPLATE_LANG}`);

    // Get all language files
    const langFiles = fs.readdirSync(LANGS_DIR)
        .filter(file => file.endsWith('.js') && !SKIP_LANGS.includes(file))
        .sort();

    console.log(`🌍 Found ${langFiles.length} language files to process\n`);

    let totalProcessed = 0;
    let totalAdded = 0;

    // Process each language file
    for (const langFile of langFiles) {
        const langPath = path.join(LANGS_DIR, langFile);

        console.log(`🔄 Processing ${langFile}...`);

        // Extract existing translations, header, and detect styles
        const existingTranslations = extractTranslations(langPath);
        const header = extractHeader(langPath);
        const originalContent = fs.readFileSync(langPath, 'utf8');
        const quoteChar = detectQuoteStyle(originalContent);
        const keyQuotes = extractKeyQuoteStyles(originalContent);

        if (!existingTranslations) {
            console.log(`⚠️  Skipping ${langFile} - could not load existing translations`);
            continue;
        }

        // Merge translations
        const { merged, addedCount } = mergeTranslations(existingTranslations, templateTranslations);

        if (addedCount > 0) {
            // Write updated file
            writeTranslationsFile(langPath, merged, header, quoteChar, keyQuotes);
            console.log(`✅ Added ${addedCount} missing keys to ${langFile}`);
            totalAdded += addedCount;
        } else {
            console.log(`✨ ${langFile} is already up to date`);
        }

        totalProcessed++;
    }

    console.log(`\n🎉 Sync completed!`);
    console.log(`📊 Processed ${totalProcessed} files`);
    console.log(`➕ Added ${totalAdded} total missing keys`);

    if (totalAdded > 0) {
        console.log('\n⚠️  Note: New keys are marked with [TRANSLATE: ...] placeholders.');
        console.log('   Please replace these placeholders with proper translations.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    extractTranslations,
    extractHeader,
    formatObject,
    writeTranslationsFile,
    mergeTranslations
};