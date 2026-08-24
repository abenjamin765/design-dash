#!/usr/bin/env node
/**
 * Design Plan generator — roadmap item 4 (ARCHITECTURE.md), ADR-0005.
 *
 * Generates the Design Plan (= HEAD): a self-contained, regenerable HTML view
 * of a dash's Dash Model. Never hand-edit its output; regenerate instead.
 *
 * Usage:
 *   node apps/design-plan/generate.mjs <slug>
 *
 * Slug resolution: real dashes/{slug} wins; the literal slug `sample-dash`
 * falls back to apps/workshop/sample-dash (demo fixture).
 *
 * Zero dependencies: Node builtins + the shared dash-contract.mjs tables.
 */
'use strict';

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve, dirname, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

import {
  PHASES,
  GATE_PHASES,
  GATE_LABELS,
  TIER_GATES,
  artifactsForPhase,
} from '../dash-living-plan/contract/dash-contract.mjs';

const APP_DIR = dirname(fileURLToPath(import.meta.url)); // apps/design-plan
const REPO_ROOT = resolve(APP_DIR, '..', '..');
const WORKSHOP_APP_DIR = resolve(APP_DIR, '..', 'workshop');

// Node types per schema group (method/dash-model-schema.md)
const GROUPS = [
  { id: 'why', title: 'Why', blurb: 'Justification chain — evidence, beliefs, interpretation, framed opportunity.', types: ['evidence', 'assumption', 'insight', 'opportunity'] },
  { id: 'what', title: 'What', blurb: 'The product definition — work, limits, domain nouns.', types: ['requirement', 'constraint', 'object'] },
  { id: 'how', title: 'How', blurb: 'Experience and consequence — scenarios through screens to outcomes.', types: ['scenario', 'flow', 'screen', 'decision', 'outcome', 'annotation'] },
];

const TYPE_ORDER = ['evidence', 'assumption', 'insight', 'opportunity', 'requirement', 'constraint', 'object', 'scenario', 'flow', 'screen', 'decision', 'outcome', 'annotation'];

// --------------------------------------------------------------- utilities

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function unquote(v) {
  const t = String(v).trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/** Inline arrays: [a, b] -> ['a','b']; otherwise a trimmed scalar. */
function parseScalar(v) {
  const t = String(v).trim();
  if (t.startsWith('[') && t.endsWith(']')) {
    const inner = t.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((part) => unquote(part));
  }
  return unquote(t);
}

/**
 * Tolerant hand-rolled frontmatter parser (same style as apps/workshop/server.js):
 * top-level scalars, quoted strings, inline arrays, block lists of scalars or
 * of `{to, type}` maps (links), and one nested map level (provenance).
 */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: {}, body: raw };
  const body = raw.slice(m[0].length);

  const fm = {};
  let currentKey = null; // top-level key awaiting nested content
  let currentItem = null; // active list-item map under currentKey

  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const indent = line.match(/^\s*/)[0].length;
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      const itemText = trimmed.slice(2);
      if (!currentKey) continue;
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      const kv = itemText.match(/^([\w][\w-]*):\s*(.*)$/);
      if (kv) {
        currentItem = { [kv[1]]: parseScalar(kv[2]) };
        fm[currentKey].push(currentItem);
      } else {
        fm[currentKey].push(parseScalar(itemText));
        currentItem = null;
      }
      continue;
    }

    const kv = trimmed.match(/^([\w][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, val] = kv;

    if (indent === 0) {
      currentItem = null;
      if (val === '') {
        currentKey = key;
        if (!(key in fm)) fm[key] = {}; // refined by following lines
      } else {
        currentKey = null;
        fm[key] = parseScalar(val);
      }
    } else if (currentItem && currentKey) {
      currentItem[key] = parseScalar(val); // continuation of a links item
    } else if (currentKey) {
      if (Array.isArray(fm[currentKey])) fm[currentKey] = {};
      if (typeof fm[currentKey] !== 'object' || fm[currentKey] === null) fm[currentKey] = {};
      fm[currentKey][key] = parseScalar(val); // provenance subkeys
    }
  }
  return { fm, body };
}

