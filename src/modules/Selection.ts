/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as consts from '../constants';
import {
	INVISIBLE_SPACE,
	INVISIBLE_SPACE_REG_EXP_END as INV_END,
	INVISIBLE_SPACE_REG_EXP_START as INV_START
} from '../constants';

import { HTMLTagNames, IDictionary, IJodit, markerInfo } from '../types';
import { Dom } from './Dom';
import { css } from './helpers/css';
import { normalizeNode, normilizeCSSValue } from './helpers/normalize';
import { $$ } from './helpers/selector';
import { isFunction, isPlainObject } from './helpers/checker';
import { each } from './helpers/each';
import { trim } from './helpers/string';
import { error } from './helpers';

type WindowSelection = Selection | null;

export class Select {
	constructor(readonly jodit: IJodit) {
		jodit.events.on('removeMarkers', () => {
			this.removeMarkers();
		});
	}

	/**
	 * Throw Error exception if parameter is not Node
	 * @param node
	 */
	private errorNode(node: unknown) {
		if (!Dom.isNode(node, this.win)) {
			throw error('Parameter node must be instance of Node');
		}
	}

	/**
	 * Return current work place - for Jodit is Editor
	 */
	get area(): HTMLElement {
		return this.jodit.editor;
	}

	/**
	 * Editor Window - it can be different for iframe mode
	 */
	get win(): Window {
		return this.jodit.editorWindow;
	}

	/**
	 * Current jodit editor doc
	 */
	get doc(): Document {
		return this.jodit.editorDocument;
	}

