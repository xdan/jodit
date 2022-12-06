/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, IDictionary, CommitMode } from 'jodit/types';
import { CommitStyle, REPLACE } from 'jodit/core/selection';
import {
	extractSelectedPart,
	getSuitChild,
	getSuitParent,
	findSuitClosest,
	toggleAttributes,
	unwrapChildren,
	isInsideInvisibleElement,
	wrapAndCommitStyle,
	toggleOrderedList
} from 'jodit/core/selection/style/api';
import { Dom } from 'jodit/core/dom';
import { INITIAL, UNSET, UNWRAP, WRAP } from 'jodit/core/selection';
import { assert } from 'jodit/core/helpers/utils/assert';

export const states = {
	START: 'START',
	ELEMENT: 'ELEMENT',
	UNWRAP: 'UNWRAP',
	UNWRAP_CHILDREN: 'UNWRAP_CHILDREN',
	CHANGE: 'CHANGE',
	REPLACE_DEFAULT: 'REPLACE_DEFAULT',
	LIST: 'LIST',
	WRAP: 'WRAP',
	EXTRACT: 'EXTRACT',
	END: 'END'
} as const;

export interface IStyleTransactionValue {
	next: keyof typeof states;
	element: HTMLElement;
	style: CommitStyle;
	jodit: IJodit;
	mode: CommitMode;
}

type IStyleTransactions = IDictionary<
	IDictionary<(value: IStyleTransactionValue) => IStyleTransactionValue>,
	keyof typeof states
>;

export const transactions: IStyleTransactions = {
	[states.START]: {
		exec(value) {
			const { element, jodit, style, mode } = value;

			if (
				isInsideInvisibleElement(element, jodit.editor) ||
				Dom.isEmptyContent(element)
			) {
				return { ...value, next: states.END };
			}

			const elm =
				getSuitParent(style, element, jodit.editor) ||
				getSuitChild(style, element);

			if (elm) {
				return { ...value, next: states.ELEMENT, element: elm };
			}

			const suit = findSuitClosest(style, element, jodit.editor);

			if (style.elementIsList && Dom.isTag(suit, ['ul', 'ol'])) {
				return { ...value, next: states.LIST };
			}

			if (suit) {
				return {
					...value,
					next: states.EXTRACT
				};
			}

			return {
				...value,
				next: mode !== UNWRAP ? states.UNWRAP_CHILDREN : states.END
			};
		}
	},

	[states.LIST]: {
		exec(value) {
			const { element, jodit, style, mode } = value;

			if (mode !== INITIAL) {
				return { ...value, next: states.END };
			}

			const li = Dom.closest(element, 'li', jodit.editor);

			if (!li) {
				return { ...value, next: states.END };
			}

			const list = Dom.closest(element, ['ul', 'ol'], jodit.editor);

			if (!list) {
				return { ...value, next: states.END };
			}

			return {
				...value,
				mode: toggleOrderedList(style, li, jodit, mode),
				next: states.END
			};
		}
	},

	[states.EXTRACT]: {
		exec(value) {
			const { element, jodit, style } = value;

			const suit = findSuitClosest(style, element, jodit.editor);
			assert(suit, 'This place should have an element');

			if (!style.elementIsBlock) {
				extractSelectedPart(suit, element, jodit);
			}

			return {
				...value,
				element: suit,
				next: states.ELEMENT
			};
		}
	},

	[states.UNWRAP_CHILDREN]: {
		exec(value) {
			const { element, style } = value;

			if (!unwrapChildren(style, element)) {
				return {
					...value,
					next: states.WRAP
				};
			}

			return {
				...value,
				mode: UNWRAP,
				next: states.END
			};
		}
	},

	[states.WRAP]: {
		exec(value) {
			const { element, jodit, style } = value;

			const wrapper = wrapAndCommitStyle(style, element, jodit);

			return {
				...value,
				next: states.CHANGE,
				mode: WRAP,
				element: wrapper
			};
		}
	},

	[states.ELEMENT]: {
		exec(value) {
			const { style, element, jodit } = value;

			if (
				toggleAttributes(style, element, jodit, INITIAL, true) !==
				INITIAL
			) {
				return { ...value, next: states.CHANGE };
			}

			return { ...value, next: states.UNWRAP };
		}
	},

	[states.CHANGE]: {
		exec(value) {
			const { style, element, jodit } = value;

			const mode = toggleAttributes(style, element, jodit, INITIAL);

			if (
				mode === UNSET &&
				!element.attributes.length &&
				Dom.isTag(element, style.element)
			) {
				return { ...value, next: states.UNWRAP };
			}

			return { ...value, mode, next: states.END };
		}
	},

	[states.UNWRAP]: {
		exec(value) {
			if (
				value.element.attributes.length &&
				Dom.isTag(value.element, value.style.element)
			) {
				return { ...value, next: states.REPLACE_DEFAULT };
			}

			Dom.unwrap(value.element);
			return { ...value, mode: UNWRAP, next: states.END };
		}
	},

	[states.REPLACE_DEFAULT]: {
		exec(value) {
			Dom.replace(
				value.element,
				value.style.defaultTag,
				value.jodit.createInside,
				true
			);
			return { ...value, mode: REPLACE, next: states.END };
		}
	},

	[states.END]: {
		exec(value) {
			return value;
		}
	}
};
