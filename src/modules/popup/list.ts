/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Controls, IControlType, IControlTypeStrong } from '../../types/toolbar';
import { IViewBased } from '../../types/view';
import { each } from '../helpers/';
import { ToolbarButton } from '../toolbar/button';
import { ToolbarCollection } from '../toolbar/collection';
import { Popup } from './popup';
import { Jodit } from '../../Jodit';
import { JoditToolbarCollection } from '../toolbar/joditCollection';

export class PopupList extends Popup {
    private defaultControl = {
        template: (editor: IViewBased, key: string, value: string) =>
            this.jodit.i18n(value),
    };

    protected doClose() {
        if (this.toolbar) {
            this.toolbar.destruct();
        }
    }

    protected doOpen(control: IControlTypeStrong) {
        this.toolbar = this.jodit instanceof Jodit ? new JoditToolbarCollection(this.jodit) : new ToolbarCollection(this.jodit);

        const list: any =
            typeof control.list === 'string'
                ? control.list.split(/[\s,]+/)
                : control.list;

        each(list, (key: number | string, value: string | IControlType) => {
            let button: ToolbarButton,
                controls: Controls | void = this.jodit.options.controls,
                getControl = (key: string): IControlType | void => controls && controls[key];

            if (typeof value === 'string' && getControl(value)) {
                button = new ToolbarButton(
                    this.toolbar,
                    {
                        name: value.toString(),
                        ...getControl(value),
                    },
                    this.current
                ); // list like array {"align": {list: ["left", "right"]}}
            } else if (
                typeof key === 'string' &&
                getControl(key) &&
                typeof value === 'object'
            ) {
                button = new ToolbarButton(
                    this.toolbar,
                    {
                        name: key.toString(),
                        ...getControl(key),
                        ...value,
                    },
                    this.current
                ); // list like object {"align": {list: {"left": {exec: alert}, "right": {}}}}
            } else {
                button = new ToolbarButton(
                    this.toolbar,
                    {
                        name: key.toString(),
                        exec: control.exec,
                        command: control.command,
                        isActive: control.isActiveChild,
                        isDisable: control.isDisableChild,
                        mode: control.mode,
                        args: [
                            (control.args && control.args[0]) || key,
                            (control.args && control.args[1]) || value,
                        ],
                    },
                    this.current
                ); // list like object {"align": {list: {"left": {exec: alert}, "right": {}}}}

                const template =
                    control.template || this.defaultControl.template;

                button.textBox.innerHTML = template(
                    this.jodit,
                    key.toString(),
                    value.toString()
                );
            }

            this.toolbar.appendChild(button);
        });

        this.container.appendChild(this.toolbar.container);
        this.container.style.marginLeft = null;

        this.toolbar.checkActiveButtons();
    }

    public toolbar: ToolbarCollection;

    constructor(
        jodit: IViewBased,
        readonly target: HTMLElement,
        readonly current?: HTMLElement,
        readonly className: string = 'jodit_toolbar_list'
    ) {
        super(jodit, target, current, className);
    }
}
