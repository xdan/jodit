/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
declare module "../Config" {
    interface Config {
        /**
         * Mobile timeout for CLICK emulation
         */
        mobileTapTimeout: number;
        toolbarAdaptive: boolean;
    }
}
/**
 * Rebuild toolbar in depends of editor's width
 */
export declare function mobile(editor: Jodit): void;
