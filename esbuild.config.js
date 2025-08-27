const glob = require("glob");
const esbuild = require("esbuild");
const alias = require("esbuild-plugin-alias");
const path = require("path");

const entryPoints = glob.sync("src/**/*.js"); // ambil semua file js dalam src

esbuild.build({
  entryPoints,
  outdir: "dist",
  platform: "node",
  format: "cjs",
  bundle: false,
  sourcemap: true,
  outbase: "src", // supaya struktur folder tetap sama
  plugins: [
    alias({
      "@builders": path.resolve(__dirname, "src/builders"),
      "@config": path.resolve(__dirname, "src/config"),
      "@controllers": path.resolve(__dirname, "src/controllers"),
      "@enums": path.resolve(__dirname, "src/enums"),
      "@helpers": path.resolve(__dirname, "src/helpers"),
      "@middleware": path.resolve(__dirname, "src/middleware"),
      "@migrations": path.resolve(__dirname, "src/migrations"),
      "@models": path.resolve(__dirname, "src/models"),
      "@queries": path.resolve(__dirname, "src/queries"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@seeders": path.resolve(__dirname, "src/seeders"),
      "@services": path.resolve(__dirname, "src/services"),
      "@validations": path.resolve(__dirname, "src/validations"),
    }),
  ],
}).catch(() => process.exit(1));
