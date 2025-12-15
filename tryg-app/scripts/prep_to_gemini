const fs = require('fs');
const path = require('path');

// CONFIGURATION
// We look inside 'tryg-app/src' since that is where your code lives
const DIR_TO_SCAN = path.join(__dirname, 'tryg-app', 'src');
const OUTPUT_FILE = 'codebase_context.md';
const IGNORE_FILES = ['package-lock.json', 'yarn.lock', '.DS_Store'];
const ALLOWED_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.md'];

function scanDirectory(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            scanDirectory(filePath, fileList);
        } else {
            const ext = path.extname(file);
            if (!IGNORE_FILES.includes(file) && ALLOWED_EXTS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

// Also grab key files from the root of tryg-app (like package.json, vite.config)
const extraFiles = [
    path.join(__dirname, 'tryg-app', 'package.json'),
    path.join(__dirname, 'tryg-app', 'vite.config.js'),
    path.join(__dirname, 'tryg-app', 'IDEATION.md'),
    path.join(__dirname, 'learnings.md') // In the root
];

let content = `# Codebase Context: aeldrebagen\n\n`;

// Process specific root files first
extraFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        content += `\n## File: ${path.basename(filePath)}\n\`\`\`${path.extname(filePath).substring(1)}\n${fs.readFileSync(filePath, 'utf8')}\n\`\`\`\n---\n`;
    }
});

// Process src directory
const files = scanDirectory(DIR_TO_SCAN);
files.forEach(filePath => {
    const relativePath = path.relative(__dirname, filePath);
    content += `\n## File: ${relativePath}\n\`\`\`${path.extname(filePath).substring(1)}\n${fs.readFileSync(filePath, 'utf8')}\n\`\`\`\n---\n`;
});

fs.writeFileSync(OUTPUT_FILE, content);
console.log(`Successfully bundled your app context into ${OUTPUT_FILE}`);