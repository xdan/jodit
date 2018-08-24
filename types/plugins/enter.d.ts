/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
/**
 * Insert default paragraph
 *
 * @param {Jodit} editor
 * @param {Node} [fake]
 * @param {String} [wrapperTag]
 * @param {CSSStyleSheet} [style]
 * @return {HTMLElement}
 */
export declare const insertParagraph: (editor: Jodit, fake?: false | Text | undefined, wrapperTag?: string | undefined, style?: CSSStyleDeclaration | undefined) => HTMLElement;
/**
 * One of most important core plugins. It is responsible for all the browsers to have the same effect when the Enter button is pressed. By default, it should insert the <p>
 */
export declare function enter(editor: Jodit): void;
