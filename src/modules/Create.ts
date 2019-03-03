/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IDictionary } from '../types';
import { isPlainObject } from './helpers/checker/isPlainObject';
import { each } from './helpers/each';
import { asArray } from './helpers/array/asArray';
import { Dom } from './Dom';
import { css } from './helpers';
import { Attributes, Children, ICreate } from '../types/create';

export class Create implements ICreate {
    private doc: Document;
    public inside: Create;

    constructor(ownerDocument: Document, editorDocument?: Document | null) {
        this.doc = ownerDocument;

        if (editorDocument !== null) {
            this.inside = editorDocument ? new Create(editorDocument) : new Create(ownerDocument, null);
        }
    }

    /**
     * Set document creator
     * @param doc
     */
    setDocument(doc: Document): void {
        this.doc = doc;
    }

    element<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        childrenOrAttributes?: Children
    ): HTMLElementTagNameMap[K];
    element<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        childrenOrAttributes?: Attributes,
        children?: Children
    ): HTMLElementTagNameMap[K];
    element(
        tagName: string,
        childrenOrAttributes?: Attributes | Children,
        children?: Children
    ): HTMLElement {
        const elm: HTMLElement = this.doc.createElement(tagName.toLowerCase());

        if (childrenOrAttributes) {
            if (isPlainObject(childrenOrAttributes)) {
                each(<Attributes>childrenOrAttributes, (key: string, value) => {
                    if (isPlainObject(value) && key === 'style') {
                        css(elm, <IDictionary<string>>value);
                    } else {
                        elm.setAttribute(key, value.toString());
                    }
                });
            } else {
                children = <Children>childrenOrAttributes;
            }
        }

        if (children) {
            asArray(children).forEach((child: string | Node) =>
                elm.appendChild(
                    typeof child === 'string' ? this.fromHTML(child) : child
                )
            );
        }

        return elm;
    }

    div(className?: string, childrenOrAttributes?: Children): HTMLDivElement;
    div(
        className?: string,
        childrenOrAttributes?: Attributes,
        children?: Children
    ): HTMLDivElement;
    div(
        className?: string,
        childrenOrAttributes?: Attributes | Children,
        children?: Children
    ): HTMLDivElement {
        const div = this.element('div', <any>childrenOrAttributes, children);

        if (className) {
            div.className = className;
        }

        return div;
    }

    span(className?: string, childrenOrAttributes?: Children): HTMLSpanElement;
    span(
        className?: string,
        childrenOrAttributes?: Attributes,
        children?: Children
    ): HTMLSpanElement;
    span(
        className?: string,
        childrenOrAttributes?: Attributes | Children,
        children?: Children
    ): HTMLSpanElement {
        const span = this.element('span', <any>childrenOrAttributes, children);

        if (className) {
            span.className = className;
        }

        return span;
    }

    /**
     * Create text node
     *
     * @param value
     */
    text(value: string): Text {
        return this.doc.createTextNode(value);
    }

    /**
     * Create HTML Document fragment element
     */
    fragment(): DocumentFragment {
        return this.doc.createDocumentFragment();
    }

    /**
     * Create DOM element from HTML text
     *
     * @param {string} html
     *
     * @return HTMLElement
     */
    fromHTML(html: string | number): HTMLElement {
        const div: HTMLDivElement = this.div();

        div.innerHTML = html.toString();

        const child: HTMLElement =
            div.firstChild !== div.lastChild || !div.firstChild
                ? div
                : (div.firstChild as HTMLElement);

        Dom.safeRemove(child);

        return child;
    }
}
