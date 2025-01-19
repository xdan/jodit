/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IComponent, IJodit, Nullable } from './src/types';

declare global {
	const Jodit: IJodit;

	interface HTMLElement {
		component: Nullable<IComponent>;
	}

	// https://github.com/xdan/jodit/issues/718
	interface ShadowRoot {
		getSelection(): ReturnType<Window['getSelection']>;
	}

	interface Function {
		originalConstructor: Function;
	}
}

export { Jodit };
