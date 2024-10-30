import * as React from "react";
export type PointerEventType = "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerLeave" | "onPointerCancel";
export type KeyboardEventType = "onKeyDown" | "onKeyUp";
export type WheelEventType = "onWheel";
export type SupportedEventType = PointerEventType | KeyboardEventType | WheelEventType;
export type ReactEventType<T, K> = K extends KeyboardEventType ? React.KeyboardEvent<T> : K extends WheelEventType ? React.WheelEvent<T> : K extends PointerEventType ? React.PointerEvent<T> : never;
export type EventCallback<T, P extends React.PointerEvent<T> | React.KeyboardEvent<T> | React.WheelEvent<T>> = (event: P) => void;
export type SubscribeSensors<T> = <ET extends SupportedEventType>(type: ET, callback: EventCallback<T, ReactEventType<T, ET>>) => () => void;
export type RegisterSensors<T> = Required<Pick<React.HTMLAttributes<T>, PointerEventType>> & Required<Pick<React.HTMLAttributes<T>, KeyboardEventType>> & Required<Pick<React.HTMLAttributes<T>, WheelEventType>>;
export type UseSensors<T> = {
    registerSensors: RegisterSensors<T>;
    subscribeSensors: SubscribeSensors<T>;
};
export declare function useSensors<T extends Element>(): UseSensors<T>;
