export var SwipeState;
(function (SwipeState) {
    SwipeState[SwipeState["NONE"] = 0] = "NONE";
    SwipeState[SwipeState["SWIPE"] = 1] = "SWIPE";
    SwipeState[SwipeState["ANIMATION"] = 2] = "ANIMATION";
})(SwipeState || (SwipeState = {}));
export * from "./usePointerSwipe.js";
export * from "./usePreventSwipeNavigation.js";
export * from "./useWheelSwipe.js";
