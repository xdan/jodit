/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
declare module "../Config" {
    interface Config {
        iframe: boolean;
        iframeDefaultSrc: string;
        iframeBaseUrl: string;
        iframeStyle: string;
        iframeCSSLinks: string[];
    }
}
/**
 * Iframe plugin - use `iframe` instead of DIV in editor. It can be need when you want attach custom styles in editor in backend of you system
 */
export declare function iframe(editor: Jodit): void;
