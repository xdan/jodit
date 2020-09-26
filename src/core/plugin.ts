/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import autobind from 'autobind-decorator';

import { IJodit, IPlugin } from '../types';
import { ViewComponent, STATUSES } from './component';

export abstract class Plugin extends ViewComponent<IJodit> implements IPlugin {
	protected abstract afterInit(jodit: IJodit): void;
	protected abstract beforeDestruct(jodit: IJodit): void;

	constructor(jodit: IJodit) {
		super(jodit);

		jodit.e
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

			this.j?.events?.off('beforeDestruct', this.destruct);
			this.beforeDestruct(this.j);
			super.destruct();
		}
	}
}
