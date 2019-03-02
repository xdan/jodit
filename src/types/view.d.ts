/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Buttons, Controls, IToolbarCollection } from './toolbar';
import { IComponent, IDictionary } from './types';
import { ICreate } from './create';
import { IEventsNative } from './events';

interface IViewOptions {
    disabled?: boolean;
    readonly?: boolean;
    iframe?: boolean;

    activeButtonsInReadOnly?: string[];

    removeButtons: string[];
    buttons: Buttons;
    zIndex?: number;
    fullsize?: boolean;
    globalFullsize?: boolean;
    showTooltip?: boolean;
    showTooltipDelay?: number;
    useNativeTooltip?: boolean;
    textIcons?: boolean;
    direction?: string;
    controls?: Controls;
}

interface IPanel extends IComponent {
    container: HTMLElement;
    create: ICreate;

    ownerDocument: Document;
    ownerWindow: Window;

    isLockedNotBy(name: string): boolean;
    isLocked(): boolean;

    lock(name?: string): boolean;
    unlock(): boolean;

    isFullSize: () => boolean;
    toggleFullSize(isFullSize?: boolean): void;
}

interface IViewBased<T = IViewOptions> extends IPanel {
    /**
     * @property {string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    id: string;

    buffer: IDictionary;

    progress_bar: HTMLElement;

    options: T;

    events: IEventsNative;
    create: ICreate;

    i18n: (text: string, ...params: Array<string | number>) => string;

    defaultTimeout: number;

    iframe?: HTMLIFrameElement | null;

    getInstance<T = IComponent>(moduleName: string, options?: object): T;

    getVersion: () => string;

    components: IComponent[];
}

interface IViewWithToolbar<T = IViewOptions> extends IViewBased<T> {
    toolbar: IToolbarCollection;
}
