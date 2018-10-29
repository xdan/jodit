/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
/**
 * Show placeholder
 *
 */
/**
 * @property {boolean} showPlaceholder=true Show placeholder
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *    showPlaceholder: false
 * });
 * ```
 */
declare module "../Config" {
    interface Config {
        showPlaceholder: boolean;
        useInputsPlaceholder: boolean;
        placeholder: string;
    }
}
/**
 * Show placeholder inside empty editor
 *
 * @param {Jodit} editor
 */
export declare function placeholder(this: any, editor: Jodit): void;
