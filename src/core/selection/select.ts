/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as consts from '../constants';
import {
	INSEPARABLE_TAGS,
	INVISIBLE_SPACE,
	INVISIBLE_SPACE_REG_EXP_END as INV_END,
	INVISIBLE_SPACE_REG_EXP_START as INV_START
} from '../constants';

import type {
	CanUndef,
	HTMLTagNames,
	IDictionary,
	IJodit,
	IStyle,
	markerInfo,
	Nullable
} from '../../types';
import { Dom } from '../dom';

import {
	attr,
	error,
	isFunction,
	isString,
	$$,
	css,
	call,
	toArray
} from '../helpers';
import { Style } from './style/style';
import { autobind } from '../decorators';

type WindowSelection = Selection | null;

export class Select {
	constructor(readonly jodit: IJodit) {
		jodit.e.on('removeMarkers', () => {
			this.removeMarkers();
		});
	}

	/**
	 * Short alias for this.jodit
	 */
	get j(): this['jodit'] {
		return this.jodit;
	}

	/**
	 * Throw Error exception if parameter is not Node
	 * @param node
	 */
	private errorNode(node: unknown): void {
		if (!Dom.isNode(node, this.win)) {
			throw error('Parameter node must be instance of Node');
		}
	}

	/**
	 * Return current work place - for Jodit is Editor
	 */
	get area(): HTMLElement {
		return this.j.editor;
	}

	/**
	 * Editor Window - it can be different for iframe mode
	 */
	get win(): Window {
		return this.j.ew;
	}

	/**
	 * Current jodit editor doc
	 */
	get doc(): Document {
		return this.j.ed;
	}

	/**
	 * Return current selection object
	 */
	get sel(): WindowSelection {
		if (this.j.o.shadowRoot) {
			return this.j.o.shadowRoot.getSelection();
		}

		return this.win.getSelection();
	}

	/**
	 * Return first selected range or create new
	 */
	get range(): Range {
		const sel = this.sel;

		return sel && sel.rangeCount ? sel.getRangeAt(0) : this.createRange();
	}

	/**
	 * Return current selection object
	 * @param select Immediately add in selection
	 */
	createRange(select: boolean = false): Range {
		const range = this.doc.createRange();

		if (select) {
			this.selectRange(range);
		}

		return range;
	}

	/**
	 * Remove all selected content
	 */
	remove(): void {
		const sel = this.sel,
			current = this.current();

		if (sel && current) {
			for (let i = 0; i < sel.rangeCount; i += 1) {
				sel.getRangeAt(i).deleteContents();
				sel.getRangeAt(i).collapse(true);
			}
		}
	}

	/**
	 * Clear all selection
	 */
	clear(): void {
		if (this.sel?.rangeCount) {
			this.sel?.removeAllRanges();
		}
	}

	/**
	 * Remove node element from editor
	 * @param node
	 */
	removeNode(node: Node): void {
		if (!Dom.isOrContains(this.j.editor, node, true)) {
			throw error(
				"Selection.removeNode can remove only editor's children"
			);
		}

		Dom.safeRemove(node);
		this.j.e.fire('afterRemoveNode', node);
	}

	/**
	 * Insert the cursor toWYSIWYG any point x, y
	 *
	 * @method insertAtPoint
	 * @param {int} x Coordinate by horizontal
	 * @param {int} y Coordinate by vertical
	 * @return boolean Something went wrong
	 */
	insertCursorAtPoint(x: number, y: number): boolean {
		this.removeMarkers();

		try {
			const rng = this.createRange();

			(() => {
				if (this.doc.caretPositionFromPoint) {
					const caret = this.doc.caretPositionFromPoint(x, y);

					if (caret) {
						rng.setStart(caret.offsetNode, caret.offset);
						return;
					}
				}

				if (this.doc.caretRangeFromPoint) {
					const caret = this.doc.caretRangeFromPoint(x, y);
					rng.setStart(caret.startContainer, caret.startOffset);
				}
			})();

			rng.collapse(true);
			this.selectRange(rng);

			return true;
		} catch {}

		return false;
	}

	/**
	 * Define element is selection helper
	 * @param elm
	 */
	isMarker = (elm: Node): boolean =>
		Dom.isNode(elm, this.win) &&
		Dom.isTag(elm, 'span') &&
		elm.hasAttribute('data-' + consts.MARKER_CLASS);

