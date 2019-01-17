/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

export const val = (
    elm: HTMLInputElement | HTMLElement,
    selector: string,
    value?: string
): string => {
    const child = elm.querySelector(selector) as HTMLInputElement;

    if (!child) {
        return '';
    }

    if (value) {
        child.value = value;
    }

    return child.value;
};
