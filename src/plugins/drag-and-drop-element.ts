/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Plugin } from "../modules/Plugin";
import {Dom} from "../modules";
import {css, ctrlKey, dataBind, dom} from "../modules/Helpers";

/**
 * Process drag and drop image or another element inside the editor
 */
export class DragAndDropElement extends Plugin {
    private isCopyMode: boolean = false;
    private dragList: string[] = ['img', 'a'];
    private draggable: HTMLElement | null = null;

    onDragStart = (event: DragEvent) => {
        let
            target: Node | null = <Node>event.target,
            last: HTMLElement | null = null;

        do {
            if (this.dragList.includes(target.nodeName.toLowerCase())) {
                if (!last || (target.firstChild === last && target.lastChild === last)) {
                    last = <HTMLElement>target;
                }
            }

            target = target.parentNode;
        } while (target && target !== this.jodit.editor);

        if (!last) {
            return;
        }

        this.draggable =  <HTMLElement>last.cloneNode(true);

        dataBind(this.draggable, 'target', last);

        css(this.draggable, {
            'z-index': 100000000000000,
            'pointer-events': 'none',
            position: 'fixed',
            display: 'inlin-block',
            left: event.clientX,
            top: event.clientY,
            width: last.offsetWidth,
            height: last.offsetHeight,
        });

        event.preventDefault();
        event.stopPropagation();
    };
    onDrag = (event: DragEvent) => {
        if (!this.draggable) {
            return;
        }

        this.jodit.events.fire('hidePopup hideResizer');

        if (!this.draggable.parentNode) {
            this.jodit.ownerDocument.body.appendChild(this.draggable);
        }

        css(this.draggable, {
            left: event.clientX + 20,
            top: event.clientY + 20,
        });

        this.jodit.selection.insertCursorAtPoint(event.clientX, event.clientY);

        event.preventDefault();
        event.stopPropagation();
    };
    onDragEnd = (event?: DragEvent) => {
        if (this.draggable) {
            this.draggable.parentNode && this.draggable.parentNode.removeChild(this.draggable);
            this.draggable = null;
        }
        this.isCopyMode = false;
    };
    onDrop = (event: DragEvent) => {
        if (!this.draggable) {
            return;
        }

        let fragment: HTMLElement = dataBind(this.draggable, 'target');

        this.onDragEnd();

        if (this.isCopyMode) {
            fragment = <HTMLElement>fragment.cloneNode(true);
        }

        this.jodit.selection.insertNode(fragment, true, false);

        if (fragment.nodeName === 'IMG' && this.jodit.events) {
            this.jodit.events.fire('afterInsertImage', fragment);
        }

        this.jodit.events.fire('synchro');

        event.preventDefault();
        event.stopPropagation()
    };

    afterInit() {
        this.jodit.events
            .on(this.jodit.editor, 'mousemove', this.onDrag)
            .on(this.jodit.editor, 'dragstart mousedown', this.onDragStart)
            .on('drop mouseup', this.onDrop)
            .on(window, 'dragend drop mouseup', this.onDragEnd)
    }

    beforeDestruct() {
        this.onDragEnd();
    }
}