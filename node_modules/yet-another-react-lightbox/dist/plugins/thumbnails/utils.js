import { composePrefix } from "../../core/utils.js";
import { PLUGIN_THUMBNAILS } from "../../core/consts.js";
export const cssPrefix = (value) => composePrefix(PLUGIN_THUMBNAILS, value);
export const cssThumbnailPrefix = (value) => cssPrefix(composePrefix("thumbnail", value));
