/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/bold/README.md]]
 * @packageDocumentation
 * @module plugins/bold
 */

import type {
	CanUndef,
	IControlType,
	IDictionary,
	IJodit,
	IStyle
} from 'jodit/types';
import { pluginSystem } from 'jodit/core/global';
import { isArray } from 'jodit/core/helpers';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import './interface';
import './config';

import boldIcon from './icons/bold.svg';
import italicIcon from './icons/italic.svg';
import strikethroughIcon from './icons/strikethrough.svg';
import subscriptIcon from './icons/subscript.svg';
import superscriptIcon from './icons/superscript.svg';
import underlineIcon from './icons/underline.svg';

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

		let cssRules: CanUndef<IStyle>;

		Object.keys(cssOptions).forEach((key: string) => {
			if (!cssRules) {
				cssRules = {};
			}

			cssRules[key] = isArray(cssOptions[key])
				? (cssOptions[key] as any)[0]
				: cssOptions[key];
		});

		editor.s.commitStyle({
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

Icon.set('bold', boldIcon)
	.set('italic', italicIcon)
	.set('strikethrough', strikethroughIcon)
	.set('subscript', subscriptIcon)
	.set('superscript', superscriptIcon)
	.set('underline', underlineIcon);
