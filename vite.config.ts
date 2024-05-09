import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'フリマアシストぷらす',
  version: '1.0.0',
  description: 'フリマアシストをさらにやりやすくするための拡張機能',
  permissions: ['tabs', 'activeTab', 'scripting'],
  background: {
    service_worker: 'src/background.ts',
  },
  content_scripts: [
    {
      matches: ['https://jp.mercari.com/mypage/listings'],
      js: ['src/content.ts'],
    },
  ],
  action: {
    default_popup: 'popup.html',
  },
});

export default defineConfig({
  plugins: [crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
