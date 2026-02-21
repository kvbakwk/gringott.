const fs = require('fs');
const path = require('path');

const historyDirs = [
  '/home/jakub/.vscode-server/data/User/History',
  '/home/jakub/.antigravity-server/data/User/History',
  '/home/jakub/.config/Code/User/History'
];

let filesToRestore = {}; 

for (const hd of historyDirs) {
  if (!fs.existsSync(hd)) continue;
  fs.readdirSync(hd).forEach(dir => {
    const entryPath = path.join(hd, dir, 'entries.json');
    if (!fs.existsSync(entryPath)) return;
    try {
      const data = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
      const decoded = decodeURIComponent(data.resource);
      
      const match = decoded.match(/(\/home\/jakub\/gringott\..*)$/);
      if (match) {
        let filePath = match[1];
        if (filePath.includes('/src/app/api/') || filePath.includes('/src/app/utils/') || filePath.includes('/src/app/context/')) {
          let validEntries = [];
          for (const entry of data.entries) {
            const p = path.join(hd, dir, entry.id);
            if (fs.existsSync(p)) {
              const size = fs.statSync(p).size;
              if (size > 0) {
                 validEntries.push({ ...entry, size, fullPath: p });
              }
            }
          }
          if (validEntries.length > 0) {
            let lastValid = validEntries.reduce((a, b) => a.timestamp > b.timestamp ? a : b);
            
            if (!filesToRestore[filePath] || filesToRestore[filePath].timestamp < lastValid.timestamp) {
                filesToRestore[filePath] = {
                  path: lastValid.fullPath,
                  timestamp: lastValid.timestamp,
                  size: lastValid.size
                };
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  });
}

let restoredCount = 0;
for (const [p, info] of Object.entries(filesToRestore)) {
   if (!fs.existsSync(p)) {
     console.log(`Restoring missing: ${p}`);
     fs.mkdirSync(path.dirname(p), { recursive: true });
     fs.copyFileSync(info.path, p);
     restoredCount++;
   } else {
     // Check if we should override. If it's old tracked file, the history version might be newer.
     const currentSize = fs.statSync(p).size;
     // simple heuristic
   }
}
console.log(`Restored ${restoredCount} core app files.`);

