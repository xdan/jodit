/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { IJodit } from '../../types';
import { Plugin } from '../../core/plugin';

export class pasteDifferentContent extends Plugin {
	/** @override */
	protected afterInit(jodit: IJodit): void {}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {}
}
