/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/video/README.md]]
 * @packageDocumentation
 * @module plugins/video
 */

import type { IJodit } from 'jodit/types';
import { pluginSystem } from 'jodit/core/global';

import './config';

function video(editor: IJodit): void {
	editor.registerButton({
		name: 'video',
		group: 'media'
	});
}

pluginSystem.add('video', video);
