import Jodit from '../Jodit';
import {Config} from '../Config'
import * as consts from '../constants';
import {$$, appendScript, debounce, dom} from '../modules/Helpers';
import {markerInfo} from "../modules/Selection";

/**
* @prop {boolean} useAceEditor=true Use ACE editor instead of usual textarea
* @memberof Jodit.defaultOptions
*/
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
Jodit.plugins.source = function (editor: Jodit) {
    const className = 'jodit_ace_editor';
    const loadNext = (i: number, urls: string[], eventOnFinalize: false|string = 'aceReady') => {
        if (eventOnFinalize && urls[i] === undefined && editor && editor.events) {
            editor.events.fire(eventOnFinalize);
            return;
        }
        if (urls[i] !== undefined) {
            appendScript(urls[i], () => {
                loadNext(i + 1, urls);
            }, className);
        }
    };
    const mirrorContainer: HTMLDivElement = <HTMLDivElement>dom('<div class="jodit_source"/>', document),
        mirror: HTMLTextAreaElement = <HTMLTextAreaElement>dom('<textarea class="jodit_source_mirror"/>', document),
        from = () => {
            const new_value = editor.getEditorValue();
            if (new_value !== mirror.value) {
                mirror.value = editor.getEditorValue();
            }
        },
        to = () => {
            editor.setEditorValue(mirror.value)
        },
        autosize = () => {
            mirror.style.height = 'auto';
            mirror.style.height = mirror.scrollHeight + 'px';
        }

    editor.__on(mirror, 'change keydown mousedown touchstart input', debounce(to, editor.options.observer.timeout));
    editor.__on(mirror, 'change keydown mousedown touchstart input', debounce(autosize, editor.options.observer.timeout));

    editor.events
        .on('placeholder', (text: string) => {
            mirror.setAttribute('placeholder', text);
        })
        .on('afterInit', () => {
            from();
            mirrorContainer.appendChild(mirror);
            editor.workplace.appendChild(mirrorContainer);

            loadNext(0, editor.options.beautifyHTMLCDNUrlsJS, false);
            if (editor.options.useAceEditor) {
                let aceEditor,
                    undoManager,
                    noChange: boolean = false;

                const updateButtons = () => {
                        if (undoManager && editor.getMode() === consts.MODE_SOURCE) {
                            editor.events.fire('canRedo', [undoManager.hasRedo()]);
                            editor.events.fire('canUndo', [undoManager.hasUndo()]);
                        }
                    },
                    saveValue = () => {
                        if (!noChange && aceEditor && editor.getRealMode() === consts.MODE_SOURCE) {
                            mirror.value = aceEditor.getValue();
                            updateButtons();
                            to();
                        }
                    },
                    tryInitAceEditor = () => {
                        if (aceEditor === undefined) {
                            if (window['ace'] !== undefined) {
                                let fakeMirror = dom('<div class="jodit_source_mirror-fake"/>', document);
                                mirrorContainer.insertBefore(fakeMirror, mirror);

                                aceEditor = window['ace'].edit(fakeMirror);

                                aceEditor.setTheme(editor.options.sourceEditorNativeOptions.theme);
                                aceEditor.getSession().setMode(editor.options.sourceEditorNativeOptions.mode);
                                aceEditor.setHighlightActiveLine(editor.options.sourceEditorNativeOptions.highlightActiveLine);
                                aceEditor.$blockScrolling = Infinity;

                                aceEditor.setValue(mirror.value);

                                aceEditor.setOptions({
                                    maxLines: Infinity
                                });

                                aceEditor.on('change', saveValue);

                                mirror.style.display = 'none';

                                undoManager = aceEditor.getSession().getUndoManager();

                                editor.events.fire('aceInited');
                            }
                        }
                        if (aceEditor) {
                            if (window['html_beautify']) {
                                aceEditor.setValue(window['html_beautify'](mirror.value));
                            } else {
                                aceEditor.setValue(mirror.value);
                            }
                            updateButtons();
                        }
                    };

                editor.events.on('afterSetMode', () => {
                    if (editor.getMode() !== consts.MODE_SOURCE && editor.getMode() !== consts.MODE_SPLIT) {
                        return;
                    }
                    from();
                    tryInitAceEditor();
                    editor.events.on('aceReady', tryInitAceEditor);
                });

                editor.events.on('beforeCommand', (command: string) => {
                    if (editor.getMode() !== consts.MODE_WYSIWYG && (command === 'redo' || command === 'undo') && undoManager) {
                        if (undoManager['has' + command.substr(0,1).toUpperCase() + command.substr(1)]) {
                            aceEditor[command]();
                        }
                        updateButtons();
                        return false;
                    }
                });

                // global add ace editor in browser
                if (window['ace'] === undefined && !$$('script.' + className, document.body).length) {
                    loadNext(0, editor.options.sourceEditorCDNUrlsJS);
                }
            } else {
                const cl = (str: string): string => str.replace(consts.INVISIBLE_SPACE_REG_EXP, '');
                let selInfo: markerInfo[];
                editor.events.on('beforeSetMode', () => {
                    if (editor.getMode() === consts.MODE_WYSIWYG) {
                        selInfo = editor.selection.save();
                        editor.setEditorValue();
                    } else {
                        const getNormalPosition = (pos: number, str: string) => {
                            let start = pos
                            while(start > 0) {
                                start--;

                                if (str[start] === '<' && str[start + 1] !== undefined && str[start + 1].match(/\w/i)) {
                                    return start - 1;
                                }
                                if (str[start] === '>') {
                                    return pos;
                                }

                            }
                            return pos;
                        }
                        selInfo = [];
                        if (mirror.selectionStart === mirror.selectionEnd) {
                            const marker: HTMLSpanElement = editor.selection.marker(false);
                            selInfo[0] = {
                                startId: marker.id,
                                collapsed: true,
                                startMarker: marker.outerHTML
                            };
                            const selectionStart = getNormalPosition(mirror.selectionStart, mirror.value);
                            mirror.value = mirror.value.substr(0, selectionStart) + selInfo[0].startMarker + mirror.value.substr(selectionStart + 1);
                        } else {
                            const markerStart: HTMLSpanElement = editor.selection.marker(true);
                            const markerEnd: HTMLSpanElement = editor.selection.marker(false);

                            selInfo[0] = {
                                startId: markerStart.id,
                                endId: markerEnd.id,
                                collapsed: false,
                                startMarker: markerStart.outerHTML,
                                endMarker: markerEnd.outerHTML
                            };
                            const selectionStart = getNormalPosition(mirror.selectionStart, mirror.value);
                            const selectionEnd = getNormalPosition(mirror.selectionEnd, mirror.value);
                            mirror.value = mirror.value.substr(0, selectionStart) + selInfo[0].startMarker + mirror.value.substr(selectionStart, selectionEnd - selectionStart) + selInfo[0].endMarker + mirror.value.substr(selectionEnd);
                        }
                        editor.setEditorValue(mirror.value);
                    }
                });

                const tempMarkerStart = '{start-jodit-selection}';
                const tempMarkerEnd = '{end-jodit-selection}';
                editor.events.on('afterSetMode', () => {
                    if (editor.getMode() === consts.MODE_WYSIWYG) {
                        editor.selection.restore(selInfo);
                        return;
                    }

                    mirror.value = mirror.value
                        .replace(cl(selInfo[0].startMarker), tempMarkerStart);
                    if (!selInfo[0].collapsed) {
                        mirror.value = mirror.value
                            .replace(cl(selInfo[0].endMarker), tempMarkerEnd);
                    }

                    if (window['html_beautify']) {
                        mirror.value = window['html_beautify'](mirror.value);
                    }

                    let  selectionStart: number = mirror.value.indexOf(tempMarkerStart),
                         selectionEnd: number  = selectionStart;

                    mirror.value = mirror.value.replace(tempMarkerStart, '');
                    if (!selInfo[0].collapsed) {
                        selectionEnd = mirror.value.indexOf(tempMarkerEnd);
                    }
                    mirror.value = mirror.value.replace(tempMarkerEnd, '');

                    mirror.setSelectionRange(
                        selectionStart,
                        selectionEnd
                    );

                    to();

                    mirror.focus();
                });
            }
        })
        .on('change', from);
};