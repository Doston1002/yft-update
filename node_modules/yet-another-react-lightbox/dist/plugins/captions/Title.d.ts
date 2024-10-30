/// <reference types="react" />
import { LightboxProps, Slide } from "../../types.js";
export type TitleProps = Pick<LightboxProps, "styles"> & Pick<Slide, "title">;
export declare function Title({ title, styles }: TitleProps): JSX.Element;
