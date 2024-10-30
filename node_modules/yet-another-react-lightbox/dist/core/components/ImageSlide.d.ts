import * as React from "react";
import { ContainerRect, ImageFit, Render, SlideImage } from "../../types.js";
export type ImageSlideProps = {
    slide: SlideImage;
    offset?: number;
    render?: Render;
    rect?: ContainerRect;
    imageFit?: ImageFit;
    onClick?: () => void;
    onLoad?: (image: HTMLImageElement) => void;
    style?: React.CSSProperties;
};
export declare function ImageSlide({ slide: image, offset, render, rect, imageFit, onClick, onLoad, style }: ImageSlideProps): JSX.Element;
