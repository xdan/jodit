/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

let keys = [];

module.exports = function(content, fileData) {
    this.cacheable && this.cacheable();

    const
        start = content.indexOf('exports.default = ') + 18,
        end = content.indexOf('};') + 1,
        json = content.substr(start, end - start)
            // replace ' to "
            .replace(/(\n[\s]{4})'/g, '$1"')
            .replace(/'[\s]*:/g, '":')
            .replace(/:[\s]*'/g, ':"')
            .replace(/'(,|\})/g, '",')

            .replace(/("|')[\s+]+("|')/g, '') // remove string concatenation
            .replace(/,[\s]*\}/g, '}') // remove latest ","
            .replace(/\/\/.*/g, '') // remove comments
            .trim();

    let result = [];

    try {
        let lang = JSON.parse(json);

        if (!keys.length) {
            keys = Object.keys(lang);
        }

        keys.forEach((key, index) => {
           result[index] = lang[key];
        });

        if (fileData.file.indexOf('/en.ts') !== -1) {
            result = keys; // for English file return keys
        }
    } catch(e) {
    }

    return "module.exports.default = " + JSON.stringify(result);
};

module.exports.seperable = true;
