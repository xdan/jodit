import { Component, STATUSES } from '../component';
import { IUIElement, IViewBased, Nullable } from '../../types';
import { Dom } from '../dom';

export abstract class UIElement<T extends IViewBased = IViewBased>
	extends Component<T>
	implements IUIElement {
	/**
	 * Is not a button
	 */
	isButton: boolean = false;

	container!: HTMLElement;
	parentElement: Nullable<IUIElement> = null;

	setParentElement(parentElement: Nullable<IUIElement>): void {
		this.parentElement = parentElement;
	}

	/**
	 * Update UI from state
	 */
	update(): void {}

	/**
	 * Append container to element
	 * @param element
	 */
	appendTo(element: HTMLElement): this {
		element.appendChild(this.container);
		return this;
	}

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
		return this.j.c.div(this.componentName);
	}

	constructor(jodit?: T) {
		super(jodit);

		this.container = this.createContainer();

		Object.defineProperty(this.container, 'component', {
			value: this
		});

		if (this.constructor.name === UIElement.name) {
			this.setStatus(STATUSES.ready);
		}
	}

	destruct(): any {
		Dom.safeRemove(this.container);
		this.setParentElement(null);
		return super.destruct();
	}
}
