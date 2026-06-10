#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const partialPath = path.join(rootDir, 'tools', 'head.html');
const checkOnly = process.argv.includes('--check');

const skippedDirs = new Set(['.git', 'legacy', 'node_modules', 'tools']);
const excludedPaths = new Set(['github/overview.html']);
const fontAwesomePattern = /fontawesome|font-awesome|\bfa-[a-zA-Z0-9-]+/;

function toPosixPath(filePath) {
    return filePath.split(path.sep).join('/');
}

function walkHtmlFiles(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (skippedDirs.has(entry.name)) {
            continue;
        }

        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkHtmlFiles(fullPath, files);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            files.push(fullPath);
        }
    }

    return files;
}

function countOccurrences(text, needle) {
    return text.split(needle).length - 1;
}

function readPartial() {
    const partial = fs.readFileSync(partialPath, 'utf8').trim();

    if (countOccurrences(partial, '{{TITLE}}') !== 1) {
        throw new Error('tools/head.html must contain exactly one {{TITLE}} placeholder.');
    }

    if (countOccurrences(partial, '{{DESCRIPTION}}') !== 1) {
        throw new Error('tools/head.html must contain exactly one {{DESCRIPTION}} placeholder.');
    }

    if (!/href="\/home\/css\/site\.css"/.test(partial)) {
        throw new Error('tools/head.html must use the root-absolute /home/css/site.css stylesheet URL.');
    }

    if (!/localStorage\.getItem\('theme'\)/.test(partial)) {
        throw new Error('tools/head.html must keep the inline theme bootstrap script in <head>.');
    }

    return partial;
}

function extractHead(html, relPath) {
    const matches = html.match(/<head[\s\S]*?<\/head>/gi) || [];
    if (matches.length !== 1) {
        throw new Error(`${relPath}: expected exactly one <head> block, found ${matches.length}.`);
    }

    return matches[0];
}

function extractPageMeta(head, relPath) {
    const titleMatch = head.match(/<title>([\s\S]*?)<\/title>/i);
    if (!titleMatch) {
        throw new Error(`${relPath}: missing <title>.`);
    }

    const descriptionTag = head.match(/<meta\b(?=[^>]*\bname=(["'])description\1)[^>]*>/i);
    if (!descriptionTag) {
        throw new Error(`${relPath}: missing <meta name="description">.`);
    }

    const descriptionMatch = descriptionTag[0].match(/\bcontent=(["'])([\s\S]*?)\1/i);
    if (!descriptionMatch) {
        throw new Error(`${relPath}: description meta tag is missing content="...".`);
    }

    return {
        title: titleMatch[1],
        description: descriptionMatch[2],
    };
}

function renderHead(partial, meta) {
    return partial
        .replace('{{TITLE}}', meta.title)
        .replace('{{DESCRIPTION}}', meta.description);
}

function isInScope(head, html, relPath) {
    if (excludedPaths.has(relPath)) {
        return false;
    }

    if (!/href=(["'])[^"']*home\/css\/site\.css\1/i.test(head)) {
        return false;
    }

    if (fontAwesomePattern.test(html)) {
        return false;
    }

    return true;
}

function main() {
    const partial = readPartial();
    const htmlFiles = walkHtmlFiles(rootDir);
    const changed = [];
    let inScopeCount = 0;

    for (const fullPath of htmlFiles) {
        const relPath = toPosixPath(path.relative(rootDir, fullPath));
        const html = fs.readFileSync(fullPath, 'utf8');

        if (excludedPaths.has(relPath) || !/home\/css\/site\.css/i.test(html) || fontAwesomePattern.test(html)) {
            continue;
        }

        const head = extractHead(html, relPath);
        if (!isInScope(head, html, relPath)) {
            continue;
        }

        inScopeCount += 1;
        const meta = extractPageMeta(head, relPath);
        const nextHtml = html.replace(head, renderHead(partial, meta));

        if (nextHtml !== html) {
            changed.push(relPath);
            if (!checkOnly) {
                fs.writeFileSync(fullPath, nextHtml);
            }
        }
    }

    const mode = checkOnly ? 'Checked' : 'Built';
    console.log(`${mode} ${inScopeCount} page head(s).`);

    if (changed.length === 0) {
        console.log('No head changes needed.');
        return;
    }

    console.log(`${checkOnly ? 'Would update' : 'Updated'} ${changed.length} page head(s).`);
    for (const relPath of changed) {
        console.log(`- ${relPath}`);
    }

    if (checkOnly) {
        process.exitCode = 1;
    }
}

main();
