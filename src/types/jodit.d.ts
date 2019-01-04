/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { IViewWithToolbar } from './view';
import { Config } from '../Config';
import { Observer } from '../modules/observer/observer';
import { Select } from '../modules/Selection';
import { CustomCommand, Modes } from './types';
import { StatusBar } from '../modules/StatusBar';

interface IJodit extends IViewWithToolbar {
    options: Config;
    observer: Observer;
    editor: HTMLElement;

    getNativeEditorValue(): string;
    getEditorValue(removeSelectionMarkers: boolean): string;
    setEditorValue(value?: string): void;
    value: string;

    /**
     * @property {HTMLDocument} editorDocument
     */
    editorDocument: HTMLDocument;

    /**
     * @property {Window} editorWindow
     */
    editorWindow: Window;

    /**
     * @property {Select} selection
     */
    selection: Select;

    /**
     * Return current real work mode. When editor in MODE_SOURCE or MODE_WYSIWYG it will
     * return them, but then editor in MODE_SPLIT it will return MODE_SOURCE if
     * Textarea(CodeMirror) focused or MODE_WYSIWYG otherwise
     *
     * @example
     * ```javascript
     * var editor = new Jodit('#editor');
     * console.log(editor.getRealMode());
     * ```
     */
    getRealMode(): Modes;
    getMode(): Modes;
    isEditorMode(): boolean;
    toggleMode(): void;

    execCommand(
        command: string,
        showUI?: any,
        value?: null | any
    ): any;

    registerCommand(
        commandNameOriginal: string,
        command: CustomCommand<IJodit>
    ): IJodit;

    getEditorText(): string;

    /**
     * workplace It contains source and wysiwyg editors
     */
    workplace: HTMLDivElement;

    statusbar: StatusBar;
}