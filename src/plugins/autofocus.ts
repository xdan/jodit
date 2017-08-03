import Jodit from '../Jodit';
import {Config} from '../Config';

declare module "../Config" {
    interface Config {
        autofocus: boolean;
    }
}

/**
 * @prop {boolean} autofocus=false true After loading the page into the editor once the focus is set
 */
Config.prototype.autofocus = false;

/**
 * Autofocus plugin
 *
 * @param {Jodit} editor
 */
Jodit.plugins.autoFocus = function (editor: Jodit) {
    let timeout;
    editor.events
        .on('afterInit', () => {
            if (editor.options.autofocus) {
                if (editor.options.observer.timeout) {
                    timeout = setTimeout(editor.selection.focus, 300)
                } else {
                    editor.selection.focus();
                }
            }
        })
        .on('beforeDestruct', () => {
            clearTimeout(timeout);
        })
};