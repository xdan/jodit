/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import {
    IControlTypeStrong,
    IToolbarButton,
    IToolbarCollection,
} from '../../types/toolbar';
import { Dom } from '../Dom';
import { asArray, camelCase } from '../helpers/';
import { ToolbarElement } from './element';
import { PopupList } from '../popup/list';
import { Popup } from '../popup/popup';
import { ToolbarTooltip } from './tooltip';
import { IViewBased } from '../../types';
import { isJoditObject } from '../helpers/checker/isJoditObject';

export class ToolbarButton extends ToolbarElement implements IToolbarButton {
    set disable(disable: boolean) {
        this.__disabled = disable;
        this.container.classList.toggle('jodit_disabled', disable);

        if (!disable) {
            if (this.container.hasAttribute('disabled')) {
                this.container.removeAttribute('disabled');
            }
        } else {
            if (!this.container.hasAttribute('disabled')) {
                this.container.setAttribute('disabled', 'disabled');
            }
        }
    }

    get disable(): boolean {
        return this.__disabled;
    }

    set active(enable: boolean) {
        this.__actived = enable;
        this.container.classList.toggle('jodit_active', enable);
    }

    get active(): boolean {
        return this.__actived;
    }

    private __disabled: boolean = false;

    private __actived: boolean = false;

    private tooltip: ToolbarTooltip;

    readonly control: IControlTypeStrong;
    readonly target: HTMLElement | undefined;

    textBox: HTMLSpanElement;
    anchor: HTMLAnchorElement;

    isDisable(): boolean {
        return Boolean(
            this.parentToolbar && this.parentToolbar.buttonIsDisabled(this)
        );
    }

    isActive(): boolean {
        return Boolean(
            this.parentToolbar && this.parentToolbar.buttonIsActive(this)
        );
    }

    private onMouseDown = (originalEvent: MouseEvent): false | void => {
        originalEvent.stopImmediatePropagation();
        originalEvent.preventDefault();

        if (this.disable) {
            return false;
        }

        const control: IControlTypeStrong = this.control,
            getTarget = (): Node | false =>
                (this.parentToolbar && this.parentToolbar.getTarget(this)) ||
                this.target ||
                false;

        if (control.list) {
            const list: PopupList = new PopupList(
                this.jodit,
                this.container,
                this.target
            );

            list.open(control);
            this.jodit.events.fire('closeAllPopups', list.container);
        } else if (
            control.exec !== undefined &&
            typeof control.exec === 'function'
        ) {
            control.exec(this.jodit, getTarget(), control, originalEvent, this
                .container as HTMLLIElement);

            this.jodit.events.fire('synchro');

            if (this.parentToolbar) {
                this.parentToolbar.immedateCheckActiveButtons();
            }

            /**
             * Fired after calling `button.exec` function
             * @event afterExec
             */
            this.jodit.events.fire('closeAllPopups afterExec');
        } else if (
            control.popup !== undefined &&
            typeof control.popup === 'function'
        ) {
            const popup: Popup = new Popup(
                this.jodit,
                this.container,
                this.target
            );

            if (
                this.jodit.events.fire(
                    camelCase('before-' + control.name + '-OpenPopup'),
                    getTarget(),
                    control,
                    popup
                ) !== false
            ) {
                const popupElm = control.popup(
                    this.jodit,
                    getTarget(),
                    control,
                    popup.close,
                    this
                );

                if (popupElm) {
                    popup.open(popupElm);
                }
            }
            /**
             * Fired after popup was opened for some control button
             * @event after{CONTROLNAME}OpenPopup
             */
            /**
             * Close all opened popups
             *
             * @event closeAllPopups
             */
            this.jodit.events.fire(
                camelCase('after-' + control.name + '-OpenPopup') +
                    ' closeAllPopups',
                popup.container
            );
        } else {
            if (control.command || control.name) {
                if (isJoditObject(this.jodit)) {
                    this.jodit.execCommand(
                        control.command || control.name,
                        (control.args && control.args[0]) || false,
                        (control.args && control.args[1]) || null
                    );
                } else {
                    this.jodit.ownerDocument.execCommand(
                        control.command || control.name,
                        (control.args && control.args[0]) || false,
                        (control.args && control.args[1]) || null
                    );
                }

                this.jodit.events.fire('closeAllPopups');
            }
        }
    };

    constructor(
        parentToolbarOrView: IToolbarCollection | IViewBased,
        control: IControlTypeStrong,
        target?: HTMLElement
    ) {
        super(parentToolbarOrView);

        this.control = control;
        this.target = target;

        this.anchor = this.jodit.create.element('a');
        this.container.appendChild(this.anchor);

        if (this.jodit.options.showTooltip && control.tooltip) {
            if (!this.jodit.options.useNativeTooltip) {
                this.tooltip = new ToolbarTooltip(this);
            } else {
                this.anchor.setAttribute(
                    'title',
                    this.jodit.i18n(control.tooltip) +
                        (control.hotkeys
                            ? '<br>' + asArray(control.hotkeys).join(' ')
                            : '')
                );
            }
        }

        this.textBox = this.jodit.create.span();
        this.anchor.appendChild(this.textBox);

        const clearName: string = control.name.replace(/[^a-zA-Z0-9]/g, '_');

        if (control.getContent && typeof control.getContent === 'function') {
            Dom.detach(this.container);
            const content = control.getContent(this.jodit, control, this);
            this.container.appendChild(
                typeof content === 'string'
                    ? this.jodit.create.fromHTML(content)
                    : content
            );
        } else {
            if (control.list && this.anchor) {
                const trigger: HTMLSpanElement = this.jodit.ownerDocument.createElement(
                    'span'
                );
                trigger.classList.add('jodit_with_dropdownlist-trigger');
                this.container.classList.add('jodit_with_dropdownlist');
                this.anchor.appendChild(trigger);
            }

            this.textBox.appendChild(this.createIcon(clearName, control));
        }

        this.container.classList.add('jodit_toolbar_btn-' + clearName);

        if (this.jodit.options.direction) {
            const
                direction = this.jodit.options.direction.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';

            this.container.style.direction = direction;
        }

        if (control.isInput) {
            this.container.classList.add('jodit_toolbar-input');
        } else {
            /**
             * You can emulate click on some button
             *
             * @event click-%buttonName%-btn
             * @example
             * ```javascript
             * var editor = new Jodit('#editor');
             * editor.events.fire('click-image-btn'); // will open Image popup
             * ```
             */

            this.jodit.events
                .on(this.container, 'mousedown touchend', this.onMouseDown)
                .on(`click-${clearName}-btn`, this.onMouseDown);
        }
    }

    destruct() {
        if (this.isDestructed) {
            return;
        }

        this.jodit && this.jodit.events && this.jodit.events.off(this.container);

        super.destruct();

        if (this.tooltip) {
            this.tooltip.destruct();
            delete this.tooltip;
        }
    }
}
