/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import * as consts from '../../constants';
import { IDictionary } from '../../types';
import { IControlTypeStrong } from '../../types/toolbar';
import { IViewBased } from '../../types/view';
import { Dom } from '../Dom';
import { asArray, camelCase, css } from '../helpers/';
import { ToolbarElement } from './element';
import { ToolbarList } from './list';
import { ToolbarPopup } from './popup';
import { Tooltip } from './tooltip';

export class ToolbarButton extends ToolbarElement {
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

    get disable() {
        return this.__disabled;
    }

    set active(enable: boolean) {
        this.__actived = enable;
        this.container.classList.toggle('jodit_active', enable);
    }

    get active() {
        return this.__actived;
    }

    private __disabled: boolean = false;

    private __actived: boolean = false;

    private tooltip: Tooltip;

    private checkActiveStatus = (
        cssObject:
            | IDictionary<string | string[]>
            | IDictionary<(editor: IViewBased, value: string) => boolean>,
        node: HTMLElement
    ): boolean => {
        let matches: number = 0,
            total: number = 0;

        Object.keys(cssObject).forEach((cssProperty: string) => {
            const cssValue = cssObject[cssProperty];

            if (typeof cssValue === 'function') {
                if (cssValue(this.jodit, css(node, cssProperty).toString())) {
                    matches += 1;
                }
            } else {
                if (
                    cssValue.indexOf(css(node, cssProperty).toString()) !== -1
                ) {
                    matches += 1;
                }
            }

            total += 1;
        });

        return total === matches;
    };
    public readonly control: IControlTypeStrong;
    public readonly target: HTMLElement | undefined;

    public textBox: HTMLSpanElement;
    public anchor: HTMLAnchorElement;

    public isDisable(): boolean {
        const mode: number =
            this.control === undefined || this.control.mode === undefined
                ? consts.MODE_WYSIWYG
                : this.control.mode;

        if (this.jodit.options.disabled) {
            return true;
        }

        if (
            this.jodit.options.readonly &&
            this.jodit.options.activeButtonsInReadOnly.indexOf(
                this.control.name
            ) === -1
        ) {
            return true;
        }

        let isEnable: boolean =
            mode === consts.MODE_SPLIT || mode === this.jodit.getRealMode();

        if (typeof this.control.isDisable === 'function') {
            isEnable =
                isEnable &&
                !this.control.isDisable(this.jodit, this.control, this);
        }

        return !isEnable;
    }

    public isActive(): boolean {
        if (typeof this.control.isActive === 'function') {
            return this.control.isActive(this.jodit, this.control, this);
        }

        const element: false | Node = this.jodit.selection
            ? this.jodit.selection.current()
            : false;

        if (!element) {
            return false;
        }

        let tags: string[], elm: Node | false, css: IDictionary<string>;

        if (
            this.control.tags ||
            (this.control.options && this.control.options.tags)
        ) {
            tags =
                this.control.tags ||
                (this.control.options && this.control.options.tags);

            elm = element;

            if (
                Dom.up(
                    elm,
                    (node: Node | null): boolean | void => {
                        if (
                            node &&
                            tags.indexOf(node.nodeName.toLowerCase()) !== -1
                        ) {
                            return true;
                        }
                    },
                    this.jodit.editor
                )
            ) {
                return true;
            }
        }

        // activate by supposed css
        if (
            this.control.css ||
            (this.control.options && this.control.options.css)
        ) {
            css =
                this.control.css ||
                (this.control.options && this.control.options.css);

            elm = element;
            if (
                Dom.up(
                    elm,
                    (node: Node | null): boolean | void => {
                        if (node && node.nodeType !== Node.TEXT_NODE) {
                            return this.checkActiveStatus(
                                css,
                                node as HTMLElement
                            );
                        }
                    },
                    this.jodit.editor
                )
            ) {
                return true;
            }
        }

        return false;
    }

    public destruct() {
        super.destruct();
        this.jodit.events.off(this.container);
    }

    public onMouseDown = (originalEvent: MouseEvent): false | void => {
        originalEvent.stopImmediatePropagation();
        originalEvent.preventDefault();

        if (this.disable) {
            return false;
        }

        const control: IControlTypeStrong = this.control;

        if (control.list) {
            const list: ToolbarList = new ToolbarList(
                this.jodit,
                this.container,
                this.target
            );

            list.parentToolbar = this.parentToolbar;

            list.open(control);
            this.jodit.events.fire('closeAllPopups', list.container);
        } else if (
            control.exec !== undefined &&
            typeof control.exec === 'function'
        ) {
            control.exec(
                this.jodit,
                this.target ||
                    (this.jodit.selection
                        ? this.jodit.selection.current()
                        : false),
                control,
                originalEvent,
                this.container as HTMLLIElement
            );

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
            const popup: ToolbarPopup = new ToolbarPopup(
                this.jodit,
                this.container,
                this.target
            );

            popup.parentToolbar = this.parentToolbar;

            if (
                this.jodit.events.fire(
                    camelCase('before-' + control.name + '-OpenPopup'),
                    this.target ||
                        (this.jodit.selection
                            ? this.jodit.selection.current()
                            : false),
                    control,
                    popup
                ) !== false
            ) {
                popup.open(
                    control.popup(
                        this.jodit,
                        this.target ||
                            (this.jodit.selection
                                ? this.jodit.selection.current()
                                : false),
                        control,
                        popup.close,
                        this
                    )
                );
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
                this.jodit.execCommand(
                    control.command || control.name,
                    (control.args && control.args[0]) || false,
                    (control.args && control.args[1]) || null
                );
                this.jodit.events.fire('closeAllPopups');
            }
        }
    };
    constructor(
        jodit: IViewBased,
        control: IControlTypeStrong,
        target?: HTMLElement
    ) {
        super(jodit);

        this.control = control;
        this.target = target;

        this.anchor = this.jodit.ownerDocument.createElement('a');
        this.container.appendChild(this.anchor);

        if (jodit.options.showTooltip && control.tooltip) {
            if (!jodit.options.useNativeTooltip) {
                this.tooltip = new Tooltip(this);
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

        this.textBox = this.jodit.ownerDocument.createElement('span');
        this.anchor.appendChild(this.textBox);

        const clearName: string = control.name.replace(/[^a-zA-Z0-9]/g, '_');

        if (control.getContent && typeof control.getContent === 'function') {
            Dom.detach(this.container);
            this.container.appendChild(
                dom(
                    control.getContent(this.jodit, control, this),
                    this.jodit.ownerDocument
                )
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
}
