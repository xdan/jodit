/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './add-new-line.less';

import type { IBound, IJodit, HTMLTagNames, Nullable } from '../../types';
import { Config } from '../../config';
import { Dom, Icon, Plugin } from '../../modules';
import {
	offset,
	position,
	call,
	scrollIntoViewIfNeeded
} from '../../core/helpers';

declare module '../../config' {
	interface Config {
		addNewLine: boolean;
		addNewLineTagsTriggers: HTMLTagNames[];
		addNewLineOnDBLClick: boolean;
		addNewLineDeltaShow: number;
	}
}

/**
 * Create helper
 * @type {boolean}
 */
Config.prototype.addNewLine = true;

/**
 * On dbl click on empty space of editor it add new P element
 * @type {boolean}
 */
Config.prototype.addNewLineOnDBLClick = true;

/**
 * What kind of tags it will be impact
 * @type {string[]}
 */
Config.prototype.addNewLineTagsTriggers = [
	'table',
	'iframe',
	'img',
	'hr',
	'jodit'
];

/**
 * Absolute delta between cursor position and edge(top or bottom)
 * of element when show line
 */
Config.prototype.addNewLineDeltaShow = 20;

const ns = 'addnewline';

/**
 * Create helper for adding new paragraph(Jodit.defaultOptions.enter tag) before iframe, table or image
 *
 * @param {Jodit} editor
 */
export class addNewLine extends Plugin {
	private line = this.j.c.fromHTML(
		`<div role="button" tabIndex="-1" title="${this.j.i18n(
			'Break'
		)}" class="jodit-add-new-line"><span>${Icon.get('enter')}</span></div>`
	) as HTMLDivElement;

	private isMatchedTag = (node: Nullable<Node>): boolean =>
		Boolean(
			node &&
				this.j.o.addNewLineTagsTriggers.includes(
					node.nodeName.toLowerCase() as HTMLTagNames
				)
		);

	private timeout!: number;
	private preview: boolean = false;
	private current!: HTMLElement | false;
	private lineInFocus: boolean = false;
	private isShown: boolean = false;

	private show() {
		if (this.isShown || this.j.o.readonly || this.j.isLocked) {
			return;
		}

		this.isShown = true;

		this.j.async.clearTimeout(this.timeout);
		this.line.classList.toggle('jodit-add-new-line_after', !this.preview);
		this.j.container.appendChild(this.line);
		this.line.style.width = this.j.editor.clientWidth + 'px';
	}

	private hideForce = () => {
		if (!this.isShown) {
			return;
		}

		this.isShown = false;
		this.j.async.clearTimeout(this.timeout);
		this.lineInFocus = false;
		Dom.safeRemove(this.line);
	};

	private hide = () => {
		if (!this.isShown || this.lineInFocus) {
			return;
		}

		this.timeout = this.j.async.setTimeout(this.hideForce, {
			timeout: 500,
			label: 'add-new-line-hide'
		});
	};

	private canGetFocus = (elm: Node | null): boolean => {
		return (
			elm != null &&
			Dom.isBlock(elm, this.j.ew) &&
			!/^(img|table|iframe|hr)$/i.test(elm.nodeName)
		);
	};

	protected afterInit(editor: IJodit): void {
		if (!editor.o.addNewLine) {
			return;
		}

		editor.e
			.on(this.line, 'mousemove', (e: MouseEvent) => {
				e.stopPropagation();
			})
			.on(this.line, 'mousedown touchstart', this.onClickLine)
			.on('change', this.hideForce)
			.on(this.line, 'mouseenter', () => {
				this.j.async.clearTimeout(this.timeout);
				this.lineInFocus = true;
			})
			.on(this.line, 'mouseleave', () => {
				this.lineInFocus = false;
			})
			.on('changePlace', this.addEventListeners.bind(this));

		this.addEventListeners();
	}

