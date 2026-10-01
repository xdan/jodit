/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/media
 */

import type { IDictionary, MediaWrapper } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Decorate media elements
		 */
		mediaInFakeBlock: boolean;

		/**
		 * Decorate media element with tag
		 */
		mediaFakeTag: string;

		/**
		 * Media tags
		 */
		mediaBlocks: string[];

		/**
		 * Wrappers that media keep in the content, by the media's tag name, such as
		 * Froala's `<span class="fr-video">` around video, audio and embeds. An
		 * element with a wrapper for its tag:
		 * - is wrapped in it instead of the editor-only `mediaFakeTag` when its tag
		 * is one of `mediaBlocks`, or left in it when it's already in one
		 * - goes in inside it when the video popup inserts it, as an upload, a
		 * link's embed or embed code that is one element
		 * - opens the media popup for its wrapper when clicked, whose Align and
		 * Delete act on the wrapper
		 *
		 * A wrapper is given `contenteditable="false"` and `draggable="true"`,
		 * which stay in the value.
		 * ```javascript
		 * const frVideo = { tag: 'span', className: 'fr-video' };
		 *
		 * Jodit.make('#editor', {
		 *   mediaWrappers: { video: frVideo, audio: frVideo, iframe: frVideo }
		 * });
		 * ```
		 */
		mediaWrappers: IDictionary<MediaWrapper>;
	}
}

Config.prototype.mediaFakeTag = 'jodit-media';
Config.prototype.mediaInFakeBlock = true;
Config.prototype.mediaBlocks = ['video', 'audio'];
Config.prototype.mediaWrappers = {};