// ------------------------------------------------------------ dash scanning

/** Real dashes/{slug} wins; literal `sample-dash` falls back to the demo fixture. */
export function resolveDashDir(slug) {
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(slug) || slug.includes('..')) return null;
  const realDash = join(REPO_ROOT, 'dashes', slug);
  if (existsSync(realDash) && statSync(realDash).isDirectory()) return realDash;
  if (slug === 'sample-dash') {
    const fixture = join(WORKSHOP_APP_DIR, 'sample-dash');
    if (existsSync(fixture)) return fixture;
  }
  return null;
}

function listModelFiles(dashDir) {
  const modelDir = join(dashDir, 'model');
  if (!existsSync(modelDir)) return [];
  return readdirSync(modelDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => join(modelDir, f));
}

/** Scan + parse every model node file. Malformed files are warned and skipped. */
export function scanModel(dashDir) {
  const nodes = [];
  const fileHashes = []; // { rel, hash }
  for (const full of listModelFiles(dashDir)) {
    const rel = relative(dashDir, full).split('\\').join('/');
    const text = readFileSync(full, 'utf8');
    fileHashes.push({ rel, hash: sha256(text) });
    const { fm, body } = parseFrontmatter(text);
    if (!fm.id || !fm.type) {
      console.error(`warn: skipping ${rel} — frontmatter missing id or type`);
      continue;
    }
    nodes.push({
      file: rel,
      id: String(fm.id),
      type: String(fm.type),
      name: fm.name ? String(fm.name) : String(fm.id),
      status: fm.status ? String(fm.status) : '',
      links: Array.isArray(fm.links)
        ? fm.links.filter((l) => l && typeof l === 'object')
        : [],
      provenance:
        fm.provenance && typeof fm.provenance === 'object' && !Array.isArray(fm.provenance)
          ? fm.provenance
          : {},
      body,
    });
  }
  // Generation stamp — exactly object-graph-export Mode B:
  // sha256 over the newline-joined, lexicographically sorted
  // '{relative-path}:{file-sha256}' entries for every scanned model file.
  const stamp = sha256(
    fileHashes
      .map(({ rel, hash }) => `${rel}:${hash}`)
      .sort()
      .join('\n')
  );
  return { nodes, stamp, scannedFiles: fileHashes.length };
}

/** Tier from dash-config.yaml (minimal tolerant read); null when absent. */
function readTier(dashDir) {
  const cfg = join(dashDir, 'dash-config.yaml');
  if (!existsSync(cfg)) return null;
  const m = readFileSync(cfg, 'utf8').match(/^tier:\s*"?([\w-]+)"?\s*$/m);
  return m ? m[1] : null;
}

// ------------------------------------------------------- markdown rendering

function inlineMd(s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}

