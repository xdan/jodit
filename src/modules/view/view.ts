/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IDictionary, IEventsNative } from '../../types';
import { IViewBased, IViewOptions } from '../../types/view';
import { Component } from '../Component';
import { EventsNative } from '../events/eventsNative';
import { Panel } from './panel';

declare let appVersion: string;

export class View extends Panel implements IViewBased {
    /**
     * @property{string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    public id: string;
    public version: string = appVersion; // from webpack.config.js

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
    public progress_bar: HTMLDivElement = this.create.div(
        'jodit_progress_bar',
        this.create.div()
    );

    public options: IViewOptions = {
        removeButtons: [],
        zIndex: 100002,
        fullsize: false,
        showTooltip: true,
        useNativeTooltip: false,
        buttons: [],
        globalFullsize: true,
    };

    public events: IEventsNative;

    public components: any = [];

    i18n(text: string): string {
        return this.jodit && this.jodit !== this
            ? this.jodit.i18n(text)
            : Jodit.prototype.i18n(text);
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
        if (typeof Jodit.modules[moduleName] !== 'function') {
            throw new Error('Need real module name');
        }

        if (this.__modulesInstances[moduleName] === undefined) {
            this.__modulesInstances[moduleName] = new Jodit.modules[moduleName](
                this.jodit || this,
                options
            );
        }

        return this.__modulesInstances[moduleName] as any;
    }

    /**
     * Return current version
     *
     * @method getVersion
     * @return {string}
     */
    public getVersion = (): string => {
        return this.version;
    };

    constructor(jodit?: IViewBased, options?: IViewOptions) {
        super(jodit);

        this.id =
            jodit && jodit.id ? jodit.id : new Date().getTime().toString();

        this.jodit = jodit || this;

        this.events =
            jodit && jodit.events
                ? jodit.events
                : new EventsNative(this.ownerDocument);
        this.buffer = jodit && jodit.buffer ? jodit.buffer : {};


        this.options = { ...this.options, ...options };
    }

    destruct() {
        if (this.isDestructed) {
            return;
        }

        if (this.events) {
            this.events.destruct();
            delete this.events;
        }

        delete this.options;

        super.destruct();
    }
}

import { Jodit } from '../../Jodit';
