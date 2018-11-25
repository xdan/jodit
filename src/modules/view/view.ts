/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { MODE_WYSIWYG } from "../../constants";
import { Jodit } from "../../Jodit";
import {Dictionary} from "../../types";
import { IViewBased, IViewOptions } from "../../types/view";
import { Component } from "../Component";
import { EventsNative } from "../EventsNative";
import { ToolbarCollection } from "../toolbar/collection";

export class View extends Component implements IViewBased {
    public buffer: Dictionary;

    public progress_bar: HTMLElement;
    public container: HTMLDivElement;

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

    public editorDocument: Document = document;
    public editorWindow: Window = window;

    public ownerDocument: Document;
    public ownerWindow: Window;

    public editor: HTMLElement;
    public toolbar: ToolbarCollection;

    protected __isFullSize: boolean = false;

    constructor(editor?: IViewBased, options = {}) {
        super(editor);

        const self: View = this,
            doc: HTMLDocument = editor ? editor.ownerDocument : document;

        self.ownerDocument = doc;
        self.ownerWindow = editor ? editor.ownerWindow : window;

        self.progress_bar = editor ? editor.progress_bar : document.createElement("div");
        self.editor = editor ? editor.editor : document.createElement("div");

        self.events = editor ? editor.events : new EventsNative(doc);
        self.buffer = editor ? editor.buffer : {};

        self.toolbar  = new ToolbarCollection(self);

        self.options = {...self.options, ...options};
    }

    public getRealMode(): number {
        return MODE_WYSIWYG;
    }

    public i18n(text: string) {
        return this.jodit ? this.jodit.i18n(text) : Jodit.prototype.i18n(text);
    }

    public isFullSize = (): boolean => this.__isFullSize;

    public toggleFullSize(isFullSize?: boolean) {
        if (isFullSize === undefined) {
            isFullSize = !this.__isFullSize;
        }

        if (isFullSize === this.__isFullSize) {
            return;
        }

        this.__isFullSize = isFullSize;

        if (this.events) {
            this.events.fire("toggleFullSize", isFullSize);
        }
    }

    public destruct() {
        this.toolbar.destruct();
        super.destruct();
    }
}
