/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Component } from "../Component";
import { IViewBased, IViewOptions } from "./type";
import { EventsNative } from "../EventsNative";
import { ToolbarCollection } from "../toolbar/collection";
export declare class View extends Component implements IViewBased {
    buffer: {
        [key: string]: any;
    };
    progress_bar: HTMLElement;
    container: HTMLDivElement;
    options: IViewOptions;
    events: EventsNative;
    editorDocument: Document;
    editorWindow: Window;
    ownerDocument: Document;
    ownerWindow: Window;
    editor: HTMLElement;
    toolbar: ToolbarCollection;
    getRealMode(): number;
    i18n(text: string): string;
    protected __isFullSize: boolean;
    isFullSize: () => boolean;
    toggleFullSize(isFullSize?: boolean): void;
    constructor(editor?: IViewBased, options?: {});
    destruct(): void;
}
