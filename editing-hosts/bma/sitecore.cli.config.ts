import scConfig from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      // Required on SAI: sites.json is gitignored and created here.
      // getStaticPaths still filters to defaultSite so we don't SSG every Edge site.
      generateMetadata(),
      generateSites(),
      extractFiles(),
      writeImportMap({
        paths: ['src/components'],
      }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    // Exclude content-sdk auxillary components and leftover RAI scaffold copies
    exclude: ['src/components/content-sdk/*', 'src/components/rai/*'],
  },
});
