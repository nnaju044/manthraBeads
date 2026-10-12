import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  define: {
    'process.env.IS_PREACT': 'false',
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'public/dist',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/whiteboard/index.jsx'),
      name: 'ManthraExcalidraw',
      fileName: () => 'excalidraw-app.js',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'excalidraw-app.css';
          }
          return '[name][extname]';
        },
      },
    },
  },
});
