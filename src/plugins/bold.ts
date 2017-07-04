import Jodit from '../jodit';
import * as consts from '../constants';
import {each} from "../modules/Helpers";

/**
 * Wrap selected content in special tag or return already wrapped
 *
 * @param {Jodit} editor
 * @param {Node} strong
 * @param {RegExp|string} reg tag list /A|TABLE|TD/i
 * @param {Boolean} [breakIfExists=true]
 * @return {HTMLElement}
 */
export const wrapAndSelect = (editor: Jodit, strong: Node, reg: RegExp|string, breakIfExists: boolean = true): HTMLElement => {
    editor.selection.focus();
    let sel = editor.win.getSelection(),
        range = sel.getRangeAt(0),
        current = editor.selection.current(),
        fake;

    if (breakIfExists && current !== false && editor.node.closest(current, reg)) {
        return <HTMLElement>editor.node.closest(current, reg);
    }

    let collapsed = editor.selection.isCollapsed();

    if (!collapsed) {
        let fragment = range.extractContents();
        strong.appendChild(fragment);
    } else {
        fake = editor.node.create('text', consts.INVISIBLE_SPACE);
        strong.appendChild(fake);
    }


    range.collapse(true);
    range.insertNode(strong);

    let new_range = editor.doc.createRange();



    if (collapsed) {
        new_range.setStartAfter(fake);
        new_range.collapse(true);
    } else {
        new_range.selectNodeContents(strong);
    }

    sel.removeAllRanges();
    sel.addRange(new_range);

    return <HTMLElement>strong;
};

Jodit.plugins.bold = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command: string) => {

        const commands = ['bold', 'italic', 'underline', 'strikethrough'];


        if (commands.indexOf(command) !== -1) {
            let current = editor.selection.current(),
                getCSS = (elm: HTMLElement, key: string): string => {
                    return editor.win.getComputedStyle(elm).getPropertyValue(key).toString()
                },
                commandOptions = Jodit.defaultOptions.controls[command];

            if (current) {
                let wrapper = <HTMLElement>editor.node.closest(current, (elm) => {
                    if (elm.nodeType !== Node.TEXT_NODE) {
                        if (each(commandOptions.css, (cssPropertyKey, cssPropertyValues) => {
                            let value = getCSS(elm, cssPropertyKey);
                            return  cssPropertyValues.indexOf(value.toLowerCase()) !== -1
                        }) !== false) {
                            return true;
                        }
                    }
                    return false;
                });
                if (wrapper) {
                    // wrapper already exists
                    let selectionInfo = editor.selection.save();

                    if (wrapper.tagName.toLowerCase().match(commandOptions.tagRegExp)) {
                        while (wrapper.firstChild) {
                            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                        }

                        editor.selection.restore(selectionInfo);
                        wrapper.parentNode.removeChild(wrapper); // because in some browsers selection can be inside wrapper
                    } else {
                        each(commandOptions.css, (cssPropertyKey) => {
                            wrapper.style.removeProperty(cssPropertyKey);
                        });

                        if (!wrapper.getAttribute('style')) {
                            wrapper.removeAttribute('style')
                        }

                        editor.selection.restore(selectionInfo);
                    }

                    editor.setEditorValue();
                    return false;
                }
            }

            wrapAndSelect(editor, editor.node.create(commandOptions.tags[0]),  commandOptions.tagRegExp);
            editor.setEditorValue();
            return false;
        }
    });
}