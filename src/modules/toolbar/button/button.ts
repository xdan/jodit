import './button.less';
import { createIcon, ToolbarElement } from '../element';
import {
	IControlTypeStrong,
	IToolbarButton,
	IViewBased,
	Nullable
} from '../../../types';
import { attr, call } from '../../helpers/utils';
import { isFunction, isJoditObject, isString } from '../../helpers/checker';
import { Dom } from '../../Dom';
import { asArray } from '../../helpers/array';

export class ToolbarButton<T extends IViewBased = IViewBased>
	extends ToolbarElement<T>
	implements IToolbarButton {
	/**
	 * ToolbarElement is button
	 */
	isToolbarButton: true = true;

	/**
	 * Valid name only with valid chars
	 */
	protected clearName(name: string): string {
		return name.replace(/[^a-zA-Z0-9]/g, '_');
	}

	get textContainer(): HTMLElement {
		return this.container.querySelector(
			'.jodit-toolbar__button-text'
		) as HTMLElement;
	}

	get trigger(): Nullable<HTMLElement> {
		return this.container.querySelector('.jodit-toolbar__button-trigger');
	}

	get button(): HTMLElement {
		return (
			(this.container.querySelector(
				'.jodit_toolbar__button'
			) as HTMLElement) || this.container
		);
	}

	/**
	 * Disable/Enable button
	 * @param disable
	 */
	setDisabled(disable: boolean) {
		if (this.__isDisabled === disable) {
			return;
		}

		this.__isDisabled = disable;
		this.container.classList.toggle('jodit_disabled', disable);

		if (!disable) {
			attr(this.container, 'disabled', null);
		} else {
			if (!this.container.hasAttribute('disabled')) {
				attr(this.container, 'disabled', 'disabled');
			}
		}
	}

	private __isDisabled: boolean = false;

	/**
	 * Button is disabled
	 */
	isDisabled(): boolean {
		return this.__isDisabled;
	}

	/**
	 * Set active state on button
	 * @param enable
	 */
	setActive(active: boolean) {
		if (this.__isActive === active) {
			return;
		}

		this.__isActive = active;

		this.container.classList.toggle('jodit_active', active);
	}

	private __isActive: boolean = false;

	/**
	 * Button is active
	 */
	isActive(): boolean {
		return this.__isActive;
	}

	/**
	 * Update content
	 */
	update(): void {
		const { control } = this;

		if (isFunction(control.getLabel)) {
			control.getLabel(this.jodit, control, this);
		}

		if (isFunction(control.getContent)) {
			Dom.detach(this.container);

			const content = control.getContent(this.jodit, control, this);

			this.container.appendChild(
				isString(content)
					? this.jodit.create.fromHTML(content)
					: content
			);
		}

		this.parentToolbar &&
			this.setDisabled(this.parentToolbar.shouldBeDisabled(this));

		if (this.parentToolbar && !this.isDisabled()) {
			this.setActive(this.parentToolbar.shouldBeActive(this));
		}

		let tabIndex = '-1';

		if (this.jodit.options.allowTabNavigation) {
			tabIndex = '0';
		}

		attr(this.container, 'tabindex', tabIndex);
	}

	constructor(
		jodit: T,
		readonly control: IControlTypeStrong,
		readonly target?: HTMLElement
	) {
		super(jodit, control, target);

		const clearName = this.clearName(control.name);
		this.container.classList.add('jodit_toolbar__item_' + clearName);

		this.update();
		this.initTooltip();

		this.jodit.events
			.on(this.button, `click.${clearName}`, this.onAction.bind(this))
			.on(this.button, `mousedown.${clearName}`, (e: MouseEvent) => {
				e.preventDefault();
			})
			.on(
				`click-${this.clearName}-btn.${clearName}`,
				this.onAction.bind(this)
			);
	}

	protected initTooltip() {
		const { control } = this;
		const tooltipText = this.tooltipText();

		if (this.jodit.options.showTooltip && control.tooltip) {
			if (!this.jodit.options.useNativeTooltip) {
				const to =
					this.jodit.options.showTooltipDelay ||
					this.jodit.defaultTimeout;

				let timeout: number = 0;

				this.jodit.events
					.on(this.container, 'mouseenter', () => {
						timeout = this.jodit.async.setTimeout(
							() =>
								!this.isDisabled() &&
								this.jodit?.events.fire(
									'showTooltip',
									this.container,
									tooltipText
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
			} else {
				this.container.setAttribute('title', tooltipText);
			}

			this.container.setAttribute('aria-label', tooltipText);
		}
	}

	private tooltipText(): string {
		if (!this.control.tooltip) {
			return '';
		}

		return (
			this.jodit.i18n(this.control.tooltip) +
			(this.control.hotkeys
				? '<br>' + asArray(this.control.hotkeys).join(' ')
				: '')
		);
	}

	destruct(): any {
		this.jodit.events
			.off(this.container, `click.${this.clearName}`)
			.off(`click-${this.clearName}-btn.${this.clearName}`);

		this.trigger &&
			this.jodit.events.off(this.trigger, `click.${this.clearName}`);

		return super.destruct();
	}

	/** @override */
	protected createContainer(control: IControlTypeStrong): HTMLElement {
		const container = this.jodit.create.element('button');

		attr(container, 'role', 'button');

		container.classList.add('jodit-toolbar__button', 'jodit-toolbar__item');

		const textContainer = this.jodit.create.span(
			'jodit-toolbar__button-text'
		);

		container.appendChild(textContainer);

		const clearName = this.clearName(control.name);
		container.appendChild(createIcon(this.jodit, clearName, control));

		return container;
	}

	protected onAction(originalEvent: MouseEvent) {
		const { control } = this;

		if (isFunction(control.exec)) {
			control.exec(
				this.jodit,
				this.target || false,
				control,
				originalEvent,
				this.container as HTMLLIElement
			);

			this.jodit?.events.fire('synchro');

			if (this.parentToolbar) {
				this.parentToolbar.immediateUpdate();
			}

			/**
			 * Fired after calling `button.exec` function
			 * @event afterExec
			 */
			this.jodit?.events.fire('closeAllPopups afterExec');

			return;
		}

		if (control.command || control.name) {
			call(
				isJoditObject(this.jodit)
					? this.jodit.execCommand.bind(this.jodit)
					: this.jodit.ownerDocument.execCommand.bind(
							this.jodit.ownerDocument
					  ),
				control.command || control.name,
				(control.args && control.args[0]) || false,
				(control.args && control.args[1]) || null
			);

			this.jodit.events.fire('closeAllPopups');
		}
	}
}
