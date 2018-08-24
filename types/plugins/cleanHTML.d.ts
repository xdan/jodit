/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
/**
 * @property {object} cleanHTML {@link cleanHTML|cleanHTML}'s options
 * @property {boolean} cleanHTML.cleanOnPaste=true clean pasted html
 * @property {boolean} cleanHTML.replaceNBSP=true Replace &amp;nbsp; toWYSIWYG plain space
 * @property {boolean} cleanHTML.allowTags=false The allowTags option defines which elements will remain in the edited text when the editor saves. You can use this toWYSIWYG limit the returned HTML toWYSIWYG a subset.
 * @example
 * ```javascript
 * var jodit = new Jodit('#editor', {
 *    cleanHTML: {
 *       cleanOnPaste: false
 *    }
 * });
 ```
 * @example
 * ```javascript
 * var editor = Jodit('#editor', {
 *     cleanHTML: {
 *         allowTags: 'p,a[href],table,tr,td, img[src=1.png]' // allow only <p>,<a>,<table>,<tr>,<td>,<img> tags and for <a> allow only `href` attribute and <img> allow only `src` atrribute == '1.png'
 *     }
 * });
 * editor.value = 'Sorry! <strong>Goodby</strong> <span>mr.</span> <a style="color:red" href="http://xdsoft.net">Freeman</a>';
 * console.log(editor.value); //Sorry! <a href="http://xdsoft.net">Freeman</a>
 * ```
 *
 * @example
 * ```javascript
 * var editor = Jodit('#editor', {
 *     cleanHTML: {
 *         allowTags: {
 *             p: true,
 *             a: {
 *                 href: true
 *             },
 *             table: true,
 *             tr: true,
 *             td: true,
 *             img: {
 *                 src: '1.png'
 *             }
 *         }
 *     }
 * });
 * ```
 */
declare module "../Config" {
    interface Config {
        cleanHTML: {
            timeout: number;
            replaceNBSP: boolean;
            cleanOnPaste: boolean;
            fillEmptyParagraph: boolean;
            removeEmptyElements: boolean;
            replaceOldTags: {
                [key: string]: string;
            } | false;
            allowTags: false | string | {
                [key: string]: string;
            };
            denyTags: false | string | {
                [key: string]: string;
            };
        };
    }
}
/**
 * Clean HTML after removeFormat and insertHorizontalRule command
 */
export declare function cleanHTML(editor: Jodit): void;
