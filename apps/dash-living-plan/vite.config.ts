import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const planDir = process.env.DASH_LIVING_PLAN_DIR
// The CLI starts the API first and passes its real port here, so the proxy can
// never point at a different workshop's backend.
const apiPort = Number(process.env.DASH_LIVING_PLAN_API_PORT) || 5276
// Port 0 = OS-assigned free port (same contract as the API). Never default to
// 5275 — concurrent dash viewers collide and the printed URL then lies.
const uiPortEnv = process.env.DASH_LIVING_PLAN_UI_PORT
const uiPort = uiPortEnv === undefined || uiPortEnv === '' ? 0 : Number(uiPortEnv)

/**
 * Report the port Vite actually bound. With several dashes open at once the
 * requested port is often taken, and a URL printed from the requested port
 * points at somebody else's plan.
 */
const reportUiPort = {
  name: 'dash-living-plan-report-ui-port',
  configureServer(server: { httpServer: import('http').Server | null }) {
    server.httpServer?.once('listening', () => {
      const address = server.httpServer?.address()
      if (!planDir || !address || typeof address === 'string') return
      fs.writeFileSync(path.join(planDir, '.ui-port'), String(address.port), 'utf8')
    })
  },
}

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react(),
    reportUiPort,
  ],
  // Quiet Vite's own "Local: http://…" line — the CLI prints the bound URL after
  // reading .ui-port, so a second URL from a default/stale port confuses agents.
  logLevel: 'warn',
  server: {
    host: '127.0.0.1',
    port: Number.isFinite(uiPort) ? uiPort : 0,
    strictPort: uiPort > 0,
    proxy: {
      '/api': `http://127.0.0.1:${apiPort}`,
      '/workshop': `http://127.0.0.1:${apiPort}`,
    },
  },
  resolve: {
    alias: planDir
      ? {
          '@plan': planDir,
        }
      : {},
    // Plan MDX lives outside this app (in the workshop dir), so bare imports the MDX
    // compiler emits — react/jsx-runtime, the MDX provider — have no node_modules to
    // resolve against. Pin them to this app's copies.
    dedupe: ['react', 'react-dom', '@mdx-js/react'],
  },
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
})
