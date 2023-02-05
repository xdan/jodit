/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/select-cells
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		tableAllowCellSelection: boolean;
	}
}

Config.prototype.tableAllowCellSelection = true;
