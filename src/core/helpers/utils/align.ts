/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { HAlignClasses, IJodit, ImageHAlign, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { attr } from 'jodit/core/helpers/utils/attr';
import { clearCenterAlign, css, cssInline } from 'jodit/core/helpers/utils/css';
import { getWrappedMedia } from 'jodit/core/helpers/utils/media-wrapper';

// The sets of class names an alignment lists, the first being the one to write
const classSets = (value?: string | string[]): string[][] =>
	(isArray(value) ? value : [value ?? ''])
		.map(set => set.split(/\s+/).filter(Boolean))
		.filter(set => set.length);

/**
 * The class names to align `elm` with: `alignClasses` for its tag, or for the
 * media in it when it wraps media (a `mediaWrappers` wrapper, `jodit` or
 * `jodit-media`), falling back to `imageAlignClasses` for an image
 */
export function getAlignClasses(
	jodit: IJodit,
	elm: Nullable<HTMLElement>
): Nullable<HAlignClasses> {
	if (!elm) {
		return null;
	}

	const media = Dom.isTag(elm, new Set(['jodit', 'jodit-media'] as const))
		? elm.firstElementChild
		: getWrappedMedia(jodit, elm);
	const tag = (media ?? elm).nodeName.toLowerCase();

	return (
		jodit.o.alignClasses?.[tag] ??
		(tag === 'img' ? jodit.o.imageAlignClasses : null)
	);
}

/**
 * Align image, with `classes` (see `alignClasses`) instead of inline styles
 * when they are given
 */
export function hAlignElement(
	image: HTMLElement,
	align: ImageHAlign,
	classes?: Nullable<HAlignClasses>
): void {
	if (classes) {
		hAlignElement(image, 'normal');

		Object.values(classes).forEach(value =>
			classSets(value).forEach(set => image.classList.remove(...set))
		);
		image.classList.add(
			...(classSets(classes[align || 'normal'])[0] ?? [])
		);

		['class', 'style'].forEach(name => {
			if (!attr(image, name)?.trim()) {
				attr(image, name, null);
			}
		});

		return;
	}

	if (align && align !== 'normal') {
		if (align !== 'center') {
			css(image, 'float', align);
			clearCenterAlign(image);
		} else {
			css(image, {
				float: '',
				display: 'block',
				marginLeft: 'auto',
				marginRight: 'auto'
			});
		}
	} else {
		if (
			css(image, 'float') &&
			['right', 'left'].indexOf(
				css(image, 'float').toString().toLowerCase()
			) !== -1
		) {
			css(image, 'float', '');
		}

		clearCenterAlign(image);
	}
}

/**
 * The alignment `hAlignElement` has set on an element
 */
export function getHAlign(
	elm: HTMLElement,
	classes?: Nullable<HAlignClasses>
): ImageHAlign {
	if (classes) {
		for (const align of ['left', 'right', 'center', 'normal'] as const) {
			if (
				classSets(classes[align]).some(set =>
					set.every(name => elm.classList.contains(name))
				)
			) {
				return align;
			}
		}
	}

	const float = cssInline(elm, 'float').toLowerCase();

	if (float === 'left' || float === 'right') {
		return float;
	}

	if (
		css(elm, 'display') === 'block' &&
		cssInline(elm, 'margin-left') === 'auto' &&
		cssInline(elm, 'margin-right') === 'auto'
	) {
		return 'center';
	}

	return 'normal';
}

/**
 * Remove text-align style for all selected children
 */
export function clearAlign(node: Node): void {
	Dom.each(node, elm => {
		if (Dom.isHTMLElement(elm)) {
			if (cssInline(elm, 'textAlign')) {
				css(elm, 'textAlign', '');

				if (!(attr(elm, 'style') || '').trim().length) {
					attr(elm, 'style', null);
				}
			}
		}
	});
}

/**
 * Apply align for element
 */
const ALIGN_BY_COMMAND: ReadonlyMap<string, string> = new Map([
	['justifyfull', 'justify'],
	['justifyright', 'right'],
	['justifyleft', 'left'],
	['justifycenter', 'center']
]);

export function alignElement(command: string, box: HTMLElement): void {
	if (Dom.isNode(box) && Dom.isElement(box)) {
		clearAlign(box);

		const align = ALIGN_BY_COMMAND.get(command.toLowerCase());

		if (align) {
			css(box, 'textAlign', align);
		}
	}
}
