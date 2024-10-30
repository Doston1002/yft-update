/// <reference types="react" />
import { ImageSlideProps } from "../../core/index.js";
import { ImageSource, SlideImage } from "../../types.js";
export type ResponsiveImageSlide = Omit<SlideImage, "srcSet"> & {
    srcSet: [ImageSource, ...ImageSource[]];
};
export declare function isResponsiveImageSlide(slide: SlideImage): slide is ResponsiveImageSlide;
export type ResponsiveImageProps = Omit<ImageSlideProps, "slide" | "rect"> & Required<Pick<ImageSlideProps, "rect">> & {
    slide: ResponsiveImageSlide;
};
export declare function ResponsiveImage(props: ResponsiveImageProps): JSX.Element;
