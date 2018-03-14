/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config'
import * as consts from '../constants';
import {cleanFromWord, debounce, normalizeNode, trim} from "../modules/Helpers";
import {Dom} from "../modules/Dom";
import {Select} from "../modules/Selection";
import {IS_SPAN} from "../constants";

/**
 * @property {object} cleanHTML {@link cleanHTML|cleanHTML}'s options
 * @property {boolean} cleanHTML.cleanOnPaste=true clean pasted html
 * @property {boolean} cleanHTML.replaceNBSP=true Replace &amp;nbsp; toWYSIWYG plain space
 * @property {boolean} cleanHTML.allowTags=false The allowTags option defines which elements will remain in the edited text when the editor saves. You can use this toWYSIWYG limit the returned HTML toWYSIWYG a subset.
 * @example
 * ```javascript
 * var jodit = new Jodit('#editor', {
 *    cleanHTML: {
 *       cleanOnPaste: false
 *    }
 * });
 ```
 * @example
 * ```javascript
 * var editor = Jodit('#editor', {
 *     allowTags: 'p,a[href],table,tr,td, img[src=1.png]' // allow only <p>,<a>,<table>,<tr>,<td>,<img> tags and for <a> allow only `href` attribute and <img> allow only `src` atrribute == '1.png'
 * });
 * editor.value = 'Sorry! <strong>Goodby</strong> <span>mr.</span> <a style="color:red" href="http://xdsoft.net">Freeman</a>';
 * console.log(editor.value); //Sorry! <a href="http://xdsoft.net">Freeman</a>
 * ```
 *
 * @example
 * ```javascript
 * var editor = Jodit('#editor', {
 *     allowTags: {
 *         p: true,
 *         a: {
 *             href: true
 *         },
 *         table: true,
 *         tr: true,
 *         td: true,
 *         img: {
 *             src: '1.png'
 *         }
 *     }
 * });
 * ```
 */
declare module "../Config" {
    interface Config {
        cleanHTML: {
            timeout: number;
            replaceNBSP: boolean,
            cleanOnPaste: boolean,
            removeEmptyElements: boolean,
            allowTags: false | string | {[key:string]: string},
            denyTags: false | string | {[key:string]: string}
        }
    }
}

Config.prototype.cleanHTML = {
    timeout: 0,
    removeEmptyElements: true,
    replaceNBSP: true,
    cleanOnPaste: true,
    allowTags: false,
    denyTags: false,
};

Config.prototype.controls.eraser = {
    command: 'removeFormat',
    tooltip: 'Clear Formatting'
};


/**
 * Clean HTML after removeFormat and insertHorizontalRule command
 */
