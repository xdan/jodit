/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

declare module 'jodit/types/events' {
	interface IEventEmitter {
		/**
		 * Fired on processing `Enter` key. If return some value, plugin `enter` will do nothing.
		 * if return false - prevent default Enter behavior
		 */
		on(
			event: 'beforeEnter',
			callback: (e: KeyboardEvent) => void | false
		): this;

		/**
		 * Fired after  processing `Enter` key.
		 */
		on(event: 'afterEnter', callback: (e: KeyboardEvent) => void): this;

		/**
		 * When inside the list there is a click on an empty element of the list, then it is deleted if empty.
		 * This event can handle this situation.
		 * @example
		 * ```javascript
		 * Jodit.make('#editor', {
		 * 	 events: {
		 * 		enterIsEmptyListLeaf(li){
		 * 			return Jodit.ns.Dom.isEmpty(li);
		 * 		}
		 * 	}
		 * });
		 */
		on(
			event: 'enterIsEmptyListLeaf',
			callback: (li: HTMLElement) => void
		): this;
	}
}
