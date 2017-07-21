// import Jodit from '../Jodit';
// import * as consts from '../constants';
// import {each} from '../modules/Helpers'
//
// Jodit.plugines.removeoldtags = function (editor) {
//     editor.events.on('afterCommand', (command) => {
//         if (command.toLowerCase() === 'bold' || command.toLowerCase() === 'italic') {
//             let olds = Array.prototype.slice.call(editor.editor.querySelectorAll(Object.keys(consts.OUTDATED_TAGS).join(',')) || []);
//
//             if (olds.length) {
//                 let info = editor.selection.save();
//                 each(olds, (i, tag) => {
//                     editor.node.replace(tag, consts.OUTDATED_TAGS[tag.tagName], true);
//                 });
//                 editor.selection.restore(info);
//             }
//         }
//     });
// }