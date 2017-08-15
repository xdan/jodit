import Jodit from '../Jodit';
import {Config} from '../Config'
import {isURL, convertMediaURLToVideoEmbed} from '../modules/Helpers'
import Dom from "../modules/Dom";

/**
* @property {object}  link `{@link module:link|link}` plugin's options
* @property {boolean} link.processVideoLink=true Replace inserted youtube/vimeo link toWYSIWYG `iframe`
* @property {boolean} link.processPastedLink=true Wrap inserted link in &lt;a href="link">link&lt;/a>
* @property {boolean} link.openLinkDialogAfterPost=true Open Link dialog after post
* @property {boolean} link.removeLinkAfterFormat=true When the button is pressed toWYSIWYG clean format, if it was done on the link is removed like command `unlink`
* @memberof Jodit.defaultOptions
*/

declare module "../Config" {
    interface Config {
        link: {
            processVideoLink: boolean;
            processPastedLink: boolean;
            openLinkDialogAfterPost: boolean;
            removeLinkAfterFormat: boolean;
        }
    }
}
Config.prototype.link = {
    processVideoLink: true,
    processPastedLink: true,
    openLinkDialogAfterPost: true,
    removeLinkAfterFormat: true,
};


/**
 * Process link
 *
 * @module link
 */
Jodit.plugins.link = function (editor: Jodit) {
    if (editor.options.link.processPastedLink) {
        editor.events.on('processPaste', function (event, html) {
            if (isURL(html)) {
                let a;
                if (convertMediaURLToVideoEmbed(html) !== html) {
                    a = convertMediaURLToVideoEmbed(html);
                } else {
                    a = editor.doc.createElement('a');
                    a.setAttribute('href', html);
                    a.innerText = html;
                    if (editor.options.link.openLinkDialogAfterPost) {
                        setTimeout(() => {
                            //parent.selection.moveCursorTo(a, true);
                            //editor.selection.selectNodes(Array.prototype.slice.call(a.childNodes));
                        }, 100);
                    }
                }
                return a;
            }
        });
    }
    if (editor.options.link.removeLinkAfterFormat) {
        editor.events.on('afterCommand', function (command) {
            let sel = editor.selection,
                newtag,
                node;

            if (command === 'removeFormat') {
                node = sel.current();
                if (node && node.tagName !== 'A') {
                    node = Dom.closest(node, 'A', editor.editor);
                }
                if (node && node.tagName === 'A') {
                    if (node.innerHTML === node.innerText) {
                        newtag = Dom.create('text', node.innerText, editor.doc);
                    } else {
                        newtag = Dom.create('span', node.innerHTML, editor.doc);
                    }
                    node.parentNode.replaceChild(newtag, node);
                    editor.selection.setCursorIn(newtag, true);
                }
            }
        });
    }
};