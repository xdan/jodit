/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
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