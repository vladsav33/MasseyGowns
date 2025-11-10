import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(),],
  css: { postcss: { plugins: [autoprefixer()] } },
});
