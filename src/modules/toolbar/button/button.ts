import './button.less';
import { createIcon, ToolbarElement } from '../element';
import { IControlTypeStrong, IToolbarButton, IViewBased, Nullable } from '../../../types';
import { attr } from '../../helpers/utils';
import { isFunction, isJoditObject, isString } from '../../helpers/checker';
import { Dom } from '../../Dom';
import { asArray } from '../../helpers/array';
import { ToolbarIcon } from '../icon';

export class ToolbarButton<T extends IViewBased = IViewBased> extends ToolbarElement<T> implements IToolbarButton {
	private get clearName(): string {
		return this.control.name.replace(/[^a-zA-Z0-9]/g, '_');
	}

	get textContainer(): HTMLElement {
		return this.container.querySelector('.jodit-toolbar__button-text') as HTMLElement;
	};

	get trigger(): Nullable<HTMLElement> {
		return this.container.querySelector('.jodit-toolbar__button-text');
	};

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
	 * Button should be active
	 */
	isShouldBeActive(): boolean {
		if (isJoditObject(this.jodit) && !this.jodit.editorIsActive) {
			return false;
		}

		if (isFunction(this.control.isActive)) {
			return this.control.isActive(this.jodit, this.control, this);
		}

		return false;
	}

	/**
	 * Button should be disabled
	 */
	isShouldBeDisabled(): boolean {
		if (this.jodit.options.disabled) {
			return true;
		}

		if (
			this.jodit.options.readonly &&
			(!this.jodit.options.activeButtonsInReadOnly ||
				this.jodit.options.activeButtonsInReadOnly.indexOf(
					this.control.name
				) === -1)
		) {
			return true;
		}

		let isDisabled: boolean = false;

		if (isFunction(this.control.isDisabled)) {
			isDisabled = this.control.isDisabled(
				this.jodit,
				this.control,
				this
			);
		}

		return isDisabled;
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

		this.setDisabled(this.isShouldBeDisabled());

		if (!this.isDisabled()) {
			this.setActive(this.isShouldBeActive());
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
		readonly target?: HTMLElement,
	) {
		super(jodit);

		const {clearName} = this;
		this.container.classList.add('jodit_toolbar__button_' + clearName);
		this.container.appendChild(createIcon(this.jodit, clearName, this.control));

		this.addTrigger();
		this.update();
		this.initTooltip();


		this.jodit.events
			.on(
				this.container,
				`click.${clearName}`,
				this.onAction.bind(this)
			)
			.on(
				`click-${this.clearName}-btn.${clearName}`,
				this.onAction.bind(this)
			);
	}

	protected addTrigger() {
		if (this.control.list) {
			const trigger = this.jodit.create
				.fromHTML(`<span class="jodit_toolbar__button-trigger">
					${ToolbarIcon.getIcon('dropdown-arrow')}
				</span>`);

			this.container.appendChild(trigger);

			this.container.classList.add('jodit_toolbar__button_with_trigger');

			this.jodit.events.on(trigger, `click.${this.clearName}`, this.onTriggerAction.bind(this));
		}
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
	protected createContainer(): HTMLElement {
		const container = this.jodit.create.element('button');

		attr(container, 'role', 'button');

		container.classList.add('jodit-toolbar__button');

		const textContainer = this.jodit.create.span(
			'jodit-toolbar__button-text'
		);

		container.appendChild(textContainer);

		return container;
	}

	protected onAction() {}
	protected onTriggerAction() {}
}
