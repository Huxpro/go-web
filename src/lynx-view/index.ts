/**
 * Framework-neutral `<lynx-view>` embedding.
 *
 * `<Go>` is React, but running a Lynx bundle in a browser is not: it is element
 * creation, viewport arithmetic and a "has it painted" state machine. This
 * entry point exposes that half on its own, so a site built with anything —
 * or nothing — can mount a Lynx preview with the same behaviour `<Go>` has.
 *
 *     import { mountLynxView } from '@lynx-js/go-web/lynx-view';
 *
 *     const view = mountLynxView(document.querySelector('#preview')!, {
 *       url: '/lynx-examples/swiper/dist/main.web.bundle',
 *       loadRuntime: () => import('@lynx-js/web-core/client').then(() => {}),
 *     });
 *     // view.reload();  view.dispose();
 */
export { mountLynxView } from './mount-lynx-view';
export type {
  LynxViewHandle,
  LynxViewOptions,
  LynxViewStage,
  LynxViewState,
} from './mount-lynx-view';
export { playAutoGesture } from './auto-gesture';
export type {
  AutoGestureHandle,
  AutoGestureOptions,
  GesturePoint,
  GestureStep,
} from './auto-gesture';
