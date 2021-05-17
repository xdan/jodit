/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './popup.less';

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
} from '../../../types';
import { Dom } from '../../dom';
import {
	attr,
	css,
	isString,
	kebabCase,
	markOwner,
	position,
	ucfirst
} from '../../helpers';
import { eventEmitter, getContainer } from '../../global';
import { UIElement } from '../element';
import { autobind } from '../../decorators';

type getBoundFunc = () => IBound;

export class Popup extends UIElement implements IPopup {
	/** @override */
	className(): string {
		return 'Popup';
	}

	isOpened: boolean = false;
	strategy: PopupStrategy = 'leftBottom';

	viewBound: () => IBound = (): IBound => ({
		left: 0,
		top: 0,
		width: this.ow.innerWidth,
		height: this.ow.innerHeight
	});

	private targetBound!: () => IBound;

	private childrenPopups: Set<IPopup> = new Set();

	/** @override */
	updateParentElement(target: IUIElement): this {
		if (target !== this && target instanceof Popup) {
			this.childrenPopups.forEach(popup => {
				if (!target.closest(popup) && popup.isOpened) {
					popup.close();
				}
			});

			if (!this.childrenPopups.has(target)) {
				this.j.e.on(target, 'beforeClose', () => {
					this.childrenPopups.delete(target);
				});
			}

			this.childrenPopups.add(target);
		}

		return super.updateParentElement(target);
	}

	/**
	 * Set popup content
	 * @param content
	 */
	setContent(content: IUIElement | HTMLElement | string): this {
		Dom.detach(this.container);

		const box = this.j.c.div(`${this.componentName}__content`);

		let elm: HTMLElement;

		if (content instanceof UIElement) {
			elm = content.container;
			// @ts-ignore
			content.parentElement = this;
		} else if (isString(content)) {
			elm = this.j.c.fromHTML(content);
		} else {
			elm = content as HTMLElement;
		}

		box.appendChild(elm);

		this.container.appendChild(box);

		this.updatePosition();

		return this;
	}

	/**
	 * Open popup near with some bound
	 *
	 * @param getBound
	 * @param keepPosition
	 */
	open(getBound: getBoundFunc, keepPosition: boolean = false): this {
		markOwner(this.jodit, this.container);

		this.isOpened = true;
		this.addGlobalListeners();

		this.targetBound = !keepPosition
			? getBound
			: this.getKeepBound(getBound);

		const parentContainer = getContainer(this.jodit, Popup);

		if (parentContainer !== this.container.parentElement) {
			parentContainer.appendChild(this.container);
		}

		this.updatePosition();

		this.j.e.fire(this, 'afterOpen');

		return this;
	}

	/**
	 * Calculate static bound for point
	 * @param getBound
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

		const element = Dom.isHTMLElement(elmUnderCursor, this.ow)
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

		const [pos, strategy] = this.calculatePosition(
			this.targetBound(),
			this.viewBound(),
			position(this.container, this.j)
		);

		this.setMod('strategy', strategy);

		css(this.container, {
			left: pos.left,
			top: pos.top
		});

		this.childrenPopups.forEach(popup => popup.updatePosition());

		return this;
	}

	/**
	 * Calculate start point
	 *
	 * @param target
	 * @param view
	 * @param container
	 * @param defaultStrategy
	 */
	private calculatePosition(
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

		// Try find match position inside Jodit.container
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
	 *
	 * @param box
	 * @param view
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

		this.childrenPopups.forEach(popup => popup.close());

		this.j.e.fire(this, 'beforeClose');
		this.j.e.fire('beforePopupClose', this);

		this.removeGlobalListeners();

		Dom.safeRemove(this.container);

		return this;
	}

	/**
	 * Close popup if click was in outside
	 * @param e
	 */
	@autobind
	private closeOnOutsideClick(e: MouseEvent): void {
		if (!this.isOpened) {
			return;
		}

		if (!e.target) {
			this.close();
			return;
		}

		const box = UIElement.closestElement(e.target as Node, Popup);

		if (box && (this === box || box.closest(this))) {
			return;
		}

		this.close();
	}

	private addGlobalListeners(): void {
		const up = this.updatePosition,
			ow = this.ow;

		eventEmitter.on('closeAllPopups', this.close);

		if (this.smart) {
			this.j.e
				.on('escape', this.close)
				.on('mousedown touchstart', this.closeOnOutsideClick)
				.on(ow, 'mousedown touchstart', this.closeOnOutsideClick);
		}

		this.j.e
			.on('closeAllPopups', this.close)
			.on('resize', up)
			.on(this.container, 'scroll mousewheel', up)
			.on(ow, 'scroll', up)
			.on(ow, 'resize', up);
	}

	private removeGlobalListeners(): void {
		const up = this.updatePosition,
			ow = this.ow;

		eventEmitter.off('closeAllPopups', this.close);

		if (this.smart) {
			this.j.e
				.off('escape', this.close)
				.off('mousedown touchstart', this.closeOnOutsideClick)
				.off(ow, 'mousedown touchstart', this.closeOnOutsideClick);
		}

		this.j.e
			.off('closeAllPopups', this.close)

			.off('resize', up)
			.off(this.container, 'scroll mousewheel', up)
			.off(ow, 'scroll', up)
			.off(ow, 'resize', up);
	}

	/**
	 * Set ZIndex
	 * @param index
	 */
	setZIndex(index: number) {
		this.container.style.zIndex = index.toString();
	}

	constructor(jodit: IViewBased, readonly smart: boolean = true) {
		super(jodit);
		attr(this.container, 'role', 'popup');
	}

	/** @override **/
	destruct(): any {
		this.close();
		return super.destruct();
	}
}
