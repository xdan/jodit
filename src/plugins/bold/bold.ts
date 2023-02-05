/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/bold/README.md]]
 * @packageDocumentation
 * @module plugins/bold
 */

import type { IDictionary, IJodit, IControlType, CanUndef } from 'jodit/types';
import { Config } from 'jodit/config';
import { isArray } from 'jodit/core/helpers';
import { pluginSystem } from 'jodit/core/global';
import { Icon } from 'jodit/core/ui/icon';

import './interface';
import './config';

/**
 * Adds `bold`,` strikethrough`, `underline` and` italic` buttons to Jodit
 */
export function bold(editor: IJodit): void {
	const callBack = (command: string): false => {
		const control: IControlType = Config.defaultOptions.controls[
				command
			] as IControlType,
			cssOptions:
				| IDictionary<string | string[]>
				| IDictionary<(editor: IJodit, value: string) => boolean> = {
				...control.css
			};

		let cssRules: CanUndef<IDictionary<string>>;

		Object.keys(cssOptions).forEach((key: string) => {
			if (!cssRules) {
				cssRules = {};
			}

			cssRules[key] = isArray(cssOptions[key])
				? (cssOptions[key] as any)[0]
				: cssOptions[key];
		});

		editor.s.applyStyle(cssRules, {
			element: control.tags ? control.tags[0] : undefined
		});

		editor.synchronizeValues();

		return false;
	};

	['bold', 'italic', 'underline', 'strikethrough'].forEach(name => {
		editor.registerButton({
			name,
			group: 'font-style'
		});
	});

	['superscript', 'subscript'].forEach(name => {
		editor.registerButton({
			name,
			group: 'script'
		});
	});

	editor
		.registerCommand('bold', {
			exec: callBack,
			hotkeys: ['ctrl+b', 'cmd+b']
		})

		.registerCommand('italic', {
			exec: callBack,
			hotkeys: ['ctrl+i', 'cmd+i']
		})

		.registerCommand('underline', {
			exec: callBack,
			hotkeys: ['ctrl+u', 'cmd+u']
		})

		.registerCommand('strikethrough', {
			exec: callBack
		})

		.registerCommand('subscript', {
			exec: callBack
		})

		.registerCommand('superscript', {
			exec: callBack
		});
}

pluginSystem.add('bold', bold);

Icon.set('bold', require('./icons/bold.svg'))
	.set('italic', require('./icons/italic.svg'))
	.set('strikethrough', require('./icons/strikethrough.svg'))
	.set('subscript', require('./icons/subscript.svg'))
	.set('superscript', require('./icons/superscript.svg'))
	.set('underline', require('./icons/underline.svg'));
