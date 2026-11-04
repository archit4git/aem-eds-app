/* eslint-disable no-console */
import { createOptimizedPicture } from './aem.js';

const aempublishurl = 'https://publish-p14733-e1160558.adobeaemcloud.com';

/**
 * Processes the updated AEP WebSDK response object structures and
 * renders personalized AJO fragments into matching data-location-on-page elements.
 * @param {Object} response - The JSON payload object containing a 'propositions' array.
 */
/**
 * Processes AEP WebSDK response object structures and renders
 * personalized AJO fragments using EDS native image optimization.
 */
export function renderPersonalizedOffers(response) {
  if (!response || !Array.isArray(response.propositions)) return;

  response.propositions.forEach((proposition) => {
    const { scope } = proposition;
    if (!scope || !scope.includes('#')) return;

    const zoneId = scope.split('#')[1];
    const targetElement = document.querySelector(`div[data-location-on-page="${zoneId}"]`);

    if (!targetElement) return;
    if (!Array.isArray(proposition.items)) return;

    proposition.items.forEach((item) => {
      const offers = item.data?.content?.offers;
      if (!Array.isArray(offers)) return;

      // Clear standard/fallback layouts before custom rendering
      targetElement.innerHTML = '';

      offers.forEach((offer) => {
        if (!Array.isArray(offer.ajoFragments)) return;

        offer.ajoFragments.forEach((fragment) => {
          // 2. Create the wrapper card using DOM methods
          const card = document.createElement('div');
          card.classList.add('ajo-offer-card');
          card.id = fragment.id;

          const title = document.createElement('h3');
          title.textContent = fragment.title;
          card.appendChild(title);

          // 3. Leverage createOptimizedPicture natively from the current directory
          // Syntax: createOptimizedPicture(src, alt, eager, breakpoints)
          const optimizedPicture = createOptimizedPicture(
            aempublishurl + fragment.imageUrl, // The raw AEM /content/dam path from AJO
            fragment.title, // Alt text
            false, // Set true only if this zone is above the fold (LCP)
            [{ width: '750' }], // Tailor custom viewport breakpoints if needed
          );

          card.appendChild(optimizedPicture);

          // 4. Inject the final generated DOM node directly into the zone container
          targetElement.appendChild(card);
        });
      });
    });
  });
}

export async function sendPageView() {
  if (typeof window.alloy !== 'function') return;

  await window.alloy('sendEvent', {
    personalization: {
      surfaces: document.offersZones,
      defaultPersonalizationEnabled: false,
      sendDisplayEvent: true,
    },
    renderDecisions: true,
    xdm: {
      eventType: 'web.webpagedetails.pageViews',
      web: {
        webPageDetails: {
          name: document.title,
          URL: window.location.href,
        },
      },
    },
  }).then((result) => {
    renderPersonalizedOffers(result);
    // eslint-disable-next-line no-console
    console.log('AEP Web SDK page view sent', result);
    return result;
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('AEP Web SDK page view failed', error);
    throw error;
  });
}

export async function sendLinkClick(linkName) {
  if (typeof window.alloy !== 'function') return;

  await window.alloy('sendEvent', {
    xdm: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          name: linkName,
          type: 'other',
        },
      },
    },
  }).then((result) => {
    // eslint-disable-next-line no-console
    console.log('AEP Web SDK link click sent', result);
    return result;
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('AEP Web SDK link click failed', error);
    throw error;
  });
}
