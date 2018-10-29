/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */


import {Component} from "../Component";
import {IViewBased, IViewOptions} from "./type";
import {EventsNative} from "../EventsNative";
import {ToolbarCollection} from "../toolbar/collection";
import {Jodit} from "../../Jodit";
import {MODE_WYSIWYG} from "../../constants";

export class View extends Component implements IViewBased {
    public buffer: {[key: string]: any};
    progress_bar: HTMLElement;
    container: HTMLDivElement;

    options: IViewOptions = {
        removeButtons: [],
        zIndex: 100002,
        fullsize: false,
        showTooltip: true,
        useNativeTooltip: false,
        buttons: [],
        globalFullsize: true,
    };

    events: EventsNative;

    editorDocument: Document = document;
    editorWindow: Window = window;

    ownerDocument: Document;
    ownerWindow: Window;

    editor: HTMLElement;
    public toolbar: ToolbarCollection;

    getRealMode(): number {
        return MODE_WYSIWYG;
    }

    i18n(text: string) {
        return this.jodit ? this.jodit.i18n(text) : Jodit.prototype.i18n(text);
    }

    protected __isFullSize: boolean = false;

    isFullSize = (): boolean => this.__isFullSize;

    toggleFullSize(isFullSize?: boolean) {
        if (isFullSize === undefined) {
            isFullSize = !this.__isFullSize;
        }

        if (isFullSize === this.__isFullSize) {
            return;
        }

        this.__isFullSize = isFullSize;


        if (this.events) {
            this.events.fire('toggleFullSize', isFullSize);
        }
    }

    constructor(editor?: IViewBased, options = {}) {
        super(editor);

        const self: View = this,
            doc: HTMLDocument = editor ? editor.ownerDocument : document;

        self.ownerDocument = doc;
        self.ownerWindow = editor ? editor.ownerWindow : window;

        self.progress_bar = editor ? editor.progress_bar : document.createElement('div');
        self.editor = editor ? editor.editor : document.createElement('div');

        self.events = editor ? editor.events : new EventsNative(doc);
        self.buffer = editor ? editor.buffer : {};

        self.toolbar  = new ToolbarCollection(self);

        self.options = {...self.options, ...options};
    }
    destruct() {
        this.toolbar.destruct();
        super.destruct();
    }
}