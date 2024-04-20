/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IComponent, IJodit, Nullable } from './src/types';

declare global {
	const Jodit: IJodit;

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
