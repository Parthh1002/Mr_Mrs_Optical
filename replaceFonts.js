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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      if (content.includes('font-playfair')) {
        content = content.replace(/font-playfair/g, 'font-fraunces');
        modified = true;
      }
      if (content.includes('font-outfit')) {
        content = content.replace(/font-outfit/g, 'font-manrope');
        modified = true;
      }
      if (content.includes('Playfair_Display')) {
        content = content.replace(/Playfair_Display/g, 'Fraunces');
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

replaceInFiles(path.join(__dirname, 'src'));
