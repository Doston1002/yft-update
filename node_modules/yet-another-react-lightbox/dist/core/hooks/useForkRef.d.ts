import * as React from "react";
export declare function setRef<T>(ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined, value: T | null): void;
export declare function useForkRef<InstanceA, InstanceB>(refA: React.Ref<InstanceA> | null | undefined, refB: React.Ref<InstanceB> | null | undefined): React.Ref<InstanceA & InstanceB> | null;
