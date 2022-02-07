/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/keyboard/tab
 */

import type { IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { watch } from 'jodit/core/decorators';
import { KEY_TAB } from 'jodit/core/constants';
import { onTabInsideLi } from 'jodit/plugins/keyboard/tab/cases';

import './config';

export class tab extends Plugin {
	protected afterInit(jodit: IJodit): void {}

	@watch(':keydown.tab')
	protected onTab(event: KeyboardEvent): false | void {
		if (event.key === KEY_TAB) {
			if (onTabInsideLi(this.j)) {
				return false;
			}
		}
	}

	protected beforeDestruct(jodit: IJodit): void {}
}
