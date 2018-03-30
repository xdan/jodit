/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Component, IViewBased} from './Component';
import {Config} from '../Config'
import {$$, css, debounce, dom, throttle, trim} from "./Helpers";
import {ToolbarIcon} from "./ToolbarCollection";
import {Dialog, Alert, Promt} from "./Dialog";
import {Jodit} from "../Jodit";
/**
 * @property {ImageEditorOptions} imageeditor module's options
 */

type ImageEditorOptions = {
    closeAfterSave: boolean;
    width: string|number;
    height: string|number;
    crop:  boolean;
    resize:  boolean;
    resizeUseRatio:  boolean;
    resizeMinWidth: number;
    resizeMinHeight: number;
    cropUseRatio:  boolean;
    cropDefaultWidth: string|number;
    cropDefaultHeight: string|number;
}

export type ActionBox = {
    action: string,
    box: {
        w: number;
        h: number;
        x?: number;
        y?: number;
    }
};

declare module "../Config" {
    interface Config {
        imageeditor: ImageEditorOptions
    }
}
Config.prototype.imageeditor = {
    /**
     * @property{boolean} imageeditor.closeAfterSave=false Close editor after save image
     */
    closeAfterSave: false,

    /**
     * @property{string|int} imageeditor.width=85% Default dialog width by screen
     */
    width: '85%',

    /**
     * @property{string|int} imageeditor.height=85% Default dialog height by screen
     */
    height: '85%',

    /**
     * @property{boolean} imageeditor.crop=true Show tab cropping
     */
    crop: true,

    /**
     * @property{boolean} imageeditor.resize=true Show tab resizing
     */
    resize: true,

    /**
     * @property{boolean} imageeditor.resizeUseRatio=true Keep aspect ratio on resize
     */
    resizeUseRatio: true,

    /**
     * @property{int} imageeditor.resizeMinWidth=20 minimal width on resize
     */
    resizeMinWidth: 20,

    /**
     * @property{boolean} imageeditor.resizeMinHeight=20 minimal height on resize
     */
    resizeMinHeight: 20,

    /**
     * @property{boolean} imageeditor.cropUseRatio=true Keep aspect ratio on crop
     */
    cropUseRatio: true,

    /**
     * @property{string} imageeditor.cropDefaultWidth=70% In the tab, crop the image is displayed not in real size. Boxing default size for it
     * @property{string} imageeditor.cropDefaultHeight=70%
     */
    cropDefaultWidth: '70%',
    cropDefaultHeight: '70%',
};

/**
 * The module allows you toWYSIWYG edit the image: resize or cut any part of it
 *
 */

export class ImageEditor extends Component{
    options: ImageEditorOptions;
    private resizeUseRatio: boolean = true;
    private cropUseRatio: boolean = true;

    private dialog: Dialog;
    private image: HTMLImageElement;
    private cropImage: HTMLImageElement;
    private clicked = false;
    private target: HTMLElement;

    private start_x: number;
    private start_y: number;
    private top_x: number;
    private top_y: number;


    private width: number;
    private height: number;

    private activeTab: string = 'resize';


    private naturalWidth: number;
    private naturalHeight: number;

    private ratio: number;
    private new_h: number;
    private new_w: number;
    private diff_x: number;
    private diff_y: number;

    private buttons: HTMLElement[];

    private editor: HTMLElement;

    private widthInput: HTMLInputElement;
    private heightInput: HTMLInputElement;

    private resize_box: HTMLElement;
    private crop_box: HTMLElement;
    private sizes: HTMLElement;

    private resizeHandler : HTMLElement;
    private cropHandler: HTMLElement;

