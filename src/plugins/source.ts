import Jodit from '../jodit';
import config from '../config'
import * as consts from '../constants';
import {$$, appendScript, dom} from '../modules/Helpers';

/**
* @prop {boolean} useAceEditor=true Use ACE editor instead of usual textarea. {@link module:source|source}'s options
* @memberof Jodit.defaultOptions
*/
config.useAceEditor = true;

/**
* @prop {plainObject} sourceEditorNativeOptions={...} Options for {@link https://ace.c9.io/#config|ace} editor
* @memberof Jodit.defaultOptions
*/
config.sourceEditorNativeOptions = {
    theme: 'ace/theme/textmate',
    mode: 'ace/mode/html',
    highlightActiveLine: true,
}

/**
* @prop {Array.<String>} sourceEditorCDNUrlJS=["https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ace.js", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ext-beautify.js"]  CDN URLs for ACE editor
* @memberof Jodit.defaultOptions
*/
config.sourceEditorCDNUrlsJS = [
    '//cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ace.js',
    '//cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ext-emmet.js',
    '//cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.12/beautify.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.12/beautify-html.min.js',
];


/**
 * Plug-in change simple textarea on CodeMirror editor in Source code mode
 *
 * @module codeMirror
 */
Jodit.plugins.source = function (editor) {
    let mirrorContainer = dom('<div class="jodit_source"/>'),
        mirror = dom('<textarea class="jodit_source_mirror"/>'),
        from = () => {
            mirror.value = editor.getEditorValue();
        },
        to = () => {
            editor.setEditorValue(mirror.value)
        };


    from();
    mirrorContainer.appendChild(mirror);
    editor.workplace.appendChild(mirrorContainer);

    editor.events.on('change', from);


    if (editor.options.useAceEditor) {
        let sourceEditor,
            undoManager,
            noChange = false;

        const className = 'jodit_ace_editor',
            updateButtons = () => {
                if (undoManager && editor.getMode() === consts.MODE_SOURCE) {
                    editor.events.fire('canRedo', [undoManager.hasRedo()]);
                    editor.events.fire('canUndo', [undoManager.hasUndo()]);
                }
            },
            saveValue = () => {
                if (!noChange && sourceEditor && editor.getRealMode() === consts.MODE_SOURCE) {
                    mirror.value = sourceEditor.getValue();
                    updateButtons();
                    to();
                }
            },
            tryInitAceEditor = () => {
                if (sourceEditor === undefined) {
                    if (window['ace'] !== undefined) {
                        let fakeMirror = dom('<div class="jodit_source_mirror-fake"/>');
                        mirrorContainer.insertBefore(fakeMirror, mirror);

                        sourceEditor = window['ace'].edit(fakeMirror);

                        sourceEditor.setTheme(editor.options.sourceEditorNativeOptions.theme);
                        sourceEditor.getSession().setMode(editor.options.sourceEditorNativeOptions.mode);
                        sourceEditor.setHighlightActiveLine(editor.options.sourceEditorNativeOptions.highlightActiveLine);
                        sourceEditor.$blockScrolling = Infinity;

                        sourceEditor.setValue(mirror.value);

                        sourceEditor.setOptions({
                            maxLines: Infinity
                        });

                        sourceEditor.on('change', saveValue);

                        mirror.style.display = 'none';

                        undoManager = sourceEditor.getSession().getUndoManager();

                        editor.events.fire('aceInited');
                    }
                }
                if (sourceEditor) {
                    if (window['html_beautify']) {
                        sourceEditor.setValue(window['html_beautify'](mirror.value));
                    } else {
                        sourceEditor.setValue(mirror.value);
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

        editor.events.on('beforeCommand', (command) => {
            if (editor.getMode() !== consts.MODE_WYSIWYG && (command === 'redo' || command === 'undo') && undoManager) {
                if (undoManager['has' + command.substr(0,1).toUpperCase() + command.substr(1)]) {
                    sourceEditor[command]();
                }
                updateButtons();
                return false;
            }
        })

        // global add ace editor in browser
        if (window['ace'] === undefined && !$$('script.' + className, document.body).length) {
            const loadNext = (i, urls) => {
                if (urls[i] === undefined && editor && editor.events) {
                    editor.events.fire('aceReady');
                    return;
                }
                if (urls[i] !== undefined) {
                    appendScript(urls[i], () => {
                        loadNext(i + 1, urls);
                    }, className);
                }
            };
            loadNext(0, editor.options.sourceEditorCDNUrlsJS);
        }
    }
}