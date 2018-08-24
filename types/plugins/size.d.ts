/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
declare module "../Config" {
    interface Config {
        allowResizeX: boolean;
        allowResizeY: boolean;
    }
}
/**
 * Resize editor
 * @param {Jodit} editor
 */
export declare function size(editor: Jodit): void;
