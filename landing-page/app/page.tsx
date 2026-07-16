"use client";

import { useState } from "react";

const steps = ["Evidence", "Objects", "Flows", "Alternatives", "Wireframes", "Plan"];

const tools = {
  chatgpt: {
    label: "ChatGPT",
    title: "Start with an installed skill.",
    body: "Describe the product problem in plain language. Design Dash will classify the work and guide one decision at a time.",
    code: "Use @design-dash to plan a new product or feature.",
    link: "https://chatgpt.com/skills?skill_id=6a58fb9320e88191831d6bd6d77835d0",
    action: "Open the Design Dash skill",
  },
  claude: {
    label: "Claude Code",
    title: "Run it inside your product workspace.",
    body: "Install the Claude adapter and keep the evidence trail, object guides, wireframes, and requirements beside the work they describe.",
    code: "./install.sh --claude",
    link: "https://github.com/abenjamin765/design-dash#readme",
    action: "View installation instructions",
  },
  cursor: {
    label: "Cursor",
    title: "Use the complete method while you design and build.",
    body: "Install the Cursor skills and rules, then start the orchestrator from the project where the resulting plan should live.",
    code: "./install.sh --cursor",
    link: "https://github.com/abenjamin765/design-dash#readme",
    action: "View installation instructions",
  },
  portable: {
    label: "Any agent",
    title: "Carry the method without a special integration.",
    body: "Give a file-capable agent the portable method and templates. The same artifacts remain readable in Markdown and HTML.",
    code: "Read AGENTS.md, then help me start a new Design Dash.",
    link: "https://github.com/abenjamin765/design-dash",
    action: "View the portable method",
  },
};

type ToolKey = keyof typeof tools;

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolKey>("chatgpt");
  const selected = tools[activeTool];

  return (
    <main id="top">
      <header className="site-header">
        <a className="wordmark" href="#top">Design Dash</a>
        <nav aria-label="Main navigation">
          <a href="#method">Method</a>
          <a href="#example">Example</a>
          <a href="#tools">Tools</a>
          <a href="https://github.com/abenjamin765/design-dash">GitHub</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">A rigorous design process, facilitated by AI</p>
        <h1 id="hero-title">From fuzzy problem<br />to build-ready plan.</h1>
        <p className="hero-copy">Prove the problem. Model the product. Explore real alternatives. Produce requirements and wireframes your team can build from.</p>
        <div className="hero-actions">
          <a className="primary-action" href="#tools">Start a Design Dash</a>
          <a className="text-action" href="#method">See how it works</a>
        </div>
        <ol className="process-line" aria-label="Design Dash process">
          {steps.map((step, index) => <li key={step}><span>{step}</span>{index < steps.length - 1 && <b aria-hidden="true">→</b>}</li>)}
        </ol>
      </section>

      <section className="section intro-section" aria-labelledby="intro-title">
        <p className="section-label">Why it exists</p>
        <div className="two-column">
          <h2 id="intro-title">AI makes screens fast. That isn’t the same as understanding a product.</h2>
          <div className="body-copy">
            <p>Without a process, assumptions become requirements, the first idea becomes the answer, and product knowledge disappears when the project ends.</p>
            <p>Design Dash keeps the speed while adding traceable evidence, deliberate alternatives, reusable product objects, and clear decision gates.</p>
          </div>
        </div>
      </section>

      <section className="section method-section" id="method" aria-labelledby="method-title">
        <p className="section-label">The method</p>
        <div className="section-intro">
          <h2 id="method-title">Six moves.<br />One traceable plan.</h2>
          <p>Nine guided phases sit behind this simple mental model. The method introduces one useful decision at a time and reveals deeper OOUX and ORCA guidance only when it becomes relevant.</p>
        </div>
        <ol className="method-list">
          <li><span>01</span><h3>Evidence</h3><p>Prove the problem—or preserve it honestly as an assumption.</p></li>
          <li><span>02</span><h3>Objects</h3><p>Model what people recognize before deciding which screens exist.</p></li>
          <li><span>03</span><h3>Flows</h3><p>Trace real scenarios through objects, actions, and state changes.</p></li>
          <li><span>04</span><h3>Alternatives</h3><p>Compare structurally different directions before committing.</p></li>
          <li><span>05</span><h3>Wireframes</h3><p>Design the happy path, edge states, and interaction hierarchy.</p></li>
          <li><span>06</span><h3>Plan</h3><p>Assemble requirements, acceptance criteria, and a learning loop.</p></li>
        </ol>
      </section>

      <section className="section example-section" id="example" aria-labelledby="example-title">
        <p className="section-label">From request to plan</p>
        <div className="example-heading">
          <h2 id="example-title">A simple request is rarely a simple design problem.</h2>
          <blockquote>“Show teachers student test results.”</blockquote>
        </div>
        <figure className="editorial-illustration wide-illustration">
          <img src="/evidence-to-plan.webp" alt="Ambiguous inputs moving through structured checkpoints and resolving into a clear plan" />
        </figure>
        <div className="example-grid">
          <div>
            <h3>The fuzzy request leaves important questions unanswered.</h3>
            <ul><li>Which teachers and students?</li><li>Which assessment or attempt?</li><li>What decision should the result support?</li><li>Who may see sensitive student data?</li></ul>
          </div>
          <div>
            <h3>The plan makes those decisions explicit.</h3>
            <ul><li>Seven modeled objects with clear relationships.</li><li>Three role-based scenarios.</li><li>Two structurally different concepts.</li><li>Permission, missing-data, and at-scale states.</li><li>Fourteen acceptance criteria and a usability study.</li></ul>
          </div>
        </div>
      </section>

      <section className="section rigor-section" aria-labelledby="rigor-title">
        <p className="section-label">Rigor follows risk</p>
        <div className="section-intro">
          <h2 id="rigor-title">The work sets the rigor.</h2>
          <p>You can always increase it. Sensitive data, broad reach, and irreversible decisions set a floor you cannot lower.</p>
        </div>
        <div className="rigor-list">
          <div><span>Express</span><h3>Small and reversible</h3><p>One role, narrow reach, and no sensitive data. Deferred evidence remains visible as debt.</p></div>
          <div><span>Standard</span><h3>A real product workflow</h3><p>Multiple roles or meaningful reach. Evidence, reconciliation, selection, critique, and learning are required.</p></div>
          <div><span>High-stakes</span><h3>Consequential by design</h3><p>Sensitive data, safety, broad reach, or hard-to-reverse decisions require every gate and accountable sign-off.</p></div>
        </div>
      </section>

      <section className="section library-section" aria-labelledby="library-title">
        <p className="section-label">Knowledge that compounds</p>
        <div className="illustrated-section">
          <div>
            <h2 id="library-title">Each dash makes the next one smarter.</h2>
            <div className="body-copy">
              <p>Object Guides become durable references for the things your product is made of: their identity, attributes, relationships, actions, states, permissions, and evidence.</p>
              <p>Future projects begin with what your team already knows instead of rebuilding the domain from scratch.</p>
            </div>
          </div>
          <figure className="editorial-illustration"><img src="/object-library.webp" alt="Reusable object modules forming a shared library and branching into multiple product experiences" /></figure>
        </div>
      </section>

      <section className="section tools-section" id="tools" aria-labelledby="tools-title">
        <p className="section-label">Works where you work</p>
        <div className="section-intro">
          <h2 id="tools-title">One method. Wherever you work.</h2>
          <p>Use a native skill when your tool supports it, or carry the same process through portable Markdown, YAML, and HTML artifacts.</p>
        </div>
        <figure className="editorial-illustration tools-illustration"><img src="/cross-tool.webp" alt="One central method flowing consistently into four different working environments" /></figure>
        <div className="tool-controls" role="group" aria-label="Choose your environment">
          {(Object.keys(tools) as ToolKey[]).map((key) => <button key={key} aria-pressed={activeTool === key} onClick={() => setActiveTool(key)}>{tools[key].label}</button>)}
        </div>
        <div className="tool-content" aria-live="polite">
          <div><h3>{selected.title}</h3><p>{selected.body}</p><a href={selected.link}>{selected.action} →</a></div>
          <code>{selected.code}</code>
        </div>
        <p className="access-note"><strong>No terminal required.</strong> Start in ChatGPT, install the repository in a code editor, or give the portable method to any file-capable agent.</p>
      </section>

      <section className="closing-section">
        <p className="eyebrow">Bring the fuzzy problem</p>
        <h2>Leave with the plan.</h2>
        <a className="primary-action" href="#tools">Start a Design Dash</a>
      </section>

      <footer><a className="wordmark" href="#top">Design Dash</a><p>Evidence-governed product design.</p><a href="https://github.com/abenjamin765/design-dash">GitHub</a></footer>
    </main>
  );
}
