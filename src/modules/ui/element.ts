import { Component } from '../component';
import { IContainer, IViewBased } from '../../types';

export abstract class UIElement extends Component implements IContainer {
	container!: HTMLElement;
	parentElement: UIElement | null = null;

	/**
	 * Update UI from state
	 */
	update(): void {};

	/**
	 * Valid name only with valid chars
	 */
	protected clearName(name: string): string {
		return name.replace(/[^a-zA-Z0-9]/g, '_');
	}

	/**
	 * Create main HTML container
	 */
	protected createContainer(): HTMLElement {
		return this.jodit.create.div(this.componentName);
	}

	constructor(jodit: IViewBased) {
		super(jodit);

		this.container = this.createContainer();

		Object.defineProperty(this.container, 'component', {
			value: this
		});
	}
}
