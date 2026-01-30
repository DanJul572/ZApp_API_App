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
    external: [
      // database drivers
      'pg',
      'mysql2',
      'sqlite3',

      // pg ecosystem
      'pg-copy-streams',
      'pg-hstore',
      'pg-query-stream',

      // orm & cli
      'sequelize',
      'sequelize-cli',

      // crypto / heavy runtime
      'bcryptjs',

      // runtime client
      '@jsreport/nodejs-client',
    ],
  })
  .catch(() => process.exit(1));
