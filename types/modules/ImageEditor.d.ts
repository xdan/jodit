/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Dialog } from "./Dialog";
import { IViewBased } from "./view/type";
import { Component } from "./Component";
/**
 * @property {ImageEditorOptions} imageeditor module's options
 */
type ImageEditorOptions = {
    closeAfterSave: boolean;
    width: string | number;
    height: string | number;
    crop: boolean;
    resize: boolean;
    resizeUseRatio: boolean;
    resizeMinWidth: number;
    resizeMinHeight: number;
    cropUseRatio: boolean;
    cropDefaultWidth: string | number;
    cropDefaultHeight: string | number;
};
export declare type ActionBox = {
    action: string;
    box: {
        w: number;
        h: number;
        x?: number;
        y?: number;
    };
};
declare module "../Config" {
    interface Config {
        imageeditor: ImageEditorOptions;
    }
}
/**
 * The module allows you toWYSIWYG edit the image: resize or cut any part of it
 *
 */
export declare class ImageEditor extends Component {
    options: ImageEditorOptions;
    private resizeUseRatio;
    private cropUseRatio;
    private dialog;
    private image;
    private cropImage;
    private clicked;
    private target;
    private start_x;
    private start_y;
    private top_x;
    private top_y;
    private width;
    private height;
    private activeTab;
    private naturalWidth;
    private naturalHeight;
    private ratio;
    private new_h;
    private new_w;
    private diff_x;
    private diff_y;
    private buttons;
    private editor;
    private widthInput;
    private heightInput;
    private resize_box;
    private crop_box;
    private sizes;
    private resizeHandler;
    private cropHandler;
    constructor(editor: IViewBased);
    /**
     * Hide image editor
     *
     * @method hide
     */
    hide: () => void;
    private calcValueByPercent;
    private calcCropBox;
    private showCrop;
    private cropBox;
    private updateCropBox;
    onSave: Function;
    private resizeBox;
    private updateResizeBox;
    /**
     * Open image editor
     *
     * @method open
     * @param {string} url
     * @param {function} save
     * @param {string} [save.name] new filename
     * @param {object} save.data Bound box for resize and crop operation
     * @param {string} save.data.action resize or crop
     * @param {object} save.data.box Bound box
     * @param {function} save.success called after success operation
     * @param {function} save.failed called after failed operation
     * @example
     * ```javascript
     * var jodit = new Jodit('.editor', {
     *     imageeditor: {
     *         crop: false,
     *         closeAfterSave: true,
     *         width: 500
     *     }
     * });
     * jodit.imageeditor.open('http://xdsoft.net/jodit/images/test.png', function (name, data, success, failed) {
     *     var img = jodit.node.create('img');
     *     img.setAttribute('src', 'http://xdsoft.net/jodit/images/test.png');
     *     if (box.action !== 'resize') {
     *          return failed('Sorry it is work only in resize mode. For croping use FileBrowser');
     *     }
     *     img.style.width = data.w;
     *     img.style.height = data.h;
     *     jodit.selection.insertNode(img);
     *     success();
     * });
     * ```
     */
    open: (url: string, save: (newname: string | void, box: ActionBox, success: Function, failed: (error: Error) => void) => void) => Promise<Dialog>;
    private setHandlers;
}
export {};
