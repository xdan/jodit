/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { IS_INLINE } from '../constants';
import { Dom } from '../modules/Dom';
import {
    cleanFromWord,
    debounce,
    normalizeNode,
    trim,
} from '../modules/helpers/';
import { Select } from '../modules/Selection';
import { IDictionary, IJodit } from '../types';

/**
 * @property {object} cleanHTML {@link cleanHtml|cleanHtml}'s options
 * @property {boolean} cleanHTML.cleanOnPaste=true clean pasted html
 * @property {boolean} cleanHTML.replaceNBSP=true Replace &amp;nbsp; toWYSIWYG plain space
 * @property {boolean} cleanHTML.allowTags=false The allowTags option defines which elements will remain in the
 * edited text when the editor saves. You can use this toWYSIWYG limit the returned HTML toWYSIWYG a subset.
 * @example
 * ```javascript
 * var jodit = new Jodit('#editor', {
 *    cleanHTML: {
 *       cleanOnPaste: false
 *    }
 * });
 * ```
 * @example
 * ```javascript
 * var editor = Jodit('#editor', {
 *     cleanHTML: {
 *         allowTags: 'p,a[href],table,tr,td, img[src=1.png]' // allow only <p>,<a>,<table>,<tr>,<td>,<img> tags and
 *         for <a> allow only `href` attribute and <img> allow only `src` atrribute == '1.png'
 *     }
 * });
 * editor.value = 'Sorry! <strong>Goodby</strong>\
 * <span>mr.</span> <a style="color:red" href="http://xdsoft.net">Freeman</a>';
 * console.log(editor.value); //Sorry! <a href="http://xdsoft.net">Freeman</a>
 * ```
 *
 * @example
 * ```javascript
 * var editor = Jodit('#editor', {
 *     cleanHTML: {
 *         allowTags: {
 *             p: true,
 *             a: {
 *                 href: true
 *             },
 *             table: true,
 *             tr: true,
 *             td: true,
 *             img: {
 *                 src: '1.png'
 *             }
 *         }
 *     }
 * });
 * ```
 */
declare module '../Config' {
    interface Config {
        cleanHTML: {
            timeout: number;
            replaceNBSP: boolean;
            cleanOnPaste: boolean;
            fillEmptyParagraph: boolean;
            removeEmptyElements: boolean;
            replaceOldTags: { [key: string]: string } | false;
            allowTags: false | string | { [key: string]: string };
            denyTags: false | string | { [key: string]: string };
        };
    }
}

Config.prototype.cleanHTML = {
    timeout: 300,
    removeEmptyElements: true,
    fillEmptyParagraph: true,
    replaceNBSP: true,
    cleanOnPaste: true,
    replaceOldTags: {
        i: 'em',
        b: 'strong',
    },
    allowTags: false,
    denyTags: false,
};

Config.prototype.controls.eraser = {
    command: 'removeFormat',
    tooltip: 'Clear Formatting',
};

/**
 * Clean HTML after removeFormat and insertHorizontalRule command
 */
