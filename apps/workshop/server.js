#!/usr/bin/env node
/**
 * Workshop server — a thin surface over declarative activity specs.
 *
 * Zero dependencies (Node built-ins only). Holds no truth (ADR-0001):
 * specs live at dashes/{slug}/workshop/*.json, model nodes at
 * dashes/{slug}/model/{node-id}.md. Responses normalize back into
 * model files; this process can be discarded without loss.
 *
 * Dash resolution order: {repo}/dashes/{slug}, then apps/workshop/{slug}
 * (the latter lets sample-dash demo without touching real dashes/).
 *
 * Run: node apps/workshop/server.js   (PORT env overrides default 4173)
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const APP_DIR = __dirname; // apps/workshop
const REPO_ROOT = path.resolve(APP_DIR, '..', '..');
const REAL_DASHES_DIR = path.join(REPO_ROOT, 'dashes');
const LOCAL_DASHES_DIR = APP_DIR; // apps/workshop/<slug>/
const PORT = Number(process.env.PORT) || 4173;

const ID_RE = /^[a-z0-9][a-z0-9._-]*$/i;
const NORMALIZABLE = new Set(['decision', 'evidence', 'annotation']);
const INITIAL_STATUS = { decision: 'proposed', evidence: 'open', annotation: 'open' };

/** Mode-aware initial status: a forced-choice compare response IS a selection. */
function initialStatusFor(norm, payload) {
  return norm === 'decision' && payload && payload.selected !== undefined ? 'selected' : INITIAL_STATUS[norm];
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
};

// ---------------------------------------------------------------- helpers

function log(method, url, status, ms) {
  const t = new Date().toISOString().slice(11, 19);
  console.log(`${t} ${method} ${url} ${status} ${ms}ms`);
}

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj, null, 2));
}

function notFound(res, msg) {
  sendJson(res, 404, { error: msg || 'not found' });
}

function badRequest(res, msg) {
  sendJson(res, 400, { error: msg });
}

function safeId(s) {
  return typeof s === 'string' && ID_RE.test(s) && !s.includes('..') ? s : null;
}

function listJsonSpecs(dir) {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  } catch {
    return [];
  }
}

/** A slug is servable when <dir>/workshop/ holds at least one .json spec. */
function isServableDash(absDir) {
  return listJsonSpecs(path.join(absDir, 'workshop')).length > 0;
}

function resolveDash(slug) {
  for (const root of [REAL_DASHES_DIR, LOCAL_DASHES_DIR]) {
    const dir = path.join(root, slug);
    if (isServableDash(dir)) return dir;
  }
  return null;
}

function listSlugs() {
  const slugs = new Set();
  for (const root of [REAL_DASHES_DIR, LOCAL_DASHES_DIR]) {
    let entries = [];
    try {
      entries = fs.readdirSync(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.isDirectory() && e.name !== 'sample-dash' && e.name.startsWith('.')) continue;
      if (e.isDirectory() && isServableDash(path.join(root, e.name))) slugs.add(e.name);
    }
  }
  return [...slugs].sort();
}

/** Parse every spec in a dash's workshop/ dir; skip unparseable ones (logged). */
function loadSpecs(dashDir) {
  const specsDir = path.join(dashDir, 'workshop');
  const specs = [];
  for (const file of listJsonSpecs(specsDir)) {
    const full = path.join(specsDir, file);
    try {
      const raw = fs.readFileSync(full, 'utf8');
      const spec = JSON.parse(raw);
      if (!spec.id || !spec.type) throw new Error('missing id or type');
      specs.push(spec);
    } catch (err) {
      console.error(`warn: skipping unparseable spec ${file}: ${err.message}`);
    }
  }
  // Stable order: phase asc, then id.
  specs.sort((a, b) => String(a.phase || '').localeCompare(String(b.phase || '')) || String(a.id).localeCompare(String(b.id)));
  return specs;
}

// ------------------------------------------------------- response write-back

/**
 * Normalize a workshop response into a Dash Model node file
 * (method/dash-model-schema.md): markdown body + YAML frontmatter.
 * The structured answer is preserved verbatim as a fenced JSON block so
 * responses stay machine-comparable across sessions and dashes.
 */
