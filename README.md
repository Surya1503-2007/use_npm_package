# @surya1503/repo-audit — Demo Project

This project demonstrates the usage of the [`@surya1503/repo-audit`](https://www.npmjs.com/package/@surya1503/repo-audit) npm package — a fast, zero-configuration dependency auditor for JavaScript and TypeScript projects.

## What is `@surya1503/repo-audit`?

It detects:

- 🔍 **Unused & Missing Dependencies** — finds packages listed in `package.json` but never imported in code
- ⚖️ **Oversized Packages** — identifies large dependencies and suggests lighter alternatives
- 🧬 **Duplicate Package Versions** — detects multiple versions of the same package in your lockfile

---

## Setup

```bash
# Clone the repo
git clone https://github.com/Surya1503-2007/use_npm_package.git
cd use_npm_package

# Install dependencies
npm install
```

---

## Demo 1: CLI Usage

The simplest way to use `repo-audit` is via the CLI:

```bash
# Run all checks
npm run audit

# Run only unused dependency detection
npm run audit:unused

# Run only package size analysis (top 5)
npm run audit:size

# Run only duplicate version detection
npm run audit:duplicates

# Generate a JSON report
npm run audit:json

# CI mode — exits with code 1 if any issues found
npm run audit:ci

# Enforce a 5MB size budget
npm run audit:threshold
```

You can also run it directly with `npx`:

```bash
npx @surya1503/repo-audit
npx @surya1503/repo-audit --only unused --ignore "chalk"
npx @surya1503/repo-audit --only size --top 5 --threshold 5mb
npx @surya1503/repo-audit --json > report.json
```

---

## Demo 2: Programmatic API Usage

### Full Audit (`index.js`)

```bash
npm run demo
```

This runs `index.js`, which uses the programmatic API to:

1. Resolve audit options with `resolveOptions()`
2. Run a full audit with `runAudit()`
3. Format and display the terminal report with `formatTerminalReport()`
4. Inspect the `AuditReport` object programmatically

### Individual Checks (`examples/individual-checks.js`)

```bash
npm run demo:individual
```

Demonstrates calling each check function independently:

- `checkUnusedDependencies()` — scan for unused/missing deps
- `checkPackageSizes()` — measure on-disk sizes of dependencies
- `checkDuplicates()` — find duplicate package versions in the lockfile

### JSON Report Generation (`examples/json-report.js`)

```bash
npm run demo:json-report
```

Shows how to generate a machine-readable JSON report using `formatJsonReport()` — useful for CI/CD pipelines and dashboards.

### Custom Configuration (`examples/custom-config.js`)

```bash
npm run demo:custom-config
```

Demonstrates:

- **Utility functions**: `formatBytes()`, `parseSize()`
- **Alternative suggestions**: `getAlternativeSuggestion()`, `ALTERNATIVES_MAP`
- **Custom audit options**: ignoring packages, setting size thresholds, selecting specific checks

---

## Project Structure

```
use_npm_package/
├── index.js                        # Main demo — full programmatic audit
├── sample-app.js                   # Sample Express app (intentionally leaves some deps unused)
├── examples/
│   ├── individual-checks.js        # Using each check function independently
│   ├── json-report.js              # Generating JSON reports
│   └── custom-config.js            # Custom options & utility functions
├── package.json                    # Project config with CLI script shortcuts
└── README.md                       # This file
```

---

## Why Some Dependencies Are Unused

This demo project **intentionally** includes dependencies that are not imported in any source file:

| Package   | Status     | Purpose                                                   |
|-----------|------------|-----------------------------------------------------------|
| `express` | ✅ Used    | Imported in `sample-app.js`                                |
| `axios`   | ✅ Used    | Imported in `sample-app.js`                                |
| `lodash`  | ⚠️ Unused  | Listed in `package.json` but never imported — repo-audit flags it |
| `moment`  | ⚠️ Unused  | Listed in `package.json` but never imported — repo-audit flags it |
| `chalk`   | ⚠️ Unused  | Listed in `package.json` but never imported — repo-audit flags it |

This setup lets you see `repo-audit` detecting real unused dependencies in action.

---

## Available `package.json` Scripts

| Script               | Command                                            |
|----------------------|----------------------------------------------------|
| `npm run audit`      | Run all checks (unused, size, duplicates)          |
| `npm run audit:unused` | Check for unused dependencies only               |
| `npm run audit:size` | Show top 5 largest packages                        |
| `npm run audit:duplicates` | Check for duplicate versions                 |
| `npm run audit:json` | Generate `audit-report.json`                       |
| `npm run audit:ci`   | CI mode — exit code 1 on any issue                 |
| `npm run audit:threshold` | Enforce 5MB size budget                       |
| `npm run demo`       | Run the main programmatic API demo                 |
| `npm run demo:individual` | Run individual check functions demo           |
| `npm run demo:json-report` | Run JSON report generation demo             |
| `npm run demo:custom-config` | Run custom configuration demo             |

---

## License

MIT © Surya
