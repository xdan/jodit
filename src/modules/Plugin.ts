/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, IPlugin } from '../types';
import { Component, STATUSES } from './Component';

export abstract class Plugin extends Component<IJodit> implements IPlugin {
	abstract afterInit(jodit: IJodit): void;
	abstract beforeDestruct(jodit: IJodit): void;

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
