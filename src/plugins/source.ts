import Jodit from '../Jodit';
import {Config} from '../Config'
import * as consts from '../constants';
import {$$, appendScript, debounce, dom} from '../modules/Helpers';
import {markerInfo} from "../modules/Selection";
import Component from "../modules/Component";

declare module "../Config" {
    interface Config {
        useAceEditor: boolean;
        sourceEditorNativeOptions: {
            theme: string;
            mode: string;
            highlightActiveLine: boolean;
        }
        beautifyHTMLCDNUrlsJS: string[];
        sourceEditorCDNUrlsJS: string[];
    }
}

/**
 * Use ACE editor instead of usual textarea
 * @memberof Jodit.defaultOptions
 */
Config.prototype.useAceEditor = false;

/**
* Options for {@link https://ace.c9.io/#config|ace} editor
* @memberof Jodit.defaultOptions
*/
Config.prototype.sourceEditorNativeOptions = {
    theme: 'ace/theme/textmate',
    mode: 'ace/mode/html',
    highlightActiveLine: true,
};

/**
* CDN URLs for ACE editor
* @memberof Jodit.defaultOptions
*/
Config.prototype.sourceEditorCDNUrlsJS = [
    '//cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ace.js',
    '//cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ext-emmet.js',
];


/**
 * HTML Beautifier
 * @memberof Jodit.defaultOptions
 */
Config.prototype.beautifyHTMLCDNUrlsJS = [
    '//cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.12/beautify.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.12/beautify-html.min.js',
];


/**
 * Plug-in change simple textarea on CodeMirror editor in Source code mode
 *
 * @module codeMirror
 */
