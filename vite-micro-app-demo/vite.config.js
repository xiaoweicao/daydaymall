// vite.config.js (子应用)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // 生成manifest文件
    manifest: 'manifest.json',
    // 配置为库模式
    lib: {
      entry: 'src/main.jsx',
      name: 'MicroApp',
      fileName: (format) => `micro-app.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});