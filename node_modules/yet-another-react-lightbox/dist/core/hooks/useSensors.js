import * as React from "react";
import { EVENT_ON_KEY_DOWN, EVENT_ON_KEY_UP, EVENT_ON_POINTER_CANCEL, EVENT_ON_POINTER_DOWN, EVENT_ON_POINTER_LEAVE, EVENT_ON_POINTER_MOVE, EVENT_ON_POINTER_UP, EVENT_ON_WHEEL, } from "../consts.js";
export function useSensors() {
    const [subscribers] = React.useState({});
    return React.useMemo(() => {
        const notifySubscribers = (type, event) => {
            var _a;
            (_a = subscribers[type]) === null || _a === void 0 ? void 0 : _a.forEach((listener) => {
                if (!event.isPropagationStopped())
                    listener(event);
            });
        };
        return {
            registerSensors: {
                onPointerDown: (event) => notifySubscribers(EVENT_ON_POINTER_DOWN, event),
                onPointerMove: (event) => notifySubscribers(EVENT_ON_POINTER_MOVE, event),
                onPointerUp: (event) => notifySubscribers(EVENT_ON_POINTER_UP, event),
                onPointerLeave: (event) => notifySubscribers(EVENT_ON_POINTER_LEAVE, event),
                onPointerCancel: (event) => notifySubscribers(EVENT_ON_POINTER_CANCEL, event),
                onKeyDown: (event) => notifySubscribers(EVENT_ON_KEY_DOWN, event),
                onKeyUp: (event) => notifySubscribers(EVENT_ON_KEY_UP, event),
                onWheel: (event) => notifySubscribers(EVENT_ON_WHEEL, event),
            },
            subscribeSensors: (type, callback) => {
                if (!subscribers[type]) {
                    subscribers[type] = [];
                }
                subscribers[type].unshift(callback);
                return () => {
                    const listeners = subscribers[type];
                    if (listeners) {
                        listeners.splice(0, listeners.length, ...listeners.filter((el) => el !== callback));
                    }
                };
            },
        };
    }, [subscribers]);
}
