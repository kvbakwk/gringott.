const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.resolve(__dirname, 'src/app/(dashboard)'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix from "../material => from "@components/material
  // Also ../layouts, ../forms
  const regex = /from\s+["']\.\.\/(material|layouts|forms|navs|features|investments|pages)(.*?)["']/g;
  if(regex.test(content)) {
    content = content.replace(regex, 'from "@components/$1$2"');
    changed = true;
  }
  
  // Also ../../material etc if they were nested
  const regex2 = /from\s+["']\.\.\/\.\.\/(material|layouts|forms|navs|features|investments|pages)(.*?)["']/g;
  if(regex2.test(content)) {
    content = content.replace(regex2, 'from "@components/$1$2"');
    changed = true;
  }
  
  // also ../wallets or ../../wallets => @components/pages/wallets ? Wait, the earlier script handled "from './wallets'".
  const regex3 = /from\s+["'](\.\.\/)*wallets(.*?)["']/g;
  if(regex3.test(content)) {
    content = content.replace(regex3, 'from "@components/pages/wallets$2"');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
}