export function cleanHtml(editor: IJodit) {
    // TODO compare this functionality and plugin paste.ts
    if (editor.options.cleanHTML.cleanOnPaste) {
        editor.events.on('processPaste', (event: Event, html: string) => {
            return cleanFromWord(html);
        });
    }

    const attributesReg = /([^\[]*)\[([^\]]+)]/,
        seperator = /[\s]*,[\s]*/,
        attrReg = /^(.*)[\s]*=[\s]*(.*)$/;

    const getHash = (
        tags: false | string | IDictionary<string>
    ): IDictionary | false => {
        const tagsHash: IDictionary = {};

        if (typeof tags === 'string') {
            tags.split(seperator).map((elm: string) => {
                elm = trim(elm);
                const attr: RegExpExecArray | null = attributesReg.exec(elm),
                    allowAttributes: IDictionary<string | boolean> = {},
                    attributeMap = (attrName: string) => {
                        attrName = trim(attrName);

                        const val: string[] | null = attrReg.exec(attrName);

                        if (val) {
                            allowAttributes[val[1]] = val[2];
                        } else {
                            allowAttributes[attrName] = true;
                        }
                    };

                if (attr) {
                    const attr2: string[] = attr[2].split(seperator);
                    if (attr[1]) {
                        attr2.forEach(attributeMap);
                        tagsHash[attr[1].toUpperCase()] = allowAttributes;
                    }
                } else {
                    tagsHash[elm.toUpperCase()] = true;
                }
            });

            return tagsHash;
        }

        if (tags) {
            Object.keys(tags).forEach((tagName: string) => {
                tagsHash[tagName.toUpperCase()] = tags[tagName];
            });
            return tagsHash;
        }

        return false;
    };

    let current: Node | false;

    const allowTagsHash: IDictionary | false = getHash(
            editor.options.cleanHTML.allowTags
        ),
        denyTagsHash: IDictionary | false = getHash(
            editor.options.cleanHTML.denyTags
        );

    const hasNotEmptyTextSibling = (node: Node, next = false): boolean => {
        let prev: Node | null = next ? node.nextSibling : node.previousSibling;

        while (prev) {
            if (
                prev.nodeType === Node.ELEMENT_NODE ||
                !Dom.isEmptyTextNode(prev)
            ) {
                return true;
            }
            prev = next ? prev.nextSibling : prev.previousSibling;
        }

        return false;
    };

    const isRemovableNode = (node: Node): boolean => {
        if (
            node.nodeType !== Node.TEXT_NODE &&
            ((allowTagsHash && !allowTagsHash[node.nodeName]) ||
                (denyTagsHash && denyTagsHash[node.nodeName]))
        ) {
            return true;
        }

        // remove extra br
        if (
            current &&
            node.nodeName === 'BR' &&
            hasNotEmptyTextSibling(node) &&
            !hasNotEmptyTextSibling(node, true) &&
            Dom.up(
                node,
                node => Dom.isBlock(node, editor.editorWindow),
                editor.editor
            ) !==
                Dom.up(
                    current,
                    node => Dom.isBlock(node, editor.editorWindow),
                    editor.editor
                )
        ) {
            return true;
        }

        return (
            editor.options.cleanHTML.removeEmptyElements &&
            current !== false &&
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName.match(IS_INLINE) !== null &&
            !editor.selection.isMarker(node) &&
            trim((node as Element).innerHTML).length === 0 &&
            !Dom.isOrContains(node, current)
        );
    };

    editor.events
        .on(
            'change afterSetMode afterInit mousedown keydown',
            debounce(() => {
                if (!editor.isDestructed && editor.isEditorMode() && editor.selection) {
                    current = editor.selection.current();

                    let node: Node | null = null,
                        work: boolean = false,
                        i: number = 0;

                    const remove: Node[] = [],
                        replaceOldTags: { [key: string]: string } | false =
                            editor.options.cleanHTML.replaceOldTags;

                    if (replaceOldTags && current) {
                        const tags: string = Object.keys(replaceOldTags).join(
                            '|'
                        );
                        if (editor.selection.isCollapsed()) {
                            const oldParent: Node | false = Dom.closest(
                                current,
                                tags,
                                editor.editor
                            );
                            if (oldParent) {
                                const selInfo = editor.selection.save(),
                                    tagName: string =
                                        replaceOldTags[
                                            oldParent.nodeName.toLowerCase()
                                        ] || replaceOldTags[oldParent.nodeName];

                                Dom.replace(
                                    oldParent as HTMLElement,
                                    tagName,
                                    true,
                                    false,
                                    editor.editorDocument
                                );
                                editor.selection.restore(selInfo);
                            }
                        }
                    }

                    const checkNode = (
                        nodeElm: Element | Node | null
                    ): void => {
                        if (nodeElm) {
                            if (isRemovableNode(nodeElm)) {
                                remove.push(nodeElm);
                                return checkNode(nodeElm.nextSibling);
                            }

                            if (
                                editor.options.cleanHTML.fillEmptyParagraph &&
                                Dom.isBlock(nodeElm, editor.editorWindow) &&
                                Dom.isEmpty(
                                    nodeElm,
                                    /^(img|svg|canvas|input|textarea|form|br)$/
                                )
                            ) {
                                const br: HTMLBRElement = editor.create.inside.element(
                                    'br'
                                );
                                nodeElm.appendChild(br);
                            }

                            if (
                                allowTagsHash &&
                                allowTagsHash[nodeElm.nodeName] !== true
                            ) {
                                const attributes: NamedNodeMap = (nodeElm as Element)
                                    .attributes;

                                if (attributes && attributes.length) {
                                    const removeAttrs: string[] = [];
                                    for (i = 0; i < attributes.length; i += 1) {
                                        if (
                                            !allowTagsHash[nodeElm.nodeName][
                                                attributes[i].name
                                            ] ||
                                            (allowTagsHash[nodeElm.nodeName][
                                                attributes[i].name
                                            ] !== true &&
                                                allowTagsHash[nodeElm.nodeName][
                                                    attributes[i].name
                                                ] !== attributes[i].value)
                                        ) {
                                            removeAttrs.push(
                                                attributes[i].name
                                            );
                                        }
                                    }

                                    if (removeAttrs.length) {
                                        work = true;
                                    }

                                    removeAttrs.forEach((attr: string) => {
                                        (nodeElm as Element).removeAttribute(
                                            attr
                                        );
                                    });
                                }
                            }

                            checkNode(nodeElm.firstChild);
                            checkNode(nodeElm.nextSibling);
                        }
                    };

                    if (editor.editor.firstChild) {
                        node = editor.editor.firstChild as Element;
                    }

                    checkNode(node);

                    remove.forEach(Dom.safeRemove);

                    if (remove.length || work) {
                        editor.events && editor.events.fire('syncho');
                    }
                }
            }, editor.options.cleanHTML.timeout)
        )
        // remove invisible chars if node has another chars
        .on('keyup', () => {
            if (editor.options.readonly) {
                return;
            }

            const currentNode: false | Node = editor.selection.current();

            if (currentNode) {
                const currentParagraph: Node | false = Dom.up(
                    currentNode,
                    node => Dom.isBlock(node, editor.editorWindow),
                    editor.editor
                );
                if (currentParagraph) {
                    Dom.all(currentParagraph, node => {
                        if (node && node.nodeType === Node.TEXT_NODE) {
                            if (
                                node.nodeValue !== null &&
                                consts.INVISIBLE_SPACE_REG_EXP.test(
                                    node.nodeValue
                                ) &&
                                node.nodeValue.replace(
                                    consts.INVISIBLE_SPACE_REG_EXP,
                                    ''
                                ).length !== 0
                            ) {
                                node.nodeValue = node.nodeValue.replace(
                                    consts.INVISIBLE_SPACE_REG_EXP,
                                    ''
                                );
                                if (
                                    node === currentNode &&
                                    editor.selection.isCollapsed()
                                ) {
                                    editor.selection.setCursorAfter(node);
                                }
                            }
                        }
                    });
                }
            }
        })
        .on('afterCommand', (command: string) => {
            const sel: Select = editor.selection;

            let hr: HTMLHRElement | null, node: Node | null;

            switch (command.toLowerCase()) {
                case 'inserthorizontalrule':
                    hr = editor.editor.querySelector('hr[id=null]');
                    if (hr) {
                        node = Dom.next(
                            hr,
                            node => Dom.isBlock(node, editor.editorWindow),
                            editor.editor,
                            false
                        ) as Node | null;

                        if (!node) {
                            node = editor.create.inside.element(
                                editor.options.enter
                            );
                            if (node) {
                                Dom.after(hr, node as HTMLElement);
                            }
                        }

                        sel.setCursorIn(node);
                    }
                    break;
                case 'removeformat':
                    node = sel.current() as Node;
                    const clean: (elm: Node) => false | void = (elm: Node) => {
                        switch (elm.nodeType) {
                            case Node.ELEMENT_NODE:
                                Dom.each(elm, clean);
                                if (elm.nodeName === 'FONT') {
                                    Dom.unwrap(elm);
                                } else {
                                    // clean some "style" attributes in selected range
                                    [].slice
                                        .call((elm as Element).attributes)
                                        .forEach((attr: Attr) => {
                                            if (
                                                [
                                                    'src',
                                                    'href',
                                                    'rel',
                                                    'content',
                                                ].indexOf(
                                                    attr.name.toLowerCase()
                                                ) === -1
                                            ) {
                                                (elm as Element).removeAttribute(
                                                    attr.name
                                                );
                                            }
                                        });
                                    normalizeNode(elm);
                                }
                                break;
                            case Node.TEXT_NODE:
                                if (
                                    editor.options.cleanHTML.replaceNBSP &&
                                    elm.nodeType === Node.TEXT_NODE &&
                                    elm.nodeValue !== null &&
                                    elm.nodeValue.match(consts.SPACE_REG_EXP)
                                ) {
                                    elm.nodeValue = elm.nodeValue.replace(
                                        consts.SPACE_REG_EXP,
                                        ' '
                                    );
                                }
                                break;
                            default:
                                Dom.safeRemove(elm);
                        }
                    };

                    if (!sel.isCollapsed()) {
                        editor.selection.eachSelection(
                            (currentNode: Node): false | void => {
                                clean(currentNode);
                            }
                        );
                    } else {
                        while (
                            node &&
                            node.nodeType !== Node.ELEMENT_NODE &&
                            node !== editor.editor
                        ) {
                            clean(node);
                            if (node) {
                                node = node.parentNode;
                            }
                        }
                    }

                    break;
            }
        });
}
