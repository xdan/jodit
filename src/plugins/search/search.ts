/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/search/README.md]]
 * @packageDocumentation
 * @module plugins/search
 */

import './search.less';

import type {
	ISelectionRange,
	MarkerInfo,
	IJodit,
	Nullable,
	IPlugin
} from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { MODE_WYSIWYG } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import { Plugin } from 'jodit/core/plugin';
import { css, position, refs, trim } from 'jodit/core/helpers';
import { autobind } from 'jodit/core/decorators';
import {
	findSomePartOfString,
	getSomePartOfStringIndex,
	template
} from 'jodit/plugins/search/helpers';

import './config';

/**
 * Search plugin. it is used for custom search in text
 * ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
 *
 * @example
 * ```typescript
 * var jodit = new Jodit('#editor', {
 *  useSearch: false
 * });
 * // or
 * var jodit = new Jodit('#editor', {
 *  disablePlugins: 'search'
 * });
 * ```
 */
export class search extends Plugin {
	override buttons: IPlugin['buttons'] = [
		{
			name: 'find',
			group: 'search'
		}
	];

	private isOpened: boolean = false;

	private selInfo: Nullable<MarkerInfo[]> = null;
	private current: Nullable<Node> = null;

	@autobind
	private eachMap(
		node: Node,
		callback: (elm: Node) => boolean,
		next: boolean
	): void {
		Dom.findWithCurrent(
			node,
			(child: Node | null): boolean => Boolean(child && callback(child)),
			this.j.editor,
			next ? 'nextSibling' : 'previousSibling',
			next ? 'firstChild' : 'lastChild'
		);
	}

	@autobind
	private updateCounters(): void {
		if (!this.isOpened) {
			return;
		}

		this.counterBox.style.display = this.queryInput.value.length
			? 'inline-block'
			: 'none';

		const range = this.j.s.range,
			counts: [number, number] = this.calcCounts(
				this.queryInput.value,
				range
			);

		this.counterBox.textContent = counts.join('/');
	}

	private boundAlreadyWas(
		current: ISelectionRange,
		bounds: ISelectionRange[]
	): boolean {
		return bounds.some((bound: ISelectionRange) => {
			return (
				bound.startContainer === current.startContainer &&
				bound.endContainer === current.endContainer &&
				bound.startOffset === current.startOffset &&
				bound.endOffset === current.endOffset
			);
		}, false);
	}

	private tryScrollToElement(startContainer: Node): void {
		// find scrollable element
		let parentBox: HTMLElement | false = Dom.closest(
			startContainer,
			Dom.isElement,
			this.j.editor
		) as HTMLElement | false;

		if (!parentBox) {
			parentBox = Dom.prev(
				startContainer,
				Dom.isElement,
				this.j.editor
			) as HTMLElement | false;
		}

		parentBox && parentBox !== this.j.editor && parentBox.scrollIntoView();
	}

	private searchBox!: HTMLDivElement;
	private queryInput!: HTMLInputElement;
	private replaceInput!: HTMLInputElement;
	private closeButton!: HTMLButtonElement;
	private nextButton!: HTMLButtonElement;
	private prevButton!: HTMLButtonElement;
	private replaceButton!: HTMLButtonElement;
	private counterBox!: HTMLSpanElement;

	protected calcCounts(
		query: string,
		current: ISelectionRange | false = false
	): [number, number] {
		const bounds: ISelectionRange[] = [];

		let currentIndex: number = 0,
			count: number = 0,
			bound: ISelectionRange | false = false,
			start: Node | null = this.j.editor.firstChild;

		while (start && query.length) {
			bound = this.find(
				start,
				query,
				true,
				0,
				(bound as Range) || this.j.ed.createRange()
			);
			if (bound) {
				if (this.boundAlreadyWas(bound, bounds)) {
					break;
				}
				bounds.push(bound);
				start = bound.startContainer;
				count += 1;
				if (current && this.boundAlreadyWas(current, [bound])) {
					currentIndex = count;
				}
			} else {
				start = null;
			}
		}

		return [currentIndex, count];
	}

	@autobind
	findAndReplace(start: Node | null, query: string): boolean {
		const range = this.j.s.range,
			bound: ISelectionRange | false = this.find(
				start,
				query,
				true,
				0,
				range
			);

		if (bound && bound.startContainer && bound.endContainer) {
			const rng = this.j.ed.createRange();

			try {
				if (bound && bound.startContainer && bound.endContainer) {
					rng.setStart(
						bound.startContainer,
						bound.startOffset as number
					);

					rng.setEnd(bound.endContainer, bound.endOffset as number);
					rng.deleteContents();

					const textNode: Node = this.j.createInside.text(
						this.replaceInput.value
					);

					rng.insertNode(textNode);
					this.j.s.select(textNode);
					this.tryScrollToElement(textNode);
				}
			} catch {}

			return true;
		}

		return false;
	}

