# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--aem-eds-app--archit4git.aem.page/
- Live: https://main--aem-eds-app--archit4git.aem.live/

## Documentation

Before using the aem-boilerplate, we recommend you to go through the documentation on [www.aem.live](https://www.aem.live/docs/), more specifically:
1. [AEM Authoring](https://www.aem.live/docs/aem-authoring)
2. [Universal Editor Tutorial](https://www.aem.live/developer/ue-tutorial)
3. [Component Model Definitions](https://www.aem.live/developer/component-model-definitions)
4. [Authoring Path Mapping](https://www.aem.live/developer/authoring-path-mapping)

## Prerequisites

- nodejs 20 or newer
- AEM Cloud Service release 2026.4 or newer

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## AEP Web SDK

The local Alloy bundle is loaded on demand by `scripts/aepwebsdk.js`. Set the
datastream ID and Adobe organization ID before `scripts/scripts.js` runs:

```html
<script nonce="aem">
  window.aepWebSdkConfig = {
    datastreamId: 'YOUR_DATASTREAM_ID',
    orgId: 'YOUR_ORG_ID',
  };
</script>
```

The SDK module exports `init()`, `sendEvent(event)`, and
`trackPageView(pageName)`. Use `sendEvent` for other AEP XDM or data events;
credentials and secrets must not be placed in client-side configuration.
