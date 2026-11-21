/**
 * Custom Configuration Example
 *
 * Shows how to use resolveOptions() with custom settings,
 * ignore specific packages, and use utility functions like
 * formatBytes(), parseSize(), and getAlternativeSuggestion().
 */

import {
  resolveOptions,
  runAudit,
  formatBytes,
  parseSize,
  getAlternativeSuggestion,
  ALTERNATIVES_MAP,
} from "@surya1503/repo-audit";

async function main() {
  console.log("=".repeat(50));
  console.log("  Custom Configuration Demo");
  console.log("=".repeat(50));

  // ── Utility Functions Demo ───────────────────────────────
  console.log("\n🔧 Utility Functions:");
  console.log(`   formatBytes(1048576)  → ${formatBytes(1048576)}`);
  console.log(`   formatBytes(5242880)  → ${formatBytes(5242880)}`);
  console.log(`   parseSize('5mb')      → ${parseSize("5mb")} bytes`);
  console.log(`   parseSize('500kb')    → ${parseSize("500kb")} bytes`);

  // ── Alternative Suggestions Demo ─────────────────────────
  console.log("\n💡 Alternative Suggestions Database:");
  const packagesToCheck = ["moment", "lodash", "axios", "express", "chalk"];
  packagesToCheck.forEach((pkg) => {
    const suggestion = getAlternativeSuggestion(pkg);
    if (suggestion) {
      console.log(`   ${pkg}: ${suggestion.reason}`);
      console.log(`      → ${suggestion.alternatives.join(", ")}`);
    } else {
      console.log(`   ${pkg}: No alternative suggested (already a good choice!)`);
    }
  });

  // ── Custom Audit with Ignored Packages ───────────────────
  console.log("\n🔍 Running audit with custom config...");
  console.log("   Ignoring: chalk, express");
  console.log("   Only checking: unused, size");
  console.log("   Threshold: 2MB\n");

  const options = await resolveOptions({
    cwd: process.cwd(),
    only: "unused,size",
    threshold: "2mb",
    top: "5",
    ignore: "chalk,express",
  });

  const report = await runAudit(options);

  console.log(`   Audit completed in ${report.durationMs}ms`);
  console.log(`   Total issues: ${report.summary.totalIssues}`);
  console.log(`   Unused count: ${report.summary.unusedCount}`);
  console.log(`   Oversized count: ${report.summary.oversizedCount}`);

  if (report.checks.size) {
    const oversized = report.checks.size.packages.filter((p) => p.exceedsThreshold);
    if (oversized.length > 0) {
      console.log(`\n   ⚠️  Packages exceeding 2MB threshold:`);
      oversized.forEach((pkg) => {
        console.log(`      ${pkg.name}: ${pkg.formattedSize}`);
      });
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("  Custom config demo complete!");
  console.log("=".repeat(50));
}

main().catch(console.error);
