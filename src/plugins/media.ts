/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { debounce } from '../modules/helpers/async';
import { $$ } from '../modules/helpers/selector';
import { IJodit } from '../types';

declare module '../Config' {
    interface Config {
        mediaInFakeBlock: boolean;
        mediaFakeTag: string;
        mediaBlocks: string[];
    }
}

/**
 * @property {string} mediaFakeTag='jodit-media' Decorate media element with tag
 */
Config.prototype.mediaFakeTag = 'jodit-media';

/**
 * @property {boolean} mediaInFakeBlock=true Decorate media elements
 */
Config.prototype.mediaInFakeBlock = true;

/**
 * @property {string[]} mediaBlocks=['video', 'audio'] Media tags
 */
Config.prototype.mediaBlocks = ['video', 'audio'];

export function media(editor: IJodit) {
    const keyFake: string = 'jodit_fake_wrapper';

    const { mediaFakeTag, mediaBlocks, mediaInFakeBlock } = editor.options;

    const wrap = (element: HTMLElement) => {
        if (
            element.parentNode &&
            (element.parentNode as HTMLElement).getAttribute(
                'data-jodit_iframe_wrapper'
            )
        ) {
            element = element.parentNode as HTMLElement;
        } else {
            let wrapper: HTMLElement;

            wrapper = editor.create.inside.fromHTML(
                '<' +
                    mediaFakeTag +
                    ' data-jodit-temp="1" ' +
                    'contenteditable="false" ' +
                    'draggable="true" ' +
                    'data-' +
                    keyFake +
                    '="1">' +
                    '</' +
                    mediaFakeTag +
                    '>'
            );

            wrapper.style.display =
                element.style.display === 'inline-block'
                    ? 'inline-block'
                    : 'block';
            wrapper.style.width = element.offsetWidth + 'px';
            wrapper.style.height = element.offsetHeight + 'px';

            if (element.parentNode) {
                element.parentNode.insertBefore(wrapper, element);
            }

            wrapper.appendChild(element);

            element = wrapper;
        }

        editor.events
            .off(element, 'mousedown.select touchstart.select')
            .on(element, 'mousedown.select touchstart.select', () => {
                editor.selection.setCursorAfter(element);
            });
    };

    if (mediaInFakeBlock) {
        editor.events
            .on('afterGetValueFromEditor', (data: { value: string }) => {
                data.value = data.value.replace(
                    new RegExp(
                        `<${mediaFakeTag}[^>]+data-${keyFake}[^>]+>(.+?)</${mediaFakeTag}>`,
                        'ig'
                    ),
                    '$1'
                );
            })
            .on(
                'change afterInit afterSetMode',
                debounce(() => {
                    if (
                        !editor.isDestructed &&
                        editor.getMode() !== consts.MODE_SOURCE
                    ) {
                        $$(mediaBlocks.join(','), editor.editor).forEach(
                            (elm: HTMLElement) => {
                                if (!(elm as any)['__' + keyFake]) {
                                    (elm as any)['__' + keyFake] = true;
                                    wrap(elm);
                                }
                            }
                        );
                    }
                }, editor.defaultTimeout)
            );
    }
}
