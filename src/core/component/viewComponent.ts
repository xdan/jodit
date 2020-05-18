import { IViewBased, IViewComponent } from '../../types';
import { Component } from './component';

export abstract class ViewComponent<T extends IViewBased = IViewBased>
	extends Component
	implements IViewComponent<T> {
	/**
	 * Parent View element
	 */
	jodit!: T;

	get defaultTimeout(): number {
		return this.j.defaultTimeout;
	}

	/**
	 * Shortcut for `this.jodit`
	 */
	get j(): this['jodit'] {
		return this.jodit;
	}

	/**
	 * Attach component to View
	 * @param jodit
	 */
	setParentView(jodit: T): this {
		this.jodit = jodit;

		jodit.components.add(this);

		return this;
	}

	constructor(jodit: T) {
		super();
		this.setParentView(jodit);
	}

	/** @override */
	destruct(): any {
		this.j.components.delete(this);
		return super.destruct();
	}
}
