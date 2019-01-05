/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import {
    css,
    ctrlKey,
    dataBind,
    setTimeout,
    splitArray,
    throttle,
} from '../modules/helpers/';
import { Plugin } from '../modules/Plugin';
import { Dom } from '../modules/Dom';

declare module '../Config' {
    interface Config {
        draggableTags: string | string[];
    }
}

/**
 * Draggable elements
 */
Config.prototype.draggableTags = ['img', 'a', 'jodit-media', 'jodit'];

/**
 * Process drag and drop image or another element inside the editor
 */
export class DragAndDropElement extends Plugin {
    private dragList: string[] = [];
    private isCopyMode: boolean = false;
    private draggable: HTMLElement | null = null;
    private wasMoved: boolean = false;

    private timeout: number = 0;

    private onDrag = throttle((event: DragEvent) => {
        if (!this.draggable) {
            return;
        }

        this.wasMoved = true;
        this.jodit.events.fire('hidePopup hideResizer');

        if (!this.draggable.parentNode) {
            this.jodit.ownerDocument.body.appendChild(this.draggable);
        }

        css(this.draggable, {
            left: event.clientX + 20,
            top: event.clientY + 20,
        });

        this.jodit.selection.insertCursorAtPoint(event.clientX, event.clientY);
    }, this.jodit.defaultTimeout);

    private onDragStart = (event: DragEvent) => {
        let target: Node | null = event.target as Node,
            last: HTMLElement | null = null;

        if (!this.dragList.length) {
            return;
        }

        do {
            if (this.dragList.indexOf(target.nodeName.toLowerCase()) !== -1) {
                if (
                    !last ||
                    (target.firstChild === last && target.lastChild === last)
                ) {
                    last = target as HTMLElement;
                }
            }

            target = target.parentNode;
        } while (target && target !== this.jodit.editor);

        if (!last) {
            return;
        }

        this.isCopyMode = ctrlKey(event); // we can move only element from editor
        this.onDragEnd();

        this.timeout = setTimeout(
            (lastNode?: HTMLElement) => {
                if (!lastNode) {
                    return;
                }

                this.draggable = lastNode.cloneNode(true) as HTMLElement;

                dataBind(this.draggable, 'target', lastNode);

                css(this.draggable, {
                    'z-index': 100000000000000,
                    'pointer-events': 'none',
                    position: 'fixed',
                    display: 'inlin-block',
                    left: event.clientX,
                    top: event.clientY,
                    width: lastNode.offsetWidth,
                    height: lastNode.offsetHeight,
                });
            },
            this.jodit.defaultTimeout,
            last
        );

        event.preventDefault();
    };

    private onDragEnd = () => {
        window.clearTimeout(this.timeout);

        if (this.draggable) {
            Dom.safeRemove(this.draggable);
            this.draggable = null;
            this.wasMoved = false;
        }
    };

    private onDrop = () => {
        if (!this.draggable || !this.wasMoved) {
            this.onDragEnd();
            return;
        }

        let fragment: HTMLElement = dataBind(this.draggable, 'target');

        this.onDragEnd();

        if (this.isCopyMode) {
            fragment = fragment.cloneNode(true) as HTMLElement;
        }

        this.jodit.selection.insertNode(fragment, true, false);

        if (fragment.nodeName === 'IMG' && this.jodit.events) {
            this.jodit.events.fire('afterInsertImage', fragment);
        }

        this.jodit.events.fire('synchro');
    };

    public afterInit() {
        this.dragList = this.jodit.options.draggableTags
            ? splitArray(this.jodit.options.draggableTags)
                  .filter(item => item)
                  .map((item: string) => item.toLowerCase())
            : [];

        if (!this.dragList.length) {
            return;
        }

        this.jodit.events
            .on(this.jodit.editor, 'mousemove touchmove', this.onDrag)
            .on(
                this.jodit.editor,
                'mousedown touchstart dragstart',
                this.onDragStart
            )
            .on('mouseup touchend', this.onDrop)
            .on(window, 'mouseup touchend', this.onDragEnd);
    }

    public beforeDestruct() {
        this.onDragEnd();
    }
}
