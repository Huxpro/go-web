---
'@lynx-js/go-web': minor
---

Add `autoGesture` to `<Go>`, and ship the driver behind it as `@lynx-js/go-web/auto-gesture`.

A gesture-driven example cannot demonstrate itself in an embedded preview. The Lynx Product Detail tutorial is a carousel whose whole point is that the drag, the release and the snap all run on the main thread — but it binds `touchstart`/`touchmove`/`touchend`, so a desktop reader's mouse never reaches it and every preview on the page reads as a still image. `autoGesture` performs the gesture with synthesized touches and draws the contact point the way a device simulator does.

The driver takes a host element and fractional coordinates and knows nothing about Lynx, React, or any framework, so it is exported on its own for sites that render `<lynx-view>` themselves. Coordinates are fractions of the host box, so a set of steps survives a resize; a step may carry `iterations` to repeat itself, so a sequence can walk a carousel to its end and back without knowing anything about carousels.

Four details in it are worth knowing before reusing it.

It dispatches a pointer event _and_ a touch event per contact, because real touch input produces both. The touch half is the one that does the work — web-core binds `touchstart`/`touchend`/`touchcancel` and no pointer events at all.

Safari needs a different code path and does not advertise it. It declares `Touch` and throws `Illegal constructor` when you call it, accepts `new TouchEvent`, still ships the legacy `document.createTouch`, and rejects a plain array where the current spec says `sequence<Touch>` — so each strategy is probed by building one throwaway event rather than inferred from a `typeof`. Before this, the throw rejected the playback loop and took the whole demonstration down with it.

Playback runs only while the preview is on screen. A tutorial page carries one preview per step, and the driver aims its contacts with `document.elementFromPoint` — viewport-relative, and empty below the fold — so an ungated preview starts a playback that silently hits nothing, and a reader scrolling down arrives to find it already finished and motionless.

It hands control back on the first `isTrusted` event, a flag only the browser can set, so a reader touching the preview always wins over the demonstration. Stopping mid-drag lifts the contact first, so the example runs its release handler instead of being left believing a finger is still down.