    constructor(editor: IViewBased) {
        super(editor);

        this.options = (editor && (<Jodit>editor).options) ? (<Jodit>editor).options.imageeditor : Jodit.defaultOptions.imageeditor;
        this.resizeUseRatio = this.options.resizeUseRatio;
        this.cropUseRatio = this.options.cropUseRatio;
        this.buttons =  [
            dom('<button data-action="reset" type="button" class="jodit_btn">' + ToolbarIcon.getIcon('update') + ' ' + editor.i18n('Reset') + '</button>', editor.ownerDocument),
            dom('<button data-action="save" type="button" class="jodit_btn jodit_btn_success">' + ToolbarIcon.getIcon('save') + ' ' + editor.i18n('Save') + '</button>', editor.ownerDocument),
            dom('<button data-action="saveas" type="button" class="jodit_btn jodit_btn_success">' + ToolbarIcon.getIcon('save') + ' ' + editor.i18n('Save as ...') + '</button>', editor.ownerDocument),
        ];
        this.activeTab = this.options.resize ? 'resize' : 'crop';
        this.editor = dom(
            '<form class="jodit_image_editor jodit_properties">' +
                '<div class="jodit_grid">' +
                    '<div class="jodit_col-lg-3-4">' +
                        (this.options.resize ?
                            '<div class="jodit_image_editor_area jodit_image_editor_area_resize active">\
                                <div class="jodit_image_editor_box"></div>\
                                <div class="jodit_image_editor_resizer">\
                                    <i class="jodit_bottomright"></i>\
                                </div>\
                            </div>' : ''
                        ) +
                        (this.options.crop ?
                            '<div class="jodit_image_editor_area jodit_image_editor_area_crop' + (!this.options.resize ? ' active' : '') + '">\
                                <div class="jodit_image_editor_box">\
                                    <div class="jodit_image_editor_croper">\
                                        <i class="jodit_bottomright"></i>\
                                        <i class="jodit_sizes"></i>\
                                    </div>\
                                </div>\
                            </div>' : ''
                        ) +
                    '</div>' +
                    '<div class="jodit_col-lg-1-4">' +
                        (this.options.resize ?
                        '<div data-area="resize" class="jodit_image_editor_slider active">\
                                <div class="jodit_image_editor_slider-title">' + ToolbarIcon.getIcon('resize') + editor.i18n('Resize') + '</div>\
                                <div class="jodit_image_editor_slider-content">\
                                    <div class="jodit_form_group">\
                                        <label for="jodit_image_editor_width">' + editor.i18n('Width') + '</label>\
                                        <input type="number" class="jodit_image_editor_width"/>\
                                    </div>\
                                    <div class="jodit_form_group">\
                                        <label for="jodit_image_editor_height">' + editor.i18n('Height') + '</label>\
                                        <input type="number" class="jodit_image_editor_height"/>\
                                    </div>\
                                    <div class="jodit_form_group">\
                                        <label>' + editor.i18n('Keep Aspect Ratio') + '</label>\
                                        <div class="jodit_btn_group jodit_btn_radio_group">\
                                            <input ' + (this.resizeUseRatio ? 'checked' : '') + ' type="checkbox" class="jodit_image_editor_keep_spect_ratio"/>\
                                            <button type="button"  data-yes="1" class="jodit_col6 jodit_btn jodit_btn_success ' + (this.resizeUseRatio ? 'active' : '') + '">' + editor.i18n('Yes') + '</button>\
                                            <button type="button" class="jodit_col6 jodit_btn' + (!this.resizeUseRatio ? 'active' : '') + '">' + editor.i18n('No') + '</button>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>' : ''
                         ) +
                        (this.options.crop ?
                        '<div data-area="crop" class="jodit_image_editor_slider' + (!this.options.resize ? ' active' : '') + '">\
                                <div class="jodit_image_editor_slider-title">' + ToolbarIcon.getIcon('crop') + editor.i18n('Crop') + '</div>\
                                <div class="jodit_image_editor_slider-content">\
                                    <div class="jodit_form_group">\
                                        <label>' + editor.i18n('Keep Aspect Ratio') + '</label>\
                                        <div class="jodit_btn_group jodit_btn_radio_group">\
                                            <input ' + (this.cropUseRatio ? 'checked' : '') + ' type="checkbox" class="jodit_image_editor_keep_spect_ratio_crop"/>\
                                            <button type="button" data-yes="1" class="jodit_col6 jodit_btn jodit_btn_success ' + (this.cropUseRatio ? 'active' : '') + '">' + editor.i18n('Yes') + '</button>\
                                            <button type="button" class="jodit_col6 jodit_btn ' + (!this.cropUseRatio ? 'active' : '') + '">' + editor.i18n('No') + '</button>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>' : ''
                        ) +
                    '</div>' +
                '</div>' +
            '</form>', editor.ownerDocument);
        this.widthInput = <HTMLInputElement>this.editor.querySelector('.jodit_image_editor_width');
        this.heightInput = <HTMLInputElement>this.editor.querySelector('.jodit_image_editor_height');

        this.resize_box = <HTMLElement>this.editor.querySelector('.jodit_image_editor_area.jodit_image_editor_area_resize .jodit_image_editor_box');
        this.crop_box = <HTMLElement>this.editor.querySelector('.jodit_image_editor_area.jodit_image_editor_area_crop .jodit_image_editor_box');
        this.sizes = <HTMLElement>this.editor.querySelector('.jodit_image_editor_area.jodit_image_editor_area_crop .jodit_sizes');

        this.resizeHandler = <HTMLElement>this.editor.querySelector('.jodit_image_editor_resizer');
        this.cropHandler = <HTMLElement>this.editor.querySelector('.jodit_image_editor_croper');

        this.dialog = new Dialog(editor);
        this.dialog.setContent(this.editor);

        this.dialog.setSize(this.options.width, this.options.height);
        this.dialog.setTitle(this.buttons);

        this.setHandlers();
    }


