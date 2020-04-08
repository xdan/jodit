import './button.less';
import { UIElement } from '../element';
import { IControlTypeStrong, IViewBased } from '../../../types';
import watch from '../../../core/decorators/watch';
import { attr } from '../../../core/helpers/utils';
import { STATUSES } from '../../component';

export class UIButton extends UIElement {
	state = {
		disabled: false,
		activated: false,
		icon: '',
		text: ''
	};

	update(): void {
		this.onChangeActivated();
		this.onChangeDisabled();
		this.onChangeText();
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
	}
}
