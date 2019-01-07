/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 * @author Patrick Sachs https://github.com/PatrickSachs
 */

export const normalizeRelativePath = (path: string) => {
    const sections = path.split("/");
    const builder = sections.reduce((builder, section) => {
        switch (section) {
            case "": {
                break;
            }
            case ".": {
                break;
            }
            case "..": {
                builder.pop();
                break;
            }
            default: {
                builder.push(section);
                break;
            }
        }
        return builder;
    }, [] as string[]);
    return builder.join("/") + (path.endsWith("/") ? "/" : "");
};