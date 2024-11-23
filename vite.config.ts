import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: `@import "./src/scss/variables.scss";`,
      },
    },
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
