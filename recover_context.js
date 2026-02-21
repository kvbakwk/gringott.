const fs = require('fs');
const path = require('path');

const historyDirs = [
  '/home/jakub/.vscode-server/data/User/History',
  '/home/jakub/.antigravity-server/data/User/History',
  '/home/jakub/.config/Code/User/History'
];

for (const hd of historyDirs) {
  if (!fs.existsSync(hd)) continue;
  fs.readdirSync(hd).forEach(dir => {
    const entryPath = path.join(hd, dir, 'entries.json');
    if (!fs.existsSync(entryPath)) return;
    try {
      const data = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
      const decoded = decodeURIComponent(data.resource);
      
      const match = decoded.match(/(\/home\/jakub\/gringott\..*)$/);
      if (match && match[1].includes('DataContext.tsx')) {
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
            
            console.log("Restoring:", match[1]);
            fs.mkdirSync(path.dirname(match[1]), { recursive: true });
            fs.copyFileSync(lastValid.fullPath, match[1]);
          }
      }
    } catch (e) {
      // ignore
    }
  });
}
console.log("Finished searching for DataContext");