export function cleanHTML(editor: Jodit) {
    if (editor.options.cleanHTML.cleanOnPaste) {
        editor.events.on('processPaste', (event: Event, html: string) => {
            return cleanFromWord(html);
        });
    }

    const
        attributesReg = /([^\[]*)\[([^\]]+)]/,
        seperator = /[\s]*,[\s]*/,
        attrReg = /^(.*)[\s]*=[\s]*(.*)$/;

    const getHash = (tags: false | string | {[key:string]: string}): {[key: string]: any} | false=> {
        const tagsHash: {[key: string]: any} = {};

        if (typeof tags === 'string') {
            tags.split(seperator).map((elm) => {
                elm = trim(elm);
                let attr: RegExpExecArray | null = attributesReg.exec(elm),
                    allowAttributes: {[key: string]: string | boolean} = {},
                    attributeMap = (attr: string) => {
                        attr = trim(attr);
                        const val: Array<string> | null = attrReg.exec(attr);
                        if (val) {
                            allowAttributes[val[1]] = val[2];
                        } else {
                            allowAttributes[attr] = true;
                        }
                    };

                if (attr) {
                    const attr2: string[] = attr[2].split(seperator);
                    if (attr[1]) {
                        attr2.map(attributeMap);
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

    let
        current: Node | false,
        allowTagsHash: {[key: string]: any} | false = getHash(editor.options.cleanHTML.allowTags),
        denyTagsHash: {[key: string]: any} | false = getHash(editor.options.cleanHTML.denyTags);

    const isRemovableNode = (node: Node): boolean => {
        if (
            node.nodeType !== Node.TEXT_NODE &&
            (
                (allowTagsHash && !allowTagsHash[node.nodeName]) ||
                (denyTagsHash && denyTagsHash[node.nodeName])
            )
        ) {
            return true;
        }

        if (
            editor.options.cleanHTML.removeEmptyElements &&
            current &&
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName.match(IS_SPAN) &&
            !editor.selection.isMarker(node) &&
            trim((<Element>node).innerHTML).length === 0 &&
            !Dom.isOrContains(node, current)
        ) {
            return true;
        }

        return false;
    };


    editor.events
        .on('change afterSetMode afterInit mousedown keydown', debounce(() => {
        if (!editor.isDestructed && editor.isEditorMode()) {
            current = editor.selection.current();

            let node: Node | null = null,
                remove: Node[] = [],
                work: boolean = false,
                i: number = 0;

            const checkNode = (node: Node | null): void => {
                if (node) {
                    if (isRemovableNode(node)) {
                        remove.push(node);
                        return checkNode(node.nextSibling);
                    }

                    if (allowTagsHash && allowTagsHash[node.nodeName] !== true) {
                        if (node.attributes && node.attributes.length) {
                            const removeAttrs: string[] = [];
                            for (i = 0; i < node.attributes.length; i += 1) {
                                if (!allowTagsHash[node.nodeName][node.attributes[i].name] ||
                                    (
                                        allowTagsHash[node.nodeName][node.attributes[i].name] !== true &&
                                        allowTagsHash[node.nodeName][node.attributes[i].name] !== node.attributes[i].value
                                    )
                                ) {
                                    removeAttrs.push(node.attributes[i].name);
                                }
                            }

                            if (removeAttrs.length) {
                                work = true;
                            }

                            removeAttrs.forEach((attr: string) => {
                                (<Element>node).removeAttribute(attr);
                            });
                        }
                    }

                    checkNode(node.firstChild);
                    checkNode(node.nextSibling);
                }
            };

            if (editor.editor.firstChild) {
                node = <Element>editor.editor.firstChild;
            }


            checkNode(node);


            remove.forEach((node: Node) => node.parentNode && node.parentNode.removeChild(node));

            if (remove.length || work) {
                editor.setEditorValue();
            }
        }
    }, editor.options.cleanHTML.timeout))
        // remove invisible spaces then they already not need
        .on('keyup',  () => {
            if (editor.selection.isCollapsed()) {
                let node: Node | null = <Node | null> editor.selection.current();
                if (node && node.nodeType === Node.TEXT_NODE && node.nodeValue !== consts.INVISIBLE_SPACE) {
                    while (node = Dom.findInline(node, true, editor.editor)) {
                        if (node && node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.match(consts.INVISIBLE_SPACE_REG_EXP)) {
                            node.nodeValue = node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP, '');
                        }
                    }
                }
            }
        })
        .on('afterCommand',  (command: string) => {
            let sel: Select = editor.selection,
                hr: HTMLHRElement | null,
                node: Node | null;

            switch (command.toLowerCase()) {
                case 'inserthorizontalrule':
                hr = editor.editor.querySelector('hr[id=null]');
                if (hr) {
                    node = <Node | null>Dom.next(hr, Dom.isBlock, editor.editor, false);
                    if (!node) {
                        node = <Node>Dom.create(editor.options.enter, '', editor.editorDocument);
                        if (node) {
                            Dom.after(hr, <HTMLElement>node)
                        }
                    }
                    sel.setCursorIn(node);
                }
                break;
                case 'removeformat':
                    node = <Node>sel.current();
                    const clean: (elm: Node) => false | void = (elm: Node) => {
                        switch (elm.nodeType) {
                            case Node.ELEMENT_NODE:
                                Dom.each(elm, clean);
                                if (elm.nodeName === 'FONT') {
                                    Dom.unwrap(elm);
                                } else {
                                    // clean some "style" attributes in selected range
                                    [].slice.call((<Element>elm).attributes).forEach((attr: Attr) => {
                                        if (['src', 'href', 'rel', 'content'].indexOf(attr.name.toLowerCase()) === -1) {
                                            (<Element>elm).removeAttribute(attr.name);
                                        }
                                    });
                                    normalizeNode(elm);
                                }
                                break;
                            case Node.TEXT_NODE:
                                if (editor.options.cleanHTML.replaceNBSP && elm.nodeType === Node.TEXT_NODE && elm.nodeValue !== null && elm.nodeValue.match(consts.SPACE_REG_EXP)) {
                                    elm.nodeValue = elm.nodeValue.replace(consts.SPACE_REG_EXP, ' ');
                                }
                                break;
                            default:
                                elm.parentNode && elm.parentNode.removeChild(elm);
                        }
                    };

                    if (!sel.isCollapsed()) {
                        editor.selection.eachSelection((current: Node): false | void => {
                            clean(current);
                        });
                    } else {
                        while (node && node.nodeType !== Node.ELEMENT_NODE && node !== editor.editor) {
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