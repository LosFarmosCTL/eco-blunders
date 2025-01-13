import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
