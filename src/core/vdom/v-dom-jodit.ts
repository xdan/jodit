/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './v-dom-jodit.less';

import type { IVDom } from './interface';
import { VDomRender } from './render';

export class VDomJodit {
	private container: HTMLElement;

	private vdom!: IVDom;

	private render: VDomRender = new VDomRender();

	set value(v: string) {
		this.vdom = this.render.htmlToVDom(v);
		this.render.render(this.vdom, this.container);
	}

	private constructor(elm: HTMLInputElement) {
		this.container = document.createElement('div');
		elm.style.display = 'none';
		elm.parentElement?.insertBefore(this.container, elm);
		this.container.setAttribute('contenteditable', 'true');
		this.container.classList.add('jodit-v-dom-container');
		this.value = elm.value;

		this.preventAllInputEvents();
	}

	static make(elm: HTMLInputElement): VDomJodit {
		return new VDomJodit(elm);
	}

	private preventAllInputEvents(): void {
		this.container.addEventListener('keydown', e => {
			e.preventDefault();
		});
	}
}
