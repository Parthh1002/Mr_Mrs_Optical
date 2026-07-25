const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        replaceInFiles(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Replace exact match /collection with /catalog
      if (content.includes('"/collection"')) {
        content = content.replace(/"\/collection"/g, '"/catalog"');
        modified = true;
      }
      if (content.includes("'/collection'")) {
        content = content.replace(/'\/collection'/g, "'/catalog'");
        modified = true;
      }
      if (content.includes('"/collection?')) {
        content = content.replace(/"\/collection\?/g, '"/catalog?');
        modified = true;
      }
      if (content.includes("'/collection?")) {
        content = content.replace(/'\/collection\?/g, "'/catalog?");
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated links:', fullPath);
      }
    }
  }
}

replaceInFiles(path.join(__dirname, 'src'));
