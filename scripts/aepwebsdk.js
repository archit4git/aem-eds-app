/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
import { createOptimizedPicture } from './aem.js';

const aempublishurl = 'https://publish-p14733-e1160558.adobeaemcloud.com';

/**
 * Sends a personalization display event to the AEP WebSDK for rendered propositions.
 * @param {Array} renderedPropositions - An array of proposition objects that were
 * successfully rendered on the page.
 */
export function trackPersonalizationDisplay(renderedPropositions) {
  // 1. Ensure we have propositions to track
  if (!renderedPropositions || renderedPropositions.length === 0) {
    return;
  }

  // 2. Map the propositions into the format required for the collection payload
  // We extract the tracking tokens by sending the core identifying metadata back to Adobe
  const propositionsForTracking = renderedPropositions.map((prop) => ({
    id: prop.id,
    scope: prop.scope,
    scopeDetails: prop.scopeDetails,
  }));

  // 3. Execute the standard Alloy sendEvent command
  window.alloy('sendEvent', {
    xdm: {
      eventType: 'decisioning.propositionDisplay', // Standard XDM event type for personalization tracking
      _experience: {
        decisioning: {
          propositions: propositionsForTracking, // The array of rendered metadata tokens
          propositionEventType: {
            display: 1
          },
        },
      }
    },
  })
    .then(() => {
      console.log(`Successfully sent AJO display tracking for ${propositionsForTracking.length} proposition(s).`);
    })
    .catch((error) => {
      console.error('Failed to send AEP WebSDK personalization display tracking:', error);
    });
}

/**
 * Processes the updated AEP WebSDK response object structures and
 * renders personalized AJO fragments into matching data-location-on-page elements.
 * @param {Object} response - The JSON payload object containing a 'propositions' array.
 */
/**
 * Processes AEP WebSDK response object structures and renders
 * personalized AJO fragments using EDS native image optimization.
 */
export function renderAndTrackOffers(response) {
  if (!response || !Array.isArray(response.propositions)) return;

  // Create a bucket to keep track of propositions that we actually found elements for
  const successfulPropositions = [];

  response.propositions.forEach((proposition) => {
    const { scope } = proposition;
    if (!scope || !scope.includes('#')) return;

    const zoneId = scope.split('#')[1];
    const targetElement = document.querySelector(`div[data-location-on-page="${zoneId}"]`);

    if (!targetElement) return; // Skip tracking if the container isn't on this page
    if (!Array.isArray(proposition.items)) return;

    // Track that this specific proposition was successfully mapped to a DOM element
    successfulPropositions.push(proposition);

    proposition.items.forEach((item) => {
      const offers = item.data?.content?.offers;
      if (!Array.isArray(offers)) return;

      targetElement.innerHTML = ''; // Clear fallbacks

      offers.forEach((offer) => {
        if (!Array.isArray(offer.ajoFragments)) return;

        offer.ajoFragments.forEach((fragment) => {
          const card = document.createElement('div');
          card.classList.add('ajo-offer-card');
          card.id = fragment.id;

          const title = document.createElement('h3');
          title.textContent = fragment.title;
          card.appendChild(title);

          const optimizedPicture = createOptimizedPicture(aempublishurl + fragment.imageUrl, fragment.title, false, [{ width: '750' }]);
          card.appendChild(optimizedPicture);

          targetElement.appendChild(card);
        });
      });
    });
  });

  // 🔥 Call the tracking function immediately after rendering the components
  if (successfulPropositions.length > 0) {
    trackPersonalizationDisplay(successfulPropositions);
  }
}

export async function sendPageView() {
  if (typeof window.alloy !== 'function') return;

  await window.alloy('sendEvent', {
    personalization: {
      surfaces: document.offersZones,
      defaultPersonalizationEnabled: false,
      sendDisplayEvent: false,
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
    renderAndTrackOffers(result);
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