Jodit.plugins.source = class extends Component {
    private className = 'jodit_ace_editor';

    private loadNext = (i: number, urls: string[], eventOnFinalize: false|string = 'aceReady', className: string = this.className) => {
        if (eventOnFinalize && urls[i] === undefined && this.jodit && this.jodit.events) {
            this.jodit.events.fire(eventOnFinalize);
            return;
        }
        if (urls[i] !== undefined) {
            appendScript(urls[i], () => {
                this.loadNext(i + 1, urls, eventOnFinalize, className);
            }, className);
        }
    };

    private mirrorContainer: HTMLDivElement;
    mirror: HTMLTextAreaElement;

    private fromWYSIWYG = (force: boolean = false) => {
        if (!this.__lock && (this.jodit.getRealMode() === consts.MODE_SOURCE || force === true)) {
            const new_value = this.jodit.getEditorValue();
            if (new_value !== this.getMirrorValue()) {
                this.setMirrorValue(new_value);
            }
        }
    };

    private __lock = false;
    private toWYSIWYG = () => {
        this.__lock = true;
        this.jodit.setEditorValue(this.getMirrorValue());
        this.__lock = false;
    };

    private autosize = () => {
        this.mirror.style.height = 'auto';
        this.mirror.style.height = this.mirror.scrollHeight + 'px';
    };

    private getNormalPosition = (pos: number, str: string): number => {
        let start: number = pos;
        while(start > 0) {
            start--;

            if (str[start] === '<' && str[start + 1] !== undefined && str[start + 1].match(/[\w\/]+/i)) {
                return start;
            }
            if (str[start] === '>') {
                return pos;
            }

        }
        return pos;
    };
    constructor(editor: Jodit) {
        super(editor);

        this.mirrorContainer = <HTMLDivElement>dom('<div class="jodit_source"/>', document);
        this.mirror = <HTMLTextAreaElement>dom('<textarea class="jodit_source_mirror"/>', document);

        editor.__on(this.mirror, 'mousedown keydown touchstart input', debounce(this.toWYSIWYG, editor.options.observer.timeout));
        editor.__on(this.mirror, 'change keydown mousedown touchstart input', debounce(this.autosize, editor.options.observer.timeout));

        editor.events
            .on('placeholder', (text: string) => {
                this.mirror.setAttribute('placeholder', text);
            })
            .on('afterInit', () => {
                this.mirrorContainer.appendChild(this.mirror);
                editor.workplace.appendChild(this.mirrorContainer);

                const className = 'beutyfy_html_jodit_helper';
                if (window['html_beautify'] === undefined && !$$('script.' + className, document.body).length) {
                    this.loadNext(0, editor.options.beautifyHTMLCDNUrlsJS, false, className);
                }

                if (editor.options.useAceEditor) {
                    this.replaceMirrorToACE();
                }

                // save restore selection
                editor.events
                    .on('beforeSetMode', this.saveSelection)
                    .on('afterSetMode', this.restoreSelection);
            })
            .on('change afterInit', this.fromWYSIWYG);
    }

    private tempMarkerStart = '{start-jodit-selection}';
    private tempMarkerEnd = '{end-jodit-selection}';
    private __clear = (str: string): string => str.replace(consts.INVISIBLE_SPACE_REG_EXP, '');

    private selInfo: markerInfo[] = [];

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
    public setMirrorSelectionRange: (start: number, end: number) => void = (start: number, end: number) => {
        this.mirror.setSelectionRange(start, end);
    };

    private saveSelection = () => {
        if (this.jodit.getMode() === consts.MODE_WYSIWYG) {
            this.selInfo = this.jodit.selection.save() || [];
            this.jodit.setEditorValue();
            this.fromWYSIWYG(true);
        } else {
            this.selInfo.length = 0;
            const value = this.getMirrorValue();
            if (this.getSelectionStart() === this.getSelectionEnd()) {
                const marker: HTMLSpanElement = this.jodit.selection.marker(true);
                this.selInfo[0] = {
                    startId: marker.id,
                    collapsed: true,
                    startMarker: marker.outerHTML
                };
                const selectionStart = this.getNormalPosition(this.getSelectionStart(), this.getMirrorValue());
                this.setMirrorValue(value.substr(0, selectionStart) + this.__clear(this.selInfo[0].startMarker) + value.substr(selectionStart));
            } else {
                const markerStart: HTMLSpanElement = this.jodit.selection.marker(true);
                const markerEnd: HTMLSpanElement = this.jodit.selection.marker(false);

                this.selInfo[0] = {
                    startId: markerStart.id,
                    endId: markerEnd.id,
                    collapsed: false,
                    startMarker: markerStart.outerHTML,
                    endMarker: markerEnd.outerHTML
                };
                const selectionStart = this.getNormalPosition(this.getSelectionStart(), value);
                const selectionEnd = this.getNormalPosition(this.getSelectionEnd(), value);
                this.setMirrorValue(value.substr(0, selectionStart) + this.__clear(this.selInfo[0].startMarker) + value.substr(selectionStart, selectionEnd - selectionStart) + this.__clear(this.selInfo[0].endMarker) + value.substr(selectionEnd));
            }
            this.toWYSIWYG();
        }
    };
    private restoreSelection = () => {
        if (!this.selInfo.length) {
            return;
        }

        if (this.jodit.getMode() === consts.MODE_WYSIWYG) {
            this.jodit.selection.restore(this.selInfo);
            this.fromWYSIWYG(true);
            return;
        }

        if (this.selInfo[0].startMarker) {
            this.setMirrorValue(this.getMirrorValue().replace(this.__clear(this.selInfo[0].startMarker), this.tempMarkerStart));
        }

        if (this.selInfo[0].endMarker) {
            this.setMirrorValue(this.getMirrorValue().replace(this.__clear(this.selInfo[0].endMarker), this.tempMarkerEnd));
        }

        if (window['html_beautify']) {
            this.setMirrorValue(window['html_beautify'](this.getMirrorValue()));
        }

        let  selectionStart: number = this.getMirrorValue().indexOf(this.tempMarkerStart),
            selectionEnd: number  = selectionStart;

        this.setMirrorValue(this.getMirrorValue().replace(this.tempMarkerStart, ''));
        if (!this.selInfo[0].collapsed || selectionStart === -1) {
            selectionEnd = this.getMirrorValue().indexOf(this.tempMarkerEnd);
            if (selectionStart === -1) {
                selectionStart = selectionEnd;
            }
        }

        this.setMirrorValue(this.getMirrorValue().replace(this.tempMarkerEnd, ''));

        this.setMirrorSelectionRange(
            selectionStart,
            selectionEnd
        );

        this.toWYSIWYG();

        this.setFocusToMirror(); // need for setting focus after change mode
    };

    private replaceMirrorToACE() {
        let editor: Jodit = this.jodit,
            aceEditor: AceAjax.Editor,
            undoManager: AceAjax.UndoManager;

        const updateButtons = () => {
                if (undoManager && editor.getMode() === consts.MODE_SOURCE) {
                    editor.events.fire('canRedo', [undoManager.hasRedo()]);
                    editor.events.fire('canUndo', [undoManager.hasUndo()]);
                }
            },
            getLastColumnIndex = (row: number): number => {
                return (<any>aceEditor.session.getDocumentLastRowColumnPosition(row, 0)).column;
            },
            getLastColumnIndices = (): number[] => {
                const rows: number = aceEditor.session.getLength();
                const lastColumnIndices: number[] = [];
                let lastColIndex: number = 0;
                for (let i = 0; i < rows; i++){
                    lastColIndex += getLastColumnIndex(i);
                    if (i>0) {
                        lastColIndex += 1;
                    }
                    lastColumnIndices[i] = lastColIndex;
                }
                return lastColumnIndices;
            },
            getRowColumnIndices = (characterIndex: number): {row: number, column: number} => {
                const lastColumnIndices: number[] = getLastColumnIndices();
                if (characterIndex <= lastColumnIndices[0]) {
                    return {row: 0, column: characterIndex};
                }
                let row: number = 1;
                for (let i = 1; i < lastColumnIndices.length; i++) {
                    if (characterIndex > lastColumnIndices[i]) {
                        row = i+1;
                    }
                }
                let column: number = characterIndex - lastColumnIndices[row-1] - 1;
                return {row: row, column: column};
            },
            setSelectionRangeIndices = (start: number, end: number) => {
                const startRowColumn = getRowColumnIndices(start);
                const endRowColumn = getRowColumnIndices(end);
                aceEditor.getSelection().setSelectionRange({
                    start: {
                        row: startRowColumn.row,
                        column: startRowColumn.column
                    },
                    end: {
                        row: endRowColumn.row,
                        column: endRowColumn.column
                    }
                });
            },
            getIndexByRowColumn = (row: number, column: number): number => {
                const lastColumnIndices: number[] = getLastColumnIndices();
                return lastColumnIndices[row] - getLastColumnIndex(row) + column;
            },
            tryInitAceEditor = () => {
                if (aceEditor === undefined && window['ace'] !== undefined) {
                    const fakeMirror = dom('<div class="jodit_source_mirror-fake"/>', document);
                    this.mirrorContainer.insertBefore(fakeMirror, this.mirrorContainer.firstChild);

                    aceEditor = (<AceAjax.Ace>window['ace']).edit(fakeMirror);

                    aceEditor.setTheme(editor.options.sourceEditorNativeOptions.theme);
                    aceEditor.getSession().setMode(editor.options.sourceEditorNativeOptions.mode);
                    aceEditor.setHighlightActiveLine(editor.options.sourceEditorNativeOptions.highlightActiveLine);
                    aceEditor.$blockScrolling = Infinity;

                    aceEditor.setValue(this.getMirrorValue());

                    aceEditor.setOptions({
                        maxLines: Infinity
                    });

                    aceEditor.on('change', this.toWYSIWYG);

                    this.mirror.style.display = 'none';

                    undoManager = aceEditor.getSession().getUndoManager();

                    this.getMirrorValue = () => {
                        return aceEditor.getValue();
                    };
                    this.setMirrorValue = (value: string) => {
                        if (window['html_beautify']) {
                            aceEditor.setValue(window['html_beautify'](value));
                        } else {
                            aceEditor.setValue(value);
                        }
                        updateButtons();
                    };
                    this.setFocusToMirror = () => {
                        aceEditor.focus();
                    };
                    this.getSelectionStart = (): number => {
                        const range: AceAjax.Range = aceEditor.selection.getRange();
                        return getIndexByRowColumn(range.start.row, range.start.column);
                    };
                    this.getSelectionEnd = (): number => {
                        const range: AceAjax.Range = aceEditor.selection.getRange();
                        return getIndexByRowColumn(range.end.row, range.end.column);
                    };
                    this.setMirrorSelectionRange = (start: number, end: number) => {
                        setSelectionRangeIndices(start, end);
                    };


                    editor.events.fire('aceInited');
                }
            };

        editor.events
            .on('aceReady', tryInitAceEditor)
            .on('afterSetMode', () => {
                if (editor.getMode() !== consts.MODE_SOURCE && editor.getMode() !== consts.MODE_SPLIT) {
                    return;
                }
                this.fromWYSIWYG();
                tryInitAceEditor();
            })
            .on('beforeCommand', (command: string) => {
            if (editor.getMode() !== consts.MODE_WYSIWYG && (command === 'redo' || command === 'undo') && undoManager) {
                if (undoManager['has' + command.substr(0,1).toUpperCase() + command.substr(1)]) {
                    aceEditor[command]();
                }
                updateButtons();
                return false;
            }
        });

        // global add ace editor in browser
        if (window['ace'] === undefined && !$$('script.' + this.className, document.body).length) {
            this.loadNext(0, editor.options.sourceEditorCDNUrlsJS);
        }
    }
};