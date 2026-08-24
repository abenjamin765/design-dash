/* Workshop client — vanilla JS, no dependencies, fully offline.
   Renders Activity Spec v1 primitives (question / artifact_panel / compare)
   and posts responses to /api/response for normalization into the dash model. */
'use strict';

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);

  const state = {
    slugs: [],
    slug: null,
    specs: [],
    currentId: null,
    responded: new Set(),
    ui: {}, // per-activity scratch space (rank order, annotations, ...)
  };

  const els = {};

  function cacheEls() {
    for (const id of [
      'slugSelect', 'liveStatus', 'liveText', 'activityList', 'railCount',
      'railEmpty', 'stageEmpty', 'activityView', 'chipPhase', 'chipType',
      'chipNorm', 'actTitle', 'actPrompt', 'actNodes', 'answerForm',
      'submitRow', 'submitBtn', 'submitHint', 'actorInput', 'confirmBox',
      'confirmDetail',
    ]) els[id] = document.getElementById(id);
  }

  // ------------------------------------------------------------- utilities

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }

  async function api(path, opts) {
    const res = await fetch(path, opts);
    if (!res.ok) {
      let msg = String(res.status);
      try { msg += ' - ' + (await res.json()).error; } catch (e) { /* not json */ }
      throw new Error(msg);
    }
    return res.json();
  }

  const TYPE_LABEL = {
    question: 'Question',
    artifact_panel: 'Artifact panel',
    compare: 'Compare',
  };

  const CHECK_SVG =
    '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5L4.8 9 10 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function currentSpec() {
    for (const s of state.specs) if (s.id === state.currentId) return s;
    return null;
  }

  // ------------------------------------------------------------------ boot

  async function boot() {
    cacheEls();

    els.slugSelect.addEventListener('change', () => selectSlug(els.slugSelect.value));
    els.submitBtn.addEventListener('click', submitResponse);
    els.answerForm.addEventListener('input', refreshValidity);
    els.answerForm.addEventListener('change', refreshValidity);
    els.answerForm.addEventListener('click', onFormClick);
    connectEvents();

    try {
      const data = await api('/api/slugs');
      state.slugs = Array.isArray(data.slugs) ? data.slugs : [];
    } catch (err) {
      els.railEmpty.hidden = false;
      els.railEmpty.textContent =
        'Cannot reach the workshop server (' + err.message + '). Start it with: node apps/workshop/server.js';
      return;
    }

    els.slugSelect.innerHTML = state.slugs
      .map((s) => '<option value="' + esc(s) + '">' + esc(s) + '</option>')
      .join('');

    if (!state.slugs.length) {
      els.railEmpty.hidden = false;
      return;
    }

    const wanted = new URLSearchParams(location.search).get('slug');
    selectSlug(state.slugs.indexOf(wanted) !== -1 ? wanted : state.slugs[0]);
  }

  async function selectSlug(slug) {
    state.slug = slug;
    state.currentId = null;
    els.slugSelect.value = slug;
    history.replaceState(null, '', '?slug=' + encodeURIComponent(slug));
    await refreshSpecs(true);
  }

  async function refreshSpecs(selectFirst) {
    if (!state.slug) return;
    let data;
    try {
      data = await api('/api/specs?slug=' + encodeURIComponent(state.slug));
    } catch (err) {
      state.specs = [];
      renderRail();
      showStageMessage('Could not load activities: ' + err.message);
      return;
    }
    state.specs = Array.isArray(data.specs) ? data.specs : [];
    renderRail();

    let stillThere = false;
    for (const s of state.specs) if (s.id === state.currentId) stillThere = true;

    if (!stillThere) {
      if (state.specs.length && selectFirst !== false) selectActivity(state.specs[0].id);
      else showStageMessage(
        'Pick an activity from the shelf. Your response is recorded straight into the dash model - no chat required.'
      );
    } else if (selectFirst === 'refresh') {
      selectActivity(state.currentId, true); // re-render in place, keep nothing stale
    }
  }

  function showStageMessage(msg) {
    els.stageEmpty.hidden = false;
    els.activityView.hidden = true;
    els.stageEmpty.querySelector('p').textContent = msg;
  }

  // ------------------------------------------------------------------ rail

  function modeSuffix(spec) {
    const m = spec.payload && spec.payload.mode;
    if (!m || m === 'single') return '';
    const labels = {
      multi: ' / multi', ranked: ' / ranked', scale: ' / scale',
      free_text: ' / free text', forced_choice: '', weighted: ' / weighted',
    };
    return labels[m] != null ? labels[m] : '';
  }

  function renderRail() {
    els.railCount.textContent = state.specs.length ? state.specs.length + ' published' : '';
    els.railEmpty.hidden = state.specs.length > 0;

    els.activityList.innerHTML = state.specs.map((spec, i) => {
      const done = state.responded.has(spec.id) ? ' done' : '';
      const active = spec.id === state.currentId ? ' active' : '';
      const tags =
        (spec.phase ? '<span class="tag tag-phase">' + esc(spec.phase) + '</span>' : '') +
        '<span class="tag">' + esc(TYPE_LABEL[spec.type] || spec.type) +
        esc(modeSuffix(spec)) + '</span>';
      return (
        '<li><button type="button" class="act-item' + active + done + '" data-id="' + esc(spec.id) + '">' +
        '<span class="act-num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="act-body"><span class="act-title">' + esc(spec.title || spec.id) + '</span>' +
        '<span class="act-tags">' + tags + '</span></span>' +
        '<span class="act-done" aria-hidden="true">&#10003;</span>' +
        '</button></li>'
      );
    }).join('');

    Array.prototype.forEach.call(els.activityList.querySelectorAll('.act-item'), (btn) => {
      btn.addEventListener('click', () => selectActivity(btn.dataset.id));
    });
  }

  // ----------------------------------------------------------------- stage

  function selectActivity(id, isRefresh) {
    const spec = state.specs.find((s) => s.id === id);
    if (!spec) return;
    state.currentId = id;
    state.ui = { annotations: [] };

    renderRail();

    els.stageEmpty.hidden = true;
    els.activityView.hidden = false;
    els.confirmBox.hidden = true;
    els.submitRow.style.display = '';
    els.submitBtn.disabled = false;
    els.submitBtn.textContent = 'Submit response';
    els.submitHint.textContent = '';

    // restart the entrance animation
    els.activityView.style.animation = 'none';
    void els.activityView.offsetWidth;
    els.activityView.style.animation = '';

    els.chipPhase.textContent = spec.phase || '-';
    els.chipType.textContent = TYPE_LABEL[spec.type] || spec.type;
    els.chipNorm.textContent = spec.normalizes_to || 'record';

    els.actTitle.textContent = spec.title || spec.id;
    els.actPrompt.textContent = spec.prompt || '';

    if (Array.isArray(spec.nodes) && spec.nodes.length) {
      els.actNodes.hidden = false;
      els.actNodes.innerHTML =
        '<span class="act-nodes-label">Nodes</span>' +
        spec.nodes.map((n) => '<span class="node-chip">' + esc(n) + '</span>').join('');
    } else {
      els.actNodes.hidden = true;
      els.actNodes.innerHTML = '';
    }

    els.answerForm.innerHTML = '';

    if (spec.type === 'question') renderQuestion(spec);
    else if (spec.type === 'artifact_panel') renderPanel(spec, Boolean(isRefresh));
    else if (spec.type === 'compare') renderCompare(spec);

    refreshValidity();
  }

  // ------------------------------------------------- primitive: question

  function optionHtml(inputType, name, opt) {
    return (
      '<label class="option">' +
      '<input type="' + inputType + '" name="' + name + '" value="' + esc(opt.value) + '">' +
      '<span class="option-mark">' + CHECK_SVG + '</span>' +
      '<span class="option-label">' + esc(opt.label) + '</span>' +
      '</label>'
    );
  }

  function renderQuestion(spec) {
    const p = spec.payload || {};
    const mode = p.mode || 'single';
    const options = Array.isArray(p.options) ? p.options : [];
    let html = '';

    if (mode === 'single' || mode === 'multi') {
      html =
        '<fieldset class="q-block"><legend class="q-label">' +
        (mode === 'multi' ? 'Choose all that apply' : 'Choose one') +
        '</legend><div class="options' + (mode === 'multi' ? ' options-multi' : '') + '" role="group">' +
        options.map((o) => optionHtml(mode === 'multi' ? 'checkbox' : 'radio', 'q', o)).join('') +
        '</div></fieldset>';
    } else if (mode === 'ranked') {
      state.ui.rankOrder = options.map((o) => o.value);
      html =
        '<fieldset class="q-block"><legend class="q-label">Rank - most important first</legend>' +
        '<ol class="rank-list" id="rankList"></ol></fieldset>';
    } else if (mode === 'scale') {
      const sc = p.scale || {};
      const min = Number.isFinite(+sc.min) ? +sc.min : 1;
      const max = Number.isFinite(+sc.max) ? +sc.max : 5;
      const step = Number.isFinite(+sc.step) && sc.step > 0 ? +sc.step : 1;
      const mid = min + Math.round((max - min) / (2 * step)) * step;
      html =
        '<div class="q-block scale-wrap"><div class="q-label">Your rating</div>' +
        '<div class="scale-value"><output id="scaleOut">' + mid + '</output><small>of ' + max + '</small></div>' +
        '<input type="range" id="scaleInput" name="q" min="' + min + '" max="' + max +
        '" step="' + step + '" value="' + mid + '" aria-label="Rating from ' + min + ' to ' + max + '">' +
        '<div class="scale-scale"><span>' + min + '</span><span>' + max + '</span></div></div>';
    } else if (mode === 'free_text') {
      html =
        '<div class="q-block free-text"><label class="q-label" for="freeText">Your answer</label>' +
        '<textarea id="freeText" name="q" placeholder="Write as much or as little as you like..."></textarea>' +
        '<span class="char-count" id="charCount">0 characters</span></div>';
    }

    els.answerForm.innerHTML = html;

    if (mode === 'single' || mode === 'multi') syncOptionStates();
    if (mode === 'ranked') drawRankList(options);
    if (mode === 'scale') {
      const input = document.getElementById('scaleInput');
      paintScale(input);
      input.addEventListener('input', () => {
        paintScale(input);
        document.getElementById('scaleOut').textContent = input.value;
      });
    }
    if (mode === 'free_text') {
      const ta = document.getElementById('freeText');
      ta.addEventListener('input', () => {
        document.getElementById('charCount').textContent =
          ta.value.length + (ta.value.length === 1 ? ' character' : ' characters');
      });
    }
  }

  function syncOptionStates() {
    Array.prototype.forEach.call(els.answerForm.querySelectorAll('.option'), (label) => {
      const input = label.querySelector('input');
      label.classList.toggle('checked', input.checked);
    });
  }

  function drawRankList(options) {
    const list = document.getElementById('rankList');
    if (!list) return;
    const byValue = {};
    for (const o of options) byValue[o.value] = o.label;

    list.innerHTML = state.ui.rankOrder.map((value, i) =>
      '<li class="rank-row">' +
      '<span class="rank-pos">' + (i + 1) + '</span>' +
      '<span class="rank-label">' + esc(byValue[value] || value) + '</span>' +
      '<span class="rank-btns">' +
      '<button type="button" class="rank-btn" data-i="' + i + '" data-d="-1" aria-label="Move up"' +
      (i === 0 ? ' disabled' : '') + '>&#8593;</button>' +
      '<button type="button" class="rank-btn" data-i="' + i + '" data-d="1" aria-label="Move down"' +
      (i === state.ui.rankOrder.length - 1 ? ' disabled' : '') + '>&#8595;</button>' +
      '</span></li>'
    ).join('');

    Array.prototype.forEach.call(list.querySelectorAll('.rank-btn'), (btn) => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.i;
        const j = i + +btn.dataset.d;
        const order = state.ui.rankOrder;
        const tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
        drawRankList(options);
        refreshValidity();
      });
    });
  }

  function paintScale(input) {
    const min = +input.min || 0;
    const max = +input.max || 100;
    const pct = ((+input.value - min) / (max - min)) * 100;
    input.style.setProperty('--fill', pct + '%');
  }

  // ------------------------------------------- primitive: artifact_panel

  function renderPanel(spec, isRefresh) {
    const p = spec.payload || {};
    const target = p.target_node_id || (spec.nodes && spec.nodes[0]) || '';
    const frame =
      '<div class="q-block">' +
      '<div class="panel-frame">' +
      '<div class="panel-toolbar"><span>' + esc(p.render || 'node') + ' render</span>' +
      '<code>' + esc(target) + '</code></div>' +
      '<div class="panel-body" id="panelBody"><p><em>Loading node&hellip;</em></p></div>' +
      '</div>';

    let html = frame;
    if (p.annotations_enabled) {
      html +=
        '<div class="annotations"><div class="q-label">Annotations</div>' +
        '<div class="annotation-list" id="annotationList"></div>' +
        '<div class="annotation-composer">' +
        '<textarea id="annotationInput" placeholder="Flag an issue, ask a question, leave a note&hellip;" aria-label="New annotation"></textarea>' +
        '<button type="button" class="btn btn-secondary" id="addAnnotation">Add</button>' +
        '</div></div>';
    } else {
      html += '<p class="panel-note">Annotations are disabled for this activity - review the artifact, then respond in chat.</p>';
    }
    html += '</div>';
    els.answerForm.innerHTML = html;

    const addBtn = document.getElementById('addAnnotation');
    if (addBtn) addBtn.addEventListener('click', addAnnotation);

    loadNode(spec, target);
  }

  async function loadNode(spec, target) {
    const body = document.getElementById('panelBody');
    if (!body) return;
    try {
      const res = await fetch('/api/node?slug=' + encodeURIComponent(state.slug) + '&id=' + encodeURIComponent(target));
      if (!res.ok) throw new Error(String(res.status));
      const raw = await res.text();
      if (!document.getElementById('panelBody')) return; // activity switched meanwhile
      const parsed = renderMarkdown(raw);
      body.innerHTML =
        '<div class="node-meta">' +
        (parsed.meta.type ? '<span class="chip">' + esc(parsed.meta.type) + '</span>' : '') +
        (parsed.meta.status ? '<span class="chip">' + esc(parsed.meta.status) + '</span>' : '') +
        '</div>' +
        '<div class="md">' + parsed.html + '</div>' +
        (parsed.meta.raw
          ? '<details class="raw-node"><summary>Frontmatter</summary><pre>' + esc(parsed.meta.raw) + '</pre></details>'
          : '');
    } catch (err) {
      body.innerHTML =
        '<p><em>Could not load node "' + esc(target) + '" (' + esc(err.message) + '). ' +
        'The model file dashes/' + esc(state.slug) + '/model/' + esc(target) + '.md was not found.</em></p>';
    }
  }

  function drawAnnotations() {
    const list = document.getElementById('annotationList');
    if (!list) return;
    list.innerHTML = state.ui.annotations.map((a, i) =>
      '<div class="annotation-entry"><span class="annotation-text">' + esc(a.text) + '</span>' +
      '<button type="button" class="annotation-remove" data-i="' + i + '" aria-label="Remove annotation">&times;</button></div>'
    ).join('');
    Array.prototype.forEach.call(list.querySelectorAll('.annotation-remove'), (btn) => {
      btn.addEventListener('click', () => {
        state.ui.annotations.splice(+btn.dataset.i, 1);
        drawAnnotations();
        refreshValidity();
      });
    });
  }

  function addAnnotation() {
    const input = document.getElementById('annotationInput');
    const text = (input.value || '').trim();
    if (!text) return;
    state.ui.annotations.push({ text: text });
    input.value = '';
    drawAnnotations();
    refreshValidity();
    input.focus();
  }

  // ------------------------------------------------- primitive: compare

  function renderCompare(spec) {
    const p = spec.payload || {};
    const items = Array.isArray(p.items) ? p.items : [];
    const criteria = Array.isArray(p.criteria) ? p.criteria : [];

    if (p.mode === 'weighted') {
      state.ui.scores = {};
      let head = '<div></div>';
      let rows = '';
      for (const it of items) {
        head += '<div>' + esc(it.label || it.node_id) + '</div>';
      }
      for (const c of criteria) {
        const weight = Number.isFinite(+c.weight) ? +c.weight : 1;
        rows +=
          '<div class="wt-criterion"><span>' + esc(c.label) + '</span>' +
          '<span class="wt-weight" title="Criterion weight">x' + weight + '</span></div>';
        for (const it of items) {
          const name = 'w-' + esc(c.label) + '-' + esc(it.node_id);
          rows +=
            '<div class="wt-cell"><input type="range" min="0" max="5" step="1" value="3" data-c="' +
            esc(c.label) + '" data-n="' + esc(it.node_id) + '" aria-label="' +
            esc((it.label || it.node_id) + ' on ' + c.label) + '">' +
            '<span class="wt-val">3</span></div>';
        }
      }
      els.answerForm.innerHTML =
        '<fieldset class="q-block"><legend class="q-label">Score each concept per criterion (0-5; weights shown)</legend>' +
        '<div class="weighted-table" style="--items:' + items.length + '">' +
        '<div class="wt-head">' + head + '</div>' +
        rows +
        '</div></fieldset>';

      Array.prototype.forEach.call(els.answerForm.querySelectorAll('.wt-cell input'), (input) => {
        paintScale(input);
        input.addEventListener('input', () => {
          paintScale(input);
          input.nextElementSibling.textContent = input.value;
        });
      });
    } else {
      // forced_choice (default)
      els.answerForm.innerHTML =
        '<fieldset class="q-block"><legend class="q-label">Pick one - this records a forced choice</legend>' +
        '<div class="compare-grid">' +
        items.map((it, i) =>
          '<label class="compare-card">' +
          '<input type="radio" name="q" value="' + esc(it.node_id) + '">' +
          '<span class="card-check">' + CHECK_SVG + '</span>' +
          '<span class="card-badge">Concept ' + String.fromCharCode(65 + i) + '</span>' +
          '<span class="card-title">' + esc(it.label || it.node_id) + '</span>' +
          '<span class="card-ref">' + esc(it.node_id) + '</span>' +
          '</label>'
        ).join('') +
        '</div></fieldset>';
      syncCompareStates();
    }
  }

  function syncCompareStates() {
    Array.prototype.forEach.call(els.answerForm.querySelectorAll('.compare-card'), (card) => {
      const input = card.querySelector('input');
      card.classList.toggle('checked', input.checked);
    });
  }

  // ---------------------------------------------- delegated form clicks

  function onFormClick(ev) {
    const opt = ev.target.closest('.option');
    if (opt) {
      // radio groups clear themselves; checkboxes toggle - just resync visuals
      setTimeout(syncOptionStates, 0);
      return;
    }
    const card = ev.target.closest('.compare-card');
    if (card) setTimeout(syncCompareStates, 0);
  }

  // ----------------------------------------------------- collect + submit

  /** Returns the normalized payload for the current activity, or null if incomplete. */
  function collectPayload(spec) {
    const p = spec.payload || {};

    if (spec.type === 'question') {
      const mode = p.mode || 'single';
      if (mode === 'single' || mode === 'multi') {
        const checked = els.answerForm.querySelectorAll('input[name="q"]:checked');
        if (!checked.length) return null;
        const values = Array.prototype.map.call(checked, (i) => i.value);
        return mode === 'multi' ? { selected: values } : { selected: values[0] };
      }
      if (mode === 'ranked') return { ranking: state.ui.rankOrder.slice() };
      if (mode === 'scale') {
        const input = document.getElementById('scaleInput');
        return input ? { value: +input.value } : null;
      }
      if (mode === 'free_text') {
        const ta = document.getElementById('freeText');
        const text = ta ? ta.value.trim() : '';
        return text ? { text: text } : null;
      }
    }

    if (spec.type === 'artifact_panel') {
      if ((p.annotations_enabled ?? true) && !state.ui.annotations.length) return null;
      return { annotations: state.ui.annotations.map((a) => ({ text: a.text })) };
    }

    if (spec.type === 'compare') {
      if (p.mode === 'weighted') {
        const scores = {};
        Array.prototype.forEach.call(els.answerForm.querySelectorAll('.wt-cell input'), (input) => {
          const c = input.dataset.c;
          const n = input.dataset.n;
          scores[c] = scores[c] || {};
          scores[c][n] = +input.value;
        });
        return Object.keys(scores).length ? { scores: scores } : null;
      }
      const checked = els.answerForm.querySelector('input[name="q"]:checked');
      return checked ? { selected: checked.value } : null;
    }

    return null;
  }

  function incompleteHint(spec) {
    if (spec.type === 'question') {
      const mode = (spec.payload && spec.payload.mode) || 'single';
      if (mode === 'multi') return 'Choose at least one option.';
      if (mode === 'free_text') return 'Write a short answer first.';
      return 'Choose an option first.';
    }
    if (spec.type === 'artifact_panel') return 'Add at least one annotation.';
    return 'Pick one concept to continue.';
  }

  function refreshValidity() {
    if (!els.activityView.hidden && currentSpec()) {
      const ok = collectPayload(currentSpec()) != null;
      els.submitBtn.disabled = !ok;
      els.submitHint.textContent = ok ? '' : incompleteHint(currentSpec());
    }
  }

  async function submitResponse() {
    const spec = currentSpec();
    if (!spec) return;
    const payload = collectPayload(spec);
    if (!payload) {
      refreshValidity();
      return;
    }

    els.submitBtn.disabled = true;
    els.submitBtn.textContent = 'Recording...';

    // Contract defaults (skills/_cross-cutting/workshop-activities): compare
    // forced_choice → decision, weighted → evidence; question → evidence;
    // artifact_panel → annotation.
    function defaultNorm(s) {
      if (s.type === 'compare') return s.payload && s.payload.mode === 'weighted' ? 'evidence' : 'decision';
      if (s.type === 'question') return 'evidence';
      return 'annotation';
    }

    const body = {
      slug: state.slug,
      activity_id: spec.id,
      normalizes_to: spec.normalizes_to || defaultNorm(spec),
      title: spec.title || spec.id,
      phase: spec.phase || '',
      nodes: Array.isArray(spec.nodes) ? spec.nodes : [],
      target_node_id: (spec.payload && spec.payload.target_node_id) || null,
      actor: els.actorInput.value.trim() || 'anonymous',
      payload: payload,
    };

    try {
      const res = await api('/api/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      state.responded.add(spec.id);
      renderRail();
      const stale = document.querySelector('.form-error');
      if (stale) stale.remove();
      els.confirmBox.hidden = false;
      els.confirmDetail.innerHTML =
        'Normalized as <strong>' + esc(res.node.type) + '</strong> node <code>' +
        esc(res.node.id) + '</code> written to <code>' + esc(res.node.file) + '</code>.';
      els.submitRow.style.display = 'none';
    } catch (err) {
      els.submitBtn.disabled = false;
      els.submitBtn.textContent = 'Submit response';
      let box = document.querySelector('.form-error');
      if (!box) {
        box = document.createElement('p');
        box.className = 'form-error';
        els.submitRow.after(box);
      }
      box.textContent = 'Could not record response: ' + err.message;
    }
  }

  // ------------------------------------------------------------- SSE feed

  function connectEvents() {
    if (typeof EventSource === 'undefined') return setLive(false);
    const source = new EventSource('/api/events');
    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);
    source.addEventListener('change', debounce(() => refreshSpecs('refresh'), 600));
  }

  function setLive(on) {
    els.liveStatus.classList.toggle('on', Boolean(on));
    els.liveStatus.classList.toggle('off', !on);
    els.liveText.textContent = on ? 'live' : 'connecting...';
  }

  // --------------------------------------------------- markdown rendering

  function inlineMd(s) {
    return s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  }

  /** Minimal markdown: headings, lists, quotes, hr, fenced code, paragraphs. */
  function mdToHtml(body) {
    const lines = body.split(/\r?\n/);
    const out = [];
    let para = [];
    let list = null; // 'ul' | 'ol'

    const flushPara = () => {
      if (para.length) {
        out.push('<p>' + inlineMd(esc(para.join(' '))) + '</p>');
        para = [];
      }
    };
    const flushList = () => {
      if (list) {
        out.push('</' + list + '>');
        list = null;
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      const fenceMatch = trimmed.match(/^```/);

      if (fenceMatch) { // handled by caller splitting fences; ignore stray markers
        continue;
      }
      if (!trimmed) { flushPara(); flushList(); continue; }

      const h = trimmed.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        flushPara(); flushList();
        const level = Math.min(h[1].length + 1, 5); // node h1 -> rendered h2
        out.push('<h' + level + '>' + inlineMd(esc(h[2])) + '</h' + level + '>');
        continue;
      }
      if (/^(-{3,}|\*{3,})$/.test(trimmed)) { flushPara(); flushList(); out.push('<hr>'); continue; }

      const quote = trimmed.match(/^>\s?(.*)$/);
      if (quote) {
        flushPara(); flushList();
        out.push('<blockquote>' + inlineMd(esc(quote[1])) + '</blockquote>');
        continue;
      }
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

  /**
   * Split frontmatter from body, render body to HTML.
   * Frontmatter is shown as chips (type/status) plus a raw <details> block -
   * no YAML parser needed for display purposes.
   */
  function renderMarkdown(raw) {
    const meta = { raw: '' };
    let body = raw;

    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (m) {
      meta.raw = m[1];
      body = raw.slice(m[0].length);
      const pick = (key) => {
        const km = m[1].match(new RegExp('^' + key + ':\\s*(.+)$', 'm'));
        return km ? km[1].trim().replace(/^["']|["']$/g, '') : '';
      };
      meta.id = pick('id');
      meta.type = pick('type');
      meta.name = pick('name');
      meta.status = pick('status');
      const conf = m[1].match(/^\s+confidence:\s*(.+)$/m);
      meta.confidence = conf ? conf[1].trim() : '';
    }

    // fenced code blocks first (protect from block parsing)
    const html = body.replace(/```[\w-]*\r?\n([\s\S]*?)```/g, (_, code) =>
      '<pre><code>' + esc(code.replace(/\n$/, '')) + '</code></pre>'
    );

    return { meta: meta, html: mdToHtml(html) };
  }

  // ------------------------------------------------------------------ go

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(); 
