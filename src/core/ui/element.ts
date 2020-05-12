import { ViewComponent, STATUSES } from '../component';
import { IDictionary, IUIElement, IViewBased, Nullable } from '../../types';
import { Dom } from '../dom';

export abstract class UIElement<T extends IViewBased = IViewBased>
	extends ViewComponent<T>
	implements IUIElement {
	container!: HTMLElement;

	private __parentElement: Nullable<IUIElement> = null;
	get parentElement(): Nullable<IUIElement> {
		return this.__parentElement;
	}

	set parentElement(parentElement: Nullable<IUIElement>) {
		this.__parentElement = parentElement;

		if (parentElement) {
			parentElement.hookStatus('beforeDestruct', () => this.destruct());
		}

		this.updateParentElement(this);
	}

	updateParentElement(target: IUIElement): this {
		this.__parentElement?.updateParentElement(target);
		return this;
	}

	/**
	 * Find match parent
	 * @param type
	 */
	closest<T extends IUIElement>(type: Function | IUIElement): Nullable<T> {
		let pe = this.__parentElement,
			c =
				typeof type === 'object'
					? (pe: IUIElement) => pe === type
					: (pe: IUIElement) => pe instanceof type;

		while (pe) {
			if (c(pe)) {
				return pe as T;
			}

			pe = pe.parentElement;
		}

		return null;
	}

	/**
	 * Find closest UIElement in DOM
	 * @param node
	 */
	static closestElement(node: Node, type: Function): Nullable<IUIElement> {
		const elm = Dom.up(node, node => {
			if (node) {
				const { component } = node as any;
				return component && component instanceof type;
			}

			return false;
		});

		return elm ? elm?.component : null;
	}

	readonly mods: IDictionary<string | boolean | null> = {};

	/**
	 * Set/remove BEM class modification
	 *
	 * @param name
	 * @param value if null, mod will be removed
	 */
	setMod(name: string, value: string | boolean | null): this {
		name = name.toLowerCase();

		if (this.mods[name] === value) {
			return this;
		}

		const mod = `${this.componentName}_${name}`,
			cl = this.container.classList;

		cl.forEach(className => {
			if (className.indexOf(mod) === 0) {
				cl.remove(className);
			}
		});

		value !== null &&
			value !== '' &&
			cl.add(`${mod}_${value.toString().toLowerCase()}`);

		this.mods[name] = value;

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
		this.parentElement = null;
		return super.destruct();
	}
}
