/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/line-height/README.md]]
 * @packageDocumentation
 * @module plugins/line-height
 */

import type { IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';

import { css } from 'jodit/core/helpers';
import { autobind } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { extendLang, pluginSystem } from 'jodit/core/global';

import './config';

export class lineHeight extends Plugin {
	override buttons: Plugin['buttons'] = [
		{
			name: 'lineHeight',
			group: 'font'
		}
	];

	constructor(jodit: IJodit) {
		super(jodit);
		extendLang(require('./langs'));
	}

	protected afterInit(jodit: IJodit): void {
		css(jodit.editor, {
			lineHeight: jodit.o.defaultLineHeight
		});

		jodit.registerCommand('applyLineHeight', this.applyLineHeight);
	}

	@autobind
	private applyLineHeight(ignore: string, ignoreA: any, value: any): void {
		const { s, createInside: c, editor: root, o } = this.j;

		if (!s.isFocused()) {
			s.focus();
		}
		s.save();

		let addStyle: boolean | undefined;

		const apply = (node: Node): void => {
			let parentBlock = Dom.closest(node, Dom.isBlock, root);

			if (!parentBlock) {
				parentBlock = Dom.wrap(node, o.enter, c);
			}

			const previousValue = css(parentBlock, 'lineHeight');

			if (addStyle === undefined) {
				addStyle = previousValue.toString() !== value.toString();
			}

			css(parentBlock, 'lineHeight', addStyle ? value : null);
		};

		try {
			if (s.isCollapsed()) {
				const fake = c.fake();
				s.insertNode(fake, false, false);
				apply(fake);
				Dom.safeRemove(fake);
			} else {
				s.eachSelection(apply);
			}
		} finally {
			s.restore();
		}
	}

	protected beforeDestruct(jodit: IJodit): void {
		css(jodit.editor, {
			lineHeight: null
		});
	}
}

pluginSystem.add('lineHeight', lineHeight);
