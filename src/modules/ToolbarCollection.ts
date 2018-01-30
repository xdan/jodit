/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Component} from "./Component";
import {Jodit} from "../Jodit";
import {ControlType} from "./Toolbar";

class ToolbarButton extends Component{
    public container: HTMLElement;


    public parentToolbar: ToolbarCollection | null = null;

    constructor(jodit: Jodit, control: ControlType) {
        super(jodit);
        this.container = jodit.ownerDocument.createElement('li');
    }
}

export class ToolbarCollection extends Component {
    public container: HTMLElement;
    public list: HTMLElement;

    private __buttons: ToolbarButton[] = [];

    constructor(jodit: Jodit) {
        super(jodit);
        this.container = jodit.ownerDocument.createElement('div');
        this.container.classList.add('jodit_toolbar');

        this.list = jodit.ownerDocument.createElement('ul');
        this.list.classList.add('jodit_dropdownlist');

        this.container.appendChild(this.list);
    }

    appendChild(button: ToolbarButton) {
        this.__buttons.push(button);
        button.parentToolbar = this;
        this.container.appendChild(button.container);
    }

    removeChild(button: ToolbarButton) {
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
}