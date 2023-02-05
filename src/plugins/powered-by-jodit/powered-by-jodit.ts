/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/powered-by-jodit/README.md]]
 * @packageDocumentation
 * @module plugins/powered-by-jodit
 */

import type { IJodit } from 'jodit/types';
import { pluginSystem } from 'jodit/core/global';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Hide the link to the Jodit site at the bottom of the editor
		 */
		hidePoweredByJodit: boolean;
	}
}

export function poweredByJodit(jodit: IJodit): void {
	const { o } = jodit;
	if (
		!o.hidePoweredByJodit &&
		!o.inline &&
		((o as any).showCharsCounter ||
			(o as any).showWordsCounter ||
			(o as any).showXPathInStatusbar)
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

pluginSystem.add('poweredByJodit', poweredByJodit);
