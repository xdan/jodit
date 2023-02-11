/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

declare module 'jodit/types/events' {
	interface IEventEmitter {
		/**
		 * Emitted every time after the plugins have been initialized
		 * or a deferred plugin has been loaded and also initialized
		 */
		on(event: 'updatePlugins', callback: () => void): this;
	}
}
