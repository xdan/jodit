import Jodit from '../Jodit';
import {Config} from '../Config'
import * as consts from '../constants';
import {cleanFromWord, trim} from "../modules/Helpers";

/**
* @property {object} cleanHTML {@link module:cleanHTML|cleanHTML}'s options
* @property {boolean} cleanHTML.cleanOnPaste=true clean pasted html
* @property {boolean} cleanHTML.replaceNBSP=true Replace &amp;nbsp; to plain space
* @property {boolean} cleanHTML.allowTags=false The allowTags option defines which elements will remain in the edited text when the editor saves. You can use this to limit the returned HTML to a subset.
* @memberof Jodit.defaultOptions
* @example
* var jodit = new Jodit('#editor', {
*    cleanHTML: {
*       cleanOnPasteL false
*    }
* });
* @example
* var editor = Jodit('#editor', {
*     allowTags: 'p,a[href],table,tr,td, img[src=1.png]' // allow only <p>,<a>,<table>,<tr>,<td>,<img> tags and for <a> allow only `href` attribute and <img> allow only `src` atrribute == '1.png'
* });
* editor.val('Sorry! <strong>Goodby</strong> <span>mr.</span> <a style="color:red" href="http://xsoft.net">Freeman</a>');
* console.log(editor.val()); //Sorry! <a href="http://xsoft.net">Freeman</a>
*
* @example
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
*/
declare module "../Config" {
    interface Config {
        cleanHTML: {
            replaceNBSP: boolean,
            cleanOnPaste: boolean,
            allowTags: false|string|{[key:string]: string}
        }
    }
}

Config.prototype.cleanHTML = {
    replaceNBSP: true,
    cleanOnPaste: true,
    allowTags: false
};

/**
 * Clean HTML after removeFormat and insertHorizontalRule command
 *
 * @module cleanHTML
 */
Jodit.plugins.cleanHTML = function (editor: Jodit) {

    if (editor.options.cleanHTML.cleanOnPaste) {
        editor.events.on('processPaste', (event, html) => {
            return cleanFromWord(html);
        });
    }

    if (editor.options.cleanHTML.allowTags) {
        let attributesReg = /([^\[]*)\[([^\]]+)]/,
            seperator = /[\s]*,[\s]*/,
            attrReg = /^(.*)[\s]*=[\s]*(.*)$/,
            allowTagsHash = {};

        if (typeof editor.options.cleanHTML.allowTags === 'string') {
            editor.options.cleanHTML.allowTags.split(seperator).map((elm) => {
                elm = trim(elm);
                let attr = attributesReg.exec(elm),
                    allowAttributes = {},
                    attributeMap = function (attr) {
                        attr = trim(attr);
                        let val = attrReg.exec(attr);
                        if (val) {
                            allowAttributes[val[1]] = val[2];
                        } else {
                            allowAttributes[attr] = true;
                        }
                    };

                if (attr) {
                    let attr2 = attr[2].split(seperator);
                    if (attr[1]) {
                        attr2.map(attributeMap);
                        allowTagsHash[attr[1].toUpperCase()] = allowAttributes;
                    }
                } else {
                    allowTagsHash[elm.toUpperCase()] = true;
                }
            });
        } else {
            allowTagsHash = editor.options.cleanHTML.allowTags;
        }

        editor.events.on('beforeSetElementValue', function (data) {
            if (editor.getMode() === consts.MODE_WYSIWYG) {
                let div = editor.node.create('div'), node, remove = [], removeAttrs, i;
                div['innerHTML'] = data.value;
                node = div.firstChild;

                while (node) {
                    if (node.tagName) {
                        if (!allowTagsHash[node.tagName]) {
                            remove.push(node);
                            node = editor.node.next(node, (elm) => (elm), div, true);
                            continue;
                        }
                        if (allowTagsHash[node.tagName] !== true) {
                            if (node.attributes && node.attributes.length) {
                                removeAttrs = [];
                                for (i = 0; i < node.attributes.length; i += 1) {
                                    if (!allowTagsHash[node.tagName][node.attributes[i].name] ||
                                            (
                                                allowTagsHash[node.tagName][node.attributes[i].name] !== true &&
                                                allowTagsHash[node.tagName][node.attributes[i].name] !== node.attributes[i].value
                                            )
                                            ) {
                                        removeAttrs.push(node.attributes[i].name);
                                    }
                                }
                                for (i = 0; i <= removeAttrs.length; i += 1) {
                                    node.removeAttribute(removeAttrs[i]);
                                }
                            }
                        }
                    }
                    node = editor.node.next(node, (elm) => (elm), div, true);
                }
                for (i = 0; i < remove.length; i += 1) {
                    if (remove[i].parentNode) {
                        remove[i].parentNode.removeChild(remove[i]);
                    }
                }
                data.value = div['innerHTML'];
            }
        });
    }
    editor.events.on('afterCommand', function (command) {
        let sel = editor.selection,
            hr,
            node,
            clean;

        switch (command) {
        case 'insertHorizontalRule':
            hr = editor.editor.querySelector('hr[id=null]');
            if (hr) {
                node = editor.node.next(hr, editor.node.isBlock, editor.editor, false);
                if (!node) {
                    node = editor.node.create(editor.options.enter);
                    editor.node.after(hr, node)
                }
                sel.setCursorIn(node);
            }
            break;
        case 'removeFormat':
            node = sel.current();
            clean = (elm) => {
                if (elm.nodeType === Node.ELEMENT_NODE) {
                    // clean some "style" attributes in selected range
                    if (elm.hasAttribute('style')) {
                        elm.removeAttribute('style');
                    }
                    if (elm.tagName === 'FONT') {
                        editor.node.each(elm, clean);
                        elm = editor.node.replace(elm, 'span');
                    }
                    if (elm.normalize) {
                        elm.normalize();
                    }
                } else {
                    if (editor.options.cleanHTML.replaceNBSP && elm.nodeType === Node.TEXT_NODE && elm.nodeValue.match(consts.SPACE_REG_EXP)) {
                        elm.nodeValue = elm.nodeValue.replace(consts.SPACE_REG_EXP, ' ');
                    }
                }
                return elm;
            };

            if (!sel.isCollapsed()) {
                editor.win.getSelection().removeAllRanges();
            } else {
                while (node && node.nodeType !== Node.ELEMENT_NODE && node !== editor.editor) {
                    node = clean(node);
                    node = node.parentNode;
                }
            }

            break;
        }
    });
};