/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/powered-by-jodit
 */

import type { IJodit } from 'jodit/types';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Hide the link to the Jodit site at the bottom of the editor
		 */
		hidePoweredByJodit: boolean;
	}
}

export function poweredByJodit(jodit: IJodit): void {
	if (
		!jodit.o.hidePoweredByJodit &&
		!jodit.o.inline &&
		(jodit.o.showCharsCounter ||
			jodit.o.showWordsCounter ||
			jodit.o.showXPathInStatusbar)
	) {
		jodit.hookStatus('ready', () => {
			jodit.statusbar.append(
				jodit.create.fromHTML(
					`<a
						tabindex="-1"
						style="text-transform: uppercase"
						class="jodit-status-bar-link"
						target="_blank"
						href="https://xdsoft.net/jodit/">
							Powered by Jodit
						</a>`
				),
				true
			);
		});
	}
}
