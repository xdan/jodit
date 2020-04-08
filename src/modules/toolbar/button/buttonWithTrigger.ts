import { ToolbarButton } from './button';
import { ToolbarIcon } from '../icon';
import { IControlTypeStrong } from '../../../types';
import { Popup } from '../../popup/popup';
import { camelCase } from '../../../core/helpers/string';
import { attr } from '../../../core/helpers/utils';
import { isFunction, isString } from '../../../core/helpers/checker';
import { PopupMenu } from '../../popup/menu';
import { makeCollection } from '../factory';
import { position } from '../../../core/helpers/size/position';

export class ToolbarButtonWithTrigger extends ToolbarButton {
	/** @override */
	protected createContainer(control: IControlTypeStrong): HTMLElement {
		const container = this.jodit.create.div(
			'jodit-toolbar__item jodit-toolbar__item_split'
		);

		container.appendChild(super.createContainer(control));

		const trigger = this.jodit.create
			.fromHTML(`<span class="jodit-toolbar__item-trigger">
					${ToolbarIcon.getIcon('chevron')}
				</span>`);

		container.appendChild(trigger);

		this.jodit.events.on(trigger, `click`, this.onTriggerAction.bind(this));

		return container;
	}

	protected onTriggerAction() {
		const { control } = this;

		// getTarget = (): Node | false =>
		// 	(this.parentToolbar && this.parentToolbar.getTarget(this)) ||
		// 	this.target ||
		// 	false;

		if (control.list) {
			const
				list = control.list,
				menu = new PopupMenu(this.jodit),
				toolbar = makeCollection(this.jodit);

			const buttons = Array.isArray(list) ? list : Object.keys(list).map((key) => {
				const value = list[key] || {};

				return {
					name: key,
					...value
				};
			});

			toolbar.build(buttons);

			menu.open(toolbar.container, () => {
				return position(this.container);
			});

			this.jodit.events.fire('closeAllPopups', menu.container);

			attr(this.container, 'aria-expanded', true);

			this.jodit.events.on(menu, 'afterClose', () => {
				attr(this.container, 'aria-expanded', false);
			});

			return;
		}

		if (isFunction(control.popup)) {
			const popup: Popup = new Popup(
				this.jodit,
				this.container,
				this.target
			);

			if (
				this.jodit.events.fire(
					camelCase(`before-${control.name}-open-popup`),
					this.target,
					control,
					popup
				) !== false
			) {
				const popupElm = control.popup(
					this.jodit,
					this.target || false,
					control,
					popup.close,
					this
				);

				if (popupElm) {
					popup.open(isString(popupElm) ? this.jodit.create.fromHTML(popupElm) : popupElm);
				}
			}

			/**
			 * Fired after popup was opened for some control button
			 * @event after{CONTROLNAME}OpenPopup
			 */

			/**
			 * Close all opened popups
			 *
			 * @event closeAllPopups
			 */
			this.jodit.events.fire(
				camelCase(`after-${control.name}-open-popup`) +
					' closeAllPopups',
				popup.container
			);
		}
	}
}
