/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { ICommitStyle } from 'jodit/types';

declare module 'jodit/types/events' {
	interface IEventEmitter {
		/**
		 * The cursorInTheEdge method checks whether the cursor is at the beginning or at the end of the element,
		 * this event allows you to override the logic
		 * determining whether the element before/after the cursor is significant for its position
		 * true - element is not significant
		 */
		on(
			event: 'isInvisibleForCursor',
			callback: (elm: HTMLElement) => void | true
		): this;

		/**
		 * Triggered after the style is applied to the element
		 */
		on(event: 'afterCommitStyle', style: ICommitStyle): this;
	}
}
