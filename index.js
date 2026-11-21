/**
 * @surya1503/repo-audit — Programmatic API Demo
 *
 * This script demonstrates how to use the repo-audit package
 * programmatically to audit a JavaScript/TypeScript project
 * for unused dependencies, oversized packages, and duplicate versions.
 */

import {
  runAudit,
  resolveOptions,
  formatTerminalReport,
  formatBytes,
} from "@surya1503/repo-audit";

async function main() {
  console.log("=".repeat(60));
  console.log("  @surya1503/repo-audit — Programmatic API Demo");
  console.log("=".repeat(60));
  console.log();

  // ── Step 1: Resolve Options ──────────────────────────────────
  // resolveOptions() merges CLI flags, config files (.repoauditrc.json),
  // and defaults into a single ResolvedOptions object.
  const options = await resolveOptions({
    cwd: process.cwd(),
    top: "5",         // Show top 5 largest packages
  });

  console.log("✅ Resolved audit options:");
  console.log(`   Working directory : ${options.cwd}`);
  console.log(`   Checks to run    : ${options.checks.join(", ")}`);
  console.log(`   Top N packages   : ${options.top}`);
  console.log(`   Threshold        : ${options.thresholdBytes === 0 ? "none" : formatBytes(options.thresholdBytes)}`);
  console.log(`   Fail on          : ${options.failOn}`);
  console.log();

  // ── Step 2: Run the Full Audit ───────────────────────────────
  console.log("🔍 Running full audit...\n");
  const report = await runAudit(options);

  // ── Step 3: Display the Terminal Report ──────────────────────
  const terminalOutput = formatTerminalReport(report, options);
  console.log(terminalOutput);

  // ── Step 4: Inspect the Report Programmatically ──────────────
  console.log("\n" + "─".repeat(60));
  console.log("📊 Programmatic Report Summary");
  console.log("─".repeat(60));
  console.log(`   Timestamp         : ${report.timestamp}`);
  console.log(`   Duration          : ${report.durationMs}ms`);
  console.log(`   Total Issues      : ${report.summary.totalIssues}`);
  console.log(`   Unused Deps       : ${report.summary.unusedCount}`);
  console.log(`   Missing Deps      : ${report.summary.missingCount}`);
  console.log(`   Oversized Pkgs    : ${report.summary.oversizedCount}`);
  console.log(`   Duplicate Pkgs    : ${report.summary.duplicateCount}`);

  if (report.checks.unused) {
    console.log("\n📦 Unused Dependencies:");
    if (report.checks.unused.unusedDependencies.length > 0) {
      report.checks.unused.unusedDependencies.forEach((dep) => {
        console.log(`   ⚠️  ${dep}`);
      });
    } else {
      console.log("   ✅ No unused production dependencies found.");
    }

    if (report.checks.unused.missingDependencies.length > 0) {
      console.log("\n❌ Missing Dependencies:");
      report.checks.unused.missingDependencies.forEach((dep) => {
        console.log(`   ❌ ${dep}`);
      });
    }

    console.log(`   📄 Scanned ${report.checks.unused.totalScannedFiles} source files.`);
  }

  if (report.checks.size) {
    console.log("\n📏 Top Packages by Size:");
    report.checks.size.packages.slice(0, 5).forEach((pkg, i) => {
      const devTag = pkg.isDev ? " (dev)" : "";
      const suggestion = pkg.suggestion
        ? ` → Consider: ${pkg.suggestion.alternatives.join(", ")}`
        : "";
      console.log(`   ${i + 1}. ${pkg.name}${devTag}: ${pkg.formattedSize}${suggestion}`);
    });
  }

  if (report.checks.duplicates && report.checks.duplicates.duplicates.length > 0) {
    console.log("\n🧬 Duplicate Packages:");
    report.checks.duplicates.duplicates.forEach((dup) => {
      const versions = dup.versions.map((v) => v.version).join(", ");
      console.log(`   ⚠️  ${dup.name} — versions: ${versions} (wasted: ${dup.formattedWastedSize})`);
    });
    console.log(`   Total wasted: ${report.checks.duplicates.formattedTotalWastedSize}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("  Demo complete!");
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("Error running audit demo:", err);
  process.exit(1);
});
