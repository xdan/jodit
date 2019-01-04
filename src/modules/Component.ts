/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Jodit } from '../Jodit';
import { IViewBased } from '../types/view';
import { IComponent } from '../types';

export abstract class Component<T extends IViewBased = IViewBased> implements IComponent {
    public jodit: T;

    /**
     * Editor was destructed
     *
     * @type {boolean}
     */
    public isDestructed: boolean = false;

    abstract destruct(): any;

    constructor(jodit?: T) {
        if (jodit) {
            this.jodit = jodit;

            if (jodit instanceof Jodit && jodit.components) {
                jodit.components.push(this);
            }
        }
    }
}
