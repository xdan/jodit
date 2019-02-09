/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { MODE_SOURCE } from '../constants';
import { Plugin } from '../modules/Plugin';
import { IJodit, markerInfo } from '../types';
import { IControlType } from '../types/toolbar';
import { appendScript, CallbackAndElement } from '../modules/helpers/appendScript';
import { debounce } from '../modules/helpers/async';
import { $$ } from '../modules/helpers/selector';
import { css } from '../modules/helpers/css';
import { Dom } from '../modules/Dom';

declare module '../Config' {
    interface Config {
        /**
         * Use ACE editor instead of usual textarea
         */
        useAceEditor: boolean;

        /**
         * Options for [ace](https://ace.c9.io/#config) editor
         */
        sourceEditorNativeOptions: {
            showGutter: boolean;
            theme: string;
            mode: string;
            wrap: string | boolean | number;
            highlightActiveLine: boolean;
        };
        /**
         * Beautify HTML then it possible
         */
        beautifyHTML: boolean;

        /**
         * CDN URLs for HTML Beautifier
         */
        beautifyHTMLCDNUrlsJS: string[];

        /**
         * CDN URLs for ACE editor
         */
        sourceEditorCDNUrlsJS: string[];
    }
}

Config.prototype.beautifyHTML = true;
Config.prototype.useAceEditor = true;

Config.prototype.sourceEditorNativeOptions = {
    /**
     * Show gutter
     */
    showGutter: true,
    /**
     * Default theme
     */
    theme: 'ace/theme/idle_fingers',

    /**
     * Default mode
     */
    mode: 'ace/mode/html',

    /**
     * Wrap lines. Possible values - "off", 80-100..., true, "free"
     */
    wrap: true,

    /**
     * Highlight active line
     */
    highlightActiveLine: true,
};

Config.prototype.sourceEditorCDNUrlsJS = [
    'https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.3/ace.js',
];

Config.prototype.beautifyHTMLCDNUrlsJS = [
    'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.7.5/beautify.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.7.5/beautify-html.min.js',
];

Config.prototype.controls.source = {
    mode: consts.MODE_SPLIT,

    exec: (editor: IJodit) => {
        editor.toggleMode();
    },

    isActive: (editor: IJodit) => {
        return editor.getRealMode() === consts.MODE_SOURCE;
    },

    tooltip: 'Change mode',
} as IControlType;

/**
 * Plug-in change simple textarea on CodeMirror editor in Source code mode
 *
 * @module source
 */
export class source extends Plugin {
    private className = 'jodit_ace_editor';

    private mirrorContainer: HTMLDivElement;

    private __lock = false;
    private __oldMirrorValue = '';

    private autosize = debounce(() => {
        this.mirror.style.height = 'auto';
        this.mirror.style.height = this.mirror.scrollHeight + 'px';
    }, this.jodit.defaultTimeout);

    private tempMarkerStart = '{start-jodit-selection}';
    private tempMarkerStartReg = /{start-jodit-selection}/g;
    private tempMarkerEnd = '{end-jodit-selection}';
    private tempMarkerEndReg = /{end-jodit-selection}/g;

    private selInfo: markerInfo[] = [];

    private lastTuple: null | CallbackAndElement = null;
    private loadNext = (
        i: number,
        urls: string[],
        eventOnFinalize: false | string = 'aceReady',
        className: string = this.className
    ) => {
        if (
            eventOnFinalize &&
            urls[i] === undefined &&
            !this.isDestructed
        ) {
            this.jodit && this.jodit.events && this.jodit.events.fire(eventOnFinalize);
            this.jodit && this.jodit.events && this.jodit.events.fire(this.jodit.ownerWindow, eventOnFinalize);

            return;
        }

        if (urls[i] !== undefined) {
            if (this.lastTuple) {
                this.lastTuple.element.removeEventListener('load', this.lastTuple.callback);
            }

            this.lastTuple = appendScript(
                urls[i],
                () => {
                    if (!this.isDestructed) {
                        this.loadNext(i + 1, urls, eventOnFinalize, className);
                    }
                },
                className,
                this.jodit.ownerDocument
            );
        }
    };

    private insertHTML = (html: string) => {
        if (this.mirror.selectionStart || this.mirror.selectionStart === 0) {
            const startPos: number = this.mirror.selectionStart,
                endPos: number = this.mirror.selectionEnd;

            this.mirror.value =
                this.mirror.value.substring(0, startPos) +
                html +
                this.mirror.value.substring(endPos, this.mirror.value.length);
        } else {
            this.mirror.value += this.mirror;
        }

        this.toWYSIWYG();
    };

