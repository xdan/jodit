/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/debug/README.md]]
 * @packageDocumentation
 * @module plugins/debug
 */

import type { IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { pluginSystem } from 'jodit/core/global';
import { Dom } from 'jodit/core/dom/dom';
import { stripTags } from 'jodit/core/helpers';
import { INVISIBLE_SPACE_REG_EXP } from 'jodit/core/constants';

export class Debug extends Plugin {
	protected afterInit(jodit: IJodit): void {
		const mirror = jodit.create.div();
		const tree = jodit.create.div();
		const sel = jodit.create.div();
		mirror.appendChild(tree);
		mirror.appendChild(sel);

		jodit.workplace.appendChild(mirror);
		Object.assign(mirror.style, {
			padding: '16px',
			backgroundColor: '#fcfcfc'
		});
		Object.assign(sel.style, {
			paddingTop: '16px'
		});

		jodit.e
			.on('keydown keyup keypress change afterInit updateDebug', () => {
				tree.innerHTML = render(jodit.editor);
			})
			.on(jodit.od, 'selectionchange', () => {
				const range = jodit.selection.range;
				tree.innerHTML = render(jodit.editor);
				sel.innerHTML = `start ${range.startContainer.nodeName} ${range.startOffset}<br>end ${range.endContainer.nodeName} ${range.endOffset}`;
			});
	}

	protected beforeDestruct(jodit: IJodit): void {}
}

function renderText(elm: Text): string {
	if (!elm.nodeValue) {
		return "<span style='color:red'>empty</span>";
	}

	return stripTags(elm.nodeValue.replace(INVISIBLE_SPACE_REG_EXP(), 'INV'));
}

function render(elm: Node, level: number = 0): string {
	return `<div style='padding-left: ${level * 5}px'>
		${elm.nodeName} ${Dom.isText(elm) ? `- ${renderText(elm)}` : ''}
	${Array.from(elm.childNodes)
		.map(ch => render(ch, level + 1))
		.join('')}
</div>`;
}

pluginSystem.add('debug', Debug);
