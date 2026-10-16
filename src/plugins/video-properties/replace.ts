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
import { css } from 'jodit/core/helpers/utils/css';

import type { EditedMedia, VideoPropertiesState } from './interface';
import { editedMedia, ownSize, readValues } from './readers';
import { applyValues } from './writers';

/**
 * Give `media`, in `outer`, the classes, inline styles, size and playback
 * settings of `old`, in `oldOuter`. It keeps its own source and poster.
 */
function takeOver(
	j: IJodit,
	oldOuter: HTMLElement,
	old: EditedMedia,
	outer: HTMLElement,
	media: EditedMedia
): void {
	const state: VideoPropertiesState = {
		target: oldOuter,
		media: old,
		ratio: 1,
		sizeIsLocked: true,
		values: {
			width: '',
			height: '',
			poster: '',
			autoplay: false,
			loop: false,
			muted: false,
			controls: true
		}
	};

	readValues(state);

	const pairs: Array<[HTMLElement, HTMLElement]> = [[old, media]];

	// A wrapper kept in the content, which holds the alignment
	if (
		oldOuter !== old &&
		outer !== media &&
		oldOuter.nodeName === outer.nodeName
	) {
		pairs.push([oldOuter, outer]);
	}

	pairs.forEach(([from, to]) => {
		['class', 'style'].forEach(name => attr(to, name, attr(from, name)));
	});

	// A video's size is CSS and an embed's its attributes, so the writer sizes
	// one that's a different element
	if (old.nodeName !== media.nodeName) {
		css(media, { width: null, height: null });

		if (!attr(media, 'style')?.trim()) {
			attr(media, 'style', null);
		}
	}

	state.media = media;
	state.values.poster = attr(media, 'poster') || '';

	applyValues(
		j,
		state,
		Boolean(ownSize(old, 'width') || ownSize(old, 'height'))
	);
}

/**
 * Run `insert`, which inserts media at the cursor, with the cursor after
 * `replaced`, and put what it inserts in place of `replaced`
 * @private
 */
export function replaceMedia(
	j: IJodit,
	replaced: HTMLElement,
	insert: () => void
): void {
	const inserted: Node[] = [];
	const collect = (node: Node): void => {
		inserted.push(node);
	};

	j.history.snapshot.transaction(() => {
		j.s.focus();
		j.s.setCursorAfter(replaced);

		j.e.on('afterInsertNode', collect);

		try {
			insert();
		} finally {
			j.e.off('afterInsertNode', collect);
		}

		const [outer] = inserted;

		if (!Dom.isHTMLElement(outer)) {
			return;
		}

		const old = editedMedia(replaced);
		const media = editedMedia(outer);

		if (old && media) {
			takeOver(j, replaced, old, outer, media);
		}

		// The resizer can have put an embed in its own wrapper already
		const placed =
			Dom.isHTMLElement(outer.parentElement) &&
			attr(outer.parentElement, 'data-jodit-temp')
				? outer.parentElement
				: outer;

		// Where the old one was, since media Jodit counts as blocks can be put
		// after the paragraph
		Dom.before(replaced, placed);
		Dom.safeRemove(replaced);
		j.s.setCursorAfter(placed);
	});

	j.synchronizeValues();
	j.e.fire('closeAllPopups');
}
