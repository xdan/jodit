/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, IPlugin, IViewBased } from '../types';
import { ViewComponent, STATUSES } from './component';
import { autobind } from './decorators';
import { isJoditObject } from './helpers';

export abstract class Plugin<T extends IViewBased = IJodit>
	extends ViewComponent<T>
	implements IPlugin<T>
{
	/** @override */
	buttons: IPlugin['buttons'] = [];

	/**
	 * Plugin have CSS style and it should be loaded
	 */
	hasStyle: boolean = false;

	/** @override */
	className(): string {
		return '';
	}

	protected abstract afterInit(jodit: T): void;
	protected abstract beforeDestruct(jodit: T): void;

	constructor(jodit: T) {
		super(jodit);

		jodit.e
			.on('afterPluginSystemInit', () => {
				if (isJoditObject(jodit)) {
					this.buttons?.forEach(btn => {
						jodit.registerButton(btn);
					});
				}
			})
			.on('afterInit', () => {
				this.setStatus(STATUSES.ready);
				this.afterInit(jodit);
			})
			.on('beforeDestruct', this.destruct);
	}

	init(jodit: T): void {
		// empty
	}

	@autobind
	destruct(): void {
		if (!this.isInDestruct) {
			this.setStatus(STATUSES.beforeDestruct);

			const { j } = this;

			if (isJoditObject(j)) {
				this.buttons?.forEach(btn => {
					j?.unregisterButton(btn);
				});
			}

			this.j?.events?.off('beforeDestruct', this.destruct);
			this.beforeDestruct(this.j);
			super.destruct();
		}
	}
}
