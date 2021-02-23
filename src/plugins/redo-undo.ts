/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IJodit, IPlugin } from '../types/';
import { Config } from '../config';
import * as consts from '../core/constants';
import { Plugin } from '../core/plugin';

Config.prototype.controls.redo = {
	mode: consts.MODE_SPLIT,
	isDisabled: (editor: IJodit): boolean => !editor.observer.stack.canRedo(),
	tooltip: 'Redo'
} as IControlType;

Config.prototype.controls.undo = {
	mode: consts.MODE_SPLIT,
	isDisabled: (editor: IJodit): boolean => !editor.observer.stack.canUndo(),
	tooltip: 'Undo'
} as IControlType;

/**
 * Custom process Redo and Undo functionality
 */
export class redoUndo extends Plugin {
	/** @override */
	buttons: IPlugin['buttons'] = [
		{
			name: 'undo',
			group: 'history'
		},
		{
			name: 'redo',
			group: 'history'
		}
	];

	beforeDestruct(): void {
		// do nothing
	}

	afterInit(editor: IJodit): void {
		const callback = (command: string): void | false => {
			editor.observer[command as 'redo' | 'undo']();

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
