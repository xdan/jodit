/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

/**
 * CTRL pressed
 *
 * @param  {KeyboardEvent} e Event
 * @return {boolean} true ctrl key was pressed
 */
export const ctrlKey = (e: MouseEvent | KeyboardEvent): boolean => {
    if (
        typeof navigator !== 'undefined' &&
        navigator.userAgent.indexOf('Mac OS X') !== -1
    ) {
        if (e.metaKey && !e.altKey) {
            return true;
        }
    } else if (e.ctrlKey && !e.altKey) {
        return true;
    }
    return false;
};
