/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/media/README.md]]
 * @packageDocumentation
 * @module plugins/media
 */

import type { IJodit, MediaWrapper } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { getContainer, pluginSystem } from 'jodit/core/global';
import {
	$$,
	attr,
	dataBind,
	getMediaWrapper,
	wrapMedia
} from 'jodit/core/helpers/utils';
import { css, cssInline } from 'jodit/core/helpers/utils/css';

import './config';

/**
 * Process `video` and `audio`
 */
export function media(editor: IJodit): void {
	const keyFake: string = 'jodit_fake_wrapper';

	const { mediaFakeTag, mediaBlocks, mediaInFakeBlock, mediaWrappers } =
		editor.options;

	const wrap = (element: HTMLElement): void => {
		if (
			element.parentNode &&
			attr(element.parentNode as HTMLElement, 'data-jodit_iframe_wrapper')
		) {
			element = element.parentNode as HTMLElement;
		} else if (mediaWrappers[element.nodeName.toLowerCase()]) {
			element =
				getMediaWrapper(editor, element) ?? wrapMedia(editor, element);
		} else if (mediaInFakeBlock) {
			const media = element;
			const wrapper = editor.createInside.element(mediaFakeTag, {
				'data-jodit-temp': 1,
				contenteditable: false,
				draggable: true,
				[`data-${keyFake}`]: 1
			});

			attr(wrapper, 'style', attr(element, 'style'));

			// The wrapper fits the media, whose size changes as its metadata loads
			// and as it's resized. A percentage width is of the line, so it takes that
			const fit = (): void => {
				css(wrapper, {
					display:
						cssInline(media, 'display') === 'inline-block'
							? 'inline-block'
							: 'block',
					width: cssInline(media, 'width').endsWith('%')
						? ''
						: 'fit-content',
					height: ''
				});
			};

			fit();
			editor.e.on(media, 'changesize', fit);

			if (element.parentNode) {
				Dom.before(element, wrapper);
			}

			Dom.append(wrapper, element);

			element = wrapper;
		} else {
			return;
		}

		// Selected, as an image is, so Delete and Backspace remove it
		editor.e
			.off(element, 'mousedown.select touchstart.select')
			.on(element, 'mousedown.select touchstart.select', () => {
				editor.s.select(element);
			});
	};

	// Media in a wrapper kept in the content let clicks through to it, as
	// jodit-media covers its media, so a click selects the media rather than
	// playing it. An inline wrapper holds it as an inline-block, unless its
	// classes or style give it a display of their own
	const wrappers = Object.values(mediaWrappers);

	if (wrappers.length) {
		editor.e.on('afterInit', () => {
			const selectors = (list: string[]): string =>
				[...new Set(list)].join(',');
			const scoped = ({ tag, className }: MediaWrapper): string =>
				`.jodit-wysiwyg ${tag}.${className}`;

			const inline = selectors(
				wrappers
					.filter(({ tag }) => consts.IS_INLINE.test(tag))
					.map(scoped)
			);
			const media = selectors(
				wrappers.flatMap(wrapper =>
					mediaBlocks.map(tag => `${scoped(wrapper)}>${tag}`)
				)
			);

			getContainer(editor, 'media-wrappers', 'style', true).innerHTML =
				(inline ? `:where(${inline}){display:inline-block}` : '') +
				`${media}{pointer-events:none}`;
		});
	}

	if (mediaInFakeBlock || Object.keys(mediaWrappers).length) {
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
