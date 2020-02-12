/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { offset, position } from '../modules/helpers/size';
import { ToolbarIcon } from '../modules/toolbar/icon';
import { IBound, IJodit } from '../types';
import { Plugin } from '../modules/Plugin';
import { call } from '../modules/helpers/utils';
import { scrollIntoView } from '../modules/helpers';

declare module '../Config' {
	interface Config {
		addNewLine: boolean;
		addNewLineTagsTriggers: string[];
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
 * Whar kind of tags it will be impact
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
	private line = this.jodit.create.fromHTML(
		`<div role="button" tabIndex="-1" title="${this.jodit.i18n(
			'Break'
		)}" class="jodit-add-new-line"><span>${ToolbarIcon.getIcon(
			'enter'
		)}</span></div>`
	) as HTMLDivElement;

	private isMatchedTag = new RegExp(
		'^(' + this.jodit.options.addNewLineTagsTriggers.join('|') + ')$',
		'i'
	);

	private timeout!: number;
	private preview: boolean = false;
	private current!: HTMLElement | false;
	private lineInFocus: boolean = false;
	private isShown: boolean = false;

	private show() {
		if (
			this.isShown ||
			this.jodit.options.readonly ||
			this.jodit.isLocked()
		) {
			return;
		}

		this.isShown = true;

		if (this.jodit.container.classList.contains('jodit_popup_active')) {
			return;
		}

		this.jodit.async.clearTimeout(this.timeout);
		this.line.classList.toggle('jodit-add-new-line_after', !this.preview);
		this.jodit.container.appendChild(this.line);
		this.line.style.width = this.jodit.editor.clientWidth + 'px';
	}

	private hideForce = () => {
		if (!this.isShown) {
			return;
		}

		this.isShown = false;
		this.jodit.async.clearTimeout(this.timeout);
		this.lineInFocus = false;
		Dom.safeRemove(this.line);
	};

	private hide = () => {
		if (!this.isShown || this.lineInFocus) {
			return;
		}

		this.timeout = this.jodit.async.setTimeout(this.hideForce, {
			timeout: 500,
			label: 'add-new-line-hide'
		});
	};

	private canGetFocus = (elm: Node | null): boolean => {
		return (
			elm !== null &&
			Dom.isBlock(elm, this.jodit.editorWindow) &&
			!/^(img|table|iframe|hr)$/i.test(elm.nodeName)
		);
	};

	protected afterInit(editor: IJodit): void {
		if (!editor.options.addNewLine) {
			return;
		}

		editor.events
			.on(this.line, 'mousemove', (e: MouseEvent) => {
				e.stopPropagation();
			})
			.on(this.line, 'mousedown touchstart', this.onClickLine)
			.on('change', this.hideForce)
			.on(this.line, 'mouseenter', () => {
				this.jodit.async.clearTimeout(this.timeout);
				this.lineInFocus = true;
			})
			.on(this.line, 'mouseleave', () => {
				this.lineInFocus = false;
			})
			.on('changePlace', this.addEventListeners.bind(this));

		this.addEventListeners();
	}

	private addEventListeners() {
		const editor = this.jodit;

		editor.events
			.off(editor.editor, '.' + ns)
			.off(editor.container, '.' + ns)
			.on(
				[editor.ownerWindow, editor.editorWindow, editor.editor],
				`scroll` + '.' + ns,
				this.hideForce
			)
			.on(editor.editor, 'dblclick' + '.' + ns, this.onDblClickEditor)
			.on(editor.editor, 'click' + '.' + ns, this.hide)
			.on(editor.container, 'mouseleave' + '.' + ns, this.hide)
			.on(
				editor.editor,
				'mousemove' + '.' + ns,
				editor.async.debounce(this.onMouseMove, editor.defaultTimeout * 3)
			);
	}

	private onClickLine = (e: MouseEvent) => {
		const editor = this.jodit;
		const p = editor.create.inside.element(editor.options.enter);

		if (this.preview && this.current && this.current.parentNode) {
			this.current.parentNode.insertBefore(p, this.current);
		} else {
			editor.editor.appendChild(p);
		}

		editor.selection.setCursorIn(p);
		scrollIntoView(p, editor.editor, editor.editorDocument);

		editor.events.fire('synchro');
		this.hideForce();

		e.preventDefault();
	};

	private onDblClickEditor = (e: MouseEvent) => {
		const editor = this.jodit;

		if (
			!editor.options.readonly &&
			editor.options.addNewLineOnDBLClick &&
			e.target === editor.editor &&
			editor.selection.isCollapsed()
		) {
			const editorBound: IBound = offset(
				editor.editor,
				editor,
				editor.editorDocument
			);

			const top = e.pageY - editor.editorWindow.pageYOffset;

			const p = editor.create.inside.element(editor.options.enter);

			if (
				Math.abs(top - editorBound.top) <
					Math.abs(top - (editorBound.height + editorBound.top)) &&
				editor.editor.firstChild
			) {
				editor.editor.insertBefore(p, editor.editor.firstChild);
			} else {
				editor.editor.appendChild(p);
			}

			editor.selection.setCursorIn(p);
			editor.setEditorValue();

			this.hideForce();
			e.preventDefault();
		}
	};

	private onMouseMove = (e: MouseEvent) => {
		const editor = this.jodit;

		let currentElement: HTMLElement | null = editor.editorDocument.elementFromPoint(
			e.clientX,
			e.clientY
		) as HTMLElement;

		if (
			!Dom.isHTMLElement(currentElement, editor.editorWindow) ||
			Dom.isOrContains(this.line, currentElement)
		) {
			return;
		}

		if (!Dom.isOrContains(editor.editor, currentElement)) {
			return;
		}

		if (!this.isMatchedTag.test(currentElement.nodeName)) {
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

		if (this.isMatchedTag.test(currentElement.nodeName)) {
			const parentBox: Node | false = Dom.up(
				currentElement,
				node => Dom.isBlock(node, editor.editorWindow),
				editor.editor
			);

			if (parentBox && parentBox !== editor.editor) {
				currentElement = parentBox as HTMLElement;
			}
		}

		const pos = position(currentElement, this.jodit);

		let top: false | number = false;

		let { clientY } = e;

		if (this.jodit.iframe) {
			const { top } = position(this.jodit.iframe, this.jodit, true);
			clientY += top;
		}

		const delta = this.jodit.options.addNewLineDeltaShow;

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

	protected beforeDestruct(): void {
		this.jodit.async.clearTimeout(this.timeout);
		this.jodit.events.off(this.line);
		this.jodit.events.off('changePlace', this.addEventListeners);

		Dom.safeRemove(this.line);

		this.jodit.events
			.off(
				[
					this.jodit.ownerWindow,
					this.jodit.editorWindow,
					this.jodit.editor
				],
				'.' + ns
			)
			.off(this.jodit.container, '.' + ns);
	}
}
