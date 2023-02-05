/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/dtd/README.md]]
 * @packageDocumentation
 * @module plugins/dtd
 */

import type { IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { pluginSystem } from 'jodit/core/global';
import { watch } from 'jodit/core/decorators/watch/watch';

import './config';
import * as beforeInsertCases from './before-insert';
import * as afterInsertCases from './after-insert';

class dtd extends Plugin {
	protected afterInit(jodit: IJodit): void {}

	protected beforeDestruct(jodit: IJodit): void {}

	@watch(':beforeInsertNode')
	protected __onBeforeInsertNode(node: Node): void {
		const casesKeys = Object.keys(beforeInsertCases) as Array<
			keyof typeof beforeInsertCases
		>;
		casesKeys.forEach(key => {
			beforeInsertCases[key](this.j, node);
		});
	}

	@watch(':afterInsertNode')
	protected __onAfterInsertNode(node: Node): void {
		const casesKeys = Object.keys(afterInsertCases) as Array<
			keyof typeof afterInsertCases
		>;
		casesKeys.forEach(key => {
			afterInsertCases[key](this.j, node);
		});
	}
}

pluginSystem.add('dtd', dtd);
