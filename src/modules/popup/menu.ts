import './menu.less';

import autobind from 'autobind-decorator';

import { IBound, IPopup, Nullable } from '../../types';
import { Dom } from '../../core/dom';
import { camelCase, css } from '../../core/helpers';
import { getContainer } from '../../core/global';
import { UIElement } from '../../core/ui';

export class PopupMenu extends UIElement implements IPopup {
	isOpened: boolean = false;

	private getBound!: () => IBound;

	setContent(content: HTMLElement): void {
		const box: HTMLElement = this.j.c.div(`${this.componentName}__content`);
		Dom.detach(this.container);
		box.appendChild(content);
		this.container.appendChild(box);
	}

	/**
	 * Open popup near with some bound
	 *
	 * @param content
	 * @param getBound
	 */
	open(content: Nullable<HTMLElement>, getBound: () => IBound): void {
		this.j.e.fire(camelCase('close-all-popups'));
		this.j.markOwner(this.container);

		this.isOpened = true;
		this.getBound = getBound;

		content && this.setContent(content);
		getContainer(this.j, PopupMenu.name).appendChild(this.container);

		this.updatePosition();

		const up = this.updatePosition;

		this.j.e
			.on(camelCase('close-all-popups'), this.close)
			.on('resize', up)
			.on(this.j.ow, 'scroll', up)
			.on(this.j.ow, 'resize', up)
			.fire(this, 'afterOpen');
	}

	@autobind
	protected updatePosition(): void {
		const pos = this.getBound();

		css(this.container, {
			left: pos.left,
			top: pos.top + pos.height
		});
	}

	@autobind
	close(): void {
		if (!this.isOpened) {
			return;
		}

		const up = this.updatePosition;

		this.j.e
			.off(camelCase('close-all-popups'), this.close)
			.off('resize', up)
			.off(this.j.ow, 'scroll', up)
			.off(this.j.ow, 'resize', up)
			.fire(this, 'afterClose');

		this.isOpened = false;
		Dom.safeRemove(this.container);
	}

	destruct(): any {
		this.close();
		return super.destruct();
	}
}
