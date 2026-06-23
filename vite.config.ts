import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Sync system environment variables to .env so Vite is guaranteed to load them in the client bundle
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const appUrl = process.env.APP_URL;

  let envContent = '';
  if (supabaseUrl) envContent += `VITE_SUPABASE_URL="${supabaseUrl}"\n`;
  if (supabaseAnon) envContent += `VITE_SUPABASE_ANON_KEY="${supabaseAnon}"\n`;
  if (geminiApiKey) envContent += `VITE_GEMINI_API_KEY="${geminiApiKey}"\n`;
  if (appUrl) envContent += `VITE_APP_URL="${appUrl}"\n`;

  if (envContent) {
    console.log("[Vite Config] Writing discovered secrets to dynamic .env file...");
    try {
      fs.writeFileSync('.env', envContent, 'utf-8');
      console.log("[Vite Config] .env file written successfully!");
    } catch (e) {
      console.error("[Vite Config] Failed to write .env file:", e);
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