function buildResponseMarkdown(body) {
  const { normalizes_to: norm, actor } = body;
  const title = String(body.title || body.activity_id);
  const submitted = new Date().toISOString();
  const nodes = Array.isArray(body.nodes) ? body.nodes.filter(Boolean) : [];
  const payload = body.payload === undefined ? {} : body.payload;

  const fm = [];
  fm.push(`id: "${body.node_id}"`);
  fm.push(`type: ${norm}`);
  fm.push(`name: "${title.replace(/"/g, "'")} — workshop response"`);
  fm.push(`status: ${initialStatusFor(norm, payload)}`);
  if (norm === 'annotation' && body.target_node_id) {
    fm.push('links:');
    fm.push(`  - to: ${body.target_node_id}`);
    fm.push('    type: ANNOTATES');
  } else {
    fm.push('links: []');
  }
  fm.push('provenance:');
  fm.push(`  source_dash: "${body.slug}"`);
  fm.push('  source: workshop');
  fm.push(`  activity_id: "${body.activity_id}"`);
  if (nodes.length) fm.push(`  activity_nodes: [${nodes.map((n) => `"${n}"`).join(', ')}]`);
  fm.push(`  actor: "${String(actor || 'anonymous').replace(/"/g, "'")}"`);
  fm.push(`  extracted_at: ${submitted}`);
  fm.push(`  confidence: ${norm === 'evidence' && payload && payload.scores ? 'inferred' : 'reported'}`);

  return [
    '---',
    fm.join('\n'),
    '---',
    '',
    `# ${title}`,
    '',
    `Workshop response to activity \`${body.activity_id}\`${body.phase ? ` (phase ${body.phase})` : ''}.`,
    '',
    `- **Actor:** ${actor || 'anonymous'}`,
    `- **Submitted:** ${submitted}`,
    `- **Normalizes to:** ${norm}`,
    '',
    '## Answer',
    '',
    '```json',
    JSON.stringify(payload, null, 2),
    '```',
    '',
    '',
  ].join('\n');
}

function handleResponse(req, res, body) {
  const started = Date.now();
  const slug = safeId(body.slug);
  const activityId = safeId(body.activity_id);
  if (!slug) return badRequest(res, 'invalid or missing slug');
  if (!activityId) return badRequest(res, 'invalid or missing activity_id');
  if (!NORMALIZABLE.has(body.normalizes_to)) {
    return badRequest(res, `normalizes_to must be one of: ${[...NORMALIZABLE].join(', ')}`);
  }
  if (typeof body.payload !== 'object' || body.payload === null || Array.isArray(body.payload)) {
    return badRequest(res, 'payload must be an object');
  }

  const dashDir = resolveDash(slug);
  if (!dashDir) return notFound(res, `unknown dash: ${slug}`);

  const modelDir = path.join(dashDir, 'model');
  fs.mkdirSync(modelDir, { recursive: true });

  const stamp = Date.now().toString(36);
  body.node_id = `${body.normalizes_to}-${activityId}-${stamp}`;
  let file = path.join(modelDir, `${body.node_id}.md`);
  let n = 2;
  while (fs.existsSync(file)) file = path.join(modelDir, `${body.node_id}-${n++}.md`);
  body.node_id = path.basename(file, '.md');

  fs.writeFileSync(file, buildResponseMarkdown(body), 'utf8');

  broadcastChange(); // panels watching this dash can refresh
  log('write', `${slug}/model/${path.basename(file)}`, 201, Date.now() - started);
  sendJson(res, 201, {
    ok: true,
    node: {
      id: body.node_id,
      type: body.normalizes_to,
      status: initialStatusFor(body.normalizes_to, body.payload),
      file: path.relative(REPO_ROOT, file),
    },
  });
}

// ------------------------------------------------------------------- SSE

const sseClients = new Set();
const watchers = new Map();
let changeTimer = null;

function broadcastChange() {
  for (const res of sseClients) {
    try {
      res.write('event: change\ndata: {"changed":true}\n\n');
    } catch {
      sseClients.delete(res);
    }
  }
}

function scheduleBroadcast() {
  clearTimeout(changeTimer);
  changeTimer = setTimeout(broadcastChange, 250); // coalesce fs.watch bursts
}