    private fromWYSIWYG = (force: boolean | string = false) => {
        if (!this.__lock || force === true) {
            this.__lock = true;
            const new_value = this.jodit.getEditorValue(false);
            if (new_value !== this.getMirrorValue()) {
                this.setMirrorValue(new_value);
            }
            this.__lock = false;
        }
    };
    private toWYSIWYG = () => {
        if (this.__lock) {
            return;
        }

        const value: string = this.getMirrorValue();

        if (value === this.__oldMirrorValue) {
            return;
        }

        this.__lock = true;
        this.jodit.setEditorValue(value);
        this.__lock = false;
        this.__oldMirrorValue = value;
    };

    private getNormalPosition = (pos: number, str: string): number => {
        let start: number = pos;

        while (start > 0) {
            start--;

            if (
                str[start] === '<' &&
                str[start + 1] !== undefined &&
                str[start + 1].match(/[\w\/]+/i)
            ) {
                return start;
            }
            if (str[start] === '>') {
                return pos;
            }
        }

        return pos;
    };

    private __clear = (str: string): string =>
        str.replace(consts.INVISIBLE_SPACE_REG_EXP, '');

    private selectAll = () => {
        this.mirror.select();
    };
    private onSelectAll = (command: string): void | false => {
        if (
            command.toLowerCase() === 'selectall' &&
            this.jodit.getRealMode() === MODE_SOURCE
        ) {
            this.selectAll();
            return false;
        }
    };

    // override it for ace editors
    private getSelectionStart: () => number = (): number => {
        return this.mirror.selectionStart;
    };
    private getSelectionEnd: () => number = (): number => {
        return this.mirror.selectionEnd;
    };
    private getMirrorValue(): string {
        return this.mirror.value;
    }
    private setMirrorValue(value: string) {
        this.mirror.value = value;
    }
    private setFocusToMirror() {
        this.mirror.focus();
    }

    private saveSelection = () => {
        if (this.jodit.getRealMode() === consts.MODE_WYSIWYG) {
            this.selInfo = this.jodit.selection.save() || [];
            this.jodit.setEditorValue();
            this.fromWYSIWYG(true);
        } else {
            this.selInfo.length = 0;
            const value: string = this.getMirrorValue();
            if (this.getSelectionStart() === this.getSelectionEnd()) {
                const marker: HTMLSpanElement = this.jodit.selection.marker(
                    true
                );
                this.selInfo[0] = {
                    startId: marker.id,
                    collapsed: true,
                    startMarker: marker.outerHTML,
                };
                const selectionStart = this.getNormalPosition(
                    this.getSelectionStart(),
                    this.getMirrorValue()
                );
                this.setMirrorValue(
                    value.substr(0, selectionStart) +
                        this.__clear(this.selInfo[0].startMarker) +
                        value.substr(selectionStart)
                );
            } else {
                const markerStart: HTMLSpanElement = this.jodit.selection.marker(
                    true
                );
                const markerEnd: HTMLSpanElement = this.jodit.selection.marker(
                    false
                );

                this.selInfo[0] = {
                    startId: markerStart.id,
                    endId: markerEnd.id,
                    collapsed: false,
                    startMarker: this.__clear(markerStart.outerHTML),
                    endMarker: this.__clear(markerEnd.outerHTML),
                };

                const selectionStart = this.getNormalPosition(
                    this.getSelectionStart(),
                    value
                );
                const selectionEnd = this.getNormalPosition(
                    this.getSelectionEnd(),
                    value
                );

                this.setMirrorValue(
                    value.substr(0, selectionStart) +
                        this.selInfo[0].startMarker +
                        value.substr(
                            selectionStart,
                            selectionEnd - selectionStart
                        ) +
                        this.selInfo[0].endMarker +
                        value.substr(selectionEnd)
                );
            }
            this.toWYSIWYG();
        }
    };
    private restoreSelection = () => {
        if (!this.selInfo.length) {
            return;
        }

        if (this.jodit.getRealMode() === consts.MODE_WYSIWYG) {
            this.__lock = true;
            this.jodit.selection.restore(this.selInfo);
            this.__lock = false;
            return;
        }

        let value: string = this.getMirrorValue();
        let selectionStart: number = 0,
            selectionEnd: number = 0;
        try {
            if (this.selInfo[0].startMarker) {
                value = value.replace(
                    /<span[^>]+data-jodit_selection_marker="start"[^>]*>[<>]*?<\/span>/gim,
                    this.tempMarkerStart
                );
            }

            if (this.selInfo[0].endMarker) {
                value = value.replace(
                    /<span[^>]+data-jodit_selection_marker="end"[^>]*>[<>]*?<\/span>/gim,
                    this.tempMarkerEnd
                );
            }

            if (
                (this.jodit.ownerWindow as any).html_beautify &&
                this.jodit.options.beautifyHTML
            ) {
                value = (this.jodit.ownerWindow as any).html_beautify(value);
            }

            selectionStart = value.indexOf(this.tempMarkerStart);
            selectionEnd = selectionStart;

            value = value.replace(this.tempMarkerStartReg, '');

            if (!this.selInfo[0].collapsed || selectionStart === -1) {
                selectionEnd = value.indexOf(this.tempMarkerEnd);
                if (selectionStart === -1) {
                    selectionStart = selectionEnd;
                }
            }

            value = value.replace(this.tempMarkerEndReg, '');
        } finally {
            value = value
                .replace(this.tempMarkerEndReg, '')
                .replace(this.tempMarkerStartReg, '');
        }

        this.setMirrorValue(value);

        this.setMirrorSelectionRange(selectionStart, selectionEnd);

        this.toWYSIWYG();

        this.setFocusToMirror(); // need for setting focus after change mode
    };

