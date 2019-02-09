/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { completeUrl } from './completeUrl';

export type CallbackAndElement = {
    callback: EventListener,
    element: HTMLElement
};

export const appendScript = (
    url: string,
    callback: (this: HTMLElement, e: Event) => any,
    className: string = '',
    doc: Document
): CallbackAndElement => {
    const script: HTMLScriptElement = doc.createElement('script');
    script.className = className;
    script.type = 'text/javascript';

    if (callback !== undefined) {
        script.addEventListener('load', callback);
    }

    script.src = completeUrl(url);

    doc.body.appendChild(script);

    return {
        callback,
        element: script
    }
};
