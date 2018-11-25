/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { asArray } from "../Helpers";
import { ToolbarButton } from "./button";

/**
 * Class create tooltip for buttons in toolbar
 */
export class Tooltip {
    public container: HTMLElement;
    private timeout: number = 0;

    constructor(readonly button: ToolbarButton) {
        if (button.control.tooltip) {
            this.container = button.jodit.ownerDocument.createElement("div");
            this.container.classList.add("jodit_tooltip");
            this.container.innerHTML = button.jodit.i18n(button.control.tooltip) + (button.control.hotkeys ? "<br>" + asArray(button.control.hotkeys).join(" ") : "");

            button.jodit.events
                .on(button.anchor, "mouseenter", this.show)
                .on(button.anchor, "mouseleave", this.hide)
                .on("change updateToolbar scroll hidePopup closeAllPopups hideTooltip", this.hide);
        }
    }

    private show = () => {
        const showElement = () => {
                this.button.container.appendChild(this.container);
                const diff: number = this.container.offsetWidth - this.button.container.offsetWidth;
                this.container.style.marginLeft = (-diff / 2) + "px";
            },
            delay: number = this.button.jodit.options.showTooltipDelay;

        this.button.jodit.events.fire("hideTooltip");

        if (delay) {
            this.timeout = window.setTimeout(showElement, delay);
        } else {
            showElement();
        }
    }

    private hide = () => {
        window.clearTimeout(this.timeout);
        this.container.parentNode && this.container.parentNode.removeChild(this.container);
    }
}