    /**
     * Hide image editor
     *
     * @method hide
     */
    hide = () => {
        this.dialog.close();
    };

    private calcValueByPercent =  (value: number|string, percent: string|number): number => {
        let percentStr: string = percent.toString();
        let valueNbr: number = parseFloat(value.toString());
        let match: string[]|null;

        match = /^[\-+]?[0-9]+(px)?$/.exec(percentStr);
        if (match) {
            return parseInt(percentStr, 10);
        }

        match = /^([\-+]?[0-9.]+)%$/.exec(percentStr);

        if (match) {
            return Math.round(valueNbr * (parseFloat(match[1]) / 100));
        }

        return valueNbr || 0;
    };

    private calcCropBox = () => {
        let w = (<HTMLElement>this.crop_box.parentNode).offsetWidth * 0.8,
            h = (<HTMLElement>this.crop_box.parentNode).offsetHeight * 0.8,
            wn: number = w,
            hn: number = h;


        if (w > this.naturalWidth && h >this.naturalHeight) {
            wn = this.naturalWidth;
            hn = this.naturalHeight;
        } else if (this.ratio > w / h) {
            wn = w;
            hn = this.naturalHeight * (w / this.naturalWidth);
        } else {
            wn = this.naturalWidth * (h / this.naturalHeight);
            hn = h;
        }

        css(this.crop_box, {
            width: wn,
            height: hn
        });
    };
    private showCrop = () => {
        if (!this.cropImage) {
            return;
        }

        this.calcCropBox();

        this.new_w = this.calcValueByPercent(this.cropImage.offsetWidth || this.image.offsetWidth, this.options.cropDefaultWidth);

        if (this.cropUseRatio) {
            this.new_h = this.new_w / this.ratio;
        } else {
            this.new_h = this.calcValueByPercent(this.cropImage.offsetHeight || this.image.offsetHeight, this.options.cropDefaultHeight);
        }

        css(this.cropHandler, {
            backgroundImage: 'url(' + this.cropImage.getAttribute('src') + ')',
            width: this.new_w,
            height: this.new_h,
            left: (this.cropImage.offsetWidth || this.image.offsetWidth) / 2 - this.new_w / 2,
            top: (this.cropImage.offsetHeight || this.image.offsetHeight) / 2 - this.new_h / 2
        });

        this.jodit.events.fire(this.cropHandler, 'updatesize');
    };

