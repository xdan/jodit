/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';

export function imageInlineToolbar(editor: Jodit) {
    editor.events.on('click', (event: Event) => {
        if (event.target && event.target['tagName'] === 'IMG') {
            //alert(1);
        }
    });
}