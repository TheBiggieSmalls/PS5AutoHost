const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const appcachePath = path.join(rootDir, 'cache.appcache');

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!filePath.includes('.git')) {
                getFiles(filePath, fileList);
            }
        } else {
            const fileName = path.basename(filePath);
            if (fileName !== 'cache.appcache' && fileName !== 'update_cache.bat' && fileName !== 'update_cache.js' && fileName !== 'update_cache.ps1') {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

const files = getFiles(rootDir);
let manifest = `CACHE MANIFEST\r\n# Auto-generated on ${new Date().toISOString()}\r\n\r\n`;

files.forEach(file => {
    const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
    const fileBuffer = fs.readFileSync(file);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex').toUpperCase();
    manifest += `${relPath} #${hash}\r\n`;
});

manifest += `\r\nNETWORK:\r\n*\r\n`;

fs.writeFileSync(appcachePath, manifest, 'ascii');
console.log('Success: cache.appcache has been updated!');