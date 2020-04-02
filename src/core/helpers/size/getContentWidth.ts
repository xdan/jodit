/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 *
 * @param element
 * @param win
 */
export const getContentWidth = (element: HTMLElement, win: Window) => {
    const pi = (value: string): number => parseInt(value, 10),
        style: CSSStyleDeclaration = win.getComputedStyle(element),
        width: number = element.offsetWidth,
        paddingLeft: number = pi(style.getPropertyValue('padding-left') || '0'),
        paddingRight: number = pi(
            style.getPropertyValue('padding-right') || '0'
        );

    return width - paddingLeft - paddingRight;
};
