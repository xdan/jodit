/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/ui/popup/README.md]]
 * @packageDocumentation
 * @module ui/popup
 */

import type {
	CanUndef,
	IBound,
	IBoundP,
	IDictionary,
	IPopup,
	IUIElement,
	IViewBased,
	Nullable,
	PopupStrategy
} from 'jodit/types';
import { Component } from 'jodit/core/component/component';
import { autobind, throttle } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { eventEmitter, getContainer } from 'jodit/core/global';
import {
	attr,
	css,
	isString,
	kebabCase,
	markOwner,
	position,
	ucfirst
} from 'jodit/core/helpers';
import { assert } from 'jodit/core/helpers/utils/assert';
import { UIElement } from 'jodit/core/ui/element';
import { UIGroup } from 'jodit/core/ui/group/group';

import './popup.less';

type getBoundFunc = () => IBound;

const EVENTS_FOR_AUTOCLOSE = [
	'escape',
	'cut',
	'delete',
	'backSpaceAfterDelete',
	'beforeCommandDelete'
];

export class Popup extends UIGroup implements IPopup {
	override className(): string {
		return 'Popup';
	}

	isOpened: boolean = false;
	strategy: PopupStrategy = 'leftBottom';

	protected override appendChildToContainer(
		childContainer: HTMLElement
	): void {
		const content = this.getElm('content');
		assert(content, 'Content element should exist');
		content.appendChild(childContainer);
	}

	viewBound: () => IBound = (): IBound => ({
		left: 0,
		top: 0,
		width: this.ow.innerWidth,
		height: this.ow.innerHeight
	});

	private __targetBound!: () => IBound;

	private __childrenPopups: Set<IPopup> = new Set();

	override updateParentElement(target: IUIElement): this {
		if (target !== this && Component.isInstanceOf<Popup>(target, Popup)) {
			this.__childrenPopups.forEach(popup => {
				if (!target.closest(popup as Popup) && popup.isOpened) {
					popup.close();
				}
			});

			if (!this.__childrenPopups.has(target)) {
				this.j.e.on(target, 'beforeClose', () => {
					this.__childrenPopups.delete(target);
				});
			}

			this.__childrenPopups.add(target);
		}

		return super.updateParentElement(target);
	}

	/**
	 * Set popup content
	 */
	setContent(content: IUIElement | HTMLElement | string): this {
		if (this.allChildren.length) {
			throw new Error('Remove children');
		}

		if (Component.isInstanceOf<UIElement>(content, UIElement)) {
			this.append(content);
		} else {
			const elm = isString(content)
				? this.j.c.fromHTML(content)
				: (content as HTMLElement);

			this.appendChildToContainer(elm);
		}

		this.updatePosition();

		return this;
	}

	/**
	 * Open popup near with some bound
	 */
	open(
		getBound: getBoundFunc,
		keepPosition: boolean = false,
		parentContainer?: HTMLElement
	): this {
		markOwner(this.jodit, this.container);
		this.container.classList.add(`jodit_theme_${this.jodit.o.theme}`);

		this.__calculateZIndex();

		this.isOpened = true;
		this.__addGlobalListeners();

		this.__targetBound = !keepPosition
			? getBound
			: this.getKeepBound(getBound);

		if (parentContainer) {
			parentContainer.appendChild(this.container);
		} else {
			const popupContainer = getContainer(this.jodit, Popup);

			if (parentContainer !== this.container.parentElement) {
				popupContainer.appendChild(this.container);
			}
		}

		this.updatePosition();

		this.j.e.fire(this, 'afterOpen');
		this.j.e.fire('afterOpenPopup', this);

		return this;
	}

	private __calculateZIndex(): void {
		if (this.container.style.zIndex) {
			return;
		}

		const checkView = (view: IViewBased): boolean => {
			const zIndex = view.container.style.zIndex || view.o.zIndex;

			if (zIndex) {
				this.setZIndex(1 + parseInt(zIndex.toString(), 10));
				return true;
			}

			return false;
		};

		const { j } = this;

		if (checkView(j)) {
			return;
		}

		let pe = this.parentElement;

		while (pe) {
			if (checkView(pe.j)) {
				return;
			}

			if (pe.container.style.zIndex) {
				this.setZIndex(
					1 + parseInt(pe.container.style.zIndex.toString(), 10)
				);
				return;
			}

			if (!pe.parentElement && pe.container.parentElement) {
				const elm = UIElement.closestElement(
					pe.container.parentElement,
					UIElement
				);

				if (elm) {
					pe = elm;
					continue;
				}
			}

			pe = pe.parentElement;
		}
	}

	/**
	 * Calculate static bound for point
	 */
	protected getKeepBound(getBound: getBoundFunc): getBoundFunc {
		const oldBound = getBound();
		const elmUnderCursor = this.od.elementFromPoint(
			oldBound.left,
			oldBound.top
		);

		if (!elmUnderCursor) {
			return getBound;
		}

		const element = Dom.isHTMLElement(elmUnderCursor)
			? elmUnderCursor
			: (elmUnderCursor.parentElement as HTMLElement);

		const oldPos = position(element, this.j);

		return () => {
			const bound = getBound();
			const newPos = position(element, this.j);

			return {
				...bound,
				top: bound.top + (newPos.top - oldPos.top),
				left: bound.left + (newPos.left - oldPos.left)
			};
		};
	}

	/**
	 * Update container position
	 */
	@autobind
	updatePosition(): this {
		if (!this.isOpened) {
			return this;
		}

		const [pos, strategy] = this.__calculatePosition(
			this.__targetBound(),
			this.viewBound(),
			position(this.container, this.j)
		);

		this.setMod('strategy', strategy);

		css(this.container, {
			left: pos.left,
			top: pos.top
		});

		this.__childrenPopups.forEach(popup => popup.updatePosition());

		return this;
	}

