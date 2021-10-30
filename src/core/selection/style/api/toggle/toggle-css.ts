/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { CommitMode, IJodit, Nullable } from '../../../../../types';
import { CHANGE, CommitStyle } from '../../commit-style';
import { attr, css, normalizeCssValue, size } from '../../../../helpers';
import { Dom } from '../../../../dom';

export function toggleCSS(
	commitStyle: CommitStyle,
	elm: HTMLElement,
	jodit: IJodit,
	mode: Nullable<CommitMode>
): Nullable<CommitMode> {
	const { style } = commitStyle.options;

	if (style && size(style) > 0) {
		Object.keys(style).forEach((rule: string) => {
			const inlineValue = elm.style.getPropertyValue(rule);

			if (inlineValue === '' && style[rule] == null) {
				return;
			}

			if (
				css(elm, rule) ===
				normalizeCssValue(rule, style[rule] as string)
			) {
				css(elm, rule, null);
				removeExtraCSS(commitStyle, elm);

				return;
			}

			css(elm, rule, style[rule]);

			mode = CHANGE;
		});
	}

	return mode;
}

function removeExtraCSS(commitStyle: CommitStyle, elm: HTMLElement) {
	if (!attr(elm, 'style')) {
		attr(elm, 'style', null);
	}

	if (elm.tagName.toLowerCase() === commitStyle.defaultTag) {
		Dom.unwrap(elm);
	}
}
