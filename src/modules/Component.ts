/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IViewBased } from '../types/view';
import { IComponent } from '../types/types';
import { isJoditObject } from './helpers/checker/isJoditObject';

export abstract class Component<T extends IViewBased = IViewBased>
    implements IComponent<T> {
    public jodit: T;

    /**
     * Editor was destructed
     *
     * @type {boolean}
     */
    public isDestructed: boolean = false;

    abstract destruct(): any;

    constructor(jodit?: T) {
        if (jodit && jodit instanceof Component) {
            this.jodit = jodit;
            if (isJoditObject(jodit)) {
                jodit.components.push(this);
            }
        }
    }
}