    private cropBox = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    };
    private updateCropBox =  () => {
        if (!this.cropImage) {
            return;
        }

        let ratioX = this.cropImage.offsetWidth / this.naturalWidth,
            ratioY = this.cropImage.offsetHeight / this.naturalHeight;

        this.cropBox.x = <number>css(this.cropHandler, 'left') / ratioX;
        this.cropBox.y = <number>css(this.cropHandler, 'top') / ratioY;
        this.cropBox.w = this.cropHandler.offsetWidth / ratioX;
        this.cropBox.h = this.cropHandler.offsetHeight / ratioY;

        this.sizes.innerText = this.cropBox.w.toFixed(0) + 'x' + this.cropBox.h.toFixed(0);
    };

    onSave: Function;

    private resizeBox = {
        w: 0,
        h: 0,
    };

    private updateResizeBox = () => {
        this.resizeBox.w = this.image.offsetWidth || this.naturalWidth;
        this.resizeBox.h = this.image.offsetHeight || this.naturalHeight;
    };

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
    open = (url: string, save: (newname: string|void, box: ActionBox, success: Function, failed: (error: Error) => void) => void): Promise<Dialog> => {
        return new Promise((resolve) => {
            let timestamp = (new Date()).getTime();

            this.image = this.jodit.ownerDocument.createElement('img');
            $$('img,.jodit_icon-loader', this.resize_box).forEach((elm: Node) => {
                elm.parentNode && elm.parentNode.removeChild(elm);
            });
            $$('img,.jodit_icon-loader', this.crop_box).forEach((elm: Node) => {
                elm.parentNode && elm.parentNode.removeChild(elm);
            });

            css(this.cropHandler, 'background', 'transparent');

            this.onSave = save;

            this.resize_box.appendChild(dom('<i class="jodit_icon-loader"></i>', this.jodit.ownerDocument));
            this.crop_box.appendChild(dom('<i class="jodit_icon-loader"></i>', this.jodit.ownerDocument));

            if (/\?/.test(url)) {
                url += '&_tst=' + timestamp;
            } else {
                url += '?_tst=' + timestamp;
            }

            this.image.setAttribute('src', url);

            this.dialog.open();
            const onload = () => {
                this.image.removeEventListener("load", onload);
                this.naturalWidth = this.image.naturalWidth;
                this.naturalHeight = this.image.naturalHeight;

                this.widthInput.value = this.naturalWidth.toString();
                this.heightInput.value = this.naturalHeight.toString();

                this.ratio = this.naturalWidth / this.naturalHeight;

                this.resize_box.appendChild(this.image);

                this.cropImage = <HTMLImageElement>this.image.cloneNode();

                this.crop_box.appendChild(this.cropImage);

                $$('.jodit_icon-loader', this.editor).forEach((elm: Node) => {
                    elm.parentNode && elm.parentNode.removeChild(elm);
                });

                if (this.activeTab === 'crop') {
                    this.showCrop();
                }

                this.jodit.events.fire(this.resizeHandler, 'updatesize');
                this.jodit.events.fire(this.cropHandler, 'updatesize');

                this.dialog.setPosition();
                this.jodit.events.fire('afterImageEditor');

                resolve(this.dialog);
            };
            this.image.addEventListener("load", onload);
            if (this.image.complete) {
                onload();
            }
        });
    };

    private setHandlers = () => {
        const self: ImageEditor = this;
        self.jodit.events
            .on(<HTMLElement[]>[self.editor.querySelector('.jodit_bottomright'), self.cropHandler], 'mousedown', (e: MouseEvent) => {
                self.target = <HTMLElement>e.target || <HTMLElement>e.srcElement;

                e.preventDefault();
                e.stopImmediatePropagation();

                self.clicked = true;

                self.start_x = e.clientX;
                self.start_y = e.clientY;

                if (self.activeTab === 'crop') {
                    self.top_x = <number>css(self.cropHandler, 'left');
                    self.top_y = <number>css(self.cropHandler, 'top');
                    self.width = self.cropHandler.offsetWidth;
                    self.height = self.cropHandler.offsetHeight;
                } else {
                    self.width = self.image.offsetWidth;
                    self.height = self.image.offsetHeight;
                }
            })
            .off(this.jodit.ownerWindow, '.jodit_image_editor' + self.jodit.id)
            .on(this.jodit.ownerWindow, 'mousemove.jodit_image_editor' + self.jodit.id, throttle((e: MouseEvent) => {
                if (self.clicked) {
                    self.diff_x = e.clientX - self.start_x;
                    self.diff_y = e.clientY - self.start_y;

                    if ((self.activeTab === 'resize' && self.resizeUseRatio) || (self.activeTab === 'crop' && self.cropUseRatio)) {
                        if (self.diff_x) {
                            self.new_w = self.width + self.diff_x;
                            self.new_h = Math.round(self.new_w / self.ratio);
                        } else {
                            self.new_h = self.height + self.diff_y;
                            self.new_w = Math.round(self.new_h * self.ratio);
                        }
                    } else {
                        self.new_w = self.width + self.diff_x;
                        self.new_h = self.height + self.diff_y;
                    }

                    if (self.activeTab === 'resize') {
                        if (self.new_w > self.options.resizeMinWidth) {
                            css(self.image, 'width', self.new_w + 'px');
                            self.widthInput.value = self.new_w.toString();
                        }

                        if (self.new_h > self.options.resizeMinHeight) {
                            css(self.image, 'height', self.new_h + 'px');
                            self.heightInput.value = self.new_h.toString();
                        }

                        this.jodit.events.fire(self.resizeHandler, 'updatesize');
                    } else {
                        if (self.target !== self.cropHandler) {
                            if (self.top_x + self.new_w > self.cropImage.offsetWidth) {
                                self.new_w = self.cropImage.offsetWidth - self.top_x;
                            }
                            if (self.top_y + self.new_h > self.cropImage.offsetHeight) {
                                self.new_h = self.cropImage.offsetHeight - self.top_y;
                            }
                            css(self.cropHandler, {
                                width: self.new_w,
                                height: self.new_h
                            });
                        } else {
                            if (self.top_x + self.diff_x + self.cropHandler.offsetWidth > self.cropImage.offsetWidth) {
                                self.diff_x = self.cropImage.offsetWidth - self.top_x - self.cropHandler.offsetWidth;
                            }
                            css(self.cropHandler, 'left', self.top_x + self.diff_x);
                            if (self.top_y + self.diff_y + self.cropHandler.offsetHeight > self.cropImage.offsetHeight) {
                                self.diff_y = self.cropImage.offsetHeight - self.top_y - self.cropHandler.offsetHeight;
                            }
                            css(self.cropHandler, 'top', self.top_y + self.diff_y);
                        }
                        this.jodit.events.fire(self.cropHandler, 'updatesize');
                    }

                    e.stopImmediatePropagation();
                }
            }, 5))

            .on(this.jodit.ownerWindow, 'resize.jodit_image_editor' + self.jodit.id, () => {
                this.jodit.events.fire(self.resizeHandler, 'updatesize');
                self.showCrop();
                this.jodit.events.fire(self.cropHandler, 'updatesize');
            })
            .on(this.jodit.ownerWindow, 'mouseup.jodit_image_editor' + self.jodit.id + ' keydown.jodit_image_editor' + self.jodit.id, (e: MouseEvent) => {
                if (self.clicked) {
                    self.clicked = false;
                    e.stopImmediatePropagation();
                }
            });

        // btn group

        $$('.jodit_btn_group', self.editor).forEach((group) => {
            const input: HTMLInputElement =  <HTMLInputElement>group.querySelector('input');
            self.jodit.events.on(group, 'click change', function (this: HTMLButtonElement) {
                let button: HTMLButtonElement = <HTMLButtonElement>this;
                $$('button', group).forEach((button: HTMLElement) => button.classList.remove('active'));
                button.classList.add('active');
                input.checked = !!button.getAttribute('data-yes');
                self.jodit.events.fire(input, 'change');
            }, 'button');
        });

        self.jodit.events
            .on(this.editor, 'click', function (this: HTMLElement) {
                $$('.jodit_image_editor_slider,.jodit_image_editor_area', self.editor).forEach(elm => elm.classList.remove('active'));
                const slide: HTMLElement = <HTMLElement>this.parentNode;
                slide.classList.add('active');
                self.activeTab = slide.getAttribute('data-area') || '';

                const tab: HTMLDivElement|null =  self.editor.querySelector('.jodit_image_editor_area.jodit_image_editor_area_' + self.activeTab);
                if (tab) {
                    tab.classList.add('active');
                }

                if (self.activeTab === 'crop') {
                    self.showCrop();
                }
            }, '.jodit_image_editor_slider-title')
            .on(self.widthInput, 'change mousedown keydown', debounce(() => {
                const value: number = parseInt(self.widthInput.value, 10);
                let another: number;
                if (value > self.jodit.options.resizer.min_width) {
                    css(self.image, 'width', value + 'px');
                    if (self.resizeUseRatio) {
                        another = Math.round(value / self.ratio);
                        if (another > self.jodit.options.resizer.min_height) {
                            css(self.image, 'height', another + 'px');
                            self.heightInput.value = another.toString();
                        }
                    }
                }
                this.jodit.events.fire(self.resizeHandler, 'updatesize');
            }, 200))
            .on(self.heightInput, 'change mousedown keydown', debounce(() => {
                const value: number = parseInt(self.heightInput.value, 10);
                let another: number;
                if (value > self.jodit.options.resizer.min_height) {
                    css(self.image, 'height', value + 'px');
                    if (self.resizeUseRatio) {
                        another = Math.round(value * self.ratio);
                        if (another > self.jodit.options.resizer.min_width) {
                            css(self.image, 'width', another + 'px');
                            self.widthInput.value  = another.toString();
                        }
                    }
                }
                this.jodit.events.fire(self.resizeHandler, 'updatesize');
            }, 200));

        const rationResizeButton: HTMLInputElement|null = self.editor.querySelector('.jodit_image_editor_keep_spect_ratio');
        if (rationResizeButton) {
            rationResizeButton.addEventListener('change', () => {
                self.resizeUseRatio = rationResizeButton.checked;
            });
        }
        // use ratio
        const rationCropButton: HTMLInputElement|null = self.editor.querySelector('.jodit_image_editor_keep_spect_ratio_crop');
        if (rationCropButton) {
            rationCropButton.addEventListener('change', () => {
                self.cropUseRatio = rationCropButton.checked;
            });
        }

        self.jodit.events
            .on(self.resizeHandler, 'updatesize', () => {
                css(self.resizeHandler, {
                    top: 0,
                    left: 0,
                    width: (self.image.offsetWidth || self.naturalWidth) + 'px',
                    height: (self.image.offsetHeight || self.naturalHeight) + 'px'
                });

                this.updateResizeBox();
            })
            .on(self.cropHandler, 'updatesize', () => {
                if (!self.cropImage) {
                    return;
                }

                let new_x: number = <number>css(self.cropHandler, 'left'),
                    new_y: number = <number>css(self.cropHandler, 'top'),
                    new_width = self.cropHandler.offsetWidth,
                    new_height = self.cropHandler.offsetHeight;

                if (new_x < 0) {
                    new_x = 0;
                }
                if (new_y < 0) {
                    new_y = 0;
                }

                if (new_x + new_width > self.cropImage.offsetWidth) {
                    new_width = self.cropImage.offsetWidth - new_x;
                    if (self.cropUseRatio) {
                        new_height = new_width / self.ratio;
                    }
                }

                if (new_y + new_height > self.cropImage.offsetHeight) {
                    new_height = self.cropImage.offsetHeight - new_y;
                    if (self.cropUseRatio) {
                        new_width = new_height * self.ratio;
                    }
                }

                css(self.cropHandler, {
                    width: new_width,
                    height: new_height,
                    left: new_x,
                    top: new_y,
                    backgroundPosition: (-new_x - 1) + 'px ' + (-new_y - 1) + 'px',
                    backgroundSize: self.cropImage.offsetWidth + 'px ' + self.cropImage.offsetHeight + 'px'
                });

                self.updateCropBox();
            });

        self.buttons.forEach((button) => {
            button.addEventListener('mousedown', (e) => {
                e.stopImmediatePropagation();
            });
            button.addEventListener('click', () => {
                let data = <ActionBox> {
                    action: self.activeTab,
                    box: self.activeTab === 'resize' ? self.resizeBox : self.cropBox
                };

                switch (button.getAttribute('data-action')) {
                    case 'saveas':
                        Promt(self.jodit.i18n('Enter new name'), self.jodit.i18n('Save in new file'), (name: string): false | void => {
                            if (!trim(name)) {
                                Alert(self.jodit.i18n('The name should not be empty'));
                                return false;
                            }
                            self.onSave(name, data, self.hide, (message: string) => {
                                Alert(message);
                            });
                        });
                        break;
                    case 'save':
                        self.onSave(undefined, data, self.hide, (message: string) => {
                            Alert(message);
                        });
                        break;
                    case 'reset':
                        if (self.activeTab === 'resize') {
                            css(self.image, {
                                width: null,
                                height: null,
                            });
                            self.widthInput.value = self.naturalWidth.toString();
                            self.heightInput.value = self.naturalHeight.toString();
                            self.jodit.events.fire(self.resizeHandler, 'updatesize');
                        } else {
                            self.showCrop();
                        }
                        break;
                }
            });
        })
    }
}