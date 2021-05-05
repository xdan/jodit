/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IComponent, Nullable } from './src/types';
import { Jodit as Super } from './src/jodit';

export * from './src/types';

declare global {
	const Jodit: typeof Super;
	const isProd: boolean;
	const isESNext: boolean;
	const appVersion: string;

	interface HTMLElement {
		component: Nullable<IComponent>;
	}

	interface Function {
		originalConstructor: Function;
	}
}

export { Jodit };
