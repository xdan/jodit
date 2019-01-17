/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IDictionary } from '../../types';

export class ToolbarIcon {
    static icons: IDictionary<string> = {};

    static exists(name: string): boolean {
        return ToolbarIcon.icons[name] !== undefined;
    }

    /**
     * Return SVG icon
     *
     * @param {string} name icon
     * @param {string} [defaultValue='<span></span>']
     * @return {string}
     */
    static getIcon(
        name: string,
        defaultValue: string = '<span></span>'
    ): string {
        return ToolbarIcon.icons[name] !== undefined
            ? ToolbarIcon.icons[name]
            : defaultValue;
    }
}
