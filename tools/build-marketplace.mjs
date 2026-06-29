#!/usr/bin/env node
// Build/refresh the Claude plugin marketplace catalog for design-dash.
//
// Usage:
//   node tools/build-marketplace.mjs
//
// If skills-lock.json is present, derives the leaf skill directories from it.
// Otherwise, enumerates all directories containing a SKILL.md under skills/.
// Writes the `skills` array into .claude-plugin/marketplace.json — preserving
// every other field in that file.
//
// Re-run whenever skills are added or moved so the catalog never drifts.

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lockPath = join(repoRoot, "skills-lock.json");
const outDir = join(repoRoot, ".claude-plugin");
const outPath = join(outDir, "marketplace.json");

const skillDirs = new Set();
const skipped = [];

if (existsSync(lockPath)) {
  // skills-lock.json present: use it as the manifest of record
  const lock = JSON.parse(readFileSync(lockPath, "utf8"));

  for (const entry of lock.skills ?? []) {
    const p = entry.path;
    if (!p || typeof p !== "string") continue;
    if (!p.startsWith("skills/")) continue;

    const abs = join(repoRoot, p);
    let dirRel = p;
    if (existsSync(abs) && statSync(abs).isFile()) {
      dirRel = dirname(p);
    } else if (/\.[a-z0-9]+$/i.test(p) && !existsSync(abs)) {
      dirRel = dirname(p);
    }

    const skillMd = join(repoRoot, dirRel, "SKILL.md");
    if (existsSync(skillMd)) {
      skillDirs.add(`./${dirRel}`);
    } else {
      skipped.push({ name: entry.name, path: p, reason: `no SKILL.md at ${dirRel}/SKILL.md` });
    }
  }
} else {
  // No lock file: walk skills/ and collect every directory with a SKILL.md
  function walkSkills(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      if (entry.isDirectory()) {
        walkSkills(join(dir, entry.name));
      } else if (entry.name === "SKILL.md") {
        const rel = dir.replace(repoRoot + "/", "");
        skillDirs.add(`./${rel}`);
      }
    }
  }

  const skillsDir = join(repoRoot, "skills");
  if (existsSync(skillsDir)) {
    walkSkills(skillsDir);
  } else {
    console.warn("skills/ directory not found at repo root. No skills enumerated.");
  }
}

const skills = [...skillDirs].sort((a, b) => a.localeCompare(b));

// Preserve existing fields; only (re)write the plugin `skills` array.
let doc;
if (existsSync(outPath)) {
  doc = JSON.parse(readFileSync(outPath, "utf8"));
} else {
  doc = {
    $schema: "https://anthropic.com/claude-code/marketplace.schema.json",
    name: "design-dash",
    owner: { name: "Design Dash OSS" },
    description:
      "Business-agnostic OOUX/ORCA Design Dash workflow skills — takes a designer from a fuzzy problem to a complete product plan.",
    plugins: [
      {
        name: "design-dash",
        source: { source: "github", repo: "<org>/design-dash" },
        description:
          "The full design-dash library: Design Dash orchestrator + all stage and cross-cutting skills.",
        strict: false,
        skills: [],
      },
    ],
  };
}

if (!Array.isArray(doc.plugins) || doc.plugins.length === 0) {
  throw new Error("marketplace.json is missing a plugins[] entry to update.");
}
doc.plugins[0].skills = skills;

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JSON.stringify(doc, null, 2) + "\n", "utf8");

console.log(`Enumerated ${skills.length} skill director${skills.length === 1 ? "y" : "ies"}.`);
if (skipped.length) {
  console.log(`Skipped ${skipped.length} manifest entr${skipped.length === 1 ? "y" : "ies"} (no SKILL.md):`);
  for (const s of skipped) console.log(`  - ${s.name} (${s.path}) — ${s.reason}`);
}
console.log(`Wrote ${outPath}`);
