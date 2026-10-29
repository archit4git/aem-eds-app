/* eslint-disable no-console */
// add delayed functionality here
import { sendPageView } from './aepwebsdk.js';

// eslint-disable-next-line func-names
window.alloy = window.alloy || function (...args) {
  (window.alloy.q = window.alloy.q || []).push(args);
  window.alloy.p = [];
};

function loadAndConfigureAlloy() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn1.adoberesources.net/alloy/2.36.1/alloy.min.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.alloy('configure', {
        edgeConfigId: 'e01294ec-f74a-43bb-93d6-2a2382c1ac34',
        imsOrgId: 'D15D15F354F647770A4C98A4@AdobeOrg',
        defaultConsent: 'in',
      });
      resolve();
    };

    script.onerror = () => reject(new Error('Failed to load Alloy script'));
  });
}

/*
function loadAlloyScript() {
  const script = document.createElement('script');
  script.src = 'https://cdn1.adoberesources.net/alloy/2.36.1/alloy.min.js';
  script.async = true;
  document.head.appendChild(script);
}

function configureAlloy() {
  window.alloy('configure', {
    edgeConfigId: 'e01294ec-f74a-43bb-93d6-2a2382c1ac34',
    imsOrgId: 'D15D15F354F647770A4C98A4@AdobeOrg',
    defaultConsent: 'in',
  });
}

loadAlloyScript();
configureAlloy();
*/
loadAndConfigureAlloy()
  .then(() => {
    console.log('Alloy script loaded and configured successfully');
    sendPageView();
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });
