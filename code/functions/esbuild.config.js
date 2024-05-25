const esbuild = require("esbuild");
esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  outdir: "lib",
  sourcemap: true,
  target: 'node18',
});
