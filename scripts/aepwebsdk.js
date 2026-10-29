export async function sendPageView(xData = {}) {
  if (typeof window.alloy !== 'function') return;

  await window.alloy('sendEvent', {
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
    // eslint-disable-next-line no-console
    console.log('AEP Web SDK page view sent', result);
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('AEP Web SDK page view failed', error);
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
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('AEP Web SDK link click failed', error);
  });
}
