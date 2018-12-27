/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Jodit } from '../../Jodit';
import { IDictionary } from '../../types';
import { IViewBased, IViewOptions } from '../../types/view';
import { Component } from '../Component';
import { EventsNative } from '../events/EventsNative';
import { ToolbarCollection } from '../toolbar/collection';
import { Panel } from './panel';

export class View extends Panel implements IViewBased {
    /**
     * @property{string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    public id: string;

    private __modulesInstances: IDictionary<Component> = {};

    /**
     * Return default timeout period in milliseconds for some debounce or throttle functions.
     * By default return {observer.timeout} options
     *
     * @return {number}
     */
    get defaultTimeout(): number {
        return 100;
    }

    /**
     * Some extra data inside editor
     *
     * @type {{}}
     * @see copyformat plugin
     */
    public buffer: IDictionary;

    /**
     * progress_bar Progress bar
     */
    public progress_bar: HTMLDivElement = this.create.div('jodit_progress_bar', this.create.div());

    public options: IViewOptions = {
        removeButtons: [],
        zIndex: 100002,
        fullsize: false,
        showTooltip: true,
        useNativeTooltip: false,
        buttons: [],
        globalFullsize: true,
    };

    public events: EventsNative;

    public toolbar: ToolbarCollection;

    public i18n(text: string) {
        return this.jodit ? this.jodit.i18n(text) : Jodit.prototype.i18n(text);
    }

    /**
     * @override
     * @param isFullSize
     */
    toggleFullSize(isFullSize?: boolean) {
        super.toggleFullSize(isFullSize);

        if (this.events) {
            this.events.fire('toggleFullSize', isFullSize);
        }
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

    public destruct() {
        this.toolbar.destruct();
        this.events.destruct();

        delete this.options;

        super.destruct();
    }

    constructor(jodit?: IViewBased, options = {}) {
        super(jodit);

        this.jodit = jodit || this;

        this.events = (jodit && jodit.events) ? jodit.events : new EventsNative(this.ownerDocument);
        this.buffer = (jodit && jodit.buffer) ? jodit.buffer : {};

        this.toolbar = new ToolbarCollection(this);

        this.options = { ...this.options, ...options };
    }
}
