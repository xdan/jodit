/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from "../Jodit";
import {EventsNative} from "./EventsNative";




export interface IViewBased {
    id: string;

    buffer: {[key: string]: any};

    progress_bar: HTMLElement;

    options: {[key: string]: any};

    editorWindow: Window;
    editorDocument: Document;
    ownerDocument: Document;
    ownerWindow: Window;

    editor: HTMLElement;

    events: EventsNative;

    isLocked: () => boolean;
    isFullSize: () => boolean;

    getRealMode: () => number;

    i18n: (text: string, ...params: Array<string|number>) => string;
}


export class Component {

    /**
     * @property{string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    id: string;

    jodit: Jodit;

    constructor(jodit?: IViewBased | Jodit) {
        if (jodit) {
            this.jodit = <Jodit>jodit;
            if (jodit instanceof Jodit && this.jodit.components) {
                this.jodit.components.push(this);
            }
        }
    }

    protected __whoLocked: string | false = '';

    isLocked = (): boolean => {
        return this.__whoLocked !== '';
    };

    isLockedNotBy = (name: string): boolean => {
        return this.isLocked() && this.__whoLocked !== name;
    };

    destruct() {}

    private __modulesInstances: {[key: string]: Component} = {};

    getInstance(moduleName: string, options?: object): Component {
        if (Jodit.modules[moduleName] === undefined) {
            throw new Error('Need real module name')
        }

        if (this.__modulesInstances[moduleName] === undefined) {
            this.__modulesInstances[moduleName] = new Jodit.modules[moduleName](this, options);
        }

        return this.__modulesInstances[moduleName];
    }

    protected __isFullSize: boolean = false;
    isFullSize = (): boolean => this.__isFullSize;
}