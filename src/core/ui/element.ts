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

	setParentElement(parentElement: Nullable<IUIElement>): this {
		this.parentElement = parentElement;
		return this;
	}

	/**
	 * Find match parent
	 * @param type
	 */
	closest<T extends Function>(type: T): Nullable<UIElement> {
		let pe = this.parentElement;

		while (pe) {
			if (pe instanceof type) {
				return pe as UIElement;
			}

			pe = pe.parentElement;
		}

		return null;
	}

	/**
	 * Set/remove BEM class modification
	 *
	 * @param name
	 * @param value if null, mod will be removed
	 */
	setMod(name: string, value: string | boolean | null): this {
		const mod = `${this.componentName}_${name}`,
			cl = this.container.classList;

		cl.forEach(className => {
			if (className.indexOf(mod) === 0) {
				cl.remove(className);
			}
		});

		value !== null && value !== '' && cl.add(`${mod}_${value}`);
		return this;
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

	constructor(jodit: T) {
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
