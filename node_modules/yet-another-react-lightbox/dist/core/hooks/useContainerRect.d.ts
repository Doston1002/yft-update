import * as React from "react";
import { ContainerRect } from "../../types.js";
export declare function useContainerRect<T extends HTMLElement = HTMLElement>(): {
    setContainerRef: (node: T | null) => void;
    containerRef: React.MutableRefObject<T | null>;
    containerRect: ContainerRect | undefined;
};
