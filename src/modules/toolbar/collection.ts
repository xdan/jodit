/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {debounce} from "../Helpers";
import {ToolbarElement} from "./element";
import {ToolbarButton} from "./button";
import {Buttons, Controls, ControlType, ControlTypeStrong} from "./type";
import {ToolbarBreak} from "./break";
import {ToolbarSeparator} from "./separator";
import {IViewBased} from "../view/type";
import {Jodit} from "../../Jodit";

export class ToolbarCollection extends ToolbarElement {
    constructor(jodit: IViewBased) {
        super(jodit, 'ul', 'jodit_toolbar');
        this.initEvents();
    }

    private __buttons: ToolbarElement[] = [];
    getButtonsList(): string[] {
        return this.__buttons
            .map((a: ToolbarElement) => a instanceof ToolbarButton ? a.control.name : '')
            .filter(a => a !== '');
    }

    appendChild(button: ToolbarElement) {
        this.__buttons.push(button);
        button.parentToolbar = this;
        this.container.appendChild(button.container);
    }

    removeChild(button: ToolbarElement) {
        const index: number = this.__buttons.indexOf(button);

        if (index !== -1) {
            this.__buttons.splice(index, 1);
            if (button.container.parentNode === this.container) {
                this.container
                    .removeChild(button.container);
            }
        }

        button.parentToolbar = null;
    }

    private __getControlType = (button: ControlType | string) : ControlTypeStrong => {
        let buttonControl: ControlTypeStrong,
            controls: Controls = this.jodit.options.controls || Jodit.defaultOptions.controls;

        if (typeof button !== 'string') {
            buttonControl = {name: 'empty', ...button};
            if (controls[buttonControl.name] !== undefined) {
                buttonControl = {...controls[buttonControl.name], ...buttonControl};
            }
        } else {
            const list: string[] = button.split(/\./);

            let store: {[key: string]: ControlType} = controls;

            if (list.length > 1) {
                if (controls[list[0]] !== undefined) {
                    store = <{[key: string]: ControlType}>controls[list[0]];
                    button = list[1];
                }
            }

            if (store[button] !== undefined) {
                buttonControl = {name: button, ...store[button]};
            } else {
                buttonControl = {
                    name: button,
                    command: button,
                    tooltip: button,
                };
            }
        }

        return buttonControl;
    };


    build(buttons: Buttons, container: HTMLElement, target?: HTMLElement) {
        let lastBtnSeparator: boolean = false;
        this.clear();
        const buttonsList: Array<ControlType | string> = typeof buttons === 'string' ? buttons.split(/[,\s]+/) : buttons;

        buttonsList
            .map(this.__getControlType)
            .forEach((buttonControl: ControlTypeStrong) => {
                let button: ToolbarElement | null = null;

                if (this.jodit.options.removeButtons.indexOf(buttonControl.name) !== -1) {
                    return;
                }

                switch (buttonControl.name) {
                    case "\n":
                        button = new ToolbarBreak(this.jodit);
                        break;
                    case '|':
                        if (!lastBtnSeparator) {
                            lastBtnSeparator = true;
                            button = new ToolbarSeparator(this.jodit);
                        }
                        break;
                    default:
                        lastBtnSeparator = false;
                        button = new ToolbarButton(this.jodit, buttonControl, target);
                }

                if (button) {
                    this.appendChild(button);
                }
            });

        if (this.container.parentNode !== container) {
            container.appendChild(this.container);
        }

        this.immedateCheckActiveButtons();
    }

    clear() {
        // in removeChild __buttons is changed
        [...this.__buttons].forEach((button: ToolbarElement) => {
            this.removeChild(button);
            button.destruct();
        });

        this.__buttons.length = 0;
        // this.container.parentNode && this.container.parentNode.removeChild(this.container);
    }

    immedateCheckActiveButtons = () => {
        if (this.jodit.isLocked()) {
            return;
        }
        (<ToolbarButton[]>this.__buttons.filter((button: ToolbarElement) => button instanceof ToolbarButton))
            .forEach((button: ToolbarButton) => {
                button.disable = button.isDisable();

                if (!button.disable) {
                    button.active = button.isActive();
                }

                if (typeof button.control.getLabel === 'function') {
                    button.control.getLabel(this.jodit, button.control, button);
                }

            });

        this.jodit.events && this.jodit.events
            .fire('updateToolbar');
    };

    checkActiveButtons = debounce(this.immedateCheckActiveButtons, this.jodit.defaultTimeout);

    private closeAll = () => {
        this.jodit.events.fire('closeAllPopups');
    };


    private listenEvents: string = 'changeStack mousedown mouseup keydown change afterInit readonly afterResize selectionchange changeSelection focus afterSetMode touchstart';

    private initEvents = () => {
        this.jodit.events
            .on(this.jodit.ownerWindow, 'mousedown touchend', this.closeAll)
            .on(this.listenEvents, this.checkActiveButtons)
            .on('afterSetMode focus', this.immedateCheckActiveButtons);
    };

    destruct() {
        this.jodit.events
            .off(this.jodit.ownerWindow, 'mousedown touchstart', this.closeAll)
            .off(this.listenEvents, this.checkActiveButtons)
            .off('afterSetMode focus', this.immedateCheckActiveButtons);

        this.clear();
        super.destruct();
    }
}