    /**
     * Proxy Method
     * @param e
     * @private
     */
    private __proxyOnFocus = (e: MouseEvent) => {
        this.jodit.events.fire('focus', e);
    };
    private __proxyOnMouseDown = (e: MouseEvent) => {
        this.jodit.events.fire('mousedown', e);
    };

    private replaceMirrorToACE() {
        const editor: IJodit = this.jodit;
        let aceEditor: AceAjax.Editor, undoManager: AceAjax.UndoManager;

        const updateButtons = () => {
                if (
                    undoManager &&
                    editor.getRealMode() === consts.MODE_SOURCE
                ) {
                    editor.events.fire('canRedo', undoManager.hasRedo());
                    editor.events.fire('canUndo', undoManager.hasUndo());
                }
            },
            getLastColumnIndex = (row: number): number => {
                return aceEditor.session.getLine(row).length;
            },
            getLastColumnIndices = (): number[] => {
                const rows: number = aceEditor.session.getLength();
                const lastColumnIndices: number[] = [];
                let lastColIndex: number = 0;
                for (let i = 0; i < rows; i++) {
                    lastColIndex += getLastColumnIndex(i);
                    if (i > 0) {
                        lastColIndex += 1;
                    }
                    lastColumnIndices[i] = lastColIndex;
                }
                return lastColumnIndices;
            },
            getRowColumnIndices = (
                characterIndex: number
            ): { row: number; column: number } => {
                const lastColumnIndices: number[] = getLastColumnIndices();
                if (characterIndex <= lastColumnIndices[0]) {
                    return { row: 0, column: characterIndex };
                }
                let row: number = 1;
                for (let i = 1; i < lastColumnIndices.length; i++) {
                    if (characterIndex > lastColumnIndices[i]) {
                        row = i + 1;
                    }
                }
                const column: number =
                    characterIndex - lastColumnIndices[row - 1] - 1;
                return { row, column };
            },
            setSelectionRangeIndices = (start: number, end: number) => {
                const startRowColumn = getRowColumnIndices(start);
                const endRowColumn = getRowColumnIndices(end);
                aceEditor.getSelection().setSelectionRange({
                    start: startRowColumn,
                    end: endRowColumn,
                });
            },
            getIndexByRowColumn = (row: number, column: number): number => {
                const lastColumnIndices: number[] = getLastColumnIndices();
                return (
                    lastColumnIndices[row] - getLastColumnIndex(row) + column
                );
            },
            tryInitAceEditor = () => {
                if (
                    aceEditor === undefined &&
                    (this.jodit.ownerWindow as any).ace !== undefined
                ) {
                    this.jodit.events
                        .off(this.jodit.ownerWindow, 'aceReady', tryInitAceEditor);

                    const fakeMirror = this.jodit.create.div(
                        'jodit_source_mirror-fake'
                    );

                    this.mirrorContainer.insertBefore(
                        fakeMirror,
                        this.mirrorContainer.firstChild
                    );

                    this.aceEditor = aceEditor = ((this.jodit
                        .ownerWindow as any).ace as AceAjax.Ace).edit(
                        fakeMirror
                    );

                    aceEditor.setTheme(
                        editor.options.sourceEditorNativeOptions.theme
                    );
                    aceEditor.renderer.setShowGutter(
                        editor.options.sourceEditorNativeOptions.showGutter
                    );
                    aceEditor
                        .getSession()
                        .setMode(editor.options.sourceEditorNativeOptions.mode);

                    aceEditor.setHighlightActiveLine(
                        editor.options.sourceEditorNativeOptions
                            .highlightActiveLine
                    );
                    aceEditor.getSession().setUseWrapMode(true);
                    aceEditor.setOption('indentedSoftWrap', false);
                    aceEditor.setOption(
                        'wrap',
                        editor.options.sourceEditorNativeOptions.wrap
                    );
                    aceEditor.getSession().setUseWorker(false);
                    aceEditor.$blockScrolling = Infinity;

                    // aceEditor.setValue(this.getMirrorValue());
                    // aceEditor.clearSelection();

                    aceEditor.setOptions({
                        maxLines: Infinity,
                    });

                    aceEditor.on('change', this.toWYSIWYG);
                    aceEditor.on('focus', this.__proxyOnFocus);
                    aceEditor.on('mousedown', this.__proxyOnMouseDown);

                    this.mirror.style.display = 'none';

                    undoManager = aceEditor.getSession().getUndoManager();

                    this.setMirrorValue = (value: string) => {
                        if (
                            editor.options.beautifyHTML &&
                            (editor.ownerWindow as any).html_beautify
                        ) {
                            aceEditor.setValue(
                                (editor.ownerWindow as any).html_beautify(value)
                            );
                        } else {
                            aceEditor.setValue(value);
                        }

                        aceEditor.clearSelection();
                        updateButtons();
                    };

                    if (this.jodit.getRealMode() !== consts.MODE_WYSIWYG) {
                        this.setMirrorValue(this.getMirrorValue());
                    }

                    this.getMirrorValue = () => {
                        return aceEditor.getValue();
                    };

                    this.setFocusToMirror = () => {
                        aceEditor.focus();
                    };

                    this.getSelectionStart = (): number => {
                        const range: AceAjax.Range = aceEditor.selection.getRange();
                        return getIndexByRowColumn(
                            range.start.row,
                            range.start.column
                        );
                    };

                    this.getSelectionEnd = (): number => {
                        const range: AceAjax.Range = aceEditor.selection.getRange();
                        return getIndexByRowColumn(
                            range.end.row,
                            range.end.column
                        );
                    };

                    this.selectAll = () => {
                        aceEditor.selection.selectAll();
                    };
                    this.insertHTML = (html: string) => {
                        const start: AceAjax.Position = aceEditor.selection.getCursor(),
                            end: AceAjax.Position = aceEditor.session.insert(
                                start,
                                html
                            );

                        aceEditor.selection.setRange(
                            {
                                start,
                                end,
                            } as AceAjax.Range,
                            false
                        );
                    };

                    this.setMirrorSelectionRange = (
                        start: number,
                        end: number
                    ) => {
                        setSelectionRangeIndices(start, end);
                    };

                    editor.events
                        .on('afterResize', () => {
                            aceEditor.resize();
                        })
                        .fire('aceInited', editor);
                }
            };

        editor.events
            .on(this.jodit.ownerWindow, 'aceReady', tryInitAceEditor) // work in global scope
            .on('aceReady', tryInitAceEditor) // work in local scope
            .on('afterSetMode', () => {
                if (
                    editor.getRealMode() !== consts.MODE_SOURCE &&
                    editor.getMode() !== consts.MODE_SPLIT
                ) {
                    return;
                }

                this.fromWYSIWYG();
                tryInitAceEditor();
            })
            .on(
                'beforeCommand',
                (command: string): false | void => {
                    if (
                        editor.getRealMode() !== consts.MODE_WYSIWYG &&
                        (command === 'redo' || command === 'undo') &&
                        undoManager
                    ) {
                        if (
                            (undoManager as any)[
                                'has' +
                                    command.substr(0, 1).toUpperCase() +
                                    command.substr(1)
                            ]
                        ) {
                            aceEditor[command]();
                        }
                        updateButtons();
                        return false;
                    }
                }
            );

        tryInitAceEditor();

        // global add ace editor in browser
        if (
            (this.jodit.ownerWindow as any).ace === undefined &&
            !$$('script.' + this.className, this.jodit.ownerDocument.body)
                .length
        ) {
            this.loadNext(
                0,
                editor.options.sourceEditorCDNUrlsJS,
                'aceReady',
                this.className
            );
        }
    }

