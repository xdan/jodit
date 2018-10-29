/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
declare module "../Config" {
    interface Config {
        specialCharacters: string[];
        usePopupForSpecialCharacters: boolean;
    }
}
/**
 * The plugin inserts characters that are not part of the standard keyboard.
 */
export declare class symbols {
    private countInRow;
    constructor(editor: Jodit);
}
