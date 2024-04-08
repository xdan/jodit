/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { UIGroup } from 'jodit/core/ui';

import './tree.less';

export class FileBrowserTree extends UIGroup {
	override className(): string {
		return 'FileBrowserTree';
	}
}
