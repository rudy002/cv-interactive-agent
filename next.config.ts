import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Utiliser webpack au lieu de Turbopack pour mieux gérer les imports dynamiques
  // de TalkingHead qui utilise des imports dynamiques avec des variables
  webpack: (config, { isServer }) => {
    // Permettre les imports dynamiques avec des variables
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      
      // Améliorer la résolution des modules .mjs
      config.resolve.extensionAlias = {
        ...config.resolve.extensionAlias,
        '.js': ['.js', '.ts', '.tsx'],
        '.mjs': ['.mjs', '.js'],
      };
      
      // Configurer webpack pour mieux gérer les imports dynamiques
      // Désactiver les warnings pour les imports dynamiques problématiques
      config.module = {
        ...config.module,
        unknownContextCritical: false,
        exprContextCritical: false,
        wrappedContextCritical: false,
      };
    }
    
    // Ignorer les warnings pour les imports dynamiques de TalkingHead
    config.ignoreWarnings = [
      { module: /node_modules\/@met4citizen\/talkinghead/ },
      /Failed to parse source map/,
      /Critical dependency/,
      /the request of a dependency is an expression/,
    ];

    return config;
  },
};

export default nextConfig;
