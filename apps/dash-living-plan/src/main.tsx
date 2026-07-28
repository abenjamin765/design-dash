import React from 'react'
import { createRoot } from 'react-dom/client'
import { MDXProvider } from '@mdx-js/react'
import { components } from './components/index'
import App from './App'
import './styles/global.css'

const root = document.getElementById('root')!
createRoot(root).render(
  <React.StrictMode>
    <MDXProvider components={components}>
      <App />
    </MDXProvider>
  </React.StrictMode>
)
