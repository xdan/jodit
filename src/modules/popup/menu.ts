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
		const box: HTMLElement = this.jodit.create.div(
			`${this.componentName}__content`
		);
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
		this.jodit.events.fire(camelCase('close-all-popups'));
		this.jodit.markOwner(this.container);

		this.isOpened = true;
		this.getBound = getBound;

		content && this.setContent(content);
		getContainer(this.jodit, PopupMenu.name).appendChild(this.container);

		this.updatePosition();

		const up = this.updatePosition;

		this.jodit.events
			.on(camelCase('close-all-popups'), this.close)
			.on('resize', up)
			.on(this.jodit.ownerWindow, 'scroll', up)
			.on(this.jodit.ownerWindow, 'resize', up)
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

		this.jodit.events
			.off(camelCase('close-all-popups'), this.close)
			.off('resize', up)
			.off(this.jodit.ownerWindow, 'scroll', up)
			.off(this.jodit.ownerWindow, 'resize', up)
			.fire(this, 'afterClose');

		this.isOpened = false;
		Dom.safeRemove(this.container);
	}

	destruct(): any {
		this.close();
		return super.destruct();
	}
}
