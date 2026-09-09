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
    // Exclude content-sdk and other auxillary components
    exclude: [
      'src/components/content-sdk/*',
      'src/components/non-sitecore/*',
      // Shared helpers/constants — not Sitecore renderings (avoids bogus map entries)
      'src/components/pepsico/corporate/pepsico-corporate-utils.ts',
      'src/components/pepsico/corporate/pepsico-corporate-tokens.ts',
    ],
  },
});
