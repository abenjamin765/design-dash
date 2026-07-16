# Design Dash landing page

This is the source for the public Design Dash explainer site. It is intentionally separate from the method library so the website can evolve without changing the method contract.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

The page is a small Next.js app with one interactive environment selector. Its three editorial illustrations live in `public/` and include descriptive alternative text in the page source.

## Content responsibilities

- Keep claims aligned with `../method/method.yaml`.
- Preserve keyboard-visible focus, reduced-motion behavior, semantic headings, and meaningful image alternatives.
- Keep the ChatGPT skill and GitHub links current.
- Avoid implying that simulated critique replaces accountable sign-off.