	/**
	 * Check if editor has selection markers
	 */
	get hasMarkers(): boolean {
		return Boolean(
			$$('span[data-' + consts.MARKER_CLASS + ']', this.area).length
		);
	}

	/**
	 * Remove all markers
	 */
	removeMarkers(): void {
		$$('span[data-' + consts.MARKER_CLASS + ']', this.area).forEach(
			Dom.safeRemove
		);
	}

	/**
	 * Create marker element
	 *
	 * @param atStart
	 * @param range
	 */
	marker(atStart = false, range?: Range): HTMLSpanElement {
		let newRange: Range | null = null;

		if (range) {
			newRange = range.cloneRange();
			newRange.collapse(atStart);
		}

		const marker = this.j.createInside.span();

		marker.id =
			consts.MARKER_CLASS +
			'_' +
			Number(new Date()) +
			'_' +
			String(Math.random()).slice(2);

		marker.style.lineHeight = '0';
		marker.style.display = 'none';

		marker.setAttribute(
			'data-' + consts.MARKER_CLASS,
			atStart ? 'start' : 'end'
		);

		marker.appendChild(this.j.createInside.text(consts.INVISIBLE_SPACE));

		if (newRange) {
			if (
				Dom.isOrContains(
					this.area,
					atStart ? newRange.startContainer : newRange.endContainer
				)
			) {
				newRange.insertNode(marker);
			}
		}

		return marker;
	}

	/**
	 * Restores user selections using marker invisible elements in the DOM.
	 */
	restore(): void {
		let range: Range | false = false;

		const markAttr = (start: boolean) =>
			`span[data-${consts.MARKER_CLASS}=${start ? 'start' : 'end'}]`;

		const start = this.area.querySelector(markAttr(true)),
			end = this.area.querySelector(markAttr(false));

		if (!start) {
			return;
		}

		range = this.createRange();

		if (!end) {
			const previousNode: Node | null = start.previousSibling;

			if (Dom.isText(previousNode)) {
				range.setStart(
					previousNode,
					previousNode.nodeValue ? previousNode.nodeValue.length : 0
				);
			} else {
				range.setStartBefore(start);
			}

			Dom.safeRemove(start);

			range.collapse(true);
		} else {
			range.setStartAfter(start);
			Dom.safeRemove(start);

			range.setEndBefore(end);
			Dom.safeRemove(end);
		}

		if (range) {
			this.selectRange(range);
		}
	}

	/**
	 * Saves selections using marker invisible elements in the DOM.
	 * @param [silent] Do not change current range
	 */
	save(silent: boolean = false): markerInfo[] {
		if (this.hasMarkers) {
			return [];
		}

		const sel = this.sel;

		if (!sel || !sel.rangeCount) {
			return [];
		}

		const info: markerInfo[] = [],
			length: number = sel.rangeCount,
			ranges: Range[] = [];

		for (let i = 0; i < length; i += 1) {
			ranges[i] = sel.getRangeAt(i);

			if (ranges[i].collapsed) {
				const start = this.marker(true, ranges[i]);

				info[i] = {
					startId: start.id,
					collapsed: true,
					startMarker: start.outerHTML
				};
			} else {
				const start = this.marker(true, ranges[i]);
				const end = this.marker(false, ranges[i]);

				info[i] = {
					startId: start.id,
					endId: end.id,
					collapsed: false,
					startMarker: start.outerHTML,
					endMarker: end.outerHTML
				};
			}
		}

		if (!silent) {
			sel.removeAllRanges();

			for (let i = length - 1; i >= 0; --i) {
				const startElm = this.doc.getElementById(info[i].startId);

				if (startElm) {
					if (info[i].collapsed) {
						ranges[i].setStartAfter(startElm);
						ranges[i].collapse(true);
					} else {
						ranges[i].setStartBefore(startElm);

						if (info[i].endId) {
							const endElm = this.doc.getElementById(
								info[i].endId as string
							);

							if (endElm) {
								ranges[i].setEndAfter(endElm);
							}
						}
					}
				}

				try {
					sel.addRange(ranges[i].cloneRange());
				} catch {}
			}
		}

		return info;
	}