/** Minimal md to html: headings, lists, quotes, hr, paragraphs; fences preserved. */
export function mdToHtml(body) {
  const prepared = String(body).replace(/```[\w-]*\r?\n([\s\S]*?)```/g, (_, code) =>
    '\u0000' + Buffer.from(code.replace(/\n$/, ''), 'utf8').toString('base64') + '\u0000'
  );
  const lines = prepared.split(/\r?\n/);
  const out = [];
  let para = [];
  let list = null;

  const flushPara = () => {
    if (para.length) { out.push('<p>' + inlineMd(esc(para.join(' '))) + '</p>'); para = []; }
  };
  const flushList = () => { if (list) { out.push('</' + list + '>'); list = null; } };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('\u0000')) {
      flushPara(); flushList();
      const code = Buffer.from(trimmed.replace(/\u0000/g, ''), 'base64').toString('utf8');
      out.push('<pre><code>' + esc(code) + '</code></pre>');
      continue;
    }
    if (!trimmed) { flushPara(); flushList(); continue; }
    const h = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      const level = Math.min(h[1].length + 2, 6); // node h1 renders as h3
      out.push(`<h${level}>` + inlineMd(esc(h[2])) + `</h${level}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) { flushPara(); flushList(); out.push('<hr>'); continue; }
    const quote = trimmed.match(/^>\s?(.*)$/);
    if (quote) { flushPara(); flushList(); out.push('<blockquote>' + inlineMd(esc(quote[1])) + '</blockquote>'); continue; }
    const ul = trimmed.match(/^[-*]\s+(.*)$/);
    const ol = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const want = ul ? 'ul' : 'ol';
      if (list !== want) { flushList(); out.push('<' + want + '>'); list = want; }
      out.push('<li>' + inlineMd(esc((ul || ol)[1])) + '</li>');
      continue;
    }
    para.push(trimmed);
  }
  flushPara(); flushList();
  return out.join('\n');
}

// --------------------------------------------------------- anchor coverage

const ANCHOR_DEFS = [
  { edge: 'JUSTIFIED_BY', label: 'screen → decision', sources: ['screen'], expectedTargets: ['decision'] },
  { edge: 'IMPLEMENTS', label: 'decision → requirement/object', sources: ['decision'], expectedTargets: ['requirement', 'object'] },
  { edge: 'ADDRESSES', label: 'requirement → opportunity', sources: ['requirement'], expectedTargets: ['opportunity'] },
];

export function anchorCoverage(nodes) {
  const typeById = new Map(nodes.map((n) => [n.id, n.type]));
  return ANCHOR_DEFS.map((def) => {
    const sources = nodes.filter((n) => def.sources.includes(n.type));
    let present = 0;
    for (const n of sources) {
      if (n.links.some((l) => l.type === def.edge)) present += 1;
    }
    return {
      edge: def.edge,
      label: def.label,
      expected: sources.length,
      present,
      ok: present === sources.length && sources.length > 0 ? true : sources.length === 0 ? null : false,
    };
  });
}

// ------------------------------------------------------------- html builders

function renderPhaseStrip(dashDir, tier) {
  const gates = TIER_GATES[tier] || ['P6'];
  const rows = PHASES.map((phase) => {
    const arts = artifactsForPhase(phase, tier);
    const cells = arts.map((a) => {
      const present = existsSync(join(dashDir, a.file));
      const cls = present ? 'art ok' : a.required ? 'art missing-required' : 'art missing';
      return `<span class="${cls}" title="${esc(a.file)}${present ? '' : a.required ? ' — required, missing' : ' — optional'}"></span>${esc(a.file)}`;
    });
    const isGate = GATE_PHASES.includes(phase.id);
    const gateRequired = gates.includes(phase.id);
    return `
      <div class="phase${isGate ? ' is-gate' : ''}${gateRequired ? ' gate-required' : ''}">
        <div class="phase-head">
          <span class="phase-id">${esc(phase.id)}</span>
          <span class="phase-name">${esc(phase.name)}</span>
          ${isGate ? `<span class="gate-chip${gateRequired ? ' req' : ''}" title="${gateRequired ? 'required at tier ' + esc(tier || 'unknown') : 'optional at this tier'}">${esc(GATE_LABELS[phase.id])}</span>` : ''}
        </div>
        <div class="phase-arts">${cells.join('')}</div>
      </div>`;
  });
  return `<div class="phase-strip" id="phases">${rows.join('')}</div>`;
}

function provenanceLine(node) {
  const p = node.provenance || {};
  const bits = [];
  if (p.confidence) bits.push(`<span class="conf conf-${esc(p.confidence)}">${esc(p.confidence)}</span>`);
  if (p.source_dash) bits.push(`<span>dash: ${esc(p.source_dash)}</span>`);
  if (p.activity) bits.push(`<span>via: ${esc(p.activity)}</span>`);
  if (p.actor) bits.push(`<span>actor: ${esc(p.actor)}</span>`);
  if (p.extracted_at) bits.push(`<span>${esc(String(p.extracted_at).slice(0, 10))}</span>`);
  return bits.length ? `<div class="prov">${bits.join('<i class="sep">·</i>')}</div>` : '';
}

function linksRow(node, allIds) {
  if (!node.links.length) return '';
  const chips = node.links.map((l) => {
    const dangling = l.to && !allIds.has(l.to);
    return `<span class="link-chip${dangling ? ' dangling' : ''}" title="${dangling ? 'target not found in this model' : esc(l.type)}">` +
      `${esc(l.type || '→')} <b>${esc(l.to || '?')}</b></span>`;
  });
  return `<div class="node-links">${chips.join('')}</div>`;
}

function renderCard(node, allIds) {
  return `
    <article class="card type-${esc(node.type)}" id="node-${esc(node.id)}">
      <header class="card-head">
        <span class="type-badge">${esc(node.type)}</span>
        <h4 class="card-name">${esc(node.name)}</h4>
        ${node.status ? `<span class="status-chip">${esc(node.status)}</span>` : ''}
      </header>
      ${provenanceLine(node)}
      ${linksRow(node, allIds)}
      <div class="card-body md">${mdToHtml(node.body)}</div>
      <footer class="card-foot">
        <code class="card-file">${esc(node.file)}</code>
        <div class="annotate" data-node="${esc(node.id)}">
          <button type="button" class="annotate-btn">Annotate</button>
          <div class="annotate-panel" hidden>
            <textarea class="annotate-text" placeholder="Comment, question, critique — recorded as an annotation node on this card..." aria-label="Annotation for ${esc(node.id)}"></textarea>
            <div class="annotate-row">
              <input class="annotate-actor" placeholder="your name" aria-label="Your name">
              <button type="button" class="annotate-send">Record via workshop</button>
              <button type="button" class="annotate-snippet">Markdown fallback</button>
            </div>
            <p class="annotate-result" hidden></p>
            <pre class="annotate-snippet-out" hidden></pre>
          </div>
        </div>
      </footer>
    </article>`;
}

function renderSections(nodes) {
  const allIds = new Set(nodes.map((n) => n.id));
  const sections = GROUPS.map((group) => {
    const groupNodes = nodes
      .filter((n) => group.types.includes(n.type))
      .sort((a, b) =>
        TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) ||
        a.name.localeCompare(b.name));
    const counts = groupNodes.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc; }, {});
    const countBits = group.types.filter((t) => counts[t]).map((t) => `${counts[t]} ${t}`).join(', ');
    return `
      <section class="group group-${group.id}" id="group-${group.id}">
        <div class="group-head">
          <h2>${group.title}</h2>
          <p class="group-blurb">${esc(group.blurb)}</p>
          ${countBits ? `<p class="group-counts">${esc(countBits)}</p>` : ''}
        </div>
        <div class="cards">${groupNodes.map((n) => renderCard(n, allIds)).join('')}</div>
      </section>`;
  });
  return sections.join('');
}

function renderAnchors(coverage) {
  const rows = coverage.map((c) => {
    const state = c.ok === null ? 'n/a' : c.ok ? 'ok' : 'gap';
    return `<tr class="anchor-${state}"><td><code>${esc(c.edge)}</code></td><td>${esc(c.label)}</td><td class="num">${c.present}/${c.expected}</td><td>${state === 'null' ? '—' : state === 'ok' ? 'covered' : 'gap'}</td></tr>`;
  });
  const covered = coverage.filter((c) => c.ok === true).length;
  const gaps = coverage.filter((c) => c.ok === false).length;
  return `
    <section class="anchors" id="anchors">
      <h2>Mandatory anchors</h2>
      <p class="anchors-sum">${covered} of 3 anchor kinds covered${gaps ? ` · ${gaps} gap${gaps > 1 ? 's' : ''}` : ''}</p>
      <table><thead><tr><th>Edge</th><th>Path</th><th>Present</th><th></th></tr></thead><tbody>${rows.join('')}</tbody></table>
    </section>`;
}

// ------------------------------------------------------------------ styles

const CSS = `
:root{--paper:#f6f3ee;--panel:#fffdf9;--ink:#211d18;--soft:#5f574d;--mute:#978c7d;--line:#e6dfd3;--line2:#d3c9b8;
--accent:#bc4514;--deep:#93330e;--wash:#f8ebe1;--good:#3f6f4f;--good-wash:#ebf1e8;--warn:#a3641c;--warn-wash:#faf0dd;
--serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
--sans:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
*{box-sizing:border-box}html,body{margin:0}
body{font-family:var(--sans);background:var(--paper);color:var(--ink);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
code{font-family:var(--mono)}
header.plan-head{border-bottom:1px solid var(--line);padding:26px 40px 20px;background:var(--panel)}
.head-row{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;max-width:1080px;margin:0 auto}
h1{font-family:var(--serif);font-weight:500;font-size:30px;margin:0}
.slug{font-family:var(--mono);font-size:15px;color:var(--accent-deep,#93330e);color:var(--deep);background:var(--wash);padding:2px 10px;border-radius:99px}
.tier-chip{font-size:11px;text-transform:uppercase;letter-spacing:.09em;border:1px solid var(--line2);border-radius:99px;padding:2px 10px;color:var(--soft)}
.meta-line{max-width:1080px;margin:8px auto 0;font-size:12.5px;color:var(--mute);display:flex;gap:16px;flex-wrap:wrap}
.meta-line b{color:var(--soft);font-weight:600}
.stamp{cursor:help}
main{max-width:1080px;margin:0 auto;padding:0 40px 90px}
.phase-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:28px 0 10px}
.phase{border:1px solid var(--line);border-radius:10px;background:var(--panel);padding:10px 12px}
.phase.is-gate{border-style:dashed}
.phase.gate-required{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.phase-head{display:flex;align-items:center;gap:7px;margin-bottom:8px}
.phase-id{font-family:var(--mono);font-size:11px;color:var(--deep);background:var(--wash);border-radius:6px;padding:1px 6px}
.phase-name{font-size:12.5px;font-weight:600}
.gate-chip{margin-left:auto;font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--mute);border:1px solid var(--line2);border-radius:99px;padding:1px 7px}
.gate-chip.req{color:#fff;background:var(--accent);border-color:var(--deep)}
.phase-arts{display:flex;flex-direction:column;gap:3px;font-family:var(--mono);font-size:11px;color:var(--soft)}
.art::before{content:"○";margin-right:6px;color:var(--line2)}
.art.ok::before{content:"●";color:var(--good)}
.art.missing-required{color:var(--warn)}
.art.missing-required::before{content:"▲";color:var(--warn)}
.group{margin-top:52px}
.group-head h2{font-family:var(--serif);font-weight:500;font-size:24px;margin:0;display:flex;align-items:center;gap:12px}
.group-head h2::after{content:"";height:1px;background:var(--line);flex:1}
.group-blurb{margin:6px 0 0;color:var(--mute);font-size:13px}
.group-counts{margin:4px 0 0;font-family:var(--mono);font-size:11.5px;color:var(--soft)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-top:18px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:18px 20px 14px;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(33,29,24,.04),0 6px 18px rgba(33,29,24,.05)}
.group-why .type-badge{background:#ece4f4;color:#5b3d82}
.group-what .type-badge{background:#e3edea;color:#2f6049}
.group-how .type-badge{background:var(--wash);color:var(--deep)}
.type-badge{align-self:flex-start;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;border-radius:99px;padding:3px 10px}
.card-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px}
.card-name{font-family:var(--serif);font-weight:500;font-size:19px;line-height:1.25;margin:0;flex:1;min-width:0}
.status-chip{font-size:10.5px;font-family:var(--mono);color:var(--soft);border:1px solid var(--line2);border-radius:99px;padding:1px 8px;white-space:nowrap}
.prov{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:11.5px;color:var(--mute);margin-bottom:4px}
.prov .sep{color:var(--line2);font-style:normal}
.conf{font-family:var(--mono);font-size:10px;border-radius:99px;padding:1px 7px;background:var(--paper);border:1px solid var(--line)}
.conf-observed,.conf-confirmed{color:var(--good);border-color:var(--good)}
.conf-reported{color:var(--deep);border-color:var(--accent)}
.conf-inferred,.conf-assumed{color:var(--warn);border-color:var(--warn)}
.node-links{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 2px}
.link-chip{font-family:var(--mono);font-size:10.5px;background:var(--paper);border:1px solid var(--line);border-radius:6px;padding:1px 7px;color:var(--soft)}
.link-chip.dangling{border-style:dashed;color:var(--warn)}
.card-body{font-size:14px;color:var(--ink);min-width:0;overflow-wrap:break-word}
.card-body.md h3,.card-body.md h4,.card-body.md h5{font-family:var(--serif);font-weight:500;margin:14px 0 6px}
.card-body.md pre{background:#fbf8f2;border:1px solid var(--line);border-radius:9px;padding:12px 14px;overflow-x:auto;font-size:11px;line-height:1.45}
.card-body.md code{font-family:var(--mono);font-size:.88em;background:var(--wash);color:var(--deep);border-radius:4px;padding:1px 5px}
.card-body.md pre code{background:none;color:inherit;padding:0}
.card-body.md ul,.card-body.md ol{margin:8px 0;padding-left:20px}
.card-body.md blockquote{margin:8px 0;padding-left:12px;border-left:3px solid var(--wash);color:var(--soft);font-style:italic}
.card-foot{margin-top:auto;padding-top:12px;display:flex;justify-content:space-between;align-items:center;gap:10px}
.card-file{font-size:10.5px;color:var(--mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.annotate-btn{font:inherit;font-size:12px;color:var(--deep);background:none;border:1px solid var(--line2);border-radius:8px;padding:4px 12px;cursor:pointer}
.annotate-btn:hover{border-color:var(--accent);background:var(--wash)}
.annotate-panel{margin-top:10px;display:grid;gap:8px}
.annotate-panel textarea{width:100%;min-height:70px;resize:vertical;font:inherit;font-size:13.5px;border:1px dashed var(--line2);border-radius:9px;background:var(--paper);padding:9px 11px}
.annotate-panel textarea:focus{outline:none;border-color:var(--accent);border-style:solid;background:var(--panel)}
.annotate-row{display:flex;gap:8px;flex-wrap:wrap}
.annotate-actor{font:inherit;font-size:12.5px;border:1px solid var(--line2);border-radius:8px;padding:5px 9px;width:120px;background:var(--panel)}
.annotate-send,.annotate-snippet{font:inherit;font-size:12px;border-radius:8px;padding:5px 12px;cursor:pointer}
.annotate-send{background:var(--accent);color:#fff;border:1px solid var(--deep)}
.annotate-snippet{background:var(--panel);color:var(--soft);border:1px solid var(--line2)}
.annotate-result{margin:0;font-size:12.5px}
.annotate-result.ok{color:var(--good)}
.annotate-result.fallback{color:var(--warn)}
.annotate-snippet-out{font-family:var(--mono);font-size:11px;background:#fbf8f2;border:1px solid var(--line);border-radius:9px;padding:12px;white-space:pre-wrap;word-break:break-word;margin:0}
.anchors{margin-top:56px;border-top:1px solid var(--line);padding-top:22px}
.anchors h2{font-family:var(--serif);font-weight:500;font-size:22px;margin:0 0 4px}
.anchors-sum{color:var(--mute);font-size:13px;margin:0 0 14px}
.anchors table{width:100%;border-collapse:collapse;font-size:13.5px;background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.anchors th{text-align:left;font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--mute);padding:9px 14px;border-bottom:1px solid var(--line)}
.anchors td{padding:8px 14px;border-bottom:1px solid var(--paper)}
.anchor-ok td:nth-child(4){color:var(--good)}
.anchor-gap td:nth-child(4){color:var(--warn)}
tr.anchor-gap{background:var(--warn-wash)}
.empty{max-width:560px;margin:80px auto;text-align:center;border:1px dashed var(--line2);border-radius:16px;padding:48px 36px;background:var(--panel)}
.empty h2{font-family:var(--serif);font-weight:500;font-size:26px;margin:0 0 10px}
.empty p{color:var(--soft);margin:0 0 8px}
.empty code{font-size:12px;background:var(--wash);color:var(--deep);border-radius:4px;padding:1px 5px}
footer.plan-foot{margin-top:64px;border-top:1px solid var(--line);padding-top:16px;font-size:12px;color:var(--mute)}
@media print{.annotate,.annotate-btn{display:none}body{background:#fff}}
`;

// --------------------------------------------------- inline annotate script

const ANNOTATE_JS = `
(function () {
  'use strict';
  var WORKSHOP_ENDPOINT = 'http://localhost:4173/api/response';
  var SLUG = document.body.getAttribute('data-slug') || '';

  function boxOf(el) { return el.closest('.annotate'); }
  function nodeId(box) { return box.getAttribute('data-node'); }
  function nodeName(box) { return box.getAttribute('data-name') || nodeId(box); }
  function commentOf(box) {
    var t = box.querySelector('.annotate-text');
    return t ? t.value.trim() : '';
  }
  function actorOf(box) {
    var a = box.querySelector('.annotate-actor');
    return (a && a.value.trim()) || 'anonymous';
  }
  function say(box, cls, msg) {
    var r = box.querySelector('.annotate-result');
    r.hidden = false;
    r.className = 'annotate-result ' + cls;
    r.textContent = msg;
  }

  function postBody(box) {
    var id = nodeId(box);
    return {
      slug: SLUG,
      activity_id: 'plan-annotation-' + id,
      normalizes_to: 'annotation',
      title: 'Design Plan annotation',
      phase: '',
      nodes: [id],
      target_node_id: id,
      actor: actorOf(box),
      payload: { comment: commentOf(box) }
    };
  }

  function markdownSnippet(box) {
    var id = nodeId(box);
    var name = nodeName(box);
    var lines = [
      '---',
      'id: "annotation-plan-annotation-' + id + '-manual"',
      'type: annotation',
      'name: "Design Plan annotation - ' + name.replace(/"/g, "'") + '"',
      'status: open',
      'links:',
      '  - to: ' + id,
      '    type: ANNOTATES',
      'provenance:',
      '  source_dash: "' + SLUG + '"',
      '  channel: design-plan',
      '  activity: "plan-annotation-' + id + '"',
      '  actor: "' + actorOf(box).replace(/"/g, "'") + '"',
      '  extracted_at: ' + new Date().toISOString(),
      '  confidence: reported',
      '---',
      '',
      '# Design Plan annotation - ' + name,
      '',
      commentOf(box),
      ''
    ];
    return lines.join('\\n');
  }

  function showSnippet(box, note) {
    var pre = box.querySelector('.annotate-snippet-out');
    var text = markdownSnippet(box);
    pre.textContent = text;
    pre.hidden = false;
    say(box, 'fallback', note);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {}, function () {});
    }
  }

  function submit(box) {
    if (!commentOf(box)) { say(box, 'fallback', 'Write the annotation first.'); return; }
    var sendBtn = box.querySelector('.annotate-send');
    sendBtn.disabled = true;
    fetch(WORKSHOP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postBody(box))
    }).then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    }).then(function (r) {
      sendBtn.disabled = false;
      if (r.ok && r.data.ok) {
        say(box, 'ok', 'Recorded via workshop server as annotation node "' + r.data.node.id + '". Regenerate this plan to see it on the page.');
        var t = box.querySelector('.annotate-text'); if (t) t.value = '';
      } else {
        showSnippet(box, 'Workshop server rejected the response (' + ((r.data && r.data.error) || r.ok) + '). Markdown fallback below - paste into dashes/' + SLUG + '/model/.');
      }
    }).catch(function () {
      sendBtn.disabled = false;
      showSnippet(box, 'Workshop server unreachable (not running?) - markdown fallback below. Paste it into dashes/' + SLUG + '/model/ and regenerate.');
    });
  }

  document.addEventListener('click', function (ev) {
    var toggle = ev.target.closest('.annotate-btn');
    if (toggle) {
      var p = boxOf(toggle).querySelector('.annotate-panel');
      p.hidden = !p.hidden;
      return;
    }
    var send = ev.target.closest('.annotate-send');
    if (send) { submit(boxOf(send)); return; }
    var snip = ev.target.closest('.annotate-snippet');
    if (snip) { showSnippet(boxOf(snip), 'Markdown fallback generated - paste into dashes/' + SLUG + '/model/.'); }
  });
})();
`;

// ------------------------------------------------------------ page assembly

function renderEmptyState(slug) {
  return `
  <div class="empty">
    <h2>An empty model, honestly rendered.</h2>
    <p>This dash has no nodes under <code>model/</code> yet — so the Design Plan
       has nothing to show. That is the view telling the truth, not a bug.</p>
    <p>Nodes get created three ways: workshop responses (start the
       <code>apps/workshop/server.js</code> and answer an activity), agent authoring
       per <code>method/dash-model-schema.md</code>, or direct file edits.
       Then regenerate this plan.</p>
  </div>`;
}

/**
 * Build the full self-contained HTML document.
 * Pure function of its inputs — same model state in, same HTML out
 * (modulo exported_at, which is stamped separately).
 */
export function buildHtml({ slug, dashDir, tier, stamp, exportedAt, scannedFiles, nodes }) {
  const short = stamp.slice(0, 7);
  const tierLabel = tier || 'unspecified';
  const coverage = anchorCoverage(nodes);

  const body = nodes.length
    ? renderPhaseStrip(dashDir, tier) + renderSections(nodes) + renderAnchors(coverage)
    : renderEmptyState(slug);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design Plan — ${esc(slug)} · ${esc(stamp)}</title>
<meta name="generation-stamp" content="${esc(stamp)}">
<meta name="generation-mode" content="design-plan">
<meta name="exported-at" content="${esc(exportedAt)}">
<meta name="scanned-files" content="${scannedFiles}">
<style>${CSS}</style>
</head>
<body data-slug="${esc(slug)}">
<header class="plan-head">
  <div class="head-row">
    <h1>Design Plan</h1>
    <span class="slug">${esc(slug)}</span>
    <span class="tier-chip">tier: ${esc(tierLabel)}</span>
  </div>
  <div class="meta-line">
    <span class="stamp" title="${esc(stamp)}">generation <b>${esc(short)}</b></span>
    <span>exported <b>${esc(exportedAt)}</b></span>
    <span>mode <b>design-plan</b></span>
    <span><b>${scannedFiles}</b> model file${scannedFiles === 1 ? '' : 's'} scanned</span>
    <span>regenerate with <code>node apps/design-plan/generate.mjs ${esc(slug)}</code></span>
  </div>
</header>
<main>
${body}
<footer class="plan-foot">
  Generated view of the Dash Model (= HEAD) per ADR-0005 — never hand-edit;
  edit model files and regenerate. Annotations made here write back as
  annotation nodes, not as changes to this page.
</footer>
</main>
<script>${ANNOTATE_JS}</script>
</body>
</html>
`;
}

// -------------------------------------------------------------------- main

function fail(msg) {
  console.error(`error: ${msg}`);
  console.error('usage: node apps/design-plan/generate.mjs <slug>');
  process.exit(1);
}

export async function main(argv) {
  const slug = argv[2];
  if (!slug) fail('missing slug argument');

  const dashDir = resolveDashDir(slug);
  if (!dashDir) {
    fail(`unknown dash "${slug}" (looked in dashes/${slug}/ and the sample-dash fixture)`);
  }

  const { nodes, stamp, scannedFiles } = scanModel(dashDir);
  const tier = readTier(dashDir);
  const exportedAt = new Date().toISOString();

  const html = buildHtml({ slug, dashDir, tier, stamp, exportedAt, scannedFiles, nodes });

  const outDir = join(dashDir, 'plan');
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, 'index.html');
  writeFileSync(outFile, html, 'utf8');

  console.log(`design plan → ${relative(REPO_ROOT, outFile)}`);
  console.log(`nodes: ${nodes.length} · files scanned: ${scannedFiles} · generation ${stamp.slice(0, 7)}`);
  if (!nodes.length) console.log('note: model/ is empty — wrote the empty-state page');
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (invokedDirectly) {
  main(process.argv).catch((err) => {
    console.error(`error: ${err.message}`);
    process.exit(1);
  });
}
