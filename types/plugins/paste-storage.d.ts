/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Plugin } from "../modules/Plugin";
/**
 * Show dialog choose content to paste
 */
export declare class pasteStorage extends Plugin {
    private currentIndex;
    private paste;
    private onKeyDown;
    private selectIndex;
    private showDialog;
    private list;
    private container;
    private listBox;
    private previewBox;
    private dialog;
    private createDialog;
    afterInit(): void;
}
