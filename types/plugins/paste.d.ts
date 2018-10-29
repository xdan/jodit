/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
/**
 * @property{boolean} askBeforePasteHTML=true Ask before paste HTML in WYSIWYG mode
 */
declare module "../Config" {
    interface Config {
        askBeforePasteHTML: boolean;
        askBeforePasteFromWord: boolean;
        defaultActionOnPaste: string;
    }
}
/**
 * Ask before paste HTML source
 *
 * @module insertHTML
 */
export declare function paste(editor: Jodit): void;
