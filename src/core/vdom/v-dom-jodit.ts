/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './v-dom-jodit.less';

import type { IEventEmitter } from '../../types';
import type { IVDom } from './interface';
import { VDomRender } from './render';
import { EventEmitter } from '../event-emitter';

export class VDomJodit {
	private __container: HTMLElement;
	private __editor: HTMLElement;
	private __mirror: HTMLElement;
	private __astMirror: HTMLElement;

	private __vdom!: IVDom;

	private __render: VDomRender = new VDomRender();
	private __render2: VDomRender = new VDomRender();
	private __event: IEventEmitter = new EventEmitter();

	set value(v: string) {
		this.__vdom = this.__render.htmlToVDom(v);
		this.__render.render(this.__vdom, this.__editor);
	}

	private constructor(elm: HTMLInputElement) {
		this.__container = document.createElement('div');
		this.__editor = document.createElement('div');
		this.__mirror = document.createElement('div');
		this.__astMirror = document.createElement('pre');
		elm.style.display = 'none';
		elm.parentElement?.insertBefore(this.__container, elm);
		this.__editor.setAttribute('contenteditable', 'true');

		this.__container.classList.add('jodit-v-dom-container');
		this.__editor.classList.add('jodit-v-dom-editor');
		this.__astMirror.classList.add('jodit-v-dom-ast-mirror');
		this.__container.appendChild(this.__editor);
		this.__container.appendChild(this.__astMirror);
		this.__container.appendChild(this.__mirror);
		this.value = elm.value;
		this.__event.on(document, 'selectionchange', () => {
			console.log(111);
		});

		document.execCommand('defaultParagraphSeparator', false, 'p');

		const config = {
			attributes: true,
			childList: true,
			subtree: true,
			characterData: true
		};
		const callback = (mutationList: MutationRecord[]): void => {
			for (const mutation of mutationList) {
				console.log(mutation);
			}
			const vdom = this.__render2.htmlToVDom(this.__editor.innerHTML);
			this.__astMirror.textContent = JSON.stringify(vdom, null, ' ');

			this.__render2.render(vdom, this.__mirror);
		};
		const observer = new MutationObserver(callback);
		observer.observe(this.__editor, config);

		this.__preventAllInputEvents();
	}

	static make(elm: HTMLInputElement): VDomJodit {
		return new VDomJodit(elm);
	}

	private __preventAllInputEvents(): void {
		this.__container.addEventListener('keydown', e => {
			// e.preventDefault();
		});
	}
}

const vdom = {
	type: 'div',
	props: {
		children: [
			{
				type: 'h1',
				props: {
					style: { color: '#f00' },
					children: [
						{
							type: 'TEXT_ELEMENT',
							props: {
								nodeValue: 'This is a title'
							}
						}
					]
				}
			},
			{
				type: 'p',
				props: {
					className: 'test',
					children: [
						{
							type: 'TEXT_ELEMENT',
							props: {
								nodeValue: 'This is a paragraph'
							}
						}
					]
				}
			}
		]
	}
};
const state = {
	cursor: {
		startContainer: vdom.props.children[0].props.children[0],
		startOffset: 0
	},
	vdom
};

export function insertChar(char: string): void {
	const { startContainer, startOffset } = state.cursor;
	const text = startContainer.props.nodeValue;
	const before = text.slice(0, startOffset);
	const after = text.slice(startOffset);
	startContainer.props.nodeValue = before + char + after;
	state.cursor.startOffset += 1;

	// wipRoot = {
	// 	dom: startContainer.dom,
	// 	props: startContainer.props,
	// }
	//
	// nextUnitOfWork = wipRoot
	// deletions = []
}
