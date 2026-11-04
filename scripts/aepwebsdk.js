const offerZones = ['#offers-zone-1', '#offers-zone-2'];

function renderOfferZones(result) {
  const propositions = result?.handle
    ?.filter((entry) => entry.type === 'personalization:decisions')
    .flatMap((entry) => entry.payload);

  propositions?.forEach((proposition) => {
    const scope = proposition.scope?.slice(proposition.scope.lastIndexOf('#'));
    if (!offerZones.includes(scope)) return;

    const zone = document.querySelector(scope);
    const offers = proposition.items?.[0]?.data?.content?.offers;
    if (!zone || !Array.isArray(offers)) return;

    const list = document.createElement('ul');
    offers.forEach((offer) => {
      const fragment = offer.ajoFragments?.[0];
      const title = fragment?.title || offer.itemName;
      if (typeof title !== 'string') return;

      const item = document.createElement('li');
      const article = document.createElement('article');
      const heading = document.createElement('h3');
      heading.textContent = title;
      article.append(heading);

      if (typeof fragment?.imageUrl === 'string') {
        const image = document.createElement('img');
        image.src = fragment.imageUrl;
        image.alt = title;
        image.loading = 'lazy';
        article.prepend(image);
      }

      item.append(article);
      list.append(item);
    });

    zone.replaceChildren(list);
  });
}

export async function sendPageView(xData = {}) {
  if (typeof window.alloy !== 'function') return;

  await window.alloy('sendEvent', {
    personalization: {
      surfaces: offerZones,
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
      ...xData,
    },
  }).then((result) => {
    renderOfferZones(result);
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
