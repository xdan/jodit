/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/media/README.md]]
 * @packageDocumentation
 * @module plugins/media
 */

import type { IJodit } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { $$, attr, dataBind } from 'jodit/core/helpers/utils';
import { pluginSystem } from 'jodit/core/global';

import './config';

/**
 * Process `video` and `audio`
 */
export function media(editor: IJodit): void {
	const keyFake: string = 'jodit_fake_wrapper';

	const { mediaFakeTag, mediaBlocks, mediaInFakeBlock } = editor.options;

	const wrap = (element: HTMLElement): void => {
		if (
			element.parentNode &&
			attr(element.parentNode as HTMLElement, 'data-jodit_iframe_wrapper')
		) {
			element = element.parentNode as HTMLElement;
		} else {
			const wrapper = editor.createInside.element(mediaFakeTag, {
				'data-jodit-temp': 1,
				contenteditable: false,
				draggable: true,
				[`data-${keyFake}`]: 1
			});

			attr(wrapper, 'style', attr(element, 'style'));

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

		editor.e
			.off(element, 'mousedown.select touchstart.select')
			.on(element, 'mousedown.select touchstart.select', () => {
				editor.s.setCursorAfter(element);
			});
	};

	if (mediaInFakeBlock) {
		editor.e
			.on('afterGetValueFromEditor', (data: { value: string }) => {
				const rxp = new RegExp(
					`<${mediaFakeTag}[^>]+data-${keyFake}[^>]+>([^]+?)</${mediaFakeTag}>`,
					'ig'
				);

				if (rxp.test(data.value)) {
					data.value = data.value.replace(rxp, '$1');
				}
			})
			.on(
				'change afterInit afterSetMode changePlace',
				editor.async.debounce(() => {
					if (
						!editor.isDestructed &&
						editor.getMode() !== consts.MODE_SOURCE
					) {
						$$(mediaBlocks.join(','), editor.editor).forEach(
							(elm: HTMLElement) => {
								if (!dataBind(elm, keyFake)) {
									dataBind(elm, keyFake, true);
									wrap(elm);
								}
							}
						);
					}
				}, editor.defaultTimeout)
			);
	}
}

pluginSystem.add('media', media);
