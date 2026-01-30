/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/debug/README.md]]
 * @packageDocumentation
 * @module plugins/debug
 */

import type { IJodit } from 'jodit/types';
import { INVISIBLE_SPACE_REG_EXP } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
// @ts-ignore
import { pluginSystem } from 'jodit/core/global';
import { stripTags } from 'jodit/core/helpers/html/strip-tags';
import { Plugin } from 'jodit/core/plugin/plugin';

import './debug.less';

export class Debug extends Plugin {
	protected afterInit(jodit: IJodit): void {
		const mirror = jodit.create.div('jodit-debug');
		const tree = jodit.create.div('jodit-debug__tree');
		const events = jodit.create.div('jodit-debug__events');
		const clear = jodit.create.div('jodit-debug__events-clear', ['x']);
		const sel = jodit.create.div('jodit-debug__sel');
		mirror.appendChild(tree);
		mirror.appendChild(events);
		events.appendChild(clear);
		mirror.appendChild(sel);

		clear.addEventListener('click', () => {
			events.innerHTML = '';
			events.appendChild(clear);
		});

		jodit.workplace.appendChild(mirror);

		const allEvents: string[] = [
			'activate',
			'afterInit',
			'beforeactivate',
			'beforeblur',
			'beforedeactivate',
			'beforefocus',
			'beforeinput',
			'blur',
			'change',
			'click',
			'compositionend',
			'compositionstart',
			'compositionupdate',
			'contextmenu',
			'copy',
			'cut',
			'dblclick',
			'deactivate',
			'focus',
			'focusin',
			'focusout',
			'focusout',
			'input',
			'keydown',
			'keypress',
			'keyup',
			'mousedown',
			'mouseup',
			'paste',
			'selectionchange',
			'selectionstart',
			'dragstart',
			'drop',
			'dragover',
			'resize touchstart touchend',
			'updateDebug',
			'beforeCommand',
			'afterCommand',
			'wheel'
		];

		function updateTree(): void {
			const range = jodit.selection.range;
			tree.innerHTML = render(jodit.editor, 0, range);
			sel.innerHTML = `start ${range.startContainer.nodeName} ${range.startOffset}<br>end ${range.endContainer.nodeName} ${range.endOffset}`;
		}

		function onSomeEvent(e: Event): void {
			const event = jodit.e.current;
			const div = jodit.create.div();
			div.innerHTML = `<span>${new Date().toLocaleTimeString()}</span> ${renderEvent(event, e)}`;
			events.appendChild(div);
			events.scrollTop = events.scrollHeight;
			jodit.async.setTimeout(() => {
				events.children.length > 100 &&
					events.removeChild(events.children[0]);
			}, 100);
		}

		function renderEvent(event: string, e: Event): string {
			const result: string[] = [event ?? e.type];

			switch (event) {
				case 'beforeCommand':
				case 'afterCommand':
					result.push(`<span>${e.toString() as string}</span>`);
					break;
				case 'keydown':
				case 'keyup':
				case 'keypress':
					if (
						(e as KeyboardEvent).shiftKey &&
						(e as KeyboardEvent).key !== 'Shift'
					) {
						result.push('Shift+');
					}

					if (
						(e as KeyboardEvent).ctrlKey &&
						(e as KeyboardEvent).key !== 'Control'
					) {
						result.push('Ctrl+');
					}

					if (
						(e as KeyboardEvent).altKey &&
						(e as KeyboardEvent).key !== 'Alt'
					) {
						result.push('Alt');
					}

					result.push(`${(e as KeyboardEvent).key}`);
					break;
			}

			if (e && Dom.isNode(e.target)) {
				result.push(`<span>${e.target.nodeName}</span>`);
			}

			return result.join(' ');
		}

		jodit.e
			.on(
				'keydown keyup keypress change afterInit updateDebug',
				updateTree
			)
			.on(allEvents, onSomeEvent)
			.on(jodit.od, 'selectionchange', onSomeEvent)
			.on(jodit.od, 'selectionchange', updateTree);
	}

	protected beforeDestruct(jodit: IJodit): void {}
}

function renderText(elm: Text, range: Range): string {
	if (!elm.nodeValue) {
		return "<span style='color:red'>empty</span>";
	}

	let value = elm.nodeValue;

	if (range.collapsed) {
		if (elm === range.startContainer) {
			value =
				value.slice(0, range.startOffset) +
				'%CURSOR%' +
				value.slice(range.startOffset);
		}
	} else {
		if (elm === range.startContainer && elm === range.endContainer) {
			value =
				value.slice(0, range.startOffset) +
				'%START-CURSOR%' +
				value.slice(range.startOffset, range.endOffset) +
				'%END-CURSOR%' +
				value.slice(range.endOffset);
		} else if (elm === range.startContainer) {
			value =
				value.slice(0, range.startOffset) +
				'%CURSOR%' +
				value.slice(range.startOffset);
		} else if (elm === range.endContainer) {
			value =
				value.slice(0, range.endOffset) +
				'%CURSOR%' +
				value.slice(range.endOffset);
		}
	}

	return stripTags(value.replace(INVISIBLE_SPACE_REG_EXP(), 'INV'))
		.replace(/%CURSOR%/, '<span class="jodit-debug__tree-cursor">|</span>')
		.replace(/%START-CURSOR%/, '<span class="jodit-debug__tree-cursor">|')
		.replace(/%END-CURSOR%/, '|</span>');
}

function render(elm: Node, level: number, range: Range): string {
	const isSelected = window.getSelection()?.containsNode(elm);

	const content = [
		`<span class="jodit-debug__tree-elm-name">${elm.nodeName}</span>`,
		Dom.isText(elm) ? `- ${renderText(elm, range)}` : ''
	]
		.map(i => i.trim())
		.filter(Boolean);

	return `<div class="${isSelected ? 'jodit-debug__tree-element_selected' : ''}" style='padding-left: ${level * 5}px'>
		${content.join('&nbsp;')}
	${Array.from(elm.childNodes)
		.map((ch, index) => {
			const result: string[] = [];
			if (range.startContainer === elm && index === range.startOffset) {
				result.push('<span class="jodit-debug__tree-cursor">|</span>');
			}
			result.push(render(ch, level + 1, range));
			if (range.endContainer === elm && index === range.endOffset) {
				result.push('<span class="jodit-debug__tree-cursor">|</span>');
			}
			return result;
		})
		.flat()
		.join('')}
</div>`;
}

// pluginSystem.add('debug', Debug);
