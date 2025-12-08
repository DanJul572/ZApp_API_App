const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['bin/www'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/app.js',
    target: 'node22',
    minify: false,
    sourcemap: true,
    external: ['pg', 'mysql2', 'sqlite3', 'sequelize-cli'],
  })
  .catch(() => process.exit(1));
