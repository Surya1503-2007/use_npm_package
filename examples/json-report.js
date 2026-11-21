/**
 * JSON Report Example
 *
 * Demonstrates how to generate a machine-readable JSON audit report
 * using the programmatic API — useful for CI/CD pipelines, dashboards,
 * and automated tooling.
 */

import {
  runAudit,
  resolveOptions,
  formatJsonReport,
} from "@surya1503/repo-audit";

import { writeFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  console.log("📄 Generating JSON audit report...\n");

  const options = await resolveOptions({
    cwd: process.cwd(),
    json: true,
  });

  const report = await runAudit(options);

  // formatJsonReport returns a pretty-printed JSON string
  const jsonOutput = formatJsonReport(report);

  // Write to file
  const outputPath = join(process.cwd(), "audit-report.json");
  writeFileSync(outputPath, jsonOutput, "utf-8");

  console.log(`✅ JSON report written to: ${outputPath}`);
  console.log(`   Total issues found: ${report.summary.totalIssues}`);
  console.log(`   Audit duration: ${report.durationMs}ms`);
  console.log(`   Should fail CI: ${report.summary.shouldFail}`);

  // Parse and inspect the JSON programmatically
  const parsed = JSON.parse(jsonOutput);
  console.log(`\n📊 Report preview (first 500 chars):`);
  console.log(jsonOutput.slice(0, 500) + "...");
}

main().catch(console.error);
