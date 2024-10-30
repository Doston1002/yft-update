import * as React from "react";
import { useLayoutEffect } from "./useLayoutEffect.js";
export function useEventCallback(fn) {
    const ref = React.useRef(fn);
    useLayoutEffect(() => {
        ref.current = fn;
    });
    return React.useCallback((...args) => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.call(ref, ...args); }, []);
}
