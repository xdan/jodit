/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/search
 */

import './search.less';

import type { IJodit, MarkerInfo, Nullable } from 'jodit/types';
import { Icon, UIElement } from 'jodit/core/ui';
import { css, position, refs, trim } from 'jodit/core/helpers';
import { MODE_WYSIWYG } from 'jodit/core/constants';
import * as consts from 'jodit/core/constants';
import { autobind, component, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom';

@component
export class UISearch extends UIElement<IJodit> {
	override className(): string {
		return 'UISearch';
	}

	private queryInput: HTMLInputElement;
	private replaceInput: HTMLInputElement;
	selInfo: Nullable<MarkerInfo[]> = null;

	private closeButton: HTMLButtonElement;
	private replaceButton: HTMLButtonElement;
	private currentBox: HTMLSpanElement;
	private countBox: HTMLSpanElement;

	override render(): string {
		return `<div>
			<div class="&__box">
				<div class="&__inputs">
					<input data-ref="query" tabindex="0" placeholder="~Search for~" type="text"/>
					<input data-ref="replace" tabindex="0" placeholder="~Replace with~" type="text"/>
				</div>
				<div class="&__counts">
					<span data-ref="counter-box">
						<span data-ref="current">0</span><span>/</span><span data-ref="count">0</span>
					</span>
				</div>
				<div class="&__buttons">
					<button data-ref="next" tabindex="0" type="button">${Icon.get(
						'angle-down'
					)}</button>
					<button data-ref="prev" tabindex="0" type="button">${Icon.get(
						'angle-up'
					)}</button>
					<button data-ref="cancel" tabindex="0" type="button">${Icon.get(
						'cancel'
					)}</button>
					<button data-ref="replace-btn" tabindex="0" type="button" class="jodit-ui-button">~Replace~</button>
				</div>
			</div>
		</div>`;
	}

	private _currentIndex: number = 0;

	get currentIndex(): number {
		return this._currentIndex;
	}

	set currentIndex(value: number) {
		this._currentIndex = value;
		this.currentBox.innerText = value.toString();
	}

	set count(value: number) {
		this.countBox.innerText = value.toString();
	}

	get query(): string {
		return this.queryInput.value;
	}

	get replace(): string {
		return this.replaceInput.value;
	}

	constructor(jodit: IJodit) {
		super(jodit);

		const {
			query,
			replace,
			cancel,
			next,
			prev,
			replaceBtn,
			current,
			count
		} = refs(this.container);

		this.queryInput = query as HTMLInputElement;
		this.replaceInput = replace as HTMLInputElement;
		this.closeButton = cancel as HTMLButtonElement;
		this.replaceButton = replaceBtn as HTMLButtonElement;

		this.currentBox = current as HTMLSpanElement;
		this.countBox = count as HTMLSpanElement;

		jodit.e
			.on(this.closeButton, 'pointerdown', () => {
				this.close();
				return false;
			})
			.on(this.queryInput, 'input', () => {
				this.currentIndex = 0;
			})
			.on(this.queryInput, 'pointerdown', () => {
				if (jodit.s.isFocused()) {
					jodit.s.removeMarkers();
					this.selInfo = jodit.s.save();
				}
			})
			.on(this.replaceButton, 'pointerdown', () => {
				jodit.e.fire(this, 'pressReplaceButton');
				return false;
			})
			.on(next, 'pointerdown', (): false => {
				jodit.e.fire('searchNext');
				return false;
			})
			.on(prev, 'pointerdown', (): false => {
				jodit.e.fire('searchPrevious');
				return false;
			})
			.on(this.queryInput, 'input', () => {
				this.setMod('empty-query', !trim(this.queryInput.value).length);
			})
			.on(
				this.queryInput,
				'keydown',
				this.j.async.debounce((e: KeyboardEvent) => {
					switch (e.key) {
						case consts.KEY_ENTER:
							e.preventDefault();
							e.stopImmediatePropagation();
							if (jodit.e.fire('searchNext')) {
								this.close();
							}

							break;

						default:
							jodit.e.fire(this, 'needUpdateCounters');
							break;
					}
				}, this.j.defaultTimeout)
			);
	}

	@watch([':keydown', 'queryInput:keydown'])
	protected onEditorKeyDown(e: KeyboardEvent): void {
		if (!this.isOpened) {
			return;
		}

		const { j } = this;
		if (j.getRealMode() !== MODE_WYSIWYG) {
			return;
		}

		switch (e.key) {
			case consts.KEY_ESC:
				this.close();
				break;

			case consts.KEY_F3:
				if (this.queryInput.value) {
					j.e.fire(!e.shiftKey ? 'searchNext' : 'searchPrevious');
					e.preventDefault();
				}
				break;
		}
	}

	isOpened: boolean = false;

	@autobind
	open(
		query?: string,
		replace?: string,
		searchAndReplace: boolean = false
	): void {
		if (!this.isOpened) {
			this.j.workplace.appendChild(this.container);
			this.isOpened = true;
		}

		this.calcSticky(this.j.e.fire('getStickyState.sticky') || false);

		this.j.e.fire('hidePopup');

		this.setMod('replace', searchAndReplace);

		// this.current = this.j.s.current();

		const selStr: string = query ?? (this.j.s.sel || '').toString();

		if (selStr) {
			this.queryInput.value = selStr;
		}

		if (replace) {
			this.replaceInput.value = replace;
		}

		this.setMod('empty-query', !selStr.length);

		this.j.e.fire(this, 'needUpdateCounters');

		if (selStr) {
			this.queryInput.select();
		} else {
			this.queryInput.focus();
		}
	}

	@autobind
	close(): void {
		if (!this.isOpened) {
			return;
		}

		this.j.s.restore();

		Dom.safeRemove(this.container);
		this.isOpened = false;

		this.j.e.fire(this, 'afterClose');
	}

	/**
	 * Calculate position if sticky is enabled
	 */
	@watch(':toggleSticky')
	private calcSticky(enabled: boolean): void {
		if (this.isOpened) {
			this.setMod('sticky', enabled);

			if (enabled) {
				const pos = position(this.j.toolbarContainer);

				css(this.container, {
					top: pos.top + pos.height,
					left: pos.left + pos.width
				});
			} else {
				css(this.container, {
					top: null,
					left: null
				});
			}
		}
	}
}