/** Watch dash roots + each servable dash's workshop/ and model/ dirs. */
function refreshWatchers() {
  const wanted = new Set([REAL_DASHES_DIR, LOCAL_DASHES_DIR]);
  for (const slug of listSlugs()) {
    const dir = resolveDash(slug);
    if (!dir) continue;
    wanted.add(dir);
    wanted.add(path.join(dir, 'workshop'));
    wanted.add(path.join(dir, 'model'));
  }
  for (const dir of watchers.keys()) {
    if (!wanted.has(dir)) {
      watchers.get(dir).close();
      watchers.delete(dir);
    }
  }
  for (const dir of wanted) {
    if (watchers.has(dir)) continue;
    try {
      const w = fs.watch(dir, { persistent: false }, scheduleBroadcast);
      w.on('error', () => {});
      watchers.set(dir, w);
    } catch {
      /* dir may vanish mid-scan; parent watcher covers it */
    }
  }
}

function handleEvents(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write('retry: 2000\n\n');
  sseClients.add(res);
  refreshWatchers();
  console.log(`${new Date().toISOString().slice(11, 19)} SSE client connected (${sseClients.size} open)`);
  const ping = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      /* closed */
    }
  }, 25000);
  res.on('close', () => {
    clearInterval(ping);
    sseClients.delete(res);
  });
}

// ------------------------------------------------------------- API router

function handleApi(req, res, pathname, query, body) {
  switch (pathname) {
    case '/api/slugs':
      return sendJson(res, 200, { slugs: listSlugs() });

    case '/api/specs': {
      const slug = safeId(query.get('slug'));
      if (!slug) return badRequest(res, 'missing or invalid slug');
      const dashDir = resolveDash(slug);
      if (!dashDir) return notFound(res, `unknown dash: ${slug}`);
      const specs = loadSpecs(dashDir);
      return sendJson(res, 200, { slug, count: specs.length, specs });
    }

    case '/api/node': {
      const slug = safeId(query.get('slug'));
      const id = safeId(query.get('id'));
      if (!slug || !id) return badRequest(res, 'missing or invalid slug/id');
      const dashDir = resolveDash(slug);
      const file = dashDir && path.join(dashDir, 'model', `${id}.md`);
      if (!file || !fs.existsSync(file)) return notFound(res, `node not found: ${id}`);
      return send(res, 200, fs.readFileSync(file, 'utf8'), MIME['.md']);
    }

    case '/api/response':
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'POST required' });
      return handleResponse(req, res, body);

    default:
      return notFound(res, `no route: ${pathname}`);
  }
}

// ----------------------------------------------------------- static files

const STATIC_FILES = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/styles.css': 'styles.css',
  '/app.js': 'app.js',
};

function handleStatic(res, pathname) {
  const rel = STATIC_FILES[pathname];
  if (!rel) return notFound(res, 'not found');
  const file = path.join(APP_DIR, rel);
  send(res, 200, fs.readFileSync(file), MIME[path.extname(file)]);
}

// ------------------------------------------------------------------ server

const server = http.createServer((req, res) => {
  const started = Date.now();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const finish = (fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`error: ${err.message}`);
      if (!res.headersSent) sendJson(res, 500, { error: err.message });
    }
  };

  if (pathname === '/api/events' && req.method === 'GET') {
    return finish(() => handleEvents(res));
  }

  if (pathname.startsWith('/api/')) {
    if (req.method === 'POST') {
      const chunks = [];
      let size = 0;
      req.on('data', (c) => {
        size += c.length;
        if (size > 256 * 1024) req.destroy();
        else chunks.push(c);
      });
      return req.on('end', () =>
        finish(() => {
          let body = {};
          try {
            body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
          } catch {
            return badRequest(res, 'request body must be valid JSON');
          }
          handleApi(req, res, pathname, url.searchParams, body);
          log(req.method, req.url, res.statusCode, Date.now() - started);
        })
      );
    }
    return finish(() => {
      handleApi(req, res, pathname, url.searchParams, null);
      log(req.method, req.url, res.statusCode, Date.now() - started);
    });
  }

  return finish(() => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { error: 'method not allowed' });
    handleStatic(res, pathname);
    log(req.method, req.url, res.statusCode, Date.now() - started);
  });
});

server.listen(PORT, () => {
  console.log(`workshop serving on http://localhost:${PORT}`);
  console.log(`dashes: ${listSlugs().join(', ') || '(none found)'}`);
  refreshWatchers();
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    for (const w of watchers.values()) w.close();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 500).unref();
  });
}
