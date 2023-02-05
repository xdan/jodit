/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/redo-undo/README.md]]
 * @packageDocumentation
 * @module plugins/redo-undo
 */

import type { IControlType, IJodit, IPlugin } from 'jodit/types';
import { Config } from 'jodit/config';
import * as consts from 'jodit/core/constants';
import { Plugin } from 'jodit/core/plugin/plugin';
import { pluginSystem } from 'jodit/core/global';
import { Icon } from 'jodit/core/ui/icon';

Icon.set('redo', require('./icons/redo.svg')).set(
	'undo',
	require('./icons/undo.svg')
);

Config.prototype.controls.redo = {
	mode: consts.MODE_SPLIT,
	isDisabled: (editor: IJodit): boolean => !editor.history.canRedo(),
	tooltip: 'Redo'
} as IControlType;

Config.prototype.controls.undo = {
	mode: consts.MODE_SPLIT,
	isDisabled: (editor: IJodit): boolean => !editor.history.canUndo(),
	tooltip: 'Undo'
} as IControlType;

/**
 * Custom process Redo and Undo functionality
 */
export class redoUndo extends Plugin {
	/** @override */
	override buttons: IPlugin['buttons'] = [
		{
			name: 'undo',
			group: 'history'
		},
		{
			name: 'redo',
			group: 'history'
		}
	];

	protected override beforeDestruct(): void {
		// do nothing
	}

	protected override afterInit(editor: IJodit): void {
		const callback = (command: 'redo' | 'undo'): void | false => {
			editor.history[command]();
			return false;
		};

		editor.registerCommand('redo', {
			exec: callback,
			hotkeys: ['ctrl+y', 'ctrl+shift+z', 'cmd+y', 'cmd+shift+z']
		});

		editor.registerCommand('undo', {
			exec: callback,
			hotkeys: ['ctrl+z', 'cmd+z']
		});
	}
}

pluginSystem.add('redoUndo', redoUndo);
