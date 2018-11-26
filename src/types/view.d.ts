/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { EventsNative } from '../modules/EventsNative';
import { ToolbarCollection } from '../modules/toolbar/collection';
import { Buttons } from './toolbar';
import { IDictionary } from './types';

interface IViewOptions {
    removeButtons: string[];
    buttons: Buttons;
    zIndex?: number;
    fullsize?: boolean;
    globalFullsize?: boolean;
    showTooltip?: boolean;
    useNativeTooltip?: boolean;
}

interface IViewBased {
    id: string;

    buffer: IDictionary;

    progress_bar: HTMLElement;
    container: HTMLDivElement;

    options: any;

    editorWindow: Window;
    editorDocument: Document;
    ownerDocument: Document;
    ownerWindow: Window;

    editor: HTMLElement;

    events: EventsNative;

    isLocked: () => boolean;
    isFullSize: () => boolean;

    getRealMode: () => number;

    toolbar: ToolbarCollection;

    i18n: (text: string, ...params: Array<string | number>) => string;
    toggleFullSize(isFullSize?: boolean): void;
}
