import { EditingScripts } from '@sitecore-content-sdk/nextjs';
import Script from 'next/script';
// The BYOC bundle imports external (BYOC) components into the app and makes sure they are ready to be used
import BYOC from 'src/byoc';
import FEAASScripts from 'components/content-sdk/FEAASScripts';
import CdpPageView from 'components/content-sdk/CdpPageView';
import { JSX } from 'react';

const Scripts = (): JSX.Element => {
  return (
    <>
      <BYOC />
      <FEAASScripts />
      <CdpPageView />
      <Script src="https://kit.fontawesome.com/5b00635838.js" strategy="afterInteractive" />
      <EditingScripts />
    </>
  );
};

export default Scripts;
