/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IComponent, Nullable } from './src/types';
import type { IJodit } from './src/types';

export * from './src/types';

declare global {
	const Jodit: IJodit;
	const isProd: boolean;
	const isESNext: boolean;
	const appVersion: string;

	interface HTMLElement {
		component: Nullable<IComponent>;
	}

	interface CaretPosition {
		offsetNode: Node;
		offset: number;
	}

	interface IdleDeadline {
		readonly didTimeout: boolean;
		timeRemaining(): DOMHighResTimeStamp;
	}

	// https://github.com/xdan/jodit/issues/743
	interface IdleRequestCallback {
		(deadline: IdleDeadline): void;
	}

	interface Document {
		caretPositionFromPoint?(x: number, y: number): CaretPosition;
		caretRangeFromPoint(x: number, y: number): Range;
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
