/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

/**
 * Check if browser has a color picker (a new HTML5 attribute for input tag)
 *
 * @method hasBrowserColorPicker
 * @return {boolean}
 */
export const hasBrowserColorPicker = (): boolean => {
    let supportsColor = true;

    try {
        const
            a = document.createElement("input");

        a.type = "color";
        supportsColor = a.type === "color" && typeof a.selectionStart !== "number";
    } catch (e) {
        supportsColor = false;
    }

    return supportsColor;
};
