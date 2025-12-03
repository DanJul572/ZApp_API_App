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
      // ORM & DB drivers
      'sequelize',
      'sequelize-cli',
      'pg',
      'pg-hstore',
      'mysql2',
      'sqlite3',

      // Express ecosystem
      'express',
      'morgan',
      'ejs',

      // Validation & Swagger
      'swagger-jsdoc',
      'swagger-ui-express',
      'express-validation',
      'joi',

      // Optional but recommended
      'multer',
      'dayjs',
      'jsonwebtoken',
      'bcryptjs',
    ],
  })
  .catch(() => process.exit(1));
