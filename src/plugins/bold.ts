import Jodit from '../Jodit';
// import * as consts from '../constants';
// import Dom from "../modules/Dom";

// /**
//  * Wrap selected content in special tag or return already wrapped
//  *
//  * @param {Jodit} editor
//  * @param {Node} strong
//  * @param {RegExp|string} reg tag list /A|TABLE|TD/i
//  * @param {Boolean} [breakIfExists=true]
//  * @return {HTMLElement}
//  */
// export const wrapAndSelect = (editor: Jodit, strong: Node, reg: RegExp|string, breakIfExists: boolean = true): HTMLElement => {
//     editor.selection.focus();
//     let sel = editor.win.getSelection(),
//         range = sel.getRangeAt(0),
//         current = editor.selection.current(),
//         fake;
//
//     if (breakIfExists && current !== false && Dom.closest(current, reg, editor.editor)) {
//         return <HTMLElement>Dom.closest(current, reg, editor.editor);
//     }
//
//     let collapsed = editor.selection.isCollapsed();
//
//     if (!collapsed) {
//         let fragment = range.extractContents();
//         strong.appendChild(fragment);
//     } else {
//         fake = Dom.create('text', consts.INVISIBLE_SPACE, editor.doc);
//         strong.appendChild(fake);
//     }
//
//
//     range.collapse(true);
//     range.insertNode(strong);
//
//     let new_range = editor.doc.createRange();
//
//
//
//     if (collapsed) {
//         new_range.setStartAfter(fake);
//         new_range.collapse(true);
//     } else {
//         new_range.selectNodeContents(strong);
//     }
//
//     sel.removeAllRanges();
//     sel.addRange(new_range);
//
//     return <HTMLElement>strong;
// };

Jodit.plugins.bold = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command: string) => {

        const commands = ['bold', 'italic', 'underline', 'strikethrough'];


        if (commands.indexOf(command) !== -1) {
            // Dom.apply(Jodit.defaultOptions.controls[command], (commandOptions) => {
            //     return wrapAndSelect(editor, Dom.create(commandOptions.tags[0], '', editor.doc),  commandOptions.tagRegExp);
            // }, editor);

            // editor.doc.execCommand('fontsize', false, 7)
            const cssOptions = {...Jodit.defaultOptions.controls[command].css},
                cssRules = {};
            Object.keys(cssOptions).forEach((key: string) => {
                cssRules[key] = Array.isArray(cssOptions[key]) ?  cssOptions[key][0] : cssOptions[key];
            });

            editor.selection.applyCSS(
                cssRules,
                Jodit.defaultOptions.controls[command].tags[0],
                Jodit.defaultOptions.controls[command].css
            );

            editor.setEditorValue();
            return false;
        }
    });
};