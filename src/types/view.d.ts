/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { EventsNative } from '../modules/events/eventsNative';
import { ToolbarCollection } from '../modules/toolbar/collection';
import { Buttons, Controls } from './toolbar';
import { IDictionary } from './types';
import { Create } from '../modules';

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
    controls?: Controls;
}

interface IViewBased extends IPanel{
    /**
     * @property {string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    id: string;

    buffer: IDictionary;

    progress_bar: HTMLElement;

    options: IViewOptions;

    events: EventsNative;
    create: Create;

    i18n: (text: string, ...params: Array<string | number>) => string;

    defaultTimeout: number

    iframe?: HTMLIFrameElement | null;
}

export interface IPanel {
    container: HTMLDivElement;
    create: Create;

    ownerDocument: Document;
    ownerWindow: Window;

    isLockedNotBy(name: string): boolean;
    isLocked(): boolean;

    lock(name: string): boolean;
    unlock(): boolean;

    isFullSize: () => boolean;
    toggleFullSize(isFullSize?: boolean): void;
}