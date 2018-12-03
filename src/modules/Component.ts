/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Jodit } from '../Jodit';
import { IDictionary } from '../types';
import { IViewBased } from '../types/view';

export class Component {
    private __modulesInstances: IDictionary<Component> = {};

    protected __whoLocked: string | false = '';

    /**
     * @property{string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    public id: string;

    public jodit: Jodit;

    /**
     * Editor was destructed
     *
     * @type {boolean}
     */
    public isDestructed: boolean = false;

    public isLocked = (): boolean => {
        return this.__whoLocked !== '';
    };

    public isLockedNotBy = (name: string): boolean => {
        return this.isLocked() && this.__whoLocked !== name;
    };

    public destruct() {
        // ignore
    }

    public getInstance<T = Component>(moduleName: string, options?: object): T {
        if (Jodit.modules[moduleName] === undefined) {
            throw new Error('Need real module name');
        }

        if (this.__modulesInstances[moduleName] === undefined) {
            this.__modulesInstances[moduleName] = new Jodit.modules[moduleName](
                this,
                options
            );
        }

        return this.__modulesInstances[moduleName] as any;
    }

    constructor(jodit?: IViewBased | Jodit) {
        if (jodit) {
            this.jodit = jodit as Jodit;
            if (jodit instanceof Jodit && this.jodit.components) {
                this.jodit.components.push(this);
            }
        }
    }
}
