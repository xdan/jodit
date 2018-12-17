/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { EventsNative } from '../modules/events/EventsNative';
import { ToolbarCollection } from '../modules/toolbar/collection';
import { Buttons } from './toolbar';
import { IDictionary } from './types';
import { Create } from '../modules';

interface IViewOptions {
    removeButtons: string[];
    buttons: Buttons;
    zIndex?: number;
    fullsize?: boolean;
    globalFullsize?: boolean;
    showTooltip?: boolean;
    useNativeTooltip?: boolean;
}

interface IViewBased extends IPanel{
    buffer: IDictionary;

    progress_bar: HTMLElement;

    options: IDictionary;

    events: EventsNative;
    create: Create;

    toolbar: ToolbarCollection;

    i18n: (text: string, ...params: Array<string | number>) => string;
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