/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'フリマアシストぷらす',
  version: '1.0.0',
  description: 'フリマアシストをさらにやりやすくするための拡張機能',
  permissions: ['tabs', 'activeTab', 'scripting'],
  host_permissions: ['https://jp.mercari.com/*'],
  background: {
    service_worker: 'src/background.ts',
  },
  content_scripts: [
    {
      matches: ['https://jp.mercari.com/todos', 'https://jp.mercari.com/mypage/listings'],
      js: ['src/content.ts'],
    },
  ],
  action: {
    default_popup: 'popup.html',
  },
});

export default defineConfig({
  plugins: [crx({ manifest }), tsconfigPaths()],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.ts'],
  },
});