	@autobind
	findAndSelect(start: Node | null, query: string, next: boolean): boolean {
		const range = this.j.s.range,
			bound: ISelectionRange | false = this.find(
				start,
				query,
				next,
				0,
				range
			);

		if (bound && bound.startContainer && bound.endContainer) {
			const rng: Range = this.j.ed.createRange();

			try {
				rng.setStart(bound.startContainer, bound.startOffset as number);
				rng.setEnd(bound.endContainer, bound.endOffset as number);
				this.j.s.selectRange(rng);
			} catch (e) {}

			this.tryScrollToElement(bound.startContainer);

			this.current = bound.startContainer;
			this.updateCounters();

			return true;
		}

		return false;
	}

	@autobind
	find(
		start: Node | null,
		query: string,
		next: boolean,
		deep: number,
		range: Range
	): false | ISelectionRange {
		if (start && query.length) {
			let sentence: string = '',
				bound: ISelectionRange = {
					startContainer: null,
					startOffset: null,
					endContainer: null,
					endOffset: null
				};

			this.eachMap(
				start,
				(elm: Node): boolean => {
					if (Dom.isText(elm) && elm.nodeValue?.length) {
						let value: string = elm.nodeValue;

						if (!next && elm === range.startContainer) {
							value = !deep
								? value.substring(0, range.startOffset)
								: value.substring(range.endOffset);
						} else if (next && elm === range.endContainer) {
							value = !deep
								? value.substring(range.endOffset)
								: value.substring(0, range.startOffset);
						}

						const tmpSentence: string = next
							? sentence + value
							: value + sentence;

						const part: boolean | string = findSomePartOfString(
							query,
							tmpSentence,
							next
						) as boolean | string;

						if (part !== false) {
							let currentPart: string | boolean =
								findSomePartOfString(query, value, next) as
									| string
									| boolean;

							if (currentPart === true) {
								currentPart = trim(query);
							} else if (currentPart === false) {
								currentPart = findSomePartOfString(
									value,
									query,
									next
								) as string | true;
								if (currentPart === true) {
									currentPart = trim(value);
								}
							}

							let currentPartIndex: number =
								getSomePartOfStringIndex(query, value, next) ||
								0;

							if (
								((next && !deep) || (!next && deep)) &&
								elm.nodeValue.length - value.length > 0
							) {
								currentPartIndex +=
									elm.nodeValue.length - value.length;
							}

							if (bound.startContainer == null) {
								bound.startContainer = elm;
								bound.startOffset = currentPartIndex;
							}
							if (part !== true) {
								sentence = tmpSentence;
							} else {
								bound.endContainer = elm;
								bound.endOffset = currentPartIndex;
								bound.endOffset += (
									currentPart as string
								).length;

								return true;
							}
						} else {
							sentence = '';
							bound = {
								startContainer: null,
								startOffset: null,
								endContainer: null,
								endOffset: null
							};
						}
					} else if (Dom.isBlock(elm) && sentence !== '') {
						sentence = next ? sentence + ' ' : ' ' + sentence;
					}

					return false;
				},
				next
			);

			if (bound.startContainer && bound.endContainer) {
				return bound;
			}

			if (!deep) {
				this.current = next
					? (this.j.editor.firstChild as Node)
					: (this.j.editor.lastChild as Node);

				return this.find(this.current, query, next, deep + 1, range);
			}
		}

		return false;
	}

	@autobind
	protected open(searchAndReplace: boolean = false): void {
		if (!this.isOpened) {
			this.j.workplace.appendChild(this.searchBox);
			this.isOpened = true;
		}

		this.calcSticky(this.j.e.fire('getStickyState.sticky') || false);

		this.j.e.fire('hidePopup');

		this.searchBox.classList.toggle(
			'jodit-search_replace',
			searchAndReplace
		);

		this.current = this.j.s.current();

		const selStr: string = (this.j.s.sel || '').toString();

		if (selStr) {
			this.queryInput.value = selStr;
		}

		this.updateCounters();

		if (selStr) {
			this.queryInput.select();
		} else {
			this.queryInput.focus();
		}
	}

	@autobind
	protected close(): void {
		if (!this.isOpened) {
			return;
		}

		this.j.s.restore();

		Dom.safeRemove(this.searchBox);
		this.isOpened = false;
	}

