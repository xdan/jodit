/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Jodit } from "../../Jodit";
import { Bound } from "../../types/types";
import { IViewBased } from "../../types/view";
import { Dom } from "../Dom";
import { css, dom, offset, throttle } from "../Helpers";
import { ToolbarElement } from "./element";

export  class ToolbarPopup extends ToolbarElement {

    public isOpened: boolean = false;
    private calcPosition = throttle(() => {
        if (!this.isOpened) {
            return;
        }

        const popup: HTMLElement = this.getContainer();
        const offsetContainer: Bound = offset(this.jodit.container as HTMLDivElement, this.jodit, this.jodit.ownerDocument, true);

        const offsetPopup: Bound = offset(popup, this.jodit, this.jodit.ownerDocument, true);

        const marginLeft: number = css(popup, "marginLeft") as number || 0;
        offsetPopup.left -= marginLeft;

        let diffLeft: number = marginLeft;
        let width: number | string = "auto";

        if (offsetPopup.left < offsetContainer.left) {
            diffLeft = offsetContainer.left  - offsetPopup.left;
        } else if (offsetPopup.left + offsetPopup.width >= offsetContainer.left + offsetContainer.width) {
            diffLeft =  -((offsetPopup.left + offsetPopup.width) - (offsetContainer.left + offsetContainer.width));
        } else {
            diffLeft = 0;
        }

        if (offsetPopup.width >= offsetContainer.width) {
            diffLeft = offsetContainer.left - offsetPopup.left;
            width = offsetContainer.width;
        }

        if (diffLeft !== marginLeft) {
            try {
                popup.style.setProperty("margin-left", diffLeft + "px", "important");
            } catch (e) {
                popup.style.marginLeft = diffLeft + "px"; // fallback for ie9
            }
        }

        const triangle: HTMLSpanElement | null = popup.querySelector(".jodit_popup_triangle");
        if (triangle) {
            triangle.style.marginLeft = -diffLeft + "px";
        }

        css(popup, "width", width);

        // const popup: HTMLElement = this.container;
        // const offsetConainer: Bound = offset(<HTMLDivElement>this.jodit.container, this.jodit, this.jodit.ownerDocument, true);
        //
        // // css(popup, 'marginLeft', 0);
        // let offsetPopup: Bound = offset(popup, this.jodit, this.jodit.ownerDocument, true);
        // let marginLeft: number = 0;
        // let diffLeft: number = 0;
        //
        // if (offsetPopup.left + offsetPopup.width > offsetConainer.left + offsetConainer.width) {
        //     diffLeft =  -((offsetPopup.left + offsetPopup.width) - (offsetConainer.left + offsetConainer.width));
        //     css(popup, {
        //         marginLeft: diffLeft + marginLeft
        //     });
        //     offsetPopup = offset(popup, this.jodit, this.jodit.ownerDocument, true);
        // }
        //
        // if (offsetPopup.left  < offsetConainer.left) {
        //     if (offsetPopup.left + offsetPopup.width > offsetConainer.left + offsetConainer.width) {
        //         css(popup, {
        //             width: offsetConainer.width
        //         });
        //     } else {
        //         diffLeft = offsetConainer.left  - offsetPopup.left;
        //         css(popup, {
        //             marginLeft: diffLeft  + marginLeft
        //         });
        //     }
        // }
        //
        // if (diffLeft) {
        //     const triangle: HTMLSpanElement | null = popup.querySelector('.jodit_popup_triangle');
        //     if (triangle) {
        //         triangle.style.marginLeft = -diffLeft + 'px';
        //     }
        // }

    }, this.jodit.defaultTimeout);
    constructor(jodit: IViewBased, readonly target: HTMLElement, readonly current?: HTMLElement,  readonly className: string = "jodit_toolbar_popup") {
        super(jodit, "div", className);
        this.container.setAttribute("data-editor_id", jodit.id);

        this.jodit.events
            .on(this.container, "mousedown touchstart touchend", (e: MouseEvent) => {
                e.stopPropagation();
            })
            .on([this.jodit.ownerWindow, this.jodit.events], "resize", this.calcPosition);

    }
    public destruct() {
        this.jodit.events
            .off([this.jodit.ownerWindow, this.jodit.events], "resize", this.calcPosition);
        super.destruct();
    }

    /**
     * @param {HTMLElement} content
     * @param {boolean} [rightAlign=false] Open popup on right side
     * @param {boolean} [noStandartActions=false] No call standarts action
     */
    public open(content: any, rightAlign?: boolean, noStandartActions: boolean = false) {
        // this.jodit.events.fire('beforeOpenPopup closeAllPopups', this, content);
        Jodit.fireEach("beforeOpenPopup closeAllPopups", this, content); // close popups in another editors too

        noStandartActions || this.jodit.events.on("closeAllPopups", this.close);

        this.container.classList.add(this.className + "-open");
        this.doOpen(content);

        this.target.appendChild(this.container);

        if (rightAlign !== undefined) {
            this.container.classList.toggle("jodit_right", rightAlign);
        }

        if (!noStandartActions && this.parentToolbar) {
            this.jodit.events.fire(this.parentToolbar, "afterOpenPopup", this.container);
        }

        this.isOpened = true;

        this.calcPosition();
    }

    public close = (current?: HTMLElement | ToolbarPopup) => {
        if (!this.isOpened) {
            return;
        }

        if (!current || !Dom.isOrContains(this.container, current instanceof ToolbarPopup ? current.target : current)) {
            this.isOpened = false;
            this.jodit.events.off("closeAllPopups", this.close);

            this.doClose();

            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            if (this.jodit.selection) {
                this.jodit.selection.removeMarkers();
            }
        }
    }

    protected doOpen(content: any) {
        if (!content) {
            return;
        }

        Dom.detach(this.container);

        this.container.innerHTML = '<span class="jodit_popup_triangle"></span>';

        this.container.appendChild(dom(content, this.jodit.ownerDocument));

        this.container.style.display = "block";
        this.container.style.marginLeft = null;
    }

    protected getContainer = () => this.container;

    protected doClose() {}
}
