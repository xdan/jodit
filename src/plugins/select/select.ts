/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/select/README.md]]
 * @packageDocumentation
 * @module plugins/select
 */

import type { IJodit, Nullable } from 'jodit/types';
import { IS_INLINE } from 'jodit/core/constants';
import { autobind, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { camelCase } from 'jodit/core/helpers/string/camel-case';
import { Plugin } from 'jodit/core/plugin';
import { Popup, UIElement } from 'jodit/core/ui';

import './config';

/**
 * A utility plugin that allows you to subscribe to a click/mousedown/touchstart/mouseup on an element in DOM order
 *
 * @example
 * ```js
 * const editor = Jodit.make('#editor');
 * editor.e.on('clickImg', (img) => {
 *   console.log(img.src);
 * })
 * ```
 */
export class select extends Plugin {
	private proxyEventsList = [
		'click',
		'mousedown',
		'touchstart',
		'mouseup',
		'touchend'
	];

	protected override afterInit(jodit: IJodit): void {
		this.proxyEventsList.forEach(eventName => {
			jodit.e.on(eventName + '.select', this.onStartSelection);
		});
	}

	protected override beforeDestruct(jodit: IJodit): void {
		this.proxyEventsList.forEach(eventName => {
			jodit.e.on(eventName + '.select', this.onStartSelection);
		});
	}

	@autobind
	private onStartSelection(e: MouseEvent): void {
		const { j } = this;

		let result,
			target = e.target as Nullable<Node>;

		while (result === undefined && target && target !== j.editor) {
			result = j.e.fire(
				camelCase(e.type + '_' + target.nodeName.toLowerCase()),
				target,
				e
			);

			target = target.parentElement;
		}

		if (e.type === 'click' && result === undefined && target === j.editor) {
			j.e.fire(e.type + 'Editor', target, e);
		}
	}

	/**
	 * @event outsideClick(e) - when user clicked on the outside of editor
	 */
	@watch('ow:click')
	protected onOutsideClick(e: MouseEvent): void {
		const node = e.target as Node;

		if (Dom.up(node, elm => elm === this.j.editor)) {
			return;
		}

		const box = UIElement.closestElement(node, Popup);

		if (!box) {
			this.j.e.fire('outsideClick', e);
		}
	}

	@watch([':beforeCommandCut'])
	protected beforeCommandCut(): void | false {
		const { s } = this.j;

		if (!s.isCollapsed()) {
			const current = s.current();

			if (current && Dom.isOrContains(this.j.editor, current)) {
				this.onCopyNormalizeSelectionBound();
			}
		}
	}

	@watch([':beforeCommandSelectall'])
	protected beforeCommandSelectAll(): false {
		const { s } = this.j;
		s.focus();
		s.select(this.j.editor, true);
		s.expandSelection();
		return false;
	}

	/**
	 * Fix caret position when clicking to the right of a list item that has a
	 * nested list. Blink/WebKit place the caret at the start of the line instead
	 * of the end (#1296); move it to the end of the item's own text.
	 */
	@watch([':click'])
	protected onClickRightOfNestedListItem(e: MouseEvent): void {
		const { s } = this.j;
		const range = s.range;

		if (
			!range.collapsed ||
			range.startOffset !== 0 ||
			!Dom.isText(range.startContainer)
		) {
			return;
		}

		const text = range.startContainer;
		const li = text.parentNode;

		// The text must be the direct content of a list item that has a nested
		// list (the last level has no nested list and behaves correctly).
		if (
			!Dom.isTag(li, 'li') ||
			!(li.querySelector('ul') || li.querySelector('ol'))
		) {
			return;
		}

		const measure = this.j.ed.createRange();
		measure.selectNodeContents(text);
		const rect = measure.getBoundingClientRect();

		// Only when the click happened to the right of the text.
		if (e.clientX > rect.right) {
			s.setCursorAfter(text);
		}
	}

	/**
	 * Keep pending inline formatting after a click. Toggling Bold/Italic/etc. on
	 * a collapsed cursor leaves empty marker elements with the caret inside; a
	 * click puts the caret right before them (outside), so they get cleaned up
	 * and the formatting is lost. Move the caret back into the innermost marker
	 * so the next typed character keeps every pending format (#1291).
	 */
	@watch([':click'])
	protected onClickKeepPendingFormat(): void {
		const { s } = this.j;
		const range = s.range;

		if (!range.collapsed || !Dom.isText(range.startContainer)) {
			return;
		}

		const text = range.startContainer;

		// Caret must sit at the very end of the text, right before the markers.
		if (range.startOffset !== (text.nodeValue?.length ?? 0)) {
			return;
		}

		const marker = text.nextSibling;

		if (
			!Dom.isElement(marker) ||
			!marker.nodeName.match(IS_INLINE) ||
			!Dom.isEmpty(marker)
		) {
			return;
		}

		let inner: Element = marker;

		// Descend into the innermost empty formatting marker.
		while (
			Dom.isElement(inner.firstElementChild) &&
			inner.firstElementChild.nodeName.match(IS_INLINE)
		) {
			inner = inner.firstElementChild;
		}

		s.setCursorIn(inner);
	}

	/**
	 * Normalize selection after triple click
	 */
	@watch([':click'])
	protected onTripleClickNormalizeSelection(e: MouseEvent): void {
		if (e.detail !== 3 || !this.j.o.select.normalizeTripleClick) {
			return;
		}

		const { s } = this.j;
		const { startContainer, startOffset } = s.range;
		if (startOffset === 0 && Dom.isText(startContainer)) {
			s.select(
				Dom.closest(startContainer, Dom.isBlock, this.j.editor) ||
					startContainer,
				true
			);
		}
	}

	@watch([':copy', ':cut'])
	protected onCopyNormalizeSelectionBound(e?: ClipboardEvent): void {
		const { s, editor, o } = this.j;

		if (!o.select.normalizeSelectionBeforeCutAndCopy || s.isCollapsed()) {
			return;
		}

		if (
			e &&
			(!e.isTrusted ||
				!Dom.isNode(e.target) ||
				!Dom.isOrContains(editor, e.target))
		) {
			return;
		}

		this.jodit.s.expandSelection();
	}
}

pluginSystem.add('select', select);