	/** @override */
	afterInit(editor: IJodit): void {
		if (editor.o.useSearch) {
			const self: search = this;

			self.searchBox = editor.c.fromHTML(
				template(editor)
			) as HTMLDivElement;

			const {
				query,
				replace,
				cancel,
				next,
				prev,
				replaceBtn,
				counterBox
			} = refs(self.searchBox);

			self.queryInput = query as HTMLInputElement;

			self.replaceInput = replace as HTMLInputElement;

			self.closeButton = cancel as HTMLButtonElement;

			self.nextButton = next as HTMLButtonElement;

			self.prevButton = prev as HTMLButtonElement;

			self.replaceButton = replaceBtn as HTMLButtonElement;

			self.counterBox = counterBox as HTMLButtonElement;

			const onInit = () => {
				editor.e
					.off(this.j.container, 'keydown.search')
					.on(
						this.j.container,
						'keydown.search',
						(e: KeyboardEvent) => {
							if (editor.getRealMode() !== MODE_WYSIWYG) {
								return;
							}

							switch (e.key) {
								case consts.KEY_ESC:
									this.close();
									break;

								case consts.KEY_F3:
									if (self.queryInput.value) {
										editor.e.fire(
											!e.shiftKey
												? 'searchNext'
												: 'searchPrevious'
										);

										e.preventDefault();
									}
									break;
							}
						}
					);
			};
			onInit();

			editor.e
				.on('changePlace', onInit)
				.on(self.closeButton, 'click', this.close)
				.on(self.queryInput, 'mousedown', () => {
					if (editor.s.isFocused()) {
						editor.s.removeMarkers();
						self.selInfo = editor.s.save();
					}
				})
				.on(self.replaceButton, 'click', (e: MouseEvent) => {
					self.findAndReplace(
						editor.s.current() || editor.editor.firstChild,
						self.queryInput.value
					);

					this.updateCounters();

					e.preventDefault();
					e.stopImmediatePropagation();
				})
				.on(
					[self.nextButton, self.prevButton],
					'click',
					function (this: HTMLButtonElement, e: MouseEvent) {
						editor.e.fire(
							self.nextButton === this
								? 'searchNext'
								: 'searchPrevious'
						);
						e.preventDefault();
						e.stopImmediatePropagation();
					}
				)
				.on(
					this.queryInput,
					'keydown',
					this.j.async.debounce((e: KeyboardEvent) => {
						switch (e.key) {
							case consts.KEY_ENTER:
								e.preventDefault();
								e.stopImmediatePropagation();
								if (editor.e.fire('searchNext')) {
									this.close();
								}

								break;

							default:
								this.updateCounters();
								break;
						}
					}, this.j.defaultTimeout)
				)
				.on('beforeSetMode.search', () => {
					this.close();
				})
				.on('keydown.search mousedown.search', () => {
					if (this.selInfo) {
						editor.s.removeMarkers();
						this.selInfo = null;
					}
					if (this.isOpened) {
						this.current = this.j.s.current();
						this.updateCounters();
					}
				})
				.on('searchNext.search searchPrevious.search', () => {
					if (!self.isOpened) {
						return self.open();
					}

					return self.findAndSelect(
						editor.s.current() || editor.editor.firstChild,
						self.queryInput.value,
						editor.e.current === 'searchNext'
					);
				})
				.on('search.search', (value: string, next: boolean = true) => {
					editor.execCommand('search', value, next);
				})
				.on('toggleSticky.search', this.calcSticky);

			editor
				.registerCommand('search', {
					exec: (
						command: string,
						value?: string,
						next: boolean = true
					) => {
						self.findAndSelect(
							editor.s.current() || editor.editor.firstChild,
							value || '',
							next
						);

						return false;
					}
				})
				.registerCommand('openSearchDialog', {
					exec: () => {
						self.open();
						return false;
					},
					hotkeys: ['ctrl+f', 'cmd+f']
				})
				.registerCommand('openReplaceDialog', {
					exec: () => {
						if (!editor.o.readonly) {
							self.open(true);
						}
						return false;
					},
					hotkeys: ['ctrl+h', 'cmd+h']
				});
		}
	}

	/** @override */
	beforeDestruct(jodit: IJodit): void {
		Dom.safeRemove(this.searchBox);
		jodit.e.off('.search');
	}

	/**
	 * Calculate position if sticky is enabled
	 */
	@autobind
	private calcSticky(enabled: boolean): void {
		if (this.isOpened) {
			this.searchBox.classList.toggle('jodit-search_sticky', enabled);

			if (enabled) {
				const pos = position(this.j.toolbarContainer);

				css(this.searchBox, {
					top: pos.top + pos.height,
					left: pos.left + pos.width
				});
			} else {
				css(this.searchBox, {
					top: null,
					left: null
				});
			}
		}
	}
}
