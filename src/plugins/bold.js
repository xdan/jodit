import Jodit from '../jodit';
import * as consts from '../constants';

/**
 * Wrap selected content in special tag or return already wrapped
 *
 * @param {Jodit} editor
 * @param {Node} strong
 * @param {RegExp} reg
 * @param {Boolean} [breakIfExists=true]
 * @return {Node}
 */
export const wrapAndSelect = (editor, strong, reg, breakIfExists = true) => {
    editor.selection.focus();
    let sel = editor.win.getSelection(),
        range = sel.getRangeAt(0),
        fake;

    if (breakIfExists && editor.node.up(editor.selection.current(), (elm) => (reg.test(elm.tagName)))) {
        return editor.node.up(editor.selection.current(), (elm) => (reg.test(elm.tagName)));
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

    return strong;
};

Jodit.plugines.bold = function (editor) {
    editor.events.on('beforeCommand', (command) => {
        const commands = {
            bold: 'strong|b',
            italic: 'em|i',
            underline: 'u',
            strikethrough: 's',
        };

        if (commands[command] !== undefined) {
            wrapAndSelect(editor, editor.node.create(commands[command].split('|')[0]),  new RegExp('^' + commands[command] + '$', 'i'));
            editor.setEditorValue();
            return false;
        }
    });
}