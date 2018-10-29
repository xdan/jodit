/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Plugin } from "../modules/Plugin";
/**
 * Process drag and drop image from FileBrowser and movev image inside the editor
 */
export declare class DragAndDrop extends Plugin {
    private isFragmentFromEditor;
    private isCopyMode;
    private startDragPoint;
    private draggable;
    private onDragEnd;
    private onDrag;
    private bufferRange;
    private onDragStart;
    private getDataTransfer;
    private getText;
    private onDrop;
    afterInit(): void;
    beforeDestruct(): void;
}
