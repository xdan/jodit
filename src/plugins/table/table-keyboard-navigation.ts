/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/table
 */

import type { IJodit } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import { Table } from '../../modules';

/**
 * Process navigate keypressing in table cell
 */
export function tableKeyboardNavigation(editor: IJodit): void {
	editor.e
		.off('.tableKeyboardNavigation')
		.on(
			'keydown.tableKeyboardNavigation',
			(event: KeyboardEvent): false | void => {
				let current: Element, block: HTMLElement;

				if (
					event.key === consts.KEY_TAB ||
					event.key === consts.KEY_LEFT ||
					event.key === consts.KEY_RIGHT ||
					event.key === consts.KEY_UP ||
					event.key === consts.KEY_DOWN
				) {
					current = editor.s.current() as Element;

					block = Dom.up(
						current,
						(elm: Node | null) =>
							elm &&
							elm.nodeName &&
							/^td|th$/i.test(elm.nodeName),
						editor.editor
					) as HTMLTableCellElement;

					if (!block) {
						return;
					}

					const range = editor.s.range;

					if (event.key !== consts.KEY_TAB && current !== block) {
						if (
							((event.key === consts.KEY_LEFT ||
								event.key === consts.KEY_UP) &&
								(Dom.prev(
									current,
									(elm: Node | null) =>
										event.key === consts.KEY_UP
											? Dom.isTag(elm, 'br')
											: Boolean(elm),
									block
								) ||
									(event.key !== consts.KEY_UP &&
										Dom.isText(current) &&
										range.startOffset !== 0))) ||
							((event.key === consts.KEY_RIGHT ||
								event.key === consts.KEY_DOWN) &&
								(Dom.next(
									current,
									(elm: Node | null) =>
										event.key === consts.KEY_DOWN
											? Dom.isTag(elm, 'br')
											: Boolean(elm),
									block
								) ||
									(event.key !== consts.KEY_DOWN &&
										Dom.isText(current) &&
										current.nodeValue &&
										range.startOffset !==
											current.nodeValue.length)))
						) {
							return;
						}
					}
				} else {
					return;
				}

				const table = Dom.up(
					block,
					(elm: Node | null) => elm && /^table$/i.test(elm.nodeName),
					editor.editor
				) as HTMLTableElement;
				let next: HTMLTableCellElement | null = null;

				switch (event.key) {
					case consts.KEY_TAB:
					// case consts.KEY_RIGHT:
					case consts.KEY_LEFT: {
						const sibling: string =
							event.key === consts.KEY_LEFT || event.shiftKey
								? 'prev'
								: 'next';

						next = (Dom as any)[sibling](
							block,
							(elm: Node | null) =>
								elm &&
								/^td|th$/i.test((elm as HTMLElement).tagName),
							table
						) as HTMLTableCellElement;

						if (!next) {
							Table.appendRow(
								table,
								sibling === 'next'
									? false
									: (table.querySelector(
											'tr'
									  ) as HTMLTableRowElement),
								sibling === 'next',
								editor.createInside
							);
							next = (Dom as any)[sibling](
								block,
								Dom.isCell,
								table
							) as HTMLTableCellElement;
						}
						break;
					}
					case consts.KEY_UP:
					case consts.KEY_DOWN:
						{
							let i = 0,
								j = 0;

							const matrix = Table.formalMatrix(
								table,
								(elm, _i, _j) => {
									if (elm === block) {
										i = _i;
										j = _j;
									}
								}
							);
							if (event.key === consts.KEY_UP) {
								if (matrix[i - 1] !== undefined) {
									next = matrix[i - 1][j];
								}
							} else {
								if (matrix[i + 1] !== undefined) {
									next = matrix[i + 1][j];
								}
							}
						}
						break;
				}

				if (next) {
					if (!next.firstChild) {
						const first = editor.createInside.element('br');
						next.appendChild(first);
						editor.s.setCursorBefore(first);
					} else {
						if (event.key === consts.KEY_TAB) {
							editor.s.select(next, true);
						} else {
							editor.s.setCursorIn(
								next,
								event.key === consts.KEY_RIGHT ||
									event.key === consts.KEY_DOWN
							);
						}
					}
					return false;
				}
			}
		);
}
