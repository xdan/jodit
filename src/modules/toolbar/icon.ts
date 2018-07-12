/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

export class ToolbarIcon {
    static icons: {[key: string]: string} = {};

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
    static getIcon(name: string, defaultValue:string = '<span></span>'): string {
        return ToolbarIcon.icons[name] !== undefined ? ToolbarIcon.icons[name] : defaultValue;
    }
}