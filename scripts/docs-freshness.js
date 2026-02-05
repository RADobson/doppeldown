#!/usr/bin/env node

/**
 * Documentation Freshness Checker
 * 
 * Scans all .md files for frontmatter `review_due` dates and reports:
 * - Documents past their review date
 * - Documents with no frontmatter
 * - Documents exceeding the max file size (25 KB)
 * 
 * Usage: node scripts/docs-freshness.js [--strict]
 * --strict: Exit with code 1 if any issues found (for CI)
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIRS = ['docs', 'internal'];
const MAX_FILE_SIZE_KB = 25;
const ROOT = path.resolve(__dirname, '..');

function findMarkdownFiles(dir) {
  const results = [];
  const fullDir = path.join(ROOT, dir);
  
  if (!fs.existsSync(fullDir)) return results;
  
  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(fullDir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...findMarkdownFiles(path.join(dir, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push({ relativePath: path.join(dir, entry.name), fullPath });
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const fm = {};
  for (const line of match[1].split('\n')) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      fm[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }
  return fm;
}

function main() {
  const strict = process.argv.includes('--strict');
  const now = new Date();
  
  const issues = {
    stale: [],
    noFrontmatter: [],
    oversized: [],
    noReviewDate: [],
  };
  
  let totalFiles = 0;
  let healthyFiles = 0;
  
  for (const dir of DOCS_DIRS) {
    const files = findMarkdownFiles(dir);
    totalFiles += files.length;
    
    for (const { relativePath, fullPath } of files) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const stats = fs.statSync(fullPath);
      const sizeKB = stats.size / 1024;
      
      // Check file size
      if (sizeKB > MAX_FILE_SIZE_KB) {
        issues.oversized.push({
          file: relativePath,
          sizeKB: Math.round(sizeKB),
        });
      }
      
      // Check frontmatter
      const fm = parseFrontmatter(content);
      if (!fm) {
        issues.noFrontmatter.push(relativePath);
        continue;
      }
      
      // Check review date
      if (!fm.review_due) {
        issues.noReviewDate.push(relativePath);
      } else {
        const reviewDate = new Date(fm.review_due);
        if (reviewDate < now) {
          const daysOverdue = Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24));
          issues.stale.push({
            file: relativePath,
            reviewDue: fm.review_due,
            daysOverdue,
            owner: fm.author || 'unassigned',
            status: fm.status || 'unknown',
          });
        } else {
          healthyFiles++;
        }
      }
    }
  }
  
  // Report
  console.log('\n📚 Documentation Freshness Report');
  console.log('='.repeat(50));
  console.log(`Total files scanned: ${totalFiles}`);
  console.log(`Healthy (current, within review date): ${healthyFiles}`);
  console.log('');
  
  if (issues.stale.length > 0) {
    console.log(`\n🔴 STALE (${issues.stale.length} files past review date):`);
    for (const item of issues.stale.sort((a, b) => b.daysOverdue - a.daysOverdue)) {
      console.log(`  ⚠️  ${item.file}`);
      console.log(`      Review was due: ${item.reviewDue} (${item.daysOverdue} days overdue)`);
      console.log(`      Owner: ${item.owner} | Status: ${item.status}`);
    }
  }
  
  if (issues.oversized.length > 0) {
    console.log(`\n🟡 OVERSIZED (${issues.oversized.length} files > ${MAX_FILE_SIZE_KB} KB):`);
    for (const item of issues.oversized.sort((a, b) => b.sizeKB - a.sizeKB)) {
      console.log(`  📄 ${item.file} — ${item.sizeKB} KB (limit: ${MAX_FILE_SIZE_KB} KB)`);
    }
  }
  
  if (issues.noFrontmatter.length > 0) {
    console.log(`\n🟡 MISSING FRONTMATTER (${issues.noFrontmatter.length} files):`);
    for (const file of issues.noFrontmatter) {
      console.log(`  📝 ${file}`);
    }
  }
  
  if (issues.noReviewDate.length > 0) {
    console.log(`\n🟡 NO REVIEW DATE (${issues.noReviewDate.length} files have frontmatter but no review_due):`);
    for (const file of issues.noReviewDate) {
      console.log(`  📅 ${file}`);
    }
  }
  
  const totalIssues = issues.stale.length + issues.oversized.length + 
                      issues.noFrontmatter.length + issues.noReviewDate.length;
  
  if (totalIssues === 0) {
    console.log('\n✅ All documentation is healthy!');
  } else {
    console.log(`\n📊 Summary: ${totalIssues} issues found across ${totalFiles} files.`);
  }
  
  if (strict && totalIssues > 0) {
    process.exit(1);
  }
}

main();
