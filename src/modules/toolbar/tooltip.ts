/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { asArray } from '../helpers/Helpers';
import { ToolbarButton } from './button';
import { Dom } from '../Dom';
import {setTimeout} from '../helpers/Helpers';

/**
 * Class create tooltip for buttons in toolbar
 */
export class Tooltip {
    private timeout: number = 0;

    private show = () => {
        const showElement = () => {
                this.button.container.appendChild(this.container);
                const diff: number =
                    this.container.offsetWidth -
                    this.button.container.offsetWidth;
                this.container.style.marginLeft = -diff / 2 + 'px';
            },
            delay: number = this.button.jodit.options.showTooltipDelay;

        this.button.jodit.events.fire('hideTooltip');

        this.timeout = setTimeout(showElement, delay);
    };

    private hide = () => {
        window.clearTimeout(this.timeout);
        Dom.safeRemove(this.container);
    };

    public container: HTMLElement;

    constructor(readonly button: ToolbarButton) {
        if (button.control.tooltip) {
            this.container = button.jodit.ownerDocument.createElement('div');
            this.container.classList.add('jodit_tooltip');
            this.container.innerHTML =
                button.jodit.i18n(button.control.tooltip) +
                (button.control.hotkeys
                    ? '<br>' + asArray(button.control.hotkeys).join(' ')
                    : '');

            button.jodit.events
                .on(button.anchor, 'mouseenter', this.show)
                .on(button.anchor, 'mouseleave', this.hide)
                .on(
                    'change updateToolbar scroll hidePopup closeAllPopups hideTooltip',
                    this.hide
                );
        }
    }
}
