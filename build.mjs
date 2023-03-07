import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    treeShaking: true,
    platform: 'node',
    target: 'node14.4',
    outfile: './dist/main.js',
  })
  .then((data) => console.log('SUCCESS', data))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
