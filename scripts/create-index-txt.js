const fs = require('fs');
const path = require('path');

function createIndexTxtFiles(dir) {
  let count = 0;

  function walk(currentDir) {
    const indexPath = path.join(currentDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const txtPath = path.join(currentDir, 'index.txt');
      if (!fs.existsSync(txtPath)) {
        fs.writeFileSync(txtPath, '');
        count++;
      }
    }

    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          walk(path.join(currentDir, entry.name));
        }
      }
    } catch (e) {
      // ignora
    }
  }

  walk(dir);
  console.log(`Created ${count} index.txt files`);
}

createIndexTxtFiles(path.join(__dirname, '..', 'out'));