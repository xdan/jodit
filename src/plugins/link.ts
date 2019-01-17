/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { convertMediaURLToVideoEmbed, isURL, val } from '../modules/helpers/';
import { Select } from '../modules/Selection';
import { IJodit, markerInfo } from '../types';
import { IControlType } from '../types/toolbar';

/**
 * @property {object}  link `{@link link|link}` plugin's options
 * @property {boolean} link.followOnDblClick=true Follow lnk address after dblclick
 * @property {boolean} link.processVideoLink=true Replace inserted youtube/vimeo link toWYSIWYG `iframe`
 * @property {boolean} link.processPastedLink=true Wrap inserted link in &lt;a href="link">link&lt;/a>
 * @property {boolean} link.openLinkDialogAfterPost=true Open Link dialog after post
 * @property {boolean} link.removeLinkAfterFormat=true When the button is pressed toWYSIWYG clean format,
 * if it was done on the link is removed like command `unlink`
 */

declare module '../Config' {
    interface Config {
        link: {
            followOnDblClick: boolean;
            processVideoLink: boolean;
            processPastedLink: boolean;
            openLinkDialogAfterPost: boolean;
            removeLinkAfterFormat: boolean;
            noFollowCheckbox: boolean;
            openInNewTabCheckbox: boolean;
        };
    }
}
Config.prototype.link = {
    followOnDblClick: true,
    processVideoLink: true,
    processPastedLink: true,
    openLinkDialogAfterPost: true,
    removeLinkAfterFormat: true,
    noFollowCheckbox: true,
    openInNewTabCheckbox: true,
};

Config.prototype.controls.unlink = {
    exec: (editor: IJodit, current: Node) => {
        const anchor: HTMLAnchorElement | false = Dom.closest(
            current,
            'A',
            editor.editor
        ) as HTMLAnchorElement;

        if (anchor) {
            Dom.unwrap(anchor);
        }

        editor.events.fire('hidePopup');
    },
} as IControlType;
Config.prototype.controls.link = {
    isActive: (editor: IJodit): boolean => {
        const current: Node | false = editor.selection.current();
        return current && Dom.closest(current, 'a', editor.editor) !== false;
    },
    popup: (
        editor: IJodit,
        current: HTMLElement | false,
        self: IControlType,
        close: () => void
    ) => {
        const sel: Selection = editor.editorWindow.getSelection(),
            form: HTMLFormElement = editor.create.fromHTML(
                '<form class="jodit_form">' +
                    '<input required type="text" name="url" placeholder="http://" type="text"/>' +
                    '<input name="text" placeholder="' +
                    editor.i18n('Text') +
                    '" type="text"/>' +
                    (editor.options.link.openInNewTabCheckbox
                        ? '<label>' +
                          '<input name="target" type="checkbox"/> ' +
                          editor.i18n('Open in new tab') +
                          '</label>'
                        : '') +
                    (editor.options.link.noFollowCheckbox
                        ? '<label>' +
                          '<input name="nofollow" type="checkbox"/> ' +
                          editor.i18n('No follow') +
                          '</label>'
                        : '') +
                    '<div style="text-align: right">' +
                    '<button class="jodit_unlink_button" type="button">' +
                    editor.i18n('Unlink') +
                    '</button> &nbsp;&nbsp;' +
                    '<button class="jodit_link_insert_button" type="submit"></button>' +
                    '</div>' +
                    '<form/>'
            ) as HTMLFormElement;

        if (current && Dom.closest(current, 'A', editor.editor)) {
            current = Dom.closest(current, 'A', editor.editor) as HTMLElement;
        } else {
            current = false;
        }

        const lnk: HTMLAnchorElement | null = form.querySelector(
                '.jodit_link_insert_button'
            ),
            unlink: HTMLButtonElement | null = form.querySelector(
                '.jodit_unlink_button'
            );

        if (current) {
            val(form, 'input[name=url]', current.getAttribute('href') || '');
            val(form, 'input[name=text]', current.innerText);

            if (editor.options.link.openInNewTabCheckbox) {
                (form.querySelector(
                    'input[name=target]'
                ) as HTMLInputElement).checked =
                    current.getAttribute('target') === '_blank';
            }
            if (editor.options.link.noFollowCheckbox) {
                (form.querySelector(
                    'input[name=nofollow]'
                ) as HTMLInputElement).checked =
                    current.getAttribute('rel') === 'nofollow';
            }
            if (lnk) {
                lnk.innerHTML = editor.i18n('Update');
            }
        } else {
            if (unlink) {
                unlink.style.display = 'none';
            }

            val(form, 'input[name=text]', sel.toString());

            if (lnk) {
                lnk.innerHTML = editor.i18n('Insert');
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

            const a: HTMLAnchorElement =
                (current as HTMLAnchorElement) ||
                editor.editorDocument.createElement('a');

            if (!val(form, 'input[name=url]')) {
                (form.querySelector(
                    'input[name=url]'
                ) as HTMLInputElement).focus();
                (form.querySelector(
                    'input[name=url]'
                ) as HTMLInputElement).classList.add('jodit_error');
                return false;
            }

            a.setAttribute('href', val(form, 'input[name=url]'));
            a.innerText = val(form, 'input[name=text]');

            if (editor.options.link.openInNewTabCheckbox) {
                if (
                    (form.querySelector(
                        'input[name=target]'
                    ) as HTMLInputElement).checked
                ) {
                    a.setAttribute('target', '_blank');
                } else {
                    a.removeAttribute('target');
                }
            }

            if (editor.options.link.noFollowCheckbox) {
                if (
                    (form.querySelector(
                        'input[name=nofollow]'
                    ) as HTMLInputElement).checked
                ) {
                    a.setAttribute('rel', 'nofollow');
                } else {
                    a.removeAttribute('rel');
                }
            }

            if (!current) {
                editor.selection.insertNode(a);
            }

            close();
            return false;
        });

        return form;
    },
    tags: ['a'],
    tooltip: 'Insert link',
} as IControlType;

/**
 * Process link. Insert, dbclick or remove format
 *
 * @module plugins/link
 */
export function link(jodit: IJodit) {
    if (jodit.options.link.followOnDblClick) {
        jodit.events.on('afterInit', () => {
            jodit.events.on(
                jodit.editor,
                'dblclick',
                function(this: HTMLAnchorElement, e: MouseEvent) {
                    const href: string | null = this.getAttribute('href');
                    if (href) {
                        location.href = href;
                        e.preventDefault();
                    }
                },
                'a'
            );
        });
    }
    if (jodit.options.link.processPastedLink) {
        jodit.events.on(
            'processPaste',
            (event: ClipboardEvent, html: string): HTMLAnchorElement | void => {
                if (isURL(html)) {
                    const embed: string = convertMediaURLToVideoEmbed(html);

                    if (embed !== html) {
                        return jodit.create.inside.fromHTML(
                            embed
                        ) as HTMLAnchorElement;
                    }

                    const a: HTMLAnchorElement = jodit.create.inside.element(
                        'a'
                    );

                    a.setAttribute('href', html);
                    a.innerText = html;

                    return a;
                }
            }
        );
    }
    if (jodit.options.link.removeLinkAfterFormat) {
        jodit.events.on('afterCommand', (command: string) => {
            const sel: Select = jodit.selection;

            let newtag: Node, node: Node | false;

            if (command === 'removeFormat') {
                node = sel.current();
                if (node && node.nodeName !== 'A') {
                    node = Dom.closest(node, 'A', jodit.editor);
                }
                if (node && node.nodeName === 'A') {
                    if (
                        (node as HTMLElement).innerHTML ===
                        (node as HTMLElement).innerText
                    ) {
                        newtag = jodit.editorDocument.createTextNode(
                            (node as HTMLElement).innerHTML
                        );
                    } else {
                        newtag = jodit.editorDocument.createElement('span');
                        (newtag as HTMLElement).innerHTML = (node as HTMLElement).innerHTML;
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
