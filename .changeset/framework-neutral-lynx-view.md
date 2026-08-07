---
'@lynx-js/go-web': minor
---

Add `@lynx-js/go-web/lynx-view`, a framework-neutral entry point for mounting a Lynx-for-Web bundle.

`<Go>` is React, but running a bundle in a browser is not: it is element creation, `browserConfig` ordering, the fit/responsive viewport decision, and a "has it painted yet" state machine. `mountLynxView(container, options)` exposes that half on its own — no React, no framework — so a site built with anything can embed a preview with the same behaviour `<Go>` has. It reuses the existing `fit-scale` and `resolve-web-preview` utilities rather than duplicating them.

Also ships `playAutoGesture(host, { steps })`, which demonstrates a gesture-driven example with simulated touches and draws the contact point the way a device simulator does. A carousel that binds `touchstart`/`touchmove`/`touchend` shows nothing in an embedded preview otherwise, because a desktop reader's mouse never reaches it.

Two details in it are worth knowing before reusing it. It dispatches a pointer event _and_ a touch event per contact, because real touch input produces both and web-core drives its gestures from the pointer stream — sending only `touchstart`/`touchmove`/`touchend` reaches the right element and does nothing at all. And it hands control back on the first `isTrusted` event, which is a flag only the browser can set, so a reader touching the preview always wins over the demonstration.

A step carries an optional `iterations`, so a sequence can walk a carousel to its end and back — seven swipes left, then seven right — without the driver knowing anything about carousels. Stopping mid-drag lifts the contact first, so the example runs its release handler instead of being left believing a finger is still down.

Three behaviours in the new module differ from `WebIframe`, each a bug found while embedding real tutorial examples:

- `pageRoot()` skips the disposed root. A reload does not replace the old page root — web-core marks it `l-disposed` and builds the new page beside it — so taking the first selector match never observes the rebuilt page and a refresh can only ever end on the fallback timeout.
- Styles are applied one property at a time instead of through `cssText`. web-core's stylesheet declares `lynx-view { display: none }` and reveals the element with an inline style of its own, which a whole-attribute assignment on resize silently takes away, collapsing the preview to zero width.
- A settled resize rebuilds the page. `browserConfig` is read once when the page is built and a later assignment does not re-lay-out, so after a resize an example that derives anything from `SystemInfo` keeps the stale viewport and drifts out of alignment with the box it is drawn in.
