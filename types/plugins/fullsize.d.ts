/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { IViewBased } from "../modules/view/type";
/**
 * Fullsize plugin
 *
 * @module Fullsize
 */
/**
 * @property{boolean} fullsize=false true Editor toWYSIWYG open toWYSIWYG full screen
 * @property{boolean} globalFullsize=true if true, after `fullsize` -  all editors element get jodit_fullsize_box class (z-index: 100000 !important;)
 * @example
  * ```javascript
 * var editor = new jodit({
 *     fullsize: true // fullsize editor
 * });
 * ```
 * @example
 * ```javascript
 * var editor = new Jodit();
 * editor.events.fire('toggleFullSize');
 * editor.events.fire('toggleFullSize', true); // fullsize
 * editor.events.fire('toggleFullSize', false); // usual mode
 * ```
 */
declare module "../Config" {
    interface Config {
        fullsize: boolean;
        globalFullsize: boolean;
    }
}
/**
 * Process `toggleFullSize` event, and behavior - set/unset fullsize mode
 *
 * @param {Jodit} editor
 */
export declare function fullsize(editor: IViewBased): void;
