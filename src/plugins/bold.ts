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
            let selectionInfo,
                getCSS = (elm: HTMLElement, key: string): string => {
                    return editor.win.getComputedStyle(elm).getPropertyValue(key).toString()
                },
                checkCssRulesFor = (elm: HTMLElement) => {
                    return elm.nodeType === Node.ELEMENT_NODE && each(commandOptions.css, (cssPropertyKey, cssPropertyValues) => {
                        let value = getCSS(elm, cssPropertyKey);
                        return  cssPropertyValues.indexOf(value.toLowerCase()) !== -1
                    }) !== false
                },
                commandOptions = Jodit.defaultOptions.controls[command];
            let oldWrappers = [];
            editor.selection.eachSelection((current) => {
                let sel = editor.win.getSelection(),
                    wrapper,
                    range = sel.getRangeAt(0);

                wrapper = <HTMLElement>editor.node.closest(current, (elm) => {
                    if (elm.nodeType !== Node.TEXT_NODE) {
                        if (checkCssRulesFor(<HTMLElement>elm)) {
                            return true;
                        }
                    }
                    return false;
                });

                if (wrapper && oldWrappers.reduce((was, oldWprapper) => {
                        return was || oldWprapper === wrapper
                    }, false)) {
                    return;
                }



                if (wrapper) {
                    // element full selected !range.collapsed && editor.selection.cursorInTheEdge(true, wrapper) && editor.selection.cursorInTheEdge(false, wrapper)
                    if (!range.collapsed) {
                        let cursorInTheStart = editor.selection.cursorInTheEdge(true, wrapper),
                            cursorInTheEnd = editor.selection.cursorInTheEdge(false, wrapper);

                        selectionInfo = editor.selection.save();
                        if (!cursorInTheStart || !cursorInTheEnd) {
                            let leftRange = editor.doc.createRange();

                            if (cursorInTheStart) {
                                leftRange.setStart(range.endContainer, range.endOffset);
                                leftRange.setEndAfter(wrapper);
                                let fragment = leftRange.extractContents();
                                editor.node.after(wrapper, fragment)
                            } else if (cursorInTheEnd) {
                                leftRange.setStartBefore(wrapper);
                                leftRange.setEnd(range.startContainer, range.startOffset);
                                let fragment = leftRange.extractContents();
                                wrapper.parentNode.insertBefore(fragment, wrapper);
                            } else {
                                let cloneRange = range.cloneRange();
                                leftRange.setStartBefore(wrapper);
                                leftRange.setEnd(cloneRange.startContainer, cloneRange.startOffset);
                                let fragment = leftRange.extractContents();
                                wrapper.parentNode.insertBefore(fragment, wrapper);
                                leftRange.setStart(cloneRange.endContainer, cloneRange.endOffset);
                                leftRange.setEndAfter(wrapper);
                                fragment = leftRange.extractContents();
                                editor.node.after(wrapper, fragment)
                            }
                        }

                    } else {
                        if (editor.selection.cursorInTheEdge(true, wrapper)) {
                            editor.selection.setCursorBefore(wrapper);
                        } else {
                            editor.selection.setCursorAfter(wrapper);
                        }
                        return false;
                    }




                    // wrapper already exists
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

                        wrapper.normalize();

                        editor.selection.restore(selectionInfo);
                    }

                    editor.setEditorValue();
                    return false;
                }

                wrapper = wrapAndSelect(editor, editor.node.create(commandOptions.tags[0]),  commandOptions.tagRegExp);
                wrapper.normalize();

                if (wrapper) {
                    oldWrappers.push(wrapper);
                }
            });

            editor.setEditorValue();
            return false;
        }
    });
}