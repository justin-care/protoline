import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
    source: ['tokens.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'dist/css',
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables',
          },
        ],
      },
      ts: {
        transformGroup: 'js',
        buildPath: 'dist/ts',
        files: [
          {
            destination: 'tokens.d.ts',
            format: 'typescript/es6-declarations',
          },
        ],
      },
    },
  });

await (
    await sd.extend()
).buildAllPlatforms();
