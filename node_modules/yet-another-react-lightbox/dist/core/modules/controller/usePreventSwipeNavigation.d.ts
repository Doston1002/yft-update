/** prevent browser back/forward navigation on touchpad left/right swipe (especially noticeable in Safari)
 * this has to be done via non-passive native event handler */
export declare function usePreventSwipeNavigation<T extends HTMLElement = HTMLElement>(): (node: T | null) => void;