	@throttle(10)
	@autobind
	private __throttleUpdatePosition(): void {
		this.updatePosition();
	}

	/**
	 * Calculate start point
	 */
	private __calculatePosition(
		target: IBound,
		view: IBound,
		container: IBound,
		defaultStrategy: PopupStrategy = this.strategy
	): [IBoundP, PopupStrategy] {
		const x: IDictionary = {
				left: target.left,
				right: target.left - (container.width - target.width)
			},
			y: IDictionary = {
				bottom: target.top + target.height,
				top: target.top - container.height
			};

		const list = Object.keys(x).reduce(
			(keys, xKey) =>
				keys.concat(
					Object.keys(y).map(
						yKey => `${xKey}${ucfirst(yKey)}` as PopupStrategy
					)
				),
			[] as PopupStrategy[]
		);

		const getPointByStrategy = (strategy: PopupStrategy): IBound => {
			const [xKey, yKey] = kebabCase(strategy).split('-');

			return {
				left: x[xKey],
				top: y[yKey],
				width: container.width,
				height: container.height
			};
		};

		const getMatchStrategy = (inBox: IBound): Nullable<PopupStrategy> => {
			let strategy: Nullable<PopupStrategy> = null;

			if (Popup.boxInView(getPointByStrategy(defaultStrategy), inBox)) {
				strategy = defaultStrategy;
			} else {
				strategy =
					list.find((key): CanUndef<string> => {
						if (Popup.boxInView(getPointByStrategy(key), inBox)) {
							return key;
						}

						return;
					}) || null;
			}

			return strategy;
		};

		// Try to find match position inside Jodit.container
		let strategy = getMatchStrategy(position(this.j.container, this.j));

		// If not found or is not inside window view
		if (!strategy || !Popup.boxInView(getPointByStrategy(strategy), view)) {
			// Find match strategy inside window view
			strategy = getMatchStrategy(view) || strategy || defaultStrategy;
		}

		return [getPointByStrategy(strategy), strategy];
	}

	/**
	 * Check if one box is inside second
	 */
	private static boxInView(box: IBound, view: IBound): boolean {
		const accuracy = 2;

		return (
			box.top - view.top >= -accuracy &&
			box.left - view.left >= -accuracy &&
			view.top + view.height - (box.top + box.height) >= -accuracy &&
			view.left + view.width - (box.left + box.width) >= -accuracy
		);
	}

	/**
	 * Close popup
	 */
	@autobind
	close(): this {
		if (!this.isOpened) {
			return this;
		}

		this.isOpened = false;

		this.__childrenPopups.forEach(popup => popup.close());

		this.j.e.fire(this, 'beforeClose');
		this.j.e.fire('beforePopupClose', this);

		this.__removeGlobalListeners();
		Dom.safeRemove(this.container);

		return this;
	}

	/**
	 * Close popup if click was in outside
	 */
	@autobind
	private __closeOnOutsideClick(e: MouseEvent): void {
		if (!this.isOpened || this.isOwnClick(e)) {
			return;
		}

		this.close();
	}

	isOwnClick(e: MouseEvent): boolean {
		if (!e.target) {
			return false;
		}

		const box = UIElement.closestElement(e.target as Node, Popup);

		return Boolean(box && (this === box || box.closest(this)));
	}

	private __addGlobalListeners(): void {
		const up = this.__throttleUpdatePosition,
			ow = this.ow;

		eventEmitter.on('closeAllPopups', this.close);

		if (this.smart) {
			this.j.e
				.on(EVENTS_FOR_AUTOCLOSE, this.close)
				.on('mousedown touchstart', this.__closeOnOutsideClick)
				.on(ow, 'mousedown touchstart', this.__closeOnOutsideClick);
		}

		this.j.e
			.on('closeAllPopups', this.close)
			.on('resize', up)
			.on(this.container, 'scroll mousewheel', up)
			.on(ow, 'scroll', up)
			.on(ow, 'resize', up);

		Dom.up(this.j.container, box => {
			box && this.j.e.on(box, 'scroll mousewheel', up);
		});
	}

	private __removeGlobalListeners(): void {
		const up = this.__throttleUpdatePosition,
			ow = this.ow;

		eventEmitter.off('closeAllPopups', this.close);

		if (this.smart) {
			this.j.e
				.off(EVENTS_FOR_AUTOCLOSE, this.close)
				.off('mousedown touchstart', this.__closeOnOutsideClick)
				.off(ow, 'mousedown touchstart', this.__closeOnOutsideClick);
		}

		this.j.e
			.off('closeAllPopups', this.close)
			.off('resize', up)
			.off(this.container, 'scroll mousewheel', up)
			.off(ow, 'scroll', up)
			.off(ow, 'resize', up);

		if (this.j.container.isConnected) {
			Dom.up(this.j.container, box => {
				box && this.j.e.off(box, 'scroll mousewheel', up);
			});
		}
	}

	/**
	 * Set ZIndex
	 */
	setZIndex(index: number | string): void {
		this.container.style.zIndex = index.toString();
	}

	constructor(
		jodit: IViewBased,
		readonly smart: boolean = true
	) {
		super(jodit);
		attr(this.container, 'role', 'popup');
	}

	override render(): string {
		return `<div>
			<div class="&__content"></div>
		</div>`;
	}

	/** @override **/
	override destruct(): any {
		this.close();
		return super.destruct();
	}
}
