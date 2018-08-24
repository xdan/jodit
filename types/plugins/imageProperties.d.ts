/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
/**
 * Plug-in for image editing window
 *
 */
/**
 * @property{object} image Plugin {@link Image|Image}'s options
 * @property{boolean} image.openOnDblClick=true Open editing dialog after double click on image
 * @property{boolean} image.editSrc=true Show edit 'src' input
 * @property{boolean} image.useImageEditor=true Show crop/resize btn
 * @property{boolean} image.editTitle=true Show edit 'title' input
 * @property{boolean} image.editAlt=true Show edit 'alt' input
 * @property{boolean} image.editLink=true Show edit image link's options
 * @property{boolean} image.editSize=true Show edit image size's inputs
 * @property{boolean} image.editMargins=true Show edit margin inputs
 * @property{boolean} image.editStyle=true Show style edit input
 * @property{boolean} image.editClass=true Show edit classNames input
 * @property{boolean} image.editId=true Show edit ID input
 * @property{boolean} image.editAlign=true Show Alignment selector
 * @property{boolean} image.showPreview=true Show preview image
 * @property{boolean} image.selectImageAfterClose=true Select image after close dialog
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *     image: {
 *         editSrc: false,
 *         editLink: false
 *     }
 * });
 * ```
 */
declare module "../Config" {
    interface Config {
        image: {
            openOnDblClick: boolean;
            editSrc: boolean;
            useImageEditor: boolean;
            editTitle: boolean;
            editAlt: boolean;
            editLink: boolean;
            editSize: boolean;
            editMargins: boolean;
            editBorderRadius: boolean;
            editClass: boolean;
            editStyle: boolean;
            editId: boolean;
            editAlign: boolean;
            showPreview: boolean;
            selectImageAfterClose: boolean;
        };
    }
}
/**
 * Show dialog with image's options
 *
 * @param {Jodit} editor
 */
export declare function imageProperties(editor: Jodit): void;
