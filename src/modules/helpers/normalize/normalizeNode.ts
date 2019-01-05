/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { INVISIBLE_SPACE_REG_EXP } from '../../../constants';
import { Dom } from '../../Dom';

export const normalizeNode = (node: Node | null) => {
    if (!node) {
        return;
    }

    if (
        node.nodeType === Node.TEXT_NODE &&
        node.nodeValue !== null &&
        node.parentNode
    ) {
        while (
            node.nextSibling &&
            node.nextSibling.nodeType === Node.TEXT_NODE
            ) {
            if (node.nextSibling.nodeValue !== null) {
                node.nodeValue += node.nextSibling.nodeValue;
            }
            node.nodeValue = node.nodeValue.replace(
                INVISIBLE_SPACE_REG_EXP,
                ''
            );
            Dom.safeRemove(node.nextSibling);
        }
    } else {
        normalizeNode(node.firstChild);
    }

    normalizeNode(node.nextSibling);
};