import './button.less';

import { UIElement } from '../element';
import {
	CanUndef,
	IUIButton,
	IUIButtonState,
	IViewBased
} from '../../../types';
import watch from '../../../core/decorators/watch';
import { STATUSES } from '../../component';
import { Dom } from '../../dom';
import { ToolbarIcon } from '../..';
import { css, attr } from '../../../core/helpers';

export const UIButtonState = (): IUIButtonState => ({
	size: 'middle',
	disabled: false,
	activated: false,
	icon: {
		name: 'empty',
		fill: '',
		iconURL: ''
	},
	tooltip: '',
	text: ''
});

export class UIButton extends UIElement implements IUIButton {
	state = UIButtonState();

	/**
	 * DOM container for text content
	 */
	text!: HTMLElement;

	/**
	 * DOM container for icon
	 */
	icon!: HTMLElement;

	@watch('state.size')
	protected onChangeSize(ignore?: string, oldSize: string = this.state.size): void {
		const cl = this.container.classList;

		cl.remove(this.componentName + '_' + oldSize);
		cl.add(this.componentName + '_' + this.state.size);
	}

	@watch('state.text')
	protected onChangeText(): void {
		this.text.textContent = this.jodit.i18n(this.state.text);
	}

	@watch('state.disabled')
	protected onChangeDisabled(): void {
		attr(this.container, 'disabled', this.state.disabled || null);
	}

	@watch('state.activated')
	protected onChangeActivated(): void {
		attr(this.container, 'aria-pressed', this.state.activated || null);
	}

	@watch('state.tooltip')
	protected onChangeTooltip(): void {
		if (this.jodit.options.useNativeTooltip) {
			attr(this.container, 'title', this.state.tooltip);
		}

		attr(this.container, 'aria-label', this.state.tooltip);
	}

	@watch('state.icon')
	protected onChangeIcon(): void {
		Dom.detach(this.icon);

		const { jodit, state } = this;

		let iconElement: CanUndef<HTMLElement> = undefined;

		if (state.icon) {
			if (state.icon.iconURL) {
				iconElement = jodit.create.element('span');

				css(
					iconElement,
					'backgroundImage',
					'url(' +
						state.icon.iconURL.replace(
							'{basePath}',
							jodit.basePath
						) +
						')'
				);
			} else {
				const svg = ToolbarIcon.getIcon(this.state.icon.name);

				if (svg) {
					iconElement = this.jodit.create.fromHTML(svg.trim());
					iconElement.classList.add(
						'jodit-icon_' + this.clearName(this.state.icon.name)
					);
				}
			}
		}

		if (iconElement) {
			iconElement.classList.add('jodit-icon');
			iconElement.style.fill = state.icon.fill;

			this.icon.appendChild(iconElement);
		}
	}

	/**
	 * Set focus on element
	 */
	focus() {
		this.container.focus();
	}

	/**
	 * Element has focus
	 */
	isFocused(): boolean {
		const { activeElement } = this.jodit.ownerDocument;

		return Boolean(
			activeElement && Dom.isOrContains(this.container, activeElement)
		);
	}

	/** @override */
	protected createContainer(): HTMLElement {
		let tabIndex = -1;

		if (this.jodit.options.allowTabNavigation) {
			tabIndex = 0;
		}

		const button = this.jodit.create.element('button', {
			class: this.componentName,
			type: 'button',
			role: 'button',
			tabIndex,
			ariaPressed: false
		});

		this.text = this.jodit.create.span(this.componentName + '__text');
		this.icon = this.jodit.create.span(this.componentName + '__icon');

		button.appendChild(this.text);
		button.appendChild(this.icon);

		this.jodit.events.on(button, `click`, this.onActionFire.bind(this));

		return button;
	}

	constructor(jodit: IViewBased) {
		super(jodit);

		this.initTooltip();
		this.onChangeSize();

		if (this.constructor.name === UIButton.name) {
			this.setStatus(STATUSES.ready);
		}
	}

	destruct(): any {
		this.jodit.events.off(this.container);
		Dom.safeRemove(this.container);
		return super.destruct();
	}

	/**
	 * Add tooltip to button
	 */
	protected initTooltip() {
		if (
			this.jodit.options.showTooltip &&
			!this.jodit.options.useNativeTooltip
		) {
			const to =
				this.jodit.options.showTooltipDelay ||
				this.jodit.defaultTimeout;

			let timeout: number = 0;

			this.jodit.events
				.on(this.container, 'mouseenter', () => {
					if (!this.state.tooltip) {
						return;
					}

					timeout = this.jodit.async.setTimeout(
						() =>
							!this.state.disabled &&
							this.jodit?.events.fire(
								'showTooltip',
								this.container,
								this.state.tooltip
							),
						{
							timeout: to,
							label: 'tooltip'
						}
					);
				})
				.on(this.container, 'mouseleave', () => {
					this.jodit.async.clearTimeout(timeout);
					this.jodit.events.fire('hideTooltip');
				});
		}
	}

	private actionHandlers: Function[] = [];

	/**
	 * Add action handler
	 * @param originalEvent
	 */
	onAction(callback: (originalEvent: MouseEvent) => void): IUIButton {
		this.actionHandlers.push(callback);
		return this;
	}

	/**
	 * Fire all click handlers
	 * @param originalEvent
	 */
	private onActionFire(originalEvent: MouseEvent): void {
		this.actionHandlers.forEach(callback => callback.call(this, originalEvent));
	}
}
