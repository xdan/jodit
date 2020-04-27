import './popup.less';

import autobind from 'autobind-decorator';

import { IBound, IPopup, IUIElement, IViewBased } from '../../../types';
import { Dom } from '../../dom';
import {
	attr,
	camelCase,
	css,
	isString,
	markOwner,
	position
} from '../../helpers';
import { getContainer } from '../../global';
import { UIElement } from '../';

type getBoundFunc = () => IBound;

export class Popup extends UIElement implements IPopup {
	isOpened: boolean = false;

	private getBound!: () => IBound;

	private childrenPopups: Set<IPopup> = new Set();

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
			content.parentElement = this;
		} else if (isString(content)) {
			elm = this.j.c.fromHTML(content);
		} else {
			elm = content as HTMLElement;
		}

		box.appendChild(elm);

		this.container.appendChild(box);

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

		this.getBound = !keepPosition ? getBound : this.getKeepBound(getBound);

		const parentContainer = getContainer(this.jodit, Popup.name);

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
		let elmUnderCursor = this.od.elementFromPoint(
			oldBound.left,
			oldBound.top
		);

		if (!elmUnderCursor) {
			return getBound;
		}

		const element = Dom.isHTMLElement(elmUnderCursor, this.ow)
			? elmUnderCursor
			: (elmUnderCursor.parentElement as HTMLElement);

		const oldPos = position(element);

		return () => {
			const bound = getBound();
			const newPos = position(element);

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
		const pos = this.getBound();

		this.childrenPopups.forEach(popup => popup.updatePosition());

		css(this.container, {
			left: pos.left,
			top: pos.top + pos.height
		});

		return this;
	}

	/**
	 * Close popup
	 */
	@autobind
	close(): this {
		if (!this.isOpened) {
			return this;
		}

		this.childrenPopups.forEach(popup => popup.close());

		this.j.e.fire(this, 'beforeClose');

		this.removeGlobalListeners();

		this.isOpened = false;
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

		const box = Dom.up(e.target as Node, node => {
			if (node) {
				const { component } = node as any;
				return component && component instanceof Popup;
			}

			return false;
		});

		if (
			box &&
			box.component &&
			box.component instanceof Popup &&
			(box.component === this || box.component.closest(this))
		) {
			return;
		}

		this.close();
	}

	private addGlobalListeners(): void {
		const up = this.updatePosition,
			ow = this.ow;

		this.j.e
			.on(camelCase('close-all-popups'), this.close)
			.on('escape', this.close)
			.on('resize', up)
			.on(this.container, 'scroll', up)
			.on(this.container, 'mousewheel', up)
			.on('mousedown touchstart', this.closeOnOutsideClick)
			.on(ow, 'mousedown touchstart', this.closeOnOutsideClick)
			.on(ow, 'scroll', up)
			.on(ow, 'resize', up);
	}

	private removeGlobalListeners(): void {
		const up = this.updatePosition,
			ow = this.ow;

		this.j.e
			.off(camelCase('close-all-popups'), this.close)
			.off('escape', this.close)
			.off('resize', up)
			.off(this.container, 'scroll', up)
			.off(this.container, 'mousewheel', up)
			.off('mousedown touchstart', this.closeOnOutsideClick)
			.off(ow, 'mousedown touchstart', this.closeOnOutsideClick)
			.off(ow, 'scroll', up)
			.off(ow, 'resize', up);
	}

	constructor(jodit: IViewBased) {
		super(jodit);
		attr(this.container, 'role', 'popup');
	}

	/** @override **/
	destruct(): any {
		this.close();
		return super.destruct();
	}
}
