const glob = require('glob');
const esbuild = require('esbuild');

const entryPoints = glob.sync('src/**/*.js');

esbuild
  .build({
    entryPoints,
    outdir: 'dist',
    platform: 'node',
    format: 'cjs',
    bundle: false,
    sourcemap: true,
    outbase: 'src',
  })
  .catch(() => process.exit(1));
