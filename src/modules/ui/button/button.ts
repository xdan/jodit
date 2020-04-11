import './button.less';
import { UIElement } from '../element';
import { CanUndef, IControlTypeStrong, IViewBased } from '../../../types';
import watch from '../../../core/decorators/watch';
import { attr } from '../../../core/helpers/utils';
import { STATUSES } from '../../component';
import { Dom } from '../../dom';
import { ToolbarIcon } from '../..';
import { css, isString } from '../../../core/helpers';

export class UIButton extends UIElement {
	state = {
		disabled: false,
		activated: false,
		icon: {
			name: 'empty',
			iconURL: ''
		},
		text: ''
	};

	update(): void {
		this.onChangeActivated();
		this.onChangeDisabled();
		this.onChangeText();
		this.onChangeIcon();
	}

	@watch('state.text')
	protected onChangeText(): void {
		this.text.textContent = this.state.text;
	}

	@watch('state.disabled')
	protected onChangeDisabled(): void {
		attr(this.container, 'disabled', this.state.disabled || null);
	}

	@watch('state.activated')
	protected onChangeActivated(): void {
		attr(this.container, 'aria-pressed', this.state.activated || null);
	}

	@watch('state.icon')
	protected onChangeIcon(): void {
		Dom.detach(this.icon);

		const { control, jodit, state } = this;

		const icon: string = control.icon || this.clearName(control.name);

		const iconSVG: string | void | HTMLElement = jodit.events.fire(
			'getIcon',
			icon,
			control,
			this.clearName(control.name)
		);

		let iconElement: CanUndef<HTMLElement> = undefined;

		if (iconSVG) {
			iconElement = isString(iconSVG)
				? jodit.create.fromHTML(iconSVG)
				: iconSVG;
		} else if (state.icon) {
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
					iconElement = this.jodit.create.fromHTML(svg);
				}
			}
		}

		if (iconElement) {
			iconElement.classList.add(
				'jodit-icon',
				'jodit-icon_' + this.clearName(this.control.name)
			);
			this.icon.appendChild(iconElement);
		}
	}

	protected text!: HTMLElement;
	protected icon!: HTMLElement;

	/** @override */
	protected createContainer(): HTMLElement {
		const button = this.jodit.create.element('button', {
			class: this.componentName,
			type: 'button',
			role: 'button',
			tabindex: -1,
			ariaPressed: false
		});

		this.text = this.jodit.create.span(this.componentName + '__text');
		this.icon = this.jodit.create.span(this.componentName + '__icon');

		button.appendChild(this.text);
		button.appendChild(this.icon);

		return button;
	}

	constructor(jodit: IViewBased, readonly control: IControlTypeStrong) {
		super(jodit);

		this.container.classList.add(
			`${this.componentName}_${this.clearName(control.name)}`
		);

		this.setStatus(STATUSES.ready);

		this.state.icon.name = control.icon || control.name;
		this.state.icon.iconURL = control.iconURL || '';
	}
}
