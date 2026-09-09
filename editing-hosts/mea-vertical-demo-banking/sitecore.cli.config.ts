import scConfig from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      // sites.json is authored locally for this demo host (no Edge site fetch required offline).
      // Re-enable generateSites() once SITECORE_EDGE_CONTEXT_ID points at a live environment.
      generateMetadata(),
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

