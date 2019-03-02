/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IDictionary } from './types';

export type Attributes = IDictionary<
    string | number | boolean | IDictionary<string | number | boolean>
>;
export type Children = string | Array<string | Node> | Node;

interface ICreate {
    inside: ICreate;

    setDocument(doc: Document): void;

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
    ): HTMLElement;

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
    ): HTMLDivElement;

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
    ): HTMLSpanElement;

    /**
     * Create text node
     *
     * @param value
     */
    text(value: string): Text;

    /**
     * Create HTML Document fragment element
     */
    fragment(): DocumentFragment;

    /**
     * Create DOM element from HTML text
     *
     * @param {string} html
     *
     * @return HTMLElement
     */
    fromHTML(html: string): HTMLElement;
}
