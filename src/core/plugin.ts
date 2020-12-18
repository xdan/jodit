/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, IPlugin } from '../types';
import { ViewComponent, STATUSES } from './component';
import { autobind } from './decorators';

export abstract class Plugin extends ViewComponent<IJodit> implements IPlugin {
	/** @override */
	buttons: IPlugin['buttons'] = [];

	/** @override */
	className(): string {
		return '';
	}

	protected abstract afterInit(jodit: IJodit): void;
	protected abstract beforeDestruct(jodit: IJodit): void;

	constructor(jodit: IJodit) {
		super(jodit);

		jodit.e
			.on('afterPluginSystemInit', () => {
				this.buttons?.forEach(btn => {
					jodit.registerButton(btn);
				});
			})
			.on('afterInit', () => {
				this.setStatus(STATUSES.ready);
				this.afterInit(jodit);
			})
			.on('beforeDestruct', this.destruct);
	}

	init(jodit: IJodit): void {
		// empty
	}

	@autobind
	destruct(): void {
		if (!this.isInDestruct) {
			this.setStatus(STATUSES.beforeDestruct);

			this.buttons?.forEach(btn => {
				this.j?.unregisterButton(btn);
			});

			this.j?.events?.off('beforeDestruct', this.destruct);
			this.beforeDestruct(this.j);
			super.destruct();
		}
	}
}
