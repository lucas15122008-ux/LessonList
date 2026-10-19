import type { NextConfig } from "next";

// Todas as páginas da área logada leem a sessão a cada pedido, então ficamos no modelo
// de renderização dinâmico clássico em vez de Cache Components.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
