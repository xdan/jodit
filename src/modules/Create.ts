/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { IDictionary } from '../types';
import { isPlainObject } from './helpers/checker/isPlainObject';
import { each } from './helpers/each';
import { asArray } from './helpers/array/asArray';
import { Dom } from './Dom';

type Attributes = IDictionary<string | number | boolean>;
type Children = string | Array<string | Node> | Node;

export class Create {
    private doc: Document;
    public inside: Create;

    constructor(ownerDocument: Document, editorDocument?: Document) {
        this.doc = ownerDocument;
        this.inside = editorDocument ? new Create(editorDocument) : this;
    }

    element<K extends keyof HTMLElementTagNameMap>(tagName: K,
                                                   childrenOrAttributes?: Children): HTMLElementTagNameMap[K];
    element<K extends keyof HTMLElementTagNameMap>(tagName: K,
                                                   childrenOrAttributes?: Attributes, children?: Children): HTMLElementTagNameMap[K];
    element(tagName: string, childrenOrAttributes?: Attributes | Children, children?: Children): HTMLElement {
        const elm: HTMLElement = this.doc.createElement(tagName.toLowerCase());

        if (childrenOrAttributes) {
            if (isPlainObject(childrenOrAttributes)) {
                each(<Attributes>childrenOrAttributes, (key: string, value) => elm.setAttribute(key, value.toString()));
            } else {
                children = <Children>childrenOrAttributes;
            }
        }

        if (children) {
            asArray(children).forEach((child: string | Node) =>
                elm.appendChild(typeof child === 'string' ? this.fromHTML(child) : child)
            )
        }

        return elm;
    }

    div(className?: string, childrenOrAttributes?: Children): HTMLDivElement;
    div(className?: string, childrenOrAttributes?: Attributes, children?: Children): HTMLDivElement;
    div(className?: string, childrenOrAttributes?: Attributes | Children, children?: Children): HTMLDivElement {
        const div = this.element('div', <any>childrenOrAttributes, children);

        if (className) {
            div.className = className;
        }

        return div;
    }


    /**
     * Create DOM element from HTML text
     *
     * @param {string} html
     *
     * @return HTMLElement
     */
    fromHTML(html: string): HTMLElement {
        const div: HTMLDivElement = this.div();

        div.innerHTML = html;

        const child: HTMLElement =
            div.firstChild !== div.lastChild || !div.firstChild
                ? div
                : (div.firstChild as HTMLElement);

        Dom.safeRemove(child);

        return child;
    }
}