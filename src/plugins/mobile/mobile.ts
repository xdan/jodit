/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/mobile/README.md]]
 * @packageDocumentation
 * @module plugins/mobile
 */

import type {
	ButtonsGroups,
	IControlType,
	IJodit,
	IToolbarCollection
} from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { splitArray, toArray } from 'jodit/core/helpers/';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { flatButtonsSet, isButtonGroup } from 'jodit/core/ui/helpers/buttons';

import './config';

const isButtonSeparator = (item: unknown): boolean =>
	item === '|' || item === '---' || item === '\n';

/**
 * Constrain a responsive breakpoint set (`buttonsMD/SM/XS`) to the buttons the
 * user actually asked for via `buttons`. Those breakpoint defaults are
 * group-based supersets, so a custom (smaller) `buttons` list would otherwise
 * see *extra* buttons appear on resize when the toolbar switched to a breakpoint
 * set — resizing must only ever drop buttons, never add ones outside `buttons`.
 *
 * When the breakpoint set introduces nothing outside `buttons` (the default
 * case, where `buttons` is the full superset), the list is returned untouched so
 * the standard grouped mobile layout — groups, separators and `dots` — is
 * preserved. See #1389.
 */
function fitToButtons(list: ButtonsGroups, editor: IJodit): ButtonsGroups {
	const allowed = flatButtonsSet(splitArray(editor.o.buttons), editor);
	const groups = editor.getRegisteredButtonGroups();

	let changed = false;
	let hadDots = false;
	const flat: Array<string | IControlType> = [];

	for (const item of list) {
		if (isButtonGroup(item)) {
			const members = [...item.buttons, ...(groups[item.group] ?? [])];
			const kept = members.filter(button => allowed.has(button));

			if (kept.length !== members.length) {
				changed = true;
			}

			flat.push(...kept);
		} else if (isButtonSeparator(item)) {
			flat.push(item);
		} else if (item === 'dots') {
			hadDots = true;
		} else if (allowed.has(item)) {
			flat.push(item);
		} else {
			changed = true;
		}
	}

	if (!changed) {
		return list;
	}

	// Drop separators left dangling once the buttons around them were removed.
	const cleaned: Array<string | IControlType> = [];
	for (const item of flat) {
		if (
			isButtonSeparator(item) &&
			(cleaned.length === 0 ||
				isButtonSeparator(cleaned[cleaned.length - 1]))
		) {
			continue;
		}

		cleaned.push(item);
	}
	while (cleaned.length && isButtonSeparator(cleaned[cleaned.length - 1])) {
		cleaned.pop();
	}

	// Keep the "show all" overflow button only if some requested button is still
	// hidden at this breakpoint.
	if (hadDots) {
		const shown = flatButtonsSet(cleaned, editor);

		if (toArray(allowed).some(button => !shown.has(button))) {
			cleaned.push('dots');
		}
	}

	return cleaned;
}

/**
 * The width that decides which breakpoint set the toolbar uses. A toolbar
 * rendered into an external container (`toolbar` set to an element or a
 * selector) lays out in that container, so its width is what matters there.
 */
function adaptiveWidth(editor: IJodit): number {
	const { toolbar } = editor.o;

	if (isString(toolbar) || Dom.isHTMLElement(toolbar)) {
		const width = editor.toolbarContainer.offsetWidth;

		if (width) {
			return width;
		}
	}

	return (editor.container.parentElement ?? editor.container).offsetWidth;
}

/**
 * Rebuild toolbar in depends on editor's width
 */
export function mobile(editor: IJodit): void {
	let timeout: number = 0,
		store: ButtonsGroups = splitArray(editor.o.buttons);

	if (editor.o.mobileTapTimeout) {
		// Emulate double tap
		editor.e.on('touchend', (e: TouchEvent & MouseEvent): void | false => {
			if (e.changedTouches && e.changedTouches.length) {
				const now = new Date().getTime(),
					diff = now - timeout;

				if (diff > editor.o.mobileTapTimeout) {
					timeout = now;

					if (diff < editor.o.mobileTapTimeout * 1.5) {
						editor.s.insertCursorAtPoint(e.clientX, e.clientY);
					}
				}
			}
		});
	}

	editor.e.on(
		'getDiffButtons.mobile',
		(toolbar: IToolbarCollection): void | ButtonsGroups => {
			if (toolbar === editor.toolbar) {
				const buttons = flatButtonsSet(
						splitArray(editor.o.buttons),
						editor
					),
					flatStore = flatButtonsSet(store, editor);

				return toArray(buttons).reduce((acc, item) => {
					if (!flatStore.has(item)) {
						acc.push(item);
					}

					return acc;
				}, [] as ButtonsGroups);
			}
		}
	);

	if (editor.o.toolbarAdaptive) {
		editor.e
			.on(
				'resize afterInit recalcAdaptive changePlace afterAddPlace',
				() => {
					if (!editor.o.toolbar) {
						return;
					}

					const newStore = ((): ButtonsGroups => {
						if (editor.isFullSize) {
							return splitArray(editor.o.buttons);
						}

						const width = adaptiveWidth(editor);

						if (width >= editor.o.sizeLG) {
							return splitArray(editor.o.buttons);
						}

						if (width >= editor.o.sizeMD) {
							return fitToButtons(
								splitArray(editor.o.buttonsMD),
								editor
							);
						}

						if (width >= editor.o.sizeSM) {
							return fitToButtons(
								splitArray(editor.o.buttonsSM),
								editor
							);
						}

						return fitToButtons(
							splitArray(editor.o.buttonsXS),
							editor
						);
					})();

					if (newStore.toString() !== store.toString()) {
						store = newStore;

						editor.e.fire('closeAllPopups');

						editor.toolbar
							?.setRemoveButtons(editor.o.removeButtons)
							.build(store.concat(editor.o.extraButtons));
					}
				}
			)
			.on(editor.ow, 'load resize', () =>
				editor.e.fire('recalcAdaptive')
			);
	}
}

pluginSystem.add('mobile', mobile);
