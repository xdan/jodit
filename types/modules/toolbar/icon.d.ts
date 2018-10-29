/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
export declare class ToolbarIcon {
    static icons: {
        [key: string]: string;
    };
    static exists(name: string): boolean;
    /**
     * Return SVG icon
     *
     * @param {string} name icon
     * @param {string} [defaultValue='<span></span>']
     * @return {string}
     */
    static getIcon(name: string, defaultValue?: string): string;
}
