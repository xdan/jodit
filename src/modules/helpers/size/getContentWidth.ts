/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
