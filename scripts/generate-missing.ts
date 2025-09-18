import fs from "fs";
import path from "path";
import { generate } from "./generate";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MissingFiles {
  componentPath: string;
  componentName: string;
  missingStory: boolean;
  missingTest: boolean;
  missingDocs: boolean;
}

const findMissingFiles = (componentDir: string): MissingFiles[] => {
  const storybookDir = path.resolve("storybook/src/stories/");
  const docsDir = path.resolve("docs/docs/components/");
  console.log(componentDir);
  
  // Get all component files (exclude index.tsx and tsconfig.json)
  const componentFiles = fs.readdirSync(componentDir)
    .filter(file => 
      file.endsWith('.tsx') && 
      file !== 'index.tsx' && 
      !file.endsWith('.test.tsx') &&
      !file.endsWith('.stories.tsx')
    );

  const missing: MissingFiles[] = [];

  for (const componentFile of componentFiles) {
    const componentName = path.basename(componentFile, '.tsx');
    const componentPath = path.join(componentDir, componentFile);
    
    // Check for missing files
    const storyFile = path.join(storybookDir, `${componentName}.stories.tsx`);
    const testFile = path.join(storybookDir, `${componentName}.test.tsx`);
    const docsFile = path.join(docsDir, `${componentName}.mdx`);
    
    const missingStory = !fs.existsSync(storyFile);
    const missingTest = !fs.existsSync(testFile);
    const missingDocs = !fs.existsSync(docsFile);
    
    // Only include if at least one file is missing
    if (missingStory || missingTest || missingDocs) {
      missing.push({
        componentPath,
        componentName,
        missingStory,
        missingTest,
        missingDocs
      });
    }
  }

  return missing;
};

const generateMissingFiles = async (componentDir: string, options: {
  dryRun?: boolean;
  storiesOnly?: boolean;
  testsOnly?: boolean;
  docsOnly?: boolean;
} = {}) => {
  const { dryRun = false, storiesOnly = false, testsOnly = false, docsOnly = false } = options;
  
  console.log(`🔍 Scanning ${componentDir} for missing files...`);
  
  const missingFiles = findMissingFiles(componentDir);
  
  if (missingFiles.length === 0) {
    console.log("✅ All components have stories, tests, and docs!");
    return;
  }

  console.log(`\n📋 Found ${missingFiles.length} components with missing files:\n`);
  
  // Display what's missing
  for (const item of missingFiles) {
    const missing = [];
    if (item.missingStory && !testsOnly && !docsOnly) missing.push("story");
    if (item.missingTest && !storiesOnly && !docsOnly) missing.push("test");
    if (item.missingDocs && !storiesOnly && !testsOnly) missing.push("docs");
    
    if (missing.length > 0) {
      console.log(`📁 ${item.componentName}: missing ${missing.join(", ")}`);
    }
  }

  if (dryRun) {
    console.log("\n🔍 Dry run complete. Use --generate to create missing files.");
    return;
  }

  console.log("\n🚀 Generating missing files...\n");

  // Generate files for each component
  for (const item of missingFiles) {
    const shouldGenerate = 
      (item.missingStory && !testsOnly && !docsOnly) ||
      (item.missingTest && !storiesOnly && !docsOnly) ||
      (item.missingDocs && !storiesOnly && !testsOnly);

    if (shouldGenerate) {
      console.log(`⚡ Generating files for ${item.componentName}...`);
      try {
        await generate(item.componentPath);
        console.log(`✅ Generated files for ${item.componentName}`);
      } catch (error) {
        console.error(`❌ Failed to generate files for ${item.componentName}:`, error);
      }
    }
  }

  console.log("\n🎉 Generation complete!");
};

// CLI handling
const main = async () => {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: pnpm tsx scripts/generate-missing.ts <component-directory> [options]

Arguments:
  <component-directory>  Path to directory containing components (e.g., "packages/ui/src")

Options:
  --dry-run             Show what would be generated without creating files
  --generate            Actually generate the missing files (default if no --dry-run)
  --stories-only        Only generate missing story files
  --tests-only          Only generate missing test files
  --docs-only           Only generate missing documentation files
  --help                Show this help message

Examples:
  pnpm tsx scripts/generate-missing.ts packages/ui/src --dry-run
  pnpm tsx scripts/generate-missing.ts packages/ui/src --generate
  pnpm tsx scripts/generate-missing.ts packages/ui/src --stories-only
    `);
    process.exit(0);
  }

  const componentDir = args[0];
  
  if (!fs.existsSync(componentDir)) {
    console.error(`❌ Directory not found: ${componentDir}`);
    process.exit(1);
  }

  const options = {
    dryRun: args.includes('--dry-run'),
    storiesOnly: args.includes('--stories-only'),
    testsOnly: args.includes('--tests-only'),
    docsOnly: args.includes('--docs-only'),
  };

  // If no specific option is given, default to generate
  if (!options.dryRun && !args.includes('--generate')) {
    // If no explicit flag, and not dry-run, then generate
    options.dryRun = false;
  }

  await generateMissingFiles(componentDir, options);
};

// Export for use in other scripts
export { findMissingFiles, generateMissingFiles };

main().catch(console.error);
