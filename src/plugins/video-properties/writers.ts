/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/video-properties
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr } from 'jodit/core/helpers/utils/attr';
import { css, cssInline } from 'jodit/core/helpers/utils/css';

import type { EditedMedia, VideoPropertiesState } from './interface';
import { ownSize } from './readers';

import { normalSizeToString } from 'jodit/plugins/image-properties/utils/utils';

const cssSize = (value: number | string): string | null =>
	value === '' ? null : normalSizeToString(value);

// Sizes go on as the resizer writes them: an embed takes them as attributes,
// and a video as CSS, without a height while its ratio is kept, if it had none
function applySize(j: IJodit, state: VideoPropertiesState): void {
	const { media, values } = state;

	if (Dom.isTag(media, 'iframe')) {
		(['width', 'height'] as const).forEach(key => {
			attr(media, key, values[key] === '' ? null : values[key]);

			if (cssInline(media, key)) {
				css(media, key, cssSize(values[key]));
			}
		});

		// The resizer's frame for an embed
		const wrapper = media.parentElement;

		if (wrapper && attr(wrapper, 'data-jodit_iframe_wrapper')) {
			css(wrapper, {
				width: media.offsetWidth,
				height: media.offsetHeight
			});
		}

		return;
	}

	const heightFollowsWidth = state.sizeIsLocked && !ownSize(media, 'height');

	css(media, {
		width: cssSize(values.width),
		height: heightFollowsWidth ? null : cssSize(values.height)
	});

	if (!attr(media, 'style')?.trim()) {
		attr(media, 'style', null);
	}

	j.e.fire(media, 'changesize');
}

function setFlag(media: EditedMedia, name: string, on: boolean): void {
	if (media.hasAttribute(name) !== on) {
		attr(media, name, on ? '' : null);
	}
}

/**
 * Apply the dialog's values to the media
 * @private
 */
export function applyValues(
	j: IJodit,
	state: VideoPropertiesState,
	sizeChanged: boolean
): void {
	const { media, values } = state;

	if (sizeChanged && !Dom.isTag(media, 'audio')) {
		applySize(j, state);
	}

	if (Dom.isTag(media, 'iframe')) {
		return;
	}

	if (Dom.isTag(media, 'video')) {
		attr(media, 'poster', values.poster || null);
	}

	// Browsers only autoplay muted media, and playsinline keeps an iPhone from
	// playing it full screen
	setFlag(media, 'autoplay', values.autoplay);
	setFlag(media, 'muted', values.autoplay || values.muted);
	setFlag(media, 'loop', values.loop);
	setFlag(media, 'controls', values.controls || !values.autoplay);

	if (values.autoplay && Dom.isTag(media, 'video')) {
		setFlag(media, 'playsinline', true);
	}
}