	/**
	 * Return current selection object
	 */
	get sel(): WindowSelection {
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
	 */
	createRange(): Range {
		return this.doc.createRange();
	}

	/**
	 * Remove all selected content
	 */
	remove() {
		const sel = this.sel,
			current: false | Node = this.current();

		if (sel && current) {
			for (let i = 0; i < sel.rangeCount; i += 1) {
				sel.getRangeAt(i).deleteContents();
				sel.getRangeAt(i).collapse(true);
			}
		}
	}

	/**
	 * Remove node element from editor
	 * @param node
	 */
	removeNode(node: Node): void {
		if (!Dom.isOrContains(this.jodit.editor, node, true)) {
			throw error(
				"Selection.removeNode can remove only editor's children"
			);
		}

		Dom.safeRemove(node);
		this.jodit.events.fire('afterRemoveNode', node);
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
			let rng = this.createRange();

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
		Dom.isElement(elm) &&
		Dom.isTag(elm, 'span') &&
		(elm as Element).hasAttribute('data-' + consts.MARKER_CLASS);

	/**
	 * Remove all markers
	 */
	removeMarkers() {
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

		const marker: HTMLSpanElement = this.jodit.create.inside.span();

		marker.id =
			consts.MARKER_CLASS +
			'_' +
			+new Date() +
			'_' +
			('' + Math.random()).slice(2);

		marker.style.lineHeight = '0';
		marker.style.display = 'none';

		marker.setAttribute(
			'data-' + consts.MARKER_CLASS,
			atStart ? 'start' : 'end'
		);

		marker.appendChild(
			this.jodit.create.inside.text(consts.INVISIBLE_SPACE)
		);

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
	 *
	 * @param {markerInfo[]|null} selectionInfo
	 */
	restore(selectionInfo: markerInfo[] | null = []) {
		if (Array.isArray(selectionInfo)) {
			let range: Range | false = false;

			selectionInfo.forEach((selection: markerInfo) => {
				const end = this.area.querySelector(
						'#' + selection.endId
					) as HTMLElement,
					start = this.area.querySelector(
						'#' + selection.startId
					) as HTMLElement;

				if (!start) {
					return;
				}

				range = this.createRange();

				if (selection.collapsed || !end) {
					const previousNode: Node | null = start.previousSibling;

					if (Dom.isText(previousNode)) {
						range.setStart(
							previousNode,
							previousNode.nodeValue
								? previousNode.nodeValue.length
								: 0
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
			});

			if (range) {
				this.selectRange(range);
			}
		}
	}

	/**
	 * Saves selections using marker invisible elements in the DOM.
	 *
	 * @return markerInfo[]
	 */
	save(): markerInfo[] {
		const sel = this.sel;

		if (!sel || !sel.rangeCount) {
			return [];
		}

		const info: markerInfo[] = [],
			length: number = sel.rangeCount,
			ranges: Range[] = [];

		let i: number, start: HTMLSpanElement, end: HTMLSpanElement;

		for (i = 0; i < length; i += 1) {
			ranges[i] = sel.getRangeAt(i);

			if (ranges[i].collapsed) {
				start = this.marker(true, ranges[i]);

				info[i] = {
					startId: start.id,
					collapsed: true,
					startMarker: start.outerHTML
				};
			} else {
				start = this.marker(true, ranges[i]);
				end = this.marker(false, ranges[i]);

				info[i] = {
					startId: start.id,
					endId: end.id,
					collapsed: false,
					startMarker: start.outerHTML,
					endMarker: end.outerHTML
				};
			}
		}

		sel.removeAllRanges();

		for (i = length - 1; i >= 0; --i) {
			const startElm: HTMLElement | null = this.doc.getElementById(
				info[i].startId
			);

			if (startElm) {
				if (info[i].collapsed) {
					ranges[i].setStartAfter(startElm);
					ranges[i].collapse(true);
				} else {
					ranges[i].setStartBefore(startElm);
					if (info[i].endId) {
						const endElm: HTMLElement | null = this.doc.getElementById(
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

		return info;
	}

	/**
	 * Set focus in editor
	 */
	focus = (): boolean => {
		if (!this.isFocused()) {
			if (this.jodit.iframe) {
				if (this.doc.readyState == 'complete') {
					this.jodit.iframe.focus();
				}
			}

			this.win.focus();
			this.area.focus();

			const sel: WindowSelection = this.sel,
				range = sel?.rangeCount ? sel?.getRangeAt(0) : null;

			if (!range || !Dom.isOrContains(this.area, range.startContainer)) {
				const range = this.createRange();
				range.setStart(this.area, 0);
				range.collapse(true);
				this.selectRange(range);
			}

			if (!this.jodit.editorIsActive) {
				this.jodit?.events?.fire('focus');
			}

			return true;
		}

		return false;
	};

	/**
	 * Checks whether the current selection is something or just set the cursor is
	 *
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
	 *
	 * @return boolean
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
	 *
	 * @return false|Node The element under the cursor or false if undefined or not in editor
	 */
	current(checkChild: boolean = true): false | Node {
		if (this.jodit.getRealMode() === consts.MODE_WYSIWYG) {
			const sel = this.sel;

			if (sel && sel.rangeCount > 0) {
				const range = sel.getRangeAt(0);

				let node: Node | null = range.startContainer,
					rightMode: boolean = false;

				const child = (nd: Node): Node | null =>
					rightMode ? nd.lastChild : nd.firstChild;

				if (!Dom.isText(node)) {
					node = range.startContainer.childNodes[range.startOffset];

					if (!node) {
						node =
							range.startContainer.childNodes[
								range.startOffset - 1
							];
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
						} while (
							leftChild &&
							rightChild &&
							!Dom.isText(leftChild)
						);

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
		}

		return false;
	}

	/**
	 * Insert element in editor
	 *
	 * @param {Node} node
	 * @param {Boolean} [insertCursorAfter=true] After insert, cursor will move after element
	 * @param {Boolean} [fireChange=true] After insert, editor fire change event. You can prevent this behavior
	 */
	insertNode(
		node: Node,
		insertCursorAfter = true,
		fireChange: boolean = true
	) {
		this.errorNode(node);

		if (!this.isFocused() && this.jodit.isEditorMode()) {
			this.focus();
		}

		const sel = this.sel;

		if (!this.isCollapsed()) {
			this.jodit.execCommand('Delete');
		}

		if (sel && sel.rangeCount) {
			const range = sel.getRangeAt(0);

			if (Dom.isOrContains(this.area, range.commonAncestorContainer)) {
				if (
					/^(BR|HR|IMG|VIDEO)$/i.test(
						range.startContainer.nodeName
					) &&
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

		if (fireChange && this.jodit.events) {
			this.jodit.events.fire('synchro');
		}

		if (this.jodit.events) {
			this.jodit.events.fire('afterInsertNode', node);
		}
	}

	/**
	 * Inserts in the current cursor position some HTML snippet
	 *
	 * @param  {string} html HTML The text toWYSIWYG be inserted into the document
	 * @example
	 * ```javascript
	 * parent.selection.insertHTML('<img src="image.png"/>');
	 * ```
	 */
	insertHTML(html: number | string | Node) {
		if (html === '') {
			return;
		}

		const node = this.jodit.create.inside.div(),
			fragment = this.jodit.create.inside.fragment();

		let lastChild: Node | null, lastEditorElement: Node | null;

		if (!this.isFocused() && this.jodit.isEditorMode()) {
			this.focus();
		}

		if (!Dom.isNode(html, this.win)) {
			node.innerHTML = html.toString();
		} else {
			node.appendChild(html);
		}

		if (
			!this.jodit.isEditorMode() &&
			this.jodit.events.fire('insertHTML', node.innerHTML) === false
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

		this.insertNode(fragment, false);

		if (lastChild) {
			this.setCursorAfter(lastChild);
		} else {
			this.setCursorIn(fragment);
		}

		lastEditorElement = this.area.lastChild;

		while (
			Dom.isText(lastEditorElement) &&
			lastEditorElement.previousSibling &&
			lastEditorElement.nodeValue &&
			/^\s*$/.test(lastEditorElement.nodeValue)
		) {
			lastEditorElement = lastEditorElement.previousSibling;
		}

		if (lastChild) {
			if (
				lastEditorElement &&
				lastChild === lastEditorElement &&
				Dom.isElement(lastChild)
			) {
				this.area.appendChild(this.jodit.create.inside.element('br'));
			}
			this.setCursorAfter(lastChild);
		}
	}

	/**
	 * Insert image in editor
	 *
	 * @param  {string|HTMLImageElement} url URL for image, or HTMLImageElement
	 * @param  {string} [styles] If specified, it will be applied <code>$(image).css(styles)</code>
	 * @param { number | string | null } defaultWidth
	 *
	 * @fired afterInsertImage
	 */
	insertImage(
		url: string | HTMLImageElement,
		styles: IDictionary<string> | null,
		defaultWidth: number | string | null
	) {
		const image: HTMLImageElement =
			typeof url === 'string'
				? this.jodit.create.inside.element('img')
				: url;

		if (typeof url === 'string') {
			image.setAttribute('src', url);
		}

		if (defaultWidth !== null) {
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

		image.addEventListener('load', onload);

		if (image.complete) {
			onload();
		}

		const result = this.insertNode(image);

		/**
		 * Triggered after image was inserted {@link Selection~insertImage|insertImage}. This method can executed from
		 * {@link FileBrowser|FileBrowser} or {@link Uploader|Uploader}
		 * @event afterInsertImage
		 * @param {HTMLImageElement} image
		 * @example
		 * ```javascript
		 * var editor = new Jodit("#redactor");
		 * editor.events.on('afterInsertImage', function (image) {
		 *     image.className = 'bloghead4';
		 * });
		 * ```
		 */
		this.jodit.events.fire('afterInsertImage', image);

		return result;
	}

	eachSelection = (callback: (current: Node) => void) => {
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
				if (!Dom.isOrContains(this.jodit.editor, current, true)) {
					return;
				}

				if (current.nodeName.match(/^(UL|OL)$/)) {
					return Array.from(current.childNodes).forEach(forEvery);
				}

				if (Dom.isTag(current, 'li')) {
					if (current.firstChild) {
						current = current.firstChild;
					} else {
						const currentB = this.jodit.create.inside.text(
							INVISIBLE_SPACE
						);

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
	 * Set cursor after the node
	 *
	 * @param {Node} node
	 * @return {Node} fake invisible textnode. After insert it can be removed
	 */
	setCursorAfter(
		node: Node | HTMLElement | HTMLTableElement | HTMLTableCellElement
	): Text | false {
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
		let fakeNode: Text | false = false;

		if (!Dom.isText(node)) {
			fakeNode = this.jodit.create.inside.text(consts.INVISIBLE_SPACE);
			range.setStartAfter(node);
			range.insertNode(fakeNode);
			range.selectNode(fakeNode);
		} else {
			range.setEnd(
				node,
				node.nodeValue !== null ? node.nodeValue.length : 0
			);
		}

		range.collapse(false);

		this.selectRange(range);

		return fakeNode;
	}

	/**
	 * Checks if the cursor is at the end(start) block
	 *
	 * @param  {boolean} start=false true - check whether the cursor is at the start block
	 * @param {HTMLElement} parentBlock - Find in this
	 *
	 * @return {boolean | null} true - the cursor is at the end(start) block, null - cursor somewhere outside
	 */
	cursorInTheEdge(start: boolean, parentBlock: HTMLElement): boolean | null {
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
			const text = container.nodeValue || '';

			if (end && text.replace(INV_END, '').length > offset) {
				return false;
			}

			const inv = INV_START.exec(text);
			if (
				start &&
				((inv && inv[0].length < offset) || (!inv && offset > 0))
			) {
				return false;
			}
		} else {
			const children = Array.from(container.childNodes);

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

		const next = start
			? Dom.prev(current, check, parentBlock)
			: Dom.next(current, check, parentBlock);

		return !next;
		//'<li><p><span>test</span>s<span>test</span></p></li>'
	}

	/**
	 * Wrapper for cursorInTheEdge
	 * @param parentBlock
	 */
	cursorOnTheLeft(parentBlock: HTMLElement): boolean | null {
		return this.cursorInTheEdge(true, parentBlock);
	}

	/**
	 * Wrapper for cursorInTheEdge
	 * @param parentBlock
	 */
	cursorOnTheRight(parentBlock: HTMLElement): boolean | null {
		return this.cursorInTheEdge(false, parentBlock);
	}

	/**
	 * Set cursor before the node
	 *
	 * @param {Node} node
	 * @return {Text} fake invisible textnode. After insert it can be removed
	 */
	setCursorBefore(
		node: Node | HTMLElement | HTMLTableElement | HTMLTableCellElement
	): Text | false {
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
		let fakeNode: Text | false = false;

		if (!Dom.isText(node)) {
			fakeNode = this.jodit.create.inside.text(consts.INVISIBLE_SPACE);
			range.setStartBefore(node);
			range.collapse(true);
			range.insertNode(fakeNode);
			range.selectNode(fakeNode);
		} else {
			range.setStart(
				node,
				node.nodeValue !== null ? node.nodeValue.length : 0
			);
		}

		range.collapse(true);
		this.selectRange(range);

		return fakeNode;
	}

	/**
	 * Set cursor in the node
	 *
	 * @param {Node} node
	 * @param {boolean} [inStart=false] set cursor in start of element
	 */
	setCursorIn(node: Node, inStart: boolean = false) {
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
			const fakeNode = this.jodit.create.inside.text(
				consts.INVISIBLE_SPACE
			);
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
	 *
	 * @fires changeSelection
	 */
	selectRange(range: Range) {
		const sel = this.sel;

		if (sel) {
			sel.removeAllRanges();
			sel.addRange(range);
		}

		/**
		 * Fired after change selection
		 *
		 * @event changeSelection
		 */
		this.jodit.events.fire('changeSelection');
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
	) {
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
	 * console.log(editor.selection.getHTML()); // html
	 * console.log(Jodit.modules.Helpers.stripTags(editor.selection.getHTML())); // plain text
	 * ```
	 */
	getHTML(): string {
		const sel = this.sel;

		if (sel && sel.rangeCount > 0) {
			const range = sel.getRangeAt(0);
			const clonedSelection = range.cloneContents();
			const div = this.jodit.create.inside.div();

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
		tagOrCallback: HTMLTagNames | ((font: HTMLElement) => void)
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

		this.doc.execCommand('fontsize', false, '7');

		$$('*[data-font-size]', this.area).forEach((elm: HTMLElement) => {
			const fontSize = elm.getAttribute('data-font-size');

			if (elm.style && fontSize) {
				elm.style.fontSize = fontSize;
				elm.removeAttribute('data-font-size');
			}
		});

		const result: HTMLElement[] = [];

		$$('font[size="7"]', this.area).forEach((font: HTMLElement) => {
			try {
				if (isFunction(tagOrCallback)) {
					tagOrCallback(font);
				} else {
					result.push(
						Dom.replace(
							font,
							tagOrCallback,
							this.jodit.create.inside
						)
					);
				}
			} finally {
				if (font.parentNode) {
					Dom.unwrap(font);
				}
			}
		});

		return result;
	}

	/**
	 * Apply some css rules for all selections. It method wraps selections in nodeName tag.
	 *
	 * @param {object} cssRules
	 * @param {string} nodeName
	 * @param {object} options
	 */
	applyCSS(
		cssRules: IDictionary<string | number | undefined>,
		nodeName: HTMLTagNames = 'span',
		options?:
			| ((jodit: IJodit, elm: HTMLElement) => boolean)
			| IDictionary<string | string[]>
			| IDictionary<(editor: IJodit, elm: HTMLElement) => boolean>
	) {
		const WRAP = 1,
			UNWRAP = 0,
			defaultTag = 'SPAN';

		let mode: number;

		const findNextCondition = (elm: Node | null): boolean =>
			elm !== null &&
			!Dom.isEmptyTextNode(elm) &&
			!this.isMarker(elm as HTMLElement);

		const checkCssRulesFor = (elm: HTMLElement): boolean => {
			return (
				!Dom.isTag(elm, 'font') &&
				Dom.isElement(elm) &&
				((isPlainObject(options) &&
					each(
						options as IDictionary<string[]>,
						(cssPropertyKey, cssPropertyValues) => {
							const value = css(
								elm,
								cssPropertyKey,
								undefined,
								true
							);

							return (
								value !== null &&
								value !== '' &&
								cssPropertyValues.indexOf(
									value.toString().toLowerCase()
								) !== -1
							);
						}
					)) ||
					(typeof options === 'function' && options(this.jodit, elm)))
			);
		};

		const isSuitElement = (elm: Node | null): boolean | null => {
			if (!elm) {
				return false;
			}

			const reg = RegExp('^' + elm.nodeName + '$', 'i');

			return (
				(reg.test(nodeName) ||
					!!(options && checkCssRulesFor(elm as HTMLElement))) &&
				findNextCondition(elm)
			);
		};

		const toggleStyles = (elm: HTMLElement) => {
			if (isSuitElement(elm)) {
				// toggle CSS rules
				if (elm.nodeName === defaultTag && cssRules) {
					// TODO need check == and ===
					Object.keys(cssRules).forEach((rule: string) => {
						if (
							mode === UNWRAP ||
							css(elm, rule) ===
								normilizeCSSValue(
									rule,
									cssRules[rule] as string
								)
						) {
							css(elm, rule, '');
							if (mode === undefined) {
								mode = UNWRAP;
							}
						} else {
							css(elm, rule, cssRules[rule]);
							if (mode === undefined) {
								mode = WRAP;
							}
						}
					});
				}

				if (
					!Dom.isBlock(elm, this.win) &&
					(!elm.getAttribute('style') || elm.nodeName !== defaultTag)
				) {
					// toggle `<strong>test</strong>` toWYSIWYG `test`, and
					// `<span style="">test</span>` toWYSIWYG `test`
					Dom.unwrap(elm);

					if (mode === undefined) {
						mode = UNWRAP;
					}
				}
			}
		};

		if (this.isCollapsed()) {
			let clearStyle: boolean = false;

			if (
				this.current() &&
				Dom.closest(this.current() as Node, nodeName, this.area)
			) {
				clearStyle = true;
				const closest = Dom.closest(
					this.current() as Node,
					nodeName,
					this.area
				);

				if (closest) {
					this.setCursorAfter(closest);
				}
			}

			if (nodeName.toUpperCase() === defaultTag || !clearStyle) {
				const node = this.jodit.create.inside.element(nodeName);

				node.appendChild(
					this.jodit.create.inside.text(consts.INVISIBLE_SPACE)
				);

				this.insertNode(node, false, false);

				if (nodeName.toUpperCase() === defaultTag && cssRules) {
					css(node as HTMLElement, cssRules);
				}

				this.setCursorIn(node);

				return;
			}
		}

		const selInfo: markerInfo[] = this.save();

		normalizeNode(this.area.firstChild); // FF fix for test "commandsTest - Exec command "bold"
		// for some text that contains a few STRONG elements, should unwrap all of these"
		this.wrapInTag((font: HTMLElement) => {
			if (
				!Dom.next(
					font,
					findNextCondition,
					font.parentNode as HTMLElement
				) &&
				!Dom.prev(
					font,
					findNextCondition,
					font.parentNode as HTMLElement
				) &&
				isSuitElement(font.parentNode as HTMLElement) &&
				font.parentNode !== this.area &&
				(!Dom.isBlock(font.parentNode, this.win) ||
					consts.IS_BLOCK.test(nodeName))
			) {
				toggleStyles(font.parentNode as HTMLElement);
				return;
			}

			if (
				font.firstChild &&
				!Dom.next(
					font.firstChild,
					findNextCondition,
					font as HTMLElement
				) &&
				!Dom.prev(
					font.firstChild,
					findNextCondition,
					font as HTMLElement
				) &&
				isSuitElement(font.firstChild as HTMLElement)
			) {
				toggleStyles(font.firstChild as HTMLElement);
				return;
			}

			if (Dom.closest(font, isSuitElement, this.area)) {
				const leftRange = this.createRange(),
					wrapper = Dom.closest(
						font,
						isSuitElement,
						this.area
					) as HTMLElement;

				leftRange.setStartBefore(wrapper);
				leftRange.setEndBefore(font);

				const leftFragment = leftRange.extractContents();

				if (
					(!leftFragment.textContent ||
						!trim(leftFragment.textContent).length) &&
					leftFragment.firstChild
				) {
					Dom.unwrap(leftFragment.firstChild);
				}

				if (wrapper.parentNode) {
					wrapper.parentNode.insertBefore(leftFragment, wrapper);
				}

				leftRange.setStartAfter(font);
				leftRange.setEndAfter(wrapper);

				const rightFragment = leftRange.extractContents();

				// case then marker can be inside fragnment
				if (
					(!rightFragment.textContent ||
						!trim(rightFragment.textContent).length) &&
					rightFragment.firstChild
				) {
					Dom.unwrap(rightFragment.firstChild);
				}

				Dom.after(wrapper, rightFragment);

				toggleStyles(wrapper);
				return;
			}
			// unwrap all suit elements inside
			const needUnwrap: Node[] = [];
			let firstElementSuit: boolean | undefined;

			if (font.firstChild) {
				Dom.find(
					font.firstChild,
					(elm: Node | null) => {
						if (elm && isSuitElement(elm as HTMLElement)) {
							if (firstElementSuit === undefined) {
								firstElementSuit = true;
							}
							needUnwrap.push(elm);
						} else {
							if (firstElementSuit === undefined) {
								firstElementSuit = false;
							}
						}
						return false;
					},
					font,
					true
				);
			}

			needUnwrap.forEach(Dom.unwrap);

			if (!firstElementSuit) {
				if (mode === undefined) {
					mode = WRAP;
				}

				if (mode === WRAP) {
					css(
						Dom.replace(font, nodeName, this.jodit.create.inside),
						cssRules && nodeName.toUpperCase() === defaultTag
							? cssRules
							: {}
					);
				}
			}
		});

		this.restore(selInfo);
	}

	/**
	 * Split selection on two parts
	 * @param currentBox
	 */
	splitSelection(currentBox: HTMLElement): Element | null {
		if (!this.isCollapsed()) {
			return null;
		}

		const leftRange = this.createRange();
		const range = this.range;

		leftRange.setStartBefore(currentBox);

		const cursorOnTheRight = this.cursorOnTheRight(currentBox);
		const cursorOnTheLeft = this.cursorOnTheLeft(currentBox);

		let br: HTMLElement | null = null;

		if (cursorOnTheRight || cursorOnTheLeft) {
			br = this.jodit.create.inside.element('br');

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

				if (cursorOnTheRight && br && br.parentNode) {
					const range = this.createRange();
					range.setStartBefore(br);
					this.selectRange(range);
				}
			} catch(e) {
				console.log(e)
			}
		}

		return currentBox.previousElementSibling;
	}
}
