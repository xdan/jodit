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

import type {
	ISelectionRange,
	IJodit,
	Nullable,
	IPlugin,
	IDictionary,
	CanUndef,
	RejectablePromise
} from 'jodit/types';
import { Dom, LazyWalker } from 'jodit/core/dom';
import { Plugin } from 'jodit/core/plugin';
import { autobind, cache, watch } from 'jodit/core/decorators';
import { UISearch } from 'jodit/plugins/search/ui/search';
import { scrollIntoViewIfNeeded } from 'jodit/core/helpers';
import { pluginSystem } from 'jodit/core/global';

import {
	clearSelectionWrappers,
	clearSelectionWrappersFromHTML,
	getSelectionWrappers,
	SentenceFinder,
	wrapRangesTextsInTmpSpan
} from './helpers';

import './config';

/**
 * Search plugin. it is used for custom search in text
 * ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
 *
 * @example
 * ```typescript
 * var jodit = Jodit.make('#editor', {
 *  useSearch: false
 * });
 * // or
 * var jodit = Jodit.make('#editor', {
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

	@cache
	private get __ui(): UISearch {
		return new UISearch(this.j);
	}

	@watch('ui:needUpdateCounters')
	private async __updateCounters(): Promise<void> {
		if (!this.__ui.isOpened) {
			return;
		}

		this.__ui.count = await this.calcCounts(this.__ui.query);
	}

	@watch('ui:pressReplaceButton')
	protected onPressReplaceButton(): void {
		this.findAndReplace(this.__ui.query);
		this.__updateCounters();
	}

	private __tryScrollToElement(startContainer: Node): void {
		// find scrollable element
		let parentBox = Dom.closest(
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

		parentBox &&
			parentBox !== this.j.editor &&
			scrollIntoViewIfNeeded(parentBox, this.j.editor, this.j.ed);
	}

	protected async calcCounts(query: string): Promise<number> {
		return (await this.findQueryBounds(query, 'walkerCount')).length;
	}

	@autobind
	async findQueryBounds(
		query: string,
		walkerKey: 'walker' | 'walkerCount'
	): Promise<ISelectionRange[]> {
		let walker = this[walkerKey];

		if (walker) {
			walker.break();
		}

		walker = new LazyWalker(this.j.async, {
			timeout: this.j.o.search.lazyIdleTimeout
		});

		this[walkerKey] = walker;

		return this.__find(walker, query).catch(e => {
			!isProd && console.error(e);
			return [];
		});
	}

	@autobind
	async findAndReplace(query: string): Promise<boolean> {
		const bounds = await this.findQueryBounds(query, 'walker');

		if (!bounds.length) {
			return false;
		}

		let currentIndex = this.__findCurrentIndexInRanges(
			bounds,
			this.j.s.range
		);

		if (currentIndex === -1) {
			currentIndex = 0;
		}

		const bound = bounds[currentIndex];

		if (bound) {
			try {
				const rng = this.j.ed.createRange();

				rng.setStart(bound.startContainer, bound.startOffset);
				rng.setEnd(bound.endContainer, bound.endOffset);
				rng.deleteContents();

				const textNode = this.j.createInside.text(this.__ui.replace);

				Dom.safeInsertNode(rng, textNode);
				clearSelectionWrappers(this.j.editor);
				this.j.s.setCursorAfter(textNode);
				this.__tryScrollToElement(textNode);

				this.__cache = {};
				this.__ui.currentIndex = currentIndex;
				await this.findAndSelect(query, true).catch(e => {
					!isProd && console.error(e);
					return null;
				});
			} finally {
				this.j.synchronizeValues();
			}

			this.j.e.fire('afterFindAndReplace');

			return true;
		}

		return false;
	}

	private __previousQuery: string = '';
	private __drawPromise: RejectablePromise<void> | null = null;

	@autobind
	async findAndSelect(query: string, next: boolean): Promise<boolean> {
		const bounds = await this.findQueryBounds(query, 'walker');
		if (!bounds.length) {
			return false;
		}

		if (
			this.__previousQuery !== query ||
			!getSelectionWrappers(this.j.editor).length
		) {
			this.__drawPromise?.rejectCallback();
			this.j.async.cancelAnimationFrame(this.__wrapFrameRequest);
			clearSelectionWrappers(this.j.editor);
			this.__drawPromise = this.__drawSelectionRanges(bounds);
		}

		this.__previousQuery = query;

		let currentIndex = this.__ui.currentIndex - 1;

		if (currentIndex === -1) {
			currentIndex = 0;
		} else if (next) {
			currentIndex =
				currentIndex === bounds.length - 1 ? 0 : currentIndex + 1;
		} else {
			currentIndex =
				currentIndex === 0 ? bounds.length - 1 : currentIndex - 1;
		}

		this.__ui.currentIndex = currentIndex + 1;

		const bound = bounds[currentIndex];

		if (bound) {
			const rng = this.j.ed.createRange();

			try {
				rng.setStart(bound.startContainer, bound.startOffset);
				rng.setEnd(bound.endContainer, bound.endOffset);
				this.j.s.selectRange(rng);
			} catch (e) {
				!isProd && console.error(e);
			}

			this.__tryScrollToElement(bound.startContainer);

			await this.__updateCounters();
			await this.__drawPromise;
			this.j.e.fire('afterFindAndSelect');

			return true;
		}

		return false;
	}

	private __findCurrentIndexInRanges(
		bounds: ISelectionRange[],
		range: Range
	): number {
		return bounds.findIndex(
			bound =>
				bound.startContainer === range.startContainer &&
				bound.startOffset === range.startOffset &&
				bound.endContainer === range.startContainer &&
				bound.endOffset === range.endOffset
		);
	}

	walker: Nullable<LazyWalker> = null;
	walkerCount: Nullable<LazyWalker> = null;

	private __cache: IDictionary<CanUndef<Promise<ISelectionRange[]>>> = {};

	private async __isValidCache(
		promise: Promise<ISelectionRange[]>
	): Promise<boolean> {
		const res = await promise;
		return res.every(
			r =>
				r.startContainer.isConnected &&
				r.startOffset <= (r.startContainer.nodeValue?.length ?? 0) &&
				r.endContainer.isConnected &&
				r.endOffset <= (r.endContainer.nodeValue?.length ?? 0)
		);
	}

	@autobind
	private async __find(
		walker: LazyWalker,
		query: string
	): Promise<ISelectionRange[]> {
		if (!query.length) {
			return [];
		}

		const cache = this.__cache[query];
		if (cache && (await this.__isValidCache(cache))) {
			return cache;
		}

		this.__cache[query] = this.j.async.promise(resolve => {
			const sentence = new SentenceFinder(this.j.o.search.fuzzySearch);

			walker
				.on('break', (): void => {
					resolve([]);
				})
				.on('visit', (elm: Node): boolean => {
					if (Dom.isText(elm)) {
						sentence.add(elm);
					}

					return false;
				})
				.on('end', (): void => {
					resolve(sentence.ranges(query) ?? []);
				})
				.setWork(this.j.editor);
		});

		return this.__cache[query] as Promise<ISelectionRange[]>;
	}

	private __wrapFrameRequest: number = 0;

	private __drawSelectionRanges(
		ranges: ISelectionRange[]
	): RejectablePromise<void> {
		const { async, createInside: ci, editor } = this.j;

		async.cancelAnimationFrame(this.__wrapFrameRequest);

		const parts = [...ranges];

		let sRange: CanUndef<ISelectionRange>,
			total = 0;

		return async.promise(resolve => {
			const drawParts = (): void => {
				do {
					sRange = parts.shift();

					if (sRange) {
						wrapRangesTextsInTmpSpan(sRange, parts, ci, editor);
					}

					total += 1;
				} while (sRange && total <= 5);

				if (parts.length) {
					this.__wrapFrameRequest =
						async.requestAnimationFrame(drawParts);
				} else {
					resolve();
				}
			};

			drawParts();
		});
	}

	@watch(':afterGetValueFromEditor')
	protected onAfterGetValueFromEditor(data: { value: string }): void {
		data.value = clearSelectionWrappersFromHTML(data.value);
	}

	/** @override */
	afterInit(editor: IJodit): void {
		if (editor.o.useSearch) {
			const self: search = this;

			editor.e
				.on('beforeSetMode.search', () => {
					this.__ui.close();
				})
				.on(this.__ui, 'afterClose', () => {
					clearSelectionWrappers(editor.editor);
					this.__ui.currentIndex = 0;
					this.__ui.count = 0;
					this.__cache = {};
				})
				.on('click', () => {
					this.__ui.currentIndex = 0;
					clearSelectionWrappers(editor.editor);
				})
				.on('change.search', () => {
					this.__cache = {};
				})
				.on(
					'keydown.search mousedown.search',
					editor.async.debounce(() => {
						if (this.__ui.selInfo) {
							editor.s.removeMarkers();
							this.__ui.selInfo = null;
						}

						if (this.__ui.isOpened) {
							this.__updateCounters();
						}
					}, editor.defaultTimeout)
				)
				.on('searchNext.search searchPrevious.search', () => {
					if (!this.__ui.isOpened) {
						this.__ui.open();
					}

					return self
						.findAndSelect(
							self.__ui.query,
							editor.e.current === 'searchNext'
						)
						.catch(e => {
							!isProd && console.error('Search error', e);
						});
				})
				.on('search.search', (value: string, next: boolean = true) => {
					this.__ui.currentIndex = 0;
					return self.findAndSelect(value || '', next).catch(e => {
						!isProd && console.error('Search error', e);
					});
				});

			editor
				.registerCommand('search', {
					exec: (
						command: string,
						value?: string,
						next: boolean = true
					) => {
						value &&
							self.findAndSelect(value, next).catch(e => {
								!isProd && console.error('Search error', e);
							});

						return false;
					}
				})
				.registerCommand('openSearchDialog', {
					exec: (command: string, value?: string) => {
						self.__ui.open(value);
						return false;
					},
					hotkeys: ['ctrl+f', 'cmd+f']
				})
				.registerCommand('openReplaceDialog', {
					exec: (
						command: string,
						query?: string,
						replace?: string
					) => {
						if (!editor.o.readonly) {
							self.__ui.open(query, replace, true);
						}
						return false;
					},
					hotkeys: ['ctrl+h', 'cmd+h']
				});
		}
	}

	/** @override */
	beforeDestruct(jodit: IJodit): void {
		this.__ui.destruct();
		jodit.e.off('.search');
	}
}

pluginSystem.add('search', search);
