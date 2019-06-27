/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
