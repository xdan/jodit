/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './v-dom-jodit.less';

import type { IEventEmitter } from '../../types';
import type { IVDom } from './interface';
import { VDomRender } from './render';
import { EventEmitter } from '../event-emitter';

export class VDomJodit {
	private container: HTMLElement;
	private editor: HTMLElement;
	private mirror: HTMLElement;
	private astMirror: HTMLElement;

	private vdom!: IVDom;

	private render: VDomRender = new VDomRender();
	private render2: VDomRender = new VDomRender();
	private event: IEventEmitter = new EventEmitter();

	set value(v: string) {
		this.vdom = this.render.htmlToVDom(v);
		this.render.render(this.vdom, this.editor);
	}

	private constructor(elm: HTMLInputElement) {
		this.container = document.createElement('div');
		this.editor = document.createElement('div');
		this.mirror = document.createElement('div');
		this.astMirror = document.createElement('pre');
		elm.style.display = 'none';
		elm.parentElement?.insertBefore(this.container, elm);
		this.editor.setAttribute('contenteditable', 'true');

		this.container.classList.add('jodit-v-dom-container');
		this.editor.classList.add('jodit-v-dom-editor');
		this.astMirror.classList.add('jodit-v-dom-ast-mirror');
		this.container.appendChild(this.editor);
		this.container.appendChild(this.astMirror);
		this.container.appendChild(this.mirror);
		this.value = elm.value;
		this.event.on(document, 'selectionchange', () => {
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
			const vdom = this.render2.htmlToVDom(this.editor.innerHTML);
			this.astMirror.textContent = JSON.stringify(vdom, null, ' ');

			this.render2.render(vdom, this.mirror);
		};
		const observer = new MutationObserver(callback);
		observer.observe(this.editor, config);

		this.preventAllInputEvents();
	}

	static make(elm: HTMLInputElement): VDomJodit {
		return new VDomJodit(elm);
	}

	private preventAllInputEvents(): void {
		this.container.addEventListener('keydown', e => {
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
