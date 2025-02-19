/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/ordered-list/README.md]]
 * @packageDocumentation
 * @module plugins/ordered-list
 */

import type { IJodit } from 'jodit/types';
import { autobind } from 'jodit/core/decorators';
import { pluginSystem } from 'jodit/core/global';
import { Plugin } from 'jodit/core/plugin';

import './config';

/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
export class orderedList extends Plugin {
	override buttons: Plugin['buttons'] = [
		{
			name: 'ul',
			group: 'list'
		},
		{
			name: 'ol',
			group: 'list'
		}
	];

	protected afterInit(jodit: IJodit): void {
		jodit
			.registerCommand('insertUnorderedList', this.onCommand)
			.registerCommand('insertOrderedList', this.onCommand);
	}

	@autobind
	private onCommand(command: string, _: unknown, type: string): false {
		this.jodit.s.commitStyle({
			element: command === 'insertunorderedlist' ? 'ul' : 'ol',
			attributes: {
				style: {
					listStyleType: type ?? null
				}
			}
		});

		this.jodit.synchronizeValues();

		return false;
	}

	protected beforeDestruct(jodit: IJodit): void {}
}

pluginSystem.add('orderedList', orderedList);
