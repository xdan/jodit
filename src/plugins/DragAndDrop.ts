/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */


import {Plugin} from "../modules/Plugin";
import {css, ctrlKey, dataBind, dom, throttle} from "../modules/Helpers";
import {TEXT_HTML, TEXT_PLAIN, URL_LIST} from "../constants";
import {UploaderData} from "../modules/Uploader";
import {Dom} from "../modules/Dom";


/**
 * Process drag and drop image from FileBrowser and movev image inside the editor
 */
export class DragAndDrop extends Plugin {
    private isFragmentFromEditor: boolean = false;
    private isCopyMode: boolean = false;

    private startDragPoint: Point = {x: 0, y: 0};
    private draggable: HTMLElement | null = null;


    private onDragEnd = () => {
        if (this.draggable) {
            this.draggable.parentNode && this.draggable.parentNode.removeChild(this.draggable);
            this.draggable = null;
        }
        this.isCopyMode = false;
    };

    private onDrag = throttle((event: DragEvent) => {
        if (this.draggable) {
            if (!this.draggable.parentNode) {
                this.jodit.ownerDocument.body.appendChild(this.draggable);
            }

            this.jodit.events.fire('hidePopup');

            css(this.draggable, {
                left: event.clientX + 20,
                top: event.clientY + 20,
            });
        }
    }, 10);

    private onDragStart = (event: DragEvent) => {
        let target: HTMLElement = (<HTMLElement>event.target);
        this.onDragEnd(); // remove olddraggable

        this.isFragmentFromEditor = Dom.isOrContains(this.jodit.editor, target, true);
        this.isCopyMode = this.isFragmentFromEditor ? ctrlKey(event) : true; // we can move only element from editor


        this.startDragPoint.x = event.clientX;
        this.startDragPoint.y = event.clientY;

        if (target.nodeType === Node.ELEMENT_NODE && target.matches('.jodit_filebrowser_files_item')) {
            target = <HTMLElement>target.querySelector('img');
        }

        if (target.nodeName === 'IMG') {

            this.draggable =  <HTMLElement>target.cloneNode(true);

            dataBind(this.draggable, 'target', target);

            css(this.draggable, {
                'z-index': 100000000000000,
                position: 'fixed',
                display: 'inlin-block',
                left: this.startDragPoint.x,
                top: this.startDragPoint.y,
                width: target.offsetWidth,
                height: target.offsetHeight,
            });
        }
    };

    private getDataTransfer = (event: DragEvent): DataTransfer => {
        return event.dataTransfer;
    };

    private getText = (event: DragEvent): string | null => {
        const dt: DataTransfer  = this.getDataTransfer(event);
        return dt.getData(TEXT_HTML) || dt.getData(TEXT_PLAIN);
    };

    private onDrop = (event: DragEvent): false | void => {
        if (!event.dataTransfer.files.length) {
            if (!this.isFragmentFromEditor && !this.draggable) {
                this.jodit.events.fire('paste', event);
                event.preventDefault();
                event.stopPropagation();
                return false;
            }

            const sel: Selection = this.jodit.editorWindow.getSelection();
            const range: Range | null = sel.rangeCount ? sel.getRangeAt(0) : null;


            let fragment: DocumentFragment | HTMLElement | null = null;

            if (!this.draggable && range) {
                fragment = this.isCopyMode ? range.cloneContents() : range.extractContents();
            } else if (this.draggable) {
                if (this.isCopyMode) {
                    fragment = this.jodit.editorDocument.createElement('img');
                    fragment.setAttribute('src', this.draggable.getAttribute('data-src') || this.draggable.getAttribute('src') || '');
                } else {
                    fragment = dataBind(this.draggable, 'target');
                }
            } else if (this.getText(event)) {
                fragment = dom(<string>this.getText(event), this.jodit.editorDocument);
            }

            sel.removeAllRanges();

            this.jodit.selection.insertCursorAtPoint(event.clientX, event.clientY);

            if (fragment) {
                this.jodit.selection.insertNode(fragment, false);
            }

            event.preventDefault();
            event.stopPropagation()
        }

        this.isFragmentFromEditor = false;
    };

    afterInit() {
        this.jodit.events
            .on(window, 'dragover', this.onDrag)
            .on([window, this.jodit.editorDocument, this.jodit.editor], 'dragstart', this.onDragStart)
            .on('drop', this.onDrop)
            .on(window, 'dragend drop mouseup', this.onDragEnd)
            // .on('drop', this.onDropImageURLFromFileBrowser)
    }
}