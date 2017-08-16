import Jodit from '../Jodit';
import {Config} from '../Config'
import {isURL, convertMediaURLToVideoEmbed} from '../modules/Helpers'
import Dom from "../modules/Dom";

/**
* @property {object}  link `{@link module:link|link}` plugin's options
* @property {boolean} link.followOnDblClick=true Follow lnk address after dblclick
* @property {boolean} link.processVideoLink=true Replace inserted youtube/vimeo link toWYSIWYG `iframe`
* @property {boolean} link.processPastedLink=true Wrap inserted link in &lt;a href="link">link&lt;/a>
* @property {boolean} link.openLinkDialogAfterPost=true Open Link dialog after post
* @property {boolean} link.removeLinkAfterFormat=true When the button is pressed toWYSIWYG clean format, if it was done on the link is removed like command `unlink`
* @memberof Jodit.defaultOptions
*/

declare module "../Config" {
    interface Config {
        link: {
            followOnDblClick: boolean;
            processVideoLink: boolean;
            processPastedLink: boolean;
            openLinkDialogAfterPost: boolean;
            removeLinkAfterFormat: boolean;
        }
    }
}
Config.prototype.link = {
    followOnDblClick: true,
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
Jodit.plugins.link = function (jodit: Jodit) {
    if (jodit.options.link.followOnDblClick) {
        jodit.events.on('afterInit', () => {
            jodit.__on(jodit.editor, 'dblclick', 'a', function (this: HTMLAnchorElement, e: MouseEvent) {
                if (this.getAttribute('href')) {
                    location.href = this.getAttribute('href');
                    e.preventDefault();
                }
            });
        });
    }
    if (jodit.options.link.processPastedLink) {
        jodit.events.on('processPaste', function (event, html) {
            if (isURL(html)) {
                let a;
                if (convertMediaURLToVideoEmbed(html) !== html) {
                    a = convertMediaURLToVideoEmbed(html);
                } else {
                    a = jodit.doc.createElement('a');
                    a.setAttribute('href', html);
                    a.innerText = html;
                    if (jodit.options.link.openLinkDialogAfterPost) {
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
    if (jodit.options.link.removeLinkAfterFormat) {
        jodit.events.on('afterCommand', function (command) {
            let sel = jodit.selection,
                newtag,
                node;

            if (command === 'removeFormat') {
                node = sel.current();
                if (node && node.tagName !== 'A') {
                    node = Dom.closest(node, 'A', jodit.editor);
                }
                if (node && node.tagName === 'A') {
                    if (node.innerHTML === node.innerText) {
                        newtag = Dom.create('text', node.innerText, jodit.doc);
                    } else {
                        newtag = Dom.create('span', node.innerHTML, jodit.doc);
                    }
                    node.parentNode.replaceChild(newtag, node);
                    jodit.selection.setCursorIn(newtag, true);
                }
            }
        });
    }
};