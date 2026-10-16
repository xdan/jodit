/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/video-properties
 */

import type { Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { isNumeric } from 'jodit/core/helpers/checker/is-numeric';
import { attr } from 'jodit/core/helpers/utils/attr';
import { cssInline } from 'jodit/core/helpers/utils/css';

import type { EditedMedia, VideoPropertiesState } from './interface';

import { normalSizeFromString } from 'jodit/plugins/image-properties/utils/utils';

const mediaSelector = 'video, audio, iframe';

/**
 * The media `target` is, or holds as its wrapper (`jodit-media`, the resizer's
 * `jodit` for an embed, or one from `mediaWrappers`)
 * @private
 */
export function editedMedia(target: HTMLElement): Nullable<EditedMedia> {
	return (
		target.matches(mediaSelector)
			? target
			: target.querySelector(mediaSelector)
	) as Nullable<EditedMedia>;
}

/**
 * The size `media` is given, inline or by its attribute
 * @private
 */
export function ownSize(media: EditedMedia, key: 'width' | 'height'): string {
	return cssInline(media, key) || attr(media, key) || '';
}

const toNumber = (value: number | string): number =>
	parseFloat(value.toString());

/**
 * Read the media's values into the state
 * @private
 */
export function readValues(state: VideoPropertiesState): void {
	const { media, values } = state;

	const width = ownSize(media, 'width');
	const height = ownSize(media, 'height');

	values.width = width ? normalSizeFromString(width) : media.offsetWidth;
	values.height = height ? normalSizeFromString(height) : '';

	if (Dom.isTag(media, 'video') && media.videoWidth) {
		state.ratio = media.videoWidth / media.videoHeight;
	} else if (isNumeric(values.width) && isNumeric(values.height)) {
		state.ratio = toNumber(values.width) / toNumber(values.height);
	} else {
		state.ratio = media.offsetWidth / media.offsetHeight || 1;
	}

	// One with no height takes it from its width
	if (!height && isNumeric(values.width)) {
		values.height = Math.round(toNumber(values.width) / state.ratio);
	}

	state.sizeIsLocked =
		isNumeric(values.width) &&
		isNumeric(values.height) &&
		(!height ||
			Math.abs(
				toNumber(values.width) - toNumber(values.height) * state.ratio
			) < 1);

	values.poster = attr(media, 'poster') || '';
	values.autoplay = media.hasAttribute('autoplay');
	values.loop = media.hasAttribute('loop');
	// Autoplay's own: turning it off gives the sound back
	values.muted = media.hasAttribute('muted') && !values.autoplay;
	// Without Autoplay it keeps its controls, or it could never be played
	values.controls = media.hasAttribute('controls') || !values.autoplay;
}
