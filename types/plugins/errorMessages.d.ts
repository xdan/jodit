/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
declare module "../Config" {
    interface Config {
        showMessageErrors: boolean;
        showMessageErrorTime: number;
        showMessageErrorOffsetPx: number;
    }
}
/**
 * Plugin toWYSIWYG display pop-up messages in the lower right corner of the editor
 */
export declare function errorMessages(editor: Jodit): void;
