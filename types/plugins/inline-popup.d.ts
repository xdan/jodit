/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
import { Plugin } from "../modules/Plugin";
import { ControlType } from "../modules/toolbar/type";
declare module "../Config" {
    interface Config {
        popup: {
            [key: string]: Array<ControlType | string>;
        };
        toolbarInline: boolean;
        toolbarInlineDisableFor: string | string[];
    }
}
/**
 * Support inline toolbar
 *
 * @param {Jodit} editor
 */
export declare class inlinePopup extends Plugin {
    private toolbar;
    private popup;
    private target;
    private container;
    constructor(jodit: Jodit);
    isShown: boolean;
    private calcWindSizes;
    private _hiddenClass;
    private calcPosition;
    private isExcludedTarget;
    private __getRect;
    private reCalcPosition;
    private showPopup;
    private hidePopup;
    private isSelectionStarted;
    private onSelectionEnd;
    private isTargetAction;
    /**
     * Popup was opened for some selection text (not for image or link)
     * @type {boolean}
     */
    private isSelectionPopup;
    private onSelectionStart;
    private hideIfCollapsed;
    onChangeSelection: () => void;
    private checkIsTargetEvent;
    afterInit(editor: Jodit): void;
    beforeDestruct(editor: Jodit): void;
}
