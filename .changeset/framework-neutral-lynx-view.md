---
'@lynx-js/go-web': minor
---

Add `@lynx-js/go-web/lynx-view`, a framework-neutral entry point for mounting a Lynx-for-Web bundle.

`<Go>` is React, but running a bundle in a browser is not: it is element creation, `browserConfig` ordering, the fit/responsive viewport decision, and a "has it painted yet" state machine. `mountLynxView(container, options)` exposes that half on its own — no React, no framework — so a site built with anything can embed a preview with the same behaviour `<Go>` has. It reuses the existing `fit-scale` and `resolve-web-preview` utilities rather than duplicating them.

Also ships `playAutoGesture(host, { steps })`, which demonstrates a gesture-driven example with simulated touches and draws the contact point the way a device simulator does. A carousel that binds `touchstart`/`touchmove`/`touchend` shows nothing in an embedded preview otherwise, because a desktop reader's mouse never reaches it.

Three behaviours in the new module differ from `WebIframe`, each a bug found while embedding real tutorial examples:

- `pageRoot()` skips the disposed root. A reload does not replace the old page root — web-core marks it `l-disposed` and builds the new page beside it — so taking the first selector match never observes the rebuilt page and a refresh can only ever end on the fallback timeout.
- Styles are applied one property at a time instead of through `cssText`. web-core's stylesheet declares `lynx-view { display: none }` and reveals the element with an inline style of its own, which a whole-attribute assignment on resize silently takes away, collapsing the preview to zero width.
- A settled resize rebuilds the page. `browserConfig` is read once when the page is built and a later assignment does not re-lay-out, so after a resize an example that derives anything from `SystemInfo` keeps the stale viewport and drifts out of alignment with the box it is drawn in.
