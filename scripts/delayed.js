/* eslint-disable no-console */

let alloyLoadedAndConfigured = false;

(() => {
  ['alloy'].forEach((namespace) => {
    if (!window[namespace]) {
      // eslint-disable-next-line no-underscore-dangle
      window.__alloyNS = window.__alloyNS || [];
      // eslint-disable-next-line no-underscore-dangle
      window.__alloyNS.push(namespace);
      window[namespace] = (...args) => new Promise((resolve, reject) => {
        window.setTimeout(() => {
          window[namespace].q.push([resolve, reject, args]);
        });
      });
      window[namespace].q = [];
    }
  });
})();

async function loadAndConfigureAlloy() {
  if (alloyLoadedAndConfigured) return;

  await import('./alloy.min.js');
  try {
    await window.alloy('configure', {
      datastreamId: 'b5fc588d-65ad-4d49-82a5-df4c42cfc1ab', // Lab-Play: b037696d-261c-4aff-a9a7-22333af5ba71, Prod-POC: b5fc588d-65ad-4d49-82a5-df4c42cfc1ab
      orgId: 'D15D15F354F647770A4C98A4@AdobeOrg', // For Lab-Play: 936F50DB58F51CE40A495E0C@AdobeOrg, Prod-POC: D15D15F354F647770A4C98A4@AdobeOrg
      defaultConsent: 'in',
    });
    alloyLoadedAndConfigured = true;
    window.dispatchEvent(new CustomEvent('alloyLoadedAndConfigured'));
    console.log('Alloy script loaded and configured successfully');
  } catch (error) {
    console.error('Error occurred while configuring Alloy:', error);
  }
}

await loadAndConfigureAlloy();
