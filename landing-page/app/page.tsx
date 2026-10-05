"use client";

import { useState } from "react";

const basePath = "/design-dash";
const exampleBase = "https://github.com/abenjamin765/design-dash/blob/main/examples/reading-list";

const steps = ["Evidence", "Objects", "Flows", "Alternatives", "Wireframes", "Plan"];

const artifacts = [
  {
    title: "Pitch",
    href: `${exampleBase}/README.md`,
    body: "The reading-list README walks the problem, the decision, and what to build next. A full dash also writes a stakeholder pitch site.",
  },
  {
    title: "Requirements",
    href: `${exampleBase}/requirements.md`,
    body: "Context, goals, objects, flows, states, and the acceptance criteria a team can build against.",
  },
  {
    title: "Wireframes",
    href: `${exampleBase}/wireframe.html`,
    body: "The selected concept, including empty and error states, in portable HTML.",
  },
  {
    title: "Object guides",
    href: `${exampleBase}/objects.md`,
    body: "The things people recognize: identity, relationships, actions, and the words the interface should use.",
  },
];

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
        <a className="wordmark" href="#top">
          <img src={`${basePath}/logo.svg`} alt="Design Dash" width={240} height={96} />
        </a>
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
          <img src={`${basePath}/evidence-to-plan.webp`} alt="Ambiguous inputs moving through structured checkpoints and resolving into a clear plan" />
        </figure>
        <div className="example-grid">
          <div>
            <h3>The fuzzy request leaves important questions unanswered.</h3>
            <ul><li>Which teachers and students?</li><li>Which assessment or attempt?</li><li>What decision should the result support?</li><li>Who may see sensitive student data?</li></ul>
          </div>
          <div>
            <h3>The method forces those decisions into the open.</h3>
            <ul>
              <li>Which objects do people recognize, and how are they related?</li>
              <li>Which roles act, and which scenarios change state?</li>
              <li>Which structurally different concepts were compared before one was chosen?</li>
              <li>What happens when data is missing, permission is denied, or the class is large?</li>
              <li>What must be true to build this, and how will we learn whether it worked?</li>
            </ul>
          </div>
        </div>
        <p className="example-caveat">Student results are regulated data, so this request would be classified High-stakes. The story shows why a short ask is hard. <a href="#leave-with">See a finished plan</a> in the reading-list example, a small synthetic Express dash.</p>
      </section>

      <section className="section leave-section" id="leave-with" aria-labelledby="leave-title">
        <p className="section-label">What you leave with</p>
        <div className="section-intro">
          <h2 id="leave-title">A plan your team can build from.</h2>
          <p>Every dash ends in portable files. Read them in the <a href={`${exampleBase}/README.md`}>team reading list</a>, along with its <a href={`${exampleBase}/assumptions.md`}>assumption register</a> and <a href={`${exampleBase}/flow.md`}>scenario flow</a>.</p>
        </div>
        <ul className="leave-list">
          {artifacts.map((artifact) => (
            <li key={artifact.title}>
              <a href={artifact.href}>{artifact.title}</a>
              <p>{artifact.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section rigor-section" aria-labelledby="rigor-title">
        <p className="section-label">Rigor follows risk</p>
        <div className="section-intro">
          <h2 id="rigor-title">The work sets the rigor.</h2>
          <p>You can raise it. Regulated data, broad reach, and irreversible decisions set a floor.</p>
        </div>
        <div className="rigor-list">
          <div><span>Express</span><h3>Small and reversible</h3><p>Low risk, easily reversible, and narrow reach. The ethics floor still applies. Skipped gates stay visible as evidence debt.</p></div>
          <div><span>Standard</span><h3>A real product workflow</h3><p>Moderate risk, or a meaningful workflow with more than one role. Evidence, reconciliation, selection, ethics, and learning are required.</p></div>
          <div><span>High-stakes</span><h3>Consequential by design</h3><p>Irreversible or broad-impact work, safety concerns, or regulated data. Every gate is required, including privacy, with accountable sign-off.</p></div>
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
          <figure className="editorial-illustration"><img src={`${basePath}/object-library.webp`} alt="Reusable object modules forming a shared library and branching into multiple product experiences" /></figure>
        </div>
      </section>

      <section className="section tools-section" id="tools" aria-labelledby="tools-title">
        <p className="section-label">Works where you work</p>
        <div className="section-intro">
          <h2 id="tools-title">One method. Wherever you work.</h2>
          <p>Use a native skill when your tool supports it, or carry the same process through portable Markdown, YAML, and HTML artifacts.</p>
        </div>
        <figure className="editorial-illustration tools-illustration"><img src={`${basePath}/cross-tool.webp`} alt="One central method flowing consistently into four different working environments" /></figure>
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

      <footer>
        <a className="wordmark" href="#top">
          <img src={`${basePath}/logo.svg`} alt="Design Dash" width={240} height={96} />
        </a>
        <p>Evidence-governed product design.</p>
        <a href="https://github.com/abenjamin765/design-dash">GitHub</a>
      </footer>
    </main>
  );
}