	/**
	 * Set focus in editor
	 * @param options
	 */
	@autobind
	focus(
		options: FocusOptions = {
			preventScroll: true
		}
	): boolean {
		if (!this.isFocused()) {
			if (this.j.iframe) {
				if (this.doc.readyState === 'complete') {
					this.j.iframe.focus();
				}
			}

			this.win.focus();
			this.area.focus(options);

			const sel = this.sel,
				range = sel?.rangeCount ? sel?.getRangeAt(0) : null;

			if (!range || !Dom.isOrContains(this.area, range.startContainer)) {
				const range = this.createRange();
				range.setStart(this.area, 0);
				range.collapse(true);
				this.selectRange(range, false);
			}

			if (!this.j.editorIsActive) {
				this.j?.events?.fire('focus');
			}

			return true;
		}

		return false;
	}

	/**
	 * Checks whether the current selection is something or just set the cursor is
	 * @return boolean true Selection does't have content
	 */
	isCollapsed(): boolean {
		const sel = this.sel;

		for (let r: number = 0; sel && r < sel.rangeCount; r += 1) {
			if (!sel.getRangeAt(r).collapsed) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Checks whether the editor currently in focus
	 */
	isFocused(): boolean {
		return (
			this.doc.hasFocus &&
			this.doc.hasFocus() &&
			this.area === this.doc.activeElement
		);
	}

	/**
	 * Returns the current element under the cursor inside editor
	 */
	current(checkChild: boolean = true): null | Node {
		if (this.j.getRealMode() === consts.MODE_WYSIWYG) {
			const sel = this.sel;

			if (!sel || sel.rangeCount === 0) {
				return null;
			}

			const range = sel.getRangeAt(0);

			let node = range.startContainer,
				rightMode: boolean = false;

			const child = (nd: Node): Node | null =>
				rightMode ? nd.lastChild : nd.firstChild;

			if (Dom.isTag(node, 'br') && sel.isCollapsed) {
				return node;
			}

			if (!Dom.isText(node)) {
				node = range.startContainer.childNodes[range.startOffset];

				if (!node) {
					node =
						range.startContainer.childNodes[range.startOffset - 1];

					rightMode = true;
				}

				if (node && sel.isCollapsed && !Dom.isText(node)) {
					// test Current method - Cursor in the left of some SPAN
					if (!rightMode && Dom.isText(node.previousSibling)) {
						node = node.previousSibling;
					} else if (checkChild) {
						let current: Node | null = child(node);

						while (current) {
							if (current && Dom.isText(current)) {
								node = current;
								break;
							}
							current = child(current);
						}
					}
				}

				if (node && !sel.isCollapsed && !Dom.isText(node)) {
					let leftChild: Node | null = node,
						rightChild: Node | null = node;

					do {
						leftChild = leftChild.firstChild;
						rightChild = rightChild.lastChild;
					} while (leftChild && rightChild && !Dom.isText(leftChild));

					if (
						leftChild === rightChild &&
						leftChild &&
						Dom.isText(leftChild)
					) {
						node = leftChild;
					}
				}
			}

			// check - cursor inside editor
			if (node && Dom.isOrContains(this.area, node)) {
				return node;
			}
		}

		return null;
	}

	/**
	 * Insert element in editor
	 *
	 * @param node
	 * @param [insertCursorAfter] After insert, cursor will move after element
	 * @param [fireChange] After insert, editor fire change event. You can prevent this behavior
	 */
	insertNode(
		node: Node,
		insertCursorAfter = true,
		fireChange: boolean = true
	): void {
		this.errorNode(node);

		if (!this.isFocused() && this.j.isEditorMode()) {
			this.focus();
			this.restore();
		}

		const sel = this.sel;

		if (!this.isCollapsed()) {
			this.j.execCommand('Delete');
		}

		if (sel && sel.rangeCount) {
			const range = sel.getRangeAt(0);

			if (Dom.isOrContains(this.area, range.commonAncestorContainer)) {
				if (
					Dom.isTag(range.startContainer, INSEPARABLE_TAGS) &&
					range.collapsed
				) {
					range.startContainer.parentNode?.insertBefore(
						node,
						range.startContainer
					);
				} else {
					range.deleteContents();
					range.insertNode(node);
				}
			} else {
				this.area.appendChild(node);
			}
		} else {
			this.area.appendChild(node);
		}

		if (insertCursorAfter) {
			if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
				node.lastChild && this.setCursorAfter(node.lastChild);
			} else {
				this.setCursorAfter(node);
			}
		}

		if (fireChange && this.j.events) {
			this.j.e.fire('synchro');
		}

		if (this.j.events) {
			this.j.e.fire('afterInsertNode', node);
		}
	}

	/**
	 * Inserts in the current cursor position some HTML snippet
	 *
	 * @param  {string} html HTML The text toWYSIWYG be inserted into the document
	 * @example
	 * ```javascript
	 * parent.s.insertHTML('<img src="image.png"/>');
	 * ```
	 */
	insertHTML(html: number | string | Node): void {
		if (html === '') {
			return;
		}

		const node = this.j.createInside.div(),
			fragment = this.j.createInside.fragment();

		let lastChild: Node | null;

		if (!this.isFocused() && this.j.isEditorMode()) {
			this.focus();
			this.restore();
		}

		if (!Dom.isNode(html, this.win)) {
			node.innerHTML = html.toString();
		} else {
			node.appendChild(html);
		}

		if (
			!this.j.isEditorMode() &&
			this.j.e.fire('insertHTML', node.innerHTML) === false
		) {
			return;
		}

		lastChild = node.lastChild;

		if (!lastChild) {
			return;
		}

		while (node.firstChild) {
			lastChild = node.firstChild;
			fragment.appendChild(node.firstChild);
		}

		this.insertNode(fragment, false, false);

		if (lastChild) {
			this.setCursorAfter(lastChild);
		} else {
			this.setCursorIn(fragment);
		}

		if (this.j.e) {
			this.j.e.fire('synchro');
		}
	}

	/**
	 * Insert image in editor
	 *
	 * @param  url URL for image, or HTMLImageElement
	 * @param  [styles] If specified, it will be applied <code>$(image).css(styles)</code>
	 * @param defaultWidth
	 *
	 * @fired afterInsertImage
	 */
	insertImage(
		url: string | HTMLImageElement,
		styles: Nullable<IDictionary<string>> = null,
		defaultWidth: Nullable<number | string> = null
	): void {
		const image = isString(url) ? this.j.createInside.element('img') : url;

		if (isString(url)) {
			image.setAttribute('src', url);
		}

		if (defaultWidth != null) {
			let dw: string = defaultWidth.toString();

			if (
				dw &&
				'auto' !== dw &&
				String(dw).indexOf('px') < 0 &&
				String(dw).indexOf('%') < 0
			) {
				dw += 'px';
			}

			css(image, 'width', dw);
		}

		if (styles && typeof styles === 'object') {
			css(image, styles);
		}

		const onload = () => {
			if (
				image.naturalHeight < image.offsetHeight ||
				image.naturalWidth < image.offsetWidth
			) {
				image.style.width = '';
				image.style.height = '';
			}

			image.removeEventListener('load', onload);
		};

		this.j.e.on(image, 'load', onload);

		if (image.complete) {
			onload();
		}

		this.insertNode(image);

		/**
		 * Triggered after image was inserted {@link Selection~insertImage|insertImage}. This method can executed from
		 * {@link FileBrowser|FileBrowser} or {@link Uploader|Uploader}
		 * @event afterInsertImage
		 * @param {HTMLImageElement} image
		 * @example
		 * ```javascript
		 * var editor = new Jodit("#redactor");
		 * editor.e.on('afterInsertImage', function (image) {
		 *     image.className = 'bloghead4';
		 * });
		 * ```
		 */
		this.j.e.fire('afterInsertImage', image);
	}

	/**
	 * Call callback for all selection node
	 * @param callback
	 */
	eachSelection = (callback: (current: Node) => void): void => {
		const sel = this.sel;

		if (sel && sel.rangeCount) {
			const range = sel.getRangeAt(0);

			const nodes: Node[] = [],
				startOffset = range.startOffset,
				length = this.area.childNodes.length,
				elementOffset = startOffset < length ? startOffset : length - 1,
				start: Node =
					range.startContainer === this.area
						? this.area.childNodes[elementOffset]
						: range.startContainer,
				end: Node =
					range.endContainer === this.area
						? this.area.childNodes[range.endOffset - 1]
						: range.endContainer;

			Dom.find(
				start,
				(node: Node | null) => {
					if (
						node &&
						node !== this.area &&
						!Dom.isEmptyTextNode(node) &&
						!this.isMarker(node as HTMLElement)
					) {
						nodes.push(node);
					}

					// checks parentElement as well because partial selections are not equal to entire element
					return (
						node === end ||
						(node && node.contains && node.contains(end))
					);
				},
				this.area,
				true,
				'nextSibling',
				false
			);

			const forEvery = (current: Node): void => {
				if (!Dom.isOrContains(this.j.editor, current, true)) {
					return;
				}

				if (current.nodeName.match(/^(UL|OL)$/)) {
					return toArray(current.childNodes).forEach(forEvery);
				}

				if (Dom.isTag(current, 'li')) {
					if (current.firstChild) {
						current = current.firstChild;
					} else {
						const currentB =
							this.j.createInside.text(INVISIBLE_SPACE);

						current.appendChild(currentB);
						current = currentB;
					}
				}

				callback(current);
			};

			if (nodes.length === 0 && Dom.isEmptyTextNode(start)) {
				nodes.push(start);
			}

			nodes.forEach(forEvery);
		}
	};

	/**
	 * Checks if the cursor is at the end(start) block
	 *
	 * @param  {boolean} start=false true - check whether the cursor is at the start block
	 * @param {HTMLElement} parentBlock - Find in this
	 *
	 * @return {boolean | null} true - the cursor is at the end(start) block, null - cursor somewhere outside
	 */
	cursorInTheEdge(
		start: boolean,
		parentBlock: HTMLElement
	): Nullable<boolean> {
		const end = !start,
			range = this.sel?.getRangeAt(0),
			current = this.current(false);

		if (
			!range ||
			!current ||
			!Dom.isOrContains(parentBlock, current, true)
		) {
			return null;
		}

		const container = start ? range.startContainer : range.endContainer;
		const offset = start ? range.startOffset : range.endOffset;

		const check = (elm: Node | null) =>
			elm && !Dom.isTag(elm, 'br') && !Dom.isEmptyTextNode(elm);

		// check right offset
		if (Dom.isText(container)) {
			const text = container.nodeValue?.length ? container.nodeValue : '';

			if (end && text.replace(INV_END(), '').length > offset) {
				return false;
			}

			const inv = INV_START().exec(text);

			if (
				start &&
				((inv && inv[0].length < offset) || (!inv && offset > 0))
			) {
				return false;
			}
		} else {
			const children = toArray(container.childNodes);

			if (end) {
				if (children.slice(offset).some(check)) {
					return false;
				}
			} else {
				if (children.slice(0, offset).some(check)) {
					return false;
				}
			}
		}

		return !call(start ? Dom.prev : Dom.next, current, check, parentBlock);
	}

	/**
	 * Wrapper for cursorInTheEdge
	 * @param parentBlock
	 */
	cursorOnTheLeft(parentBlock: HTMLElement): Nullable<boolean> {
		return this.cursorInTheEdge(true, parentBlock);
	}

	/**
	 * Wrapper for cursorInTheEdge
	 * @param parentBlock
	 */
	cursorOnTheRight(parentBlock: HTMLElement): Nullable<boolean> {
		return this.cursorInTheEdge(false, parentBlock);
	}

	/**
	 * Set cursor after the node
	 *
	 * @param {Node} node
	 * @return {Node} fake invisible textnode. After insert it can be removed
	 */
	@autobind
	setCursorAfter(node: Node): Nullable<Text> {
		return this.setCursorNearWith(node, false);
	}

	/**
	 * Set cursor before the node
	 *
	 * @param node
	 * @return fake invisible textnode. After insert it can be removed
	 */
	@autobind
	setCursorBefore(node: Node): Nullable<Text> {
		return this.setCursorNearWith(node, true);
	}

	/**
	 * Add fake node for new cursor position
	 *
	 * @param node
	 * @param inStart
	 */
	private setCursorNearWith(node: Node, inStart: boolean): Nullable<Text> {
		this.errorNode(node);

		if (
			!Dom.up(
				node,
				(elm: Node | null) =>
					elm === this.area || (elm && elm.parentNode === this.area),
				this.area
			)
		) {
			throw error('Node element must be in editor');
		}

		const range = this.createRange();
		let fakeNode: Nullable<Text> = null;

		if (!Dom.isText(node)) {
			fakeNode = this.j.createInside.text(consts.INVISIBLE_SPACE);

			inStart ? range.setStartBefore(node) : range.setEndAfter(node);

			range.collapse(inStart);

			range.insertNode(fakeNode);
			range.selectNode(fakeNode);
		} else {
			if (inStart) {
				range.setStart(node, 0);
			} else {
				range.setEnd(node, node.nodeValue?.length ?? 0);
			}
		}

		range.collapse(inStart);
		this.selectRange(range);

		return fakeNode;
	}

	/**
	 * Set cursor in the node
	 *
	 * @param node
	 * @param [inStart] set cursor in start of element
	 */
	@autobind
	setCursorIn(node: Node, inStart: boolean = false): Node {
		this.errorNode(node);

		if (
			!Dom.up(
				node,
				(elm: Node | null) =>
					elm === this.area || (elm && elm.parentNode === this.area),
				this.area
			)
		) {
			throw error('Node element must be in editor');
		}

		const range = this.createRange();

		let start: Node | null = node,
			last: Node = node;

		do {
			if (Dom.isText(start)) {
				break;
			}
			last = start;
			start = inStart ? start.firstChild : start.lastChild;
		} while (start);

		if (!start) {
			const fakeNode = this.j.createInside.text(consts.INVISIBLE_SPACE);
			if (!/^(img|br|input)$/i.test(last.nodeName)) {
				last.appendChild(fakeNode);
				last = fakeNode;
			} else {
				start = last;
			}
		}

		range.selectNodeContents(start || last);
		range.collapse(inStart);

		this.selectRange(range);

		return last;
	}

	/**
	 * Set range selection
	 *
	 * @param range
	 * @param [focus]
	 *
	 * @fires changeSelection
	 */
	selectRange(range: Range, focus: boolean = true): void {
		const sel = this.sel;

		if (focus && !this.isFocused()) {
			this.focus();
		}

		if (sel) {
			sel.removeAllRanges();
			sel.addRange(range);
		}

		/**
		 * Fired after change selection
		 *
		 * @event changeSelection
		 */
		this.j.e.fire('changeSelection');
	}

	/**
	 * Select node
	 *
	 * @param {Node} node
	 * @param {boolean} [inward=false] select all inside
	 */
	select(
		node: Node | HTMLElement | HTMLTableElement | HTMLTableCellElement,
		inward = false
	): void {
		this.errorNode(node);

		if (
			!Dom.up(
				node,
				(elm: Node | null) =>
					elm === this.area || (elm && elm.parentNode === this.area),
				this.area
			)
		) {
			throw error('Node element must be in editor');
		}

		const range = this.createRange();

		range[inward ? 'selectNodeContents' : 'selectNode'](node);

		this.selectRange(range);
	}

	/**
	 * Return current selected HTML
	 * @example
	 * ```javascript
	 * const editor = new jodit();
	 * console.log(editor.s.html); // html
	 * console.log(Jodit.modules.Helpers.stripTags(editor.s.html)); // plain text
	 * ```
	 */
	get html(): string {
		const sel = this.sel;

		if (sel && sel.rangeCount > 0) {
			const range = sel.getRangeAt(0);
			const clonedSelection = range.cloneContents();
			const div = this.j.createInside.div();

			div.appendChild(clonedSelection);

			return div.innerHTML;
		}

		return '';
	}

	/**
	 * Wrap all selected fragments inside Tag or apply some callback
	 * @param tagOrCallback
	 */
	wrapInTag(
		tagOrCallback: HTMLTagNames | ((font: HTMLElement) => any)
	): HTMLElement[] {
		// fix issue https://github.com/xdan/jodit/issues/65
		$$('*[style*=font-size]', this.area).forEach((elm: HTMLElement) => {
			elm.style &&
				elm.style.fontSize &&
				elm.setAttribute(
					'data-font-size',
					elm.style.fontSize.toString()
				);
		});

		if (!this.isCollapsed()) {
			this.j.nativeExecCommand('fontsize', false, '7');
		} else {
			const font = this.j.createInside.element('font');
			attr(font, 'size', 7);
			this.insertNode(font, false, false);
		}

		$$('*[data-font-size]', this.area).forEach((elm: HTMLElement) => {
			const fontSize = attr(elm, 'data-font-size');

			if (elm.style && fontSize) {
				elm.style.fontSize = fontSize;
				elm.removeAttribute('data-font-size');
			}
		});

		const result: HTMLElement[] = [];

		$$('font[size="7"]', this.area).forEach((font: HTMLElement) => {
			try {
				if (
					font.firstChild &&
					font.firstChild === font.lastChild &&
					this.isMarker(font.firstChild)
				) {
					return;
				}

				if (isFunction(tagOrCallback)) {
					tagOrCallback(font);
				} else {
					result.push(
						Dom.replace(font, tagOrCallback, this.j.createInside)
					);
				}
			} finally {
				const pn = font.parentNode;

				if (pn) {
					Dom.unwrap(font);

					if (Dom.isEmpty(pn)) {
						Dom.unwrap(pn);
					}
				}
			}
		});

		return result;
	}

	/**
	 * Apply some css rules for all selections. It method wraps selections in nodeName tag.
	 *
	 * @param cssRules
	 * @param options
	 * @param options.element - tag - equal CSSRule (e.g. strong === font-weight: 700)
	 * @param options.defaultTag - tag for wrapping and apply styles
	 * @example
	 * ```js
	 * const editor = Jodit.make('#editor');
	 * editor.value = 'test';
	 * editor.execCommand('selectall');
	 *
	 * editor.s.applyStyle({color: 'red'}) // will wrap `text` in `span` and add style `color:red`
	 * editor.s.applyStyle({color: 'red'}) // will remove `color:red` from `span`
	 * ```
	 */
	applyStyle(
		style: CanUndef<IStyle>,
		options: {
			element?: HTMLTagNames;
			className?: string;
			defaultTag?: HTMLTagNames;
		} = {}
	): void {
		const styleElm = new Style({
			style,
			element: options.element,
			className: options.className,
			defaultTag: options.defaultTag
		});

		styleElm.apply(this.j);
	}

	/**
	 * Split selection on two parts: left and right
	 * @param currentBox
	 * @return Left part
	 */
	splitSelection(currentBox: HTMLElement): Nullable<Element> {
		if (!this.isCollapsed()) {
			return null;
		}

		const leftRange = this.createRange();
		const range = this.range;

		leftRange.setStartBefore(currentBox);

		const cursorOnTheRight = this.cursorOnTheRight(currentBox);
		const cursorOnTheLeft = this.cursorOnTheLeft(currentBox);

		const br = this.j.createInside.element('br'),
			prevFake = this.j.createInside.text(INVISIBLE_SPACE),
			nextFake = prevFake.cloneNode();

		try {
			if (cursorOnTheRight || cursorOnTheLeft) {
				range.insertNode(br);

				const clearBR = (
					start: Node,
					getNext: (node: Node) => Node | null
				) => {
					let next = getNext(start);

					while (next) {
						const nextSib = getNext(next);

						if (
							next &&
							(Dom.isTag(next, 'br') || Dom.isEmptyTextNode(next))
						) {
							Dom.safeRemove(next);
						} else {
							break;
						}

						next = nextSib;
					}
				};

				clearBR(br, (n: Node) => n.nextSibling);
				clearBR(br, (n: Node) => n.previousSibling);

				Dom.after(br, nextFake);
				Dom.before(br, prevFake);

				if (cursorOnTheRight) {
					leftRange.setEndBefore(br);
					range.setEndBefore(br);
				} else {
					leftRange.setEndAfter(br);
					range.setEndAfter(br);
				}
			} else {
				leftRange.setEnd(range.startContainer, range.startOffset);
			}

			const fragment = leftRange.extractContents();

			if (currentBox.parentNode) {
				try {
					currentBox.parentNode.insertBefore(fragment, currentBox);

					if (cursorOnTheRight && br?.parentNode) {
						const range = this.createRange();
						range.setStartBefore(br);
						this.selectRange(range);
					}
				} catch (e) {
					if (!isProd) {
						throw e;
					}
				}
			}

			// After splitting some part can be empty
			const fillFakeParent = (fake: Node) => {
				if (
					fake?.parentNode?.firstChild === fake?.parentNode?.lastChild
				) {
					fake?.parentNode?.appendChild(br.cloneNode());
				}
			};

			fillFakeParent(prevFake);
			fillFakeParent(nextFake);
		} finally {
			Dom.safeRemove(prevFake);
			Dom.safeRemove(nextFake);
		}

		return currentBox.previousElementSibling;
	}
}
