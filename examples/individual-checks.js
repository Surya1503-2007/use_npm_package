/**
 * Individual Checks Example
 *
 * Shows how to use each audit function independently:
 *   - checkUnusedDependencies()
 *   - checkPackageSizes()
 *   - checkDuplicates()
 */

import {
  checkUnusedDependencies,
  checkPackageSizes,
  checkDuplicates,
  formatBytes,
} from "@surya1503/repo-audit";

const cwd = process.cwd();

async function demoUnused() {
  console.log("\n🔍 CHECK 1: Unused & Missing Dependencies");
  console.log("─".repeat(50));

  const result = await checkUnusedDependencies(cwd);

  console.log(`   Scanned ${result.totalScannedFiles} files`);

  if (result.unusedDependencies.length > 0) {
    console.log(`   Unused production deps: ${result.unusedDependencies.join(", ")}`);
  } else {
    console.log("   ✅ All production dependencies are in use.");
  }

  if (result.unusedDevDependencies.length > 0) {
    console.log(`   Unused dev deps: ${result.unusedDevDependencies.join(", ")}`);
  }

  if (result.missingDependencies.length > 0) {
    console.log(`   ❌ Missing deps: ${result.missingDependencies.join(", ")}`);
  }

  return result;
}

async function demoSizes() {
  console.log("\n📏 CHECK 2: Package Sizes");
  console.log("─".repeat(50));

  const result = await checkPackageSizes(cwd, 5); // top 5

  result.packages.forEach((pkg, i) => {
    const badge = pkg.isDev ? " [dev]" : "";
    console.log(`   ${i + 1}. ${pkg.name}${badge} — ${pkg.formattedSize}`);
    if (pkg.suggestion) {
      console.log(`      💡 ${pkg.suggestion.reason}`);
      console.log(`         Alternatives: ${pkg.suggestion.alternatives.join(", ")}`);
    }
  });

  console.log(`\n   Total direct dependencies scanned: ${result.totalDirectDependencies}`);
  return result;
}

async function demoDuplicates() {
  console.log("\n🧬 CHECK 3: Duplicate Versions");
  console.log("─".repeat(50));

  const result = await checkDuplicates(cwd);

  if (result.duplicates.length === 0) {
    console.log("   ✅ No duplicate package versions found.");
  } else {
    result.duplicates.forEach((dup) => {
      console.log(`   ⚠️  ${dup.name}:`);
      dup.versions.forEach((v) => {
        console.log(`      v${v.version} — required by: ${v.dependents.join(", ")}`);
      });
      console.log(`      Wasted: ${dup.formattedWastedSize}`);
    });
    console.log(`\n   Total wasted space: ${result.formattedTotalWastedSize}`);
  }

  return result;
}

// Run all three checks individually
async function main() {
  console.log("=".repeat(50));
  console.log("  Individual Checks Demo");
  console.log("=".repeat(50));

  await demoUnused();
  await demoSizes();
  await demoDuplicates();

  console.log("\n" + "=".repeat(50));
  console.log("  All individual checks complete!");
  console.log("=".repeat(50));
}

main().catch(console.error);
