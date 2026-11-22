const fs = require('fs');

const dishSet = new Set();

function scan(filepath) {
  if (!fs.existsSync(filepath)) return;
  const content = fs.readFileSync(filepath, 'utf8');
  const nameMatches = content.match(/name:\s*["'`][^"'`]+["'`]/g) || [];
  nameMatches.forEach(m => {
    const val = m.replace(/name:\s*["'`]/, '').replace(/["'`]$/, '').trim();
    if (val && !val.includes('$') && val.length < 50 && !val.includes('Student') && !val.includes('Admin') && !val.includes('User')) {
      dishSet.add(val);
    }
  });
}

scan('lib/data/mess-store.ts');
scan('lib/data/dish-images.ts');
scan('scripts/seed-menus.js');
scan('supabase/seed.sql');
scan('app/(student)/student/menu/page.tsx');
scan('app/(admin)/admin/recipes/page.tsx');

console.log('Total dishes found:', dishSet.size);
console.log(JSON.stringify(Array.from(dishSet).sort(), null, 2));
