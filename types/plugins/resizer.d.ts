/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
/**
 * The module creates a supporting frame for resizing of the elements img and table
 * @module Resizer
 * @params {Object} parent Jodit main object
 */
/**
 * @property{boolean} useIframeResizer=true Use true frame for editing iframe size
 */
declare module "../Config" {
    interface Config {
        useIframeResizer: boolean;
        useTableResizer: boolean;
        useImageResizer: boolean;
        resizer: {
            showSize: boolean;
            hideSizeTimeout: number;
            min_width: number;
            min_height: number;
        };
    }
}
/**
 * Resize table and img
 * @param {Jodit} editor
 */
export declare function resizer(editor: Jodit): void;
