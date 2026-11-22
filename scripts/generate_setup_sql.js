const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql'),
  path.join(__dirname, '..', 'supabase', 'migrations', '002_rls_policies.sql'),
  path.join(__dirname, '..', 'supabase', 'migrations', '003_triggers_and_functions.sql'),
  path.join(__dirname, '..', 'supabase', 'migrations', '004_email_verifications.sql'),
  path.join(__dirname, '..', 'supabase', 'seed.sql')
];

let allSql = `-- ========================================================
-- MealSync - Comprehensive Supabase Database Setup
-- Generated for single-step execution in Supabase SQL Editor
-- Tables, Constraints, RLS Security, Triggers & Seed Data
-- ========================================================

`;

for (const file of files) {
  const filename = path.basename(file);
  const content = fs.readFileSync(file, 'utf8');
  allSql += `-- >>>>>>>>>>>>>>> START OF ${filename} <<<<<<<<<<<<<<<\n\n`;
  allSql += content;
  allSql += `\n\n-- >>>>>>>>>>>>>>> END OF ${filename} <<<<<<<<<<<<<<<\n\n`;
}

const target = path.join(__dirname, '..', 'supabase', 'all_in_one_setup.sql');
fs.writeFileSync(target, allSql, 'utf8');
console.log('Successfully written', target, 'Total size in bytes:', fs.statSync(target).size);
