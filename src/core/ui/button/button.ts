import './button.less';

import { UIElement } from '../element';
import {
	CanUndef,
	IUIButton,
	IUIButtonState,
	IUIButtonStatePartial,
	IViewBased
} from '../../../types';
import watch from '../../../core/decorators/watch';
import { STATUSES } from '../../component';
import { Dom } from '../../dom';
import { css, attr } from '../../helpers';
import { Icon } from '../icon';

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
	/**
	 * Marker for buttons
	 */
	isButton: true = true;

	state = UIButtonState();

	/**
	 * Set state
	 * @param state
	 */
	setState(state: IUIButtonStatePartial): this {
		Object.assign(this.state, state);
		return this;
	}

	/**
	 * DOM container for text content
	 */
	text!: HTMLElement;

	/**
	 * DOM container for icon
	 */
	icon!: HTMLElement;

	@watch('state.size')
	protected onChangeSize(
		ignore?: string,
		oldSize: string = this.state.size
	): void {
		const cl = this.container.classList;

		cl.remove(this.componentName + '_' + oldSize);
		cl.add(this.componentName + '_' + this.state.size);
	}

	@watch('state.text')
	protected onChangeText(): void {
		this.text.textContent = this.j.i18n(this.state.text);
	}

	@watch('state.disabled')
	protected onChangeDisabled(): void {
		attr(this.container, 'disabled', this.state.disabled || null);
	}

	@watch('state.activated')
	protected onChangeActivated(): void {
		attr(this.container, 'aria-pressed', this.state.activated);
	}

	@watch('state.tooltip')
	protected onChangeTooltip(): void {
		if (this.j.o.useNativeTooltip) {
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
				iconElement = jodit.c.element('span');

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
				const svg = Icon.get(this.state.icon.name);

				if (svg) {
					iconElement = this.j.c.fromHTML(svg.trim());
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
		const { activeElement } = this.j.od;

		return Boolean(
			activeElement && Dom.isOrContains(this.container, activeElement)
		);
	}

	/** @override */
	protected createContainer(): HTMLElement {
		let tabIndex = -1;

		if (this.j.o.allowTabNavigation) {
			tabIndex = 0;
		}

		const button = this.j.c.element('button', {
			class: this.componentName,
			type: 'button',
			role: 'button',
			tabIndex,
			ariaPressed: false
		});

		this.text = this.j.c.span(this.componentName + '__text');
		this.icon = this.j.c.span(this.componentName + '__icon');

		button.appendChild(this.text);
		button.appendChild(this.icon);

		this.j.e.on(button, `click`, this.onActionFire.bind(this));

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
		this.j.e.off(this.container);
		return super.destruct();
	}

	/**
	 * Add tooltip to button
	 */
	protected initTooltip() {
		if (this.j.o.showTooltip && !this.j.o.useNativeTooltip) {
			const to = this.j.o.showTooltipDelay || this.j.defaultTimeout;

			let timeout: number = 0;

			this.j.e
				.on(this.container, 'mouseenter', () => {
					if (!this.state.tooltip) {
						return;
					}

					timeout = this.j.async.setTimeout(
						() =>
							!this.state.disabled &&
							this.j?.e.fire(
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
					this.j.async.clearTimeout(timeout);
					this.j.e.fire('hideTooltip');
				});
		}
	}

	private actionHandlers: Function[] = [];

	/**
	 * Add action handler
	 * @param originalEvent
	 */
	onAction(callback: (originalEvent: MouseEvent) => void): this {
		this.actionHandlers.push(callback);
		return this;
	}

	/**
	 * Fire all click handlers
	 * @param originalEvent
	 */
	private onActionFire(originalEvent: MouseEvent): void {
		this.actionHandlers.forEach(callback =>
			callback.call(this, originalEvent)
		);
	}
}
