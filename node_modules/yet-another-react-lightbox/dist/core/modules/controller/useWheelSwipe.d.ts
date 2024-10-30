import { UseSensors } from "../../hooks/index.js";
import { SwipeState } from "./index.js";
export declare function useWheelSwipe<T extends Element = Element>(swipeState: SwipeState, subscribeSensors: UseSensors<T>["subscribeSensors"], isSwipeValid: (offset: number) => boolean, containerWidth: number, swipeAnimationDuration: number, onSwipeStart: () => void, onSwipeProgress: (offset: number) => void, onSwipeFinish: (offset: number, duration: number) => void, onSwipeCancel: (offset: number) => void): void;
