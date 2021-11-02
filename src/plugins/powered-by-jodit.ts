/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../types';

declare module '../config' {
	interface Config {
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
