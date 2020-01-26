/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, IPlugin } from '../types';
import { Component, STATUSES } from './Component';

export abstract class Plugin extends Component<IJodit> implements IPlugin {
	protected abstract afterInit(jodit: IJodit): void;
	protected abstract beforeDestruct(jodit: IJodit): void;

	constructor(jodit: IJodit) {
		super(jodit);

		this.destruct = this.destruct.bind(this, jodit);

		jodit.events
			.on('afterInit', this.afterInit.bind(this, jodit))
			.on('beforeDestruct', this.destruct);
	}

	init(jodit: IJodit) {}

	destruct() {
		if (!this.isDestructed) {
			this.setStatus(STATUSES.beforeDestruct);

			this.jodit?.events?.off('beforeDestruct', this.destruct);
			this.beforeDestruct(this.jodit);
			super.destruct();
		}
	}
}
