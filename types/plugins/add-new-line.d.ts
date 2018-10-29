/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
declare module "../Config" {
    interface Config {
        addNewLine: boolean;
        addNewLineTagsTriggers: string[];
        addNewLineOnDBLClick: boolean;
    }
}
/**
 * Create helper for adding new paragraph(Jodit.defaultOptions.enter tag) before iframe, table or image
 *
 * @param {Jodit} editor
 */
export declare function addNewLine(editor: Jodit): void;
