const fs = require('fs');
const path = require('path');

function search(dir, re) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(f.name)) continue;
      search(full, re);
    } else if (f.isFile() && (f.name.endsWith('.ts') || f.name.endsWith('.tsx') || f.name.endsWith('.js'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (re.test(content)) {
        console.log(full);
      }
    }
  }
}

console.log('--- Search: .from("menus") or .from("meal_plans") ---');
search('.', /\.from\(['"](menus|meal_plans)/);