    public mirror: HTMLTextAreaElement;

    public aceEditor: AceAjax.Editor;
    public setMirrorSelectionRange: (start: number, end: number) => void = (
        start: number,
        end: number
    ) => {
        this.mirror.setSelectionRange(start, end);
    };

    private onReadonlyReact = () => {
        const isReadOnly: boolean = this.jodit.options.readonly;

        if (isReadOnly) {
            this.mirror.setAttribute('readonly', 'true');
        } else {
            this.mirror.removeAttribute('readonly');
        }

        if (this.aceEditor) {
            this.aceEditor.setReadOnly(isReadOnly);
        }
    };

    afterInit(editor: IJodit): void {
        this.mirrorContainer = editor.create.div('jodit_source');

        this.mirror = editor.create.fromHTML(
            '<textarea class="jodit_source_mirror"/>'
        ) as HTMLTextAreaElement;

        const addListeners = () => {
            // save restore selection
            editor.events
                .off('beforeSetMode.source afterSetMode.source')
                .on('beforeSetMode.source', this.saveSelection)
                .on('afterSetMode.source', this.restoreSelection);
        };

        addListeners();
        this.onReadonlyReact();

        editor.events
            .on(
                this.mirror,
                'mousedown keydown touchstart input',
                debounce(this.toWYSIWYG, editor.defaultTimeout)
            )
            .on(
                this.mirror,
                'change keydown mousedown touchstart input',
                this.autosize
            )
            .on('afterSetMode.source', this.autosize)
            .on(this.mirror, 'mousedown focus', (e: Event) => {
                editor.events.fire(e.type, e);
            });

        editor.events
            .on('setMinHeight.source', (minHeightD: number) => {
                this.mirror && css(this.mirror, 'minHeight', minHeightD);
            })
            .on(
                'insertHTML.source',
                (html: string): void | false => {
                    if (
                        !editor.options.readonly &&
                        !this.jodit.isEditorMode()
                    ) {
                        this.insertHTML(html);
                        return false;
                    }
                }
            )
            .on(
                'aceInited',
                () => {
                    this.onReadonlyReact();
                    addListeners();
                },
                void 0,
                void 0,
                true
            )
            .on('readonly.source', this.onReadonlyReact)
            .on('placeholder.source', (text: string) => {
                this.mirror.setAttribute('placeholder', text);
            })
            .on('beforeCommand.source', this.onSelectAll)
            .on('change.source', this.fromWYSIWYG);

        this.mirrorContainer.appendChild(this.mirror);
        editor.workplace.appendChild(this.mirrorContainer);
        this.autosize();

        const className = 'beutyfy_html_jodit_helper';

        if (
            editor.options.beautifyHTML &&
            (editor.ownerWindow as any).html_beautify === undefined &&
            !$$('script.' + className, editor.ownerDocument.body).length
        ) {
            this.loadNext(
                0,
                editor.options.beautifyHTMLCDNUrlsJS,
                false,
                className
            );
        }

        if (editor.options.useAceEditor) {
            this.replaceMirrorToACE();
        }

        this.fromWYSIWYG();
    }
    beforeDestruct(jodit: IJodit): void {
        Dom.safeRemove(this.mirrorContainer);
        Dom.safeRemove(this.mirror);

        if (jodit && jodit.events) {
            jodit.events.off('aceInited.source');
        }

        if (this.aceEditor) {
            this.setFocusToMirror = () => {};
            this.aceEditor.off('change', this.toWYSIWYG);
            this.aceEditor.off('focus', this.__proxyOnFocus);
            this.aceEditor.off('mousedown', this.__proxyOnMouseDown);
            this.aceEditor.destroy();
            delete this.aceEditor;
        }

        if (this.lastTuple) {
            this.lastTuple.element.removeEventListener('load', this.lastTuple.callback);
        }
    }
}