	private addEventListeners() {
		const editor = this.j;

		editor.e
			.off(editor.editor, '.' + ns)
			.off(editor.container, '.' + ns)
			.on(
				[editor.ow, editor.ew, editor.editor],
				'scroll' + '.' + ns,
				this.hideForce
			)
			.on(editor.editor, 'dblclick' + '.' + ns, this.onDblClickEditor)
			.on(editor.editor, 'click' + '.' + ns, this.hide)
			.on(editor.container, 'mouseleave' + '.' + ns, this.hide)
			.on(
				editor.editor,
				'mousemove' + '.' + ns,
				editor.async.debounce(
					this.onMouseMove,
					editor.defaultTimeout * 3
				)
			);
	}

	private onClickLine = (e: MouseEvent) => {
		const editor = this.j;
		const p = editor.createInside.element(editor.o.enter);

		if (this.preview && this.current && this.current.parentNode) {
			this.current.parentNode.insertBefore(p, this.current);
		} else {
			editor.editor.appendChild(p);
		}

		editor.s.setCursorIn(p);
		scrollIntoViewIfNeeded(p, editor.editor, editor.ed);

		editor.e.fire('synchro');
		this.hideForce();

		e.preventDefault();
	};

	private onDblClickEditor = (e: MouseEvent) => {
		const editor = this.j;

		if (
			!editor.o.readonly &&
			editor.o.addNewLineOnDBLClick &&
			e.target === editor.editor &&
			editor.s.isCollapsed()
		) {
			const editorBound: IBound = offset(
				editor.editor,
				editor,
				editor.ed
			);

			const top = e.pageY - editor.ew.pageYOffset;

			const p = editor.createInside.element(editor.o.enter);

			if (
				Math.abs(top - editorBound.top) <
					Math.abs(top - (editorBound.height + editorBound.top)) &&
				editor.editor.firstChild
			) {
				editor.editor.insertBefore(p, editor.editor.firstChild);
			} else {
				editor.editor.appendChild(p);
			}

			editor.s.setCursorIn(p);
			editor.setEditorValue();

			this.hideForce();
			e.preventDefault();
		}
	};

	private onMouseMove = (e: MouseEvent) => {
		const editor = this.j;

		let currentElement: HTMLElement | null = editor.ed.elementFromPoint(
			e.clientX,
			e.clientY
		) as HTMLElement;

		if (
			!Dom.isHTMLElement(currentElement, editor.ew) ||
			Dom.isOrContains(this.line, currentElement)
		) {
			return;
		}

		if (!Dom.isOrContains(editor.editor, currentElement)) {
			return;
		}

		if (!this.isMatchedTag(currentElement)) {
			currentElement = Dom.closest(
				currentElement,
				this.isMatchedTag,
				editor.editor
			) as HTMLElement;
		}

		if (!currentElement) {
			this.hide();
			return;
		}

		if (this.isMatchedTag(currentElement)) {
			const parentBox = Dom.up(
				currentElement,
				node => Dom.isBlock(node, editor.ew),
				editor.editor
			);

			if (parentBox && parentBox !== editor.editor) {
				currentElement = parentBox;
			}
		}

		const pos = position(currentElement, this.j);

		let top: false | number = false;

		let { clientY } = e;

		if (this.j.iframe) {
			const { top } = position(this.j.iframe, this.j, true);
			clientY += top;
		}

		const delta = this.j.o.addNewLineDeltaShow;

		if (Math.abs(clientY - pos.top) <= delta) {
			top = pos.top;
			this.preview = true;
		}

		if (Math.abs(clientY - (pos.top + pos.height)) <= delta) {
			top = pos.top + pos.height;
			this.preview = false;
		}

		if (
			top !== false &&
			!call(
				this.preview ? Dom.prev : Dom.next,
				currentElement,
				this.canGetFocus,
				editor.editor
			)
		) {
			this.line.style.top = top + 'px';
			this.current = currentElement;
			this.show();
		} else {
			this.current = false;
			this.hide();
		}
	};

	/** @override */
	protected beforeDestruct(): void {
		this.j.async.clearTimeout(this.timeout);
		this.j.e.off(this.line);
		this.j.e.off('changePlace', this.addEventListeners);

		Dom.safeRemove(this.line);

		this.j.e
			.off([this.j.ow, this.j.ew, this.j.editor], '.' + ns)
			.off(this.j.container, '.' + ns);
	}
}
