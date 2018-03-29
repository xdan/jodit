/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config'
import {isURL, convertMediaURLToVideoEmbed, dom, val} from '../modules/Helpers'
import {Dom} from "../modules/Dom";
import {ControlType} from "../modules/ToolbarCollection";
import {markerInfo} from "../modules/Selection";
import {Select} from "../modules/Selection";

/**
* @property {object}  link `{@link link|link}` plugin's options
* @property {boolean} link.followOnDblClick=true Follow lnk address after dblclick
* @property {boolean} link.processVideoLink=true Replace inserted youtube/vimeo link toWYSIWYG `iframe`
* @property {boolean} link.processPastedLink=true Wrap inserted link in &lt;a href="link">link&lt;/a>
* @property {boolean} link.openLinkDialogAfterPost=true Open Link dialog after post
* @property {boolean} link.removeLinkAfterFormat=true When the button is pressed toWYSIWYG clean format, if it was done on the link is removed like command `unlink`
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


Config.prototype.controls.unlink = <ControlType>{
    exec: (editor: Jodit, current: Node) => {
        let anchor: HTMLAnchorElement|false = <HTMLAnchorElement>Dom.closest(current, 'A', editor.editor);

        if (anchor) {
            Dom.unwrap(anchor);
        }

        editor.events.fire('hidePopup');
    }
};
Config.prototype.controls.link = <ControlType> {
    isActive: (editor: Jodit): boolean => {
        const current: Node | false = editor.selection.current();
        return current && Dom.closest(current, 'a', editor.editor) !== false;
    },
    popup: (editor: Jodit, current: HTMLElement|false, self: ControlType, close: Function) => {
        const sel: Selection = editor.editorWindow.getSelection(),
            form: HTMLFormElement = <HTMLFormElement>dom(
                '<form class="jodit_form">' +
                    '<input required type="text" name="url" placeholder="http://" type="text"/>' +
                    '<input name="text" placeholder="' + editor.i18n('Text') + '" type="text"/>' +
                    '<label>' +
                        '<input name="target" type="checkbox"/> ' + editor.i18n('Open in new tab') +
                    '</label>' +
                    '<label>' +
                        '<input name="nofollow" type="checkbox"/> ' + editor.i18n('No follow') +
                    '</label>' +
                    '<div style="text-align: right">' +
                        '<button class="jodit_unlink_button" type="button">' + editor.i18n('Unlink') + '</button> &nbsp;&nbsp;' +
                        '<button class="jodit_link_insert_button" type="submit"></button>' +
                    '</div>' +
                '<form/>',
                editor.ownerDocument
            );

        if (current && Dom.closest(current, 'A', editor.editor)) {
            current = <HTMLElement>Dom.closest(current, 'A', editor.editor)
        } else {
            current = false;
        }

        const link: HTMLAnchorElement | null = form.querySelector('.jodit_link_insert_button');
        const unlink: HTMLButtonElement | null = form.querySelector('.jodit_unlink_button');

        if (current) {
            val(form, 'input[name=url]', current.getAttribute('href') || '');
            val(form, 'input[name=text]', current.innerText);

            (<HTMLInputElement>form.querySelector('input[name=target]')).checked = (current.getAttribute('target') === '_blank');
            (<HTMLInputElement>form.querySelector('input[name=nofollow]')).checked = (current.getAttribute('rel') === 'nofollow');
            if (link) {
                link.innerHTML = editor.i18n('Update');
            }
        } else {
            if (unlink) {
                unlink.style.display = 'none';
            }

            val(form, 'input[name=text]', sel.toString());

            if (link) {
                link.innerHTML = editor.i18n('Insert');
            }
        }

        const selInfo: markerInfo[] = editor.selection.save();

        if (unlink) {
            unlink.addEventListener('mousedown', (e: MouseEvent) => {
                if (current) {
                    Dom.unwrap(current);
                }
                editor.selection.restore(selInfo);
                close();
                e.preventDefault();
            });
        }

        form.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            editor.selection.restore(selInfo);

            let a: HTMLAnchorElement = <HTMLAnchorElement>current || editor.editorDocument.createElement('a');

            if (!val(form, 'input[name=url]')) {
                (<HTMLInputElement>form.querySelector('input[name=url]')).focus();
                (<HTMLInputElement>form.querySelector('input[name=url]')).classList.add('jodit_error');
                return false;
            }


            a.setAttribute('href', val(form, 'input[name=url]'));
            a.innerText = val(form, 'input[name=text]');

            if ((<HTMLInputElement>form.querySelector('input[name=target]')).checked) {
                a.setAttribute('target', '_blank');
            } else {
                a.removeAttribute('target');
            }

            if ((<HTMLInputElement>form.querySelector('input[name=nofollow]')).checked) {
                a.setAttribute('rel', 'nofollow');
            } else {
                a.removeAttribute('rel');
            }

            if (!current) {
                editor.selection.insertNode(a);
            }

            close();
            return false;
        });

        return form;
    },
    tags: ["a"],
    tooltip: "Insert link"
};

/**
 * Process link. Insert, dbclick or remove format
 *
 * @module plugins/link
 */
export function link(jodit: Jodit) {
    if (jodit.options.link.followOnDblClick) {
        jodit.events.on('afterInit', () => {
            jodit.events.on(jodit.editor, 'dblclick', function (this: HTMLAnchorElement, e: MouseEvent) {
                const href: string|null = this.getAttribute('href');
                if (href) {
                    location.href = href;
                    e.preventDefault();
                }
            }, 'a');
        });
    }
    if (jodit.options.link.processPastedLink) {
        jodit.events.on('processPaste',  (event: ClipboardEvent, html: string): HTMLAnchorElement|void => {
            if (isURL(html)) {
                const embed: string = convertMediaURLToVideoEmbed(html);

                if (embed !== html) {
                    return <HTMLAnchorElement>dom(embed, jodit.editorDocument);
                }

                const a: HTMLAnchorElement = jodit.editorDocument.createElement('a');
                a.setAttribute('href', html);
                a.innerText = html;
                if (jodit.options.link.openLinkDialogAfterPost) {
                    setTimeout(() => {
                        //parent.selection.setCursorIn(a, true);
                        //editor.selection.selectNodes(Array.prototype.slice.call(a.childNodes));
                    }, 100);
                }

                return a;
            }
        });
    }
    if (jodit.options.link.removeLinkAfterFormat) {
        jodit.events.on('afterCommand', (command: string) => {
            let sel: Select = jodit.selection,
                newtag: Node,
                node: Node|false;

            if (command === 'removeFormat') {
                node = sel.current();
                if (node && node.nodeName !== 'A') {
                    node = Dom.closest(node, 'A', jodit.editor);
                }
                if (node && node.nodeName === 'A') {
                    if ((<HTMLElement>node).innerHTML === (<HTMLElement>node).innerText) {
                        newtag = jodit.editorDocument.createTextNode((<HTMLElement>node).innerHTML);
                    } else {
                        newtag = jodit.editorDocument.createElement('span');
                        (<HTMLElement>newtag).innerHTML = (<HTMLElement>node).innerHTML;
                    }

                    if (node.parentNode) {
                        node.parentNode.replaceChild(newtag, node);
                        jodit.selection.setCursorIn(newtag, true);
                    }
                }
            }
        });
    }
}