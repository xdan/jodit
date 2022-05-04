/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:src/plugins/fix/clean-html/README.md]]
 * @packageDocumentation
 * @module plugins/fix/clean-html
 */

import type { HTMLTagNames, IJodit, Nullable } from 'jodit/types';
import {
	INVISIBLE_SPACE_REG_EXP as INV_REG,
	IS_INLINE,
	INSEPARABLE_TAGS
} from 'jodit/core/constants';
import { Dom } from 'jodit/modules';
import { attr, keys, safeHTML, trim } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { watch, autobind, debounce, hook } from 'jodit/core/decorators';
import { findNotEmptySibling } from 'jodit/plugins/keyboard/helpers';
import { LazyWalker } from 'jodit/core/dom/lazy-walker';

import './config';
import {
	getHash,
	hasNotEmptyTextSibling
} from 'jodit/plugins/fix/clean-html/helpers';

/**
 * Clean HTML after removeFormat and insertHorizontalRule command
 */
export class cleanHtml extends Plugin {
	/** @override */
	override buttons: Plugin['buttons'] = [
		{
			name: 'eraser',
			group: 'font-style'
		}
	];

	/** @override */
	protected override afterInit(jodit: IJodit): void {
		jodit.e
			.off('.cleanHtml')
			.on(
				[
					'change.cleanHtml',
					'afterSetMode.cleanHtml',
					'afterInit.cleanHtml',
					'mousedown.cleanHtml',
					'keydown.cleanHtml'
				],
				this.onChangeCleanHTML
			)
			.on('keyup.cleanHtml', this.onKeyUpCleanUp)
			.on('beforeCommand.cleanHtml', this.beforeCommand);
	}

	/**
	 * Replaces an element with a newer one if specified in the configuration match
	 */
	private replaceIfMatched(oldParent: Node): Node {
		const replaceOldTags = this.j.o.cleanHTML.replaceOldTags;

		if (!replaceOldTags || !Dom.isHTMLElement(oldParent)) {
			return oldParent;
		}

		const tagName: string =
			replaceOldTags[oldParent.nodeName.toLowerCase()] ||
			replaceOldTags[oldParent.nodeName];

		if (tagName) {
			return Dom.replace(
				oldParent as HTMLElement,
				tagName as HTMLTagNames,
				this.j.createInside,
				true,
				false
			);
		}

		return oldParent;
	}

	/**
	 * Clean HTML code on every change
	 */
	@debounce<Plugin>(ctx => ctx.jodit.o.cleanHTML.timeout)
	private onChangeCleanHTML(): void {
		if (!this.allowEdit()) {
			return;
		}

		const editor = this.j;

		this.onSafeHTML(editor.editor);

		const current = editor.s.current();

		const replaceOldTags = editor.o.cleanHTML.replaceOldTags;

		if (replaceOldTags && current) {
			const tags = keys(replaceOldTags, false) as HTMLTagNames[];

			if (editor.s.isCollapsed()) {
				const oldParent = Dom.closest(current, tags, editor.editor);

				if (oldParent) {
					editor.s.save();
					this.replaceIfMatched(oldParent);
					editor.s.restore();
				}
			}
		}

		this.walker.setWork(editor.editor);
		this.currentSelectionNode = current;
	}

	private currentSelectionNode: Nullable<Node> = null;

	private walker: LazyWalker = new LazyWalker(this.j.async, {
		timeout: this.j.o.cleanHTML.timeout
	});

	@hook('ready')
	protected startWalker(): void {
		this.walker
			.on('visit', this.visitNode)
			.on('end', (affected: boolean): void => {
				this.j.e.fire(
					affected
						? 'internalChange finishedCleanHTMLWorker'
						: 'finishedCleanHTMLWorker'
				);
			});
	}

	@autobind
	private visitNode(nodeElm: Node): boolean {
		let hasChanges = false;

		const newNodeElm = this.replaceIfMatched(nodeElm);
		if (nodeElm !== newNodeElm) {
			nodeElm = newNodeElm;
			hasChanges = true;
		}

		if (this.isRemovableNode(nodeElm, this.currentSelectionNode)) {
			Dom.safeRemove(nodeElm);
			return true;
		}

		if (
			this.j.o.cleanHTML.fillEmptyParagraph &&
			Dom.isBlock(nodeElm) &&
			Dom.isEmpty(nodeElm, /^(img|svg|canvas|input|textarea|form|br)$/)
		) {
			const br = this.j.createInside.element('br');
			nodeElm.appendChild(br);
			hasChanges = true;
		}

		const allow = this.allowTagsHash;

		if (
			allow &&
			Dom.isElement(nodeElm) &&
			allow[nodeElm.nodeName] !== true
		) {
			const attrs: NamedNodeMap = (nodeElm as Element).attributes;

			if (attrs && attrs.length) {
				const removeAttrs: string[] = [];

				for (let i = 0; i < attrs.length; i += 1) {
					const attr = allow[nodeElm.nodeName][attrs[i].name];

					if (!attr || (attr !== true && attr !== attrs[i].value)) {
						removeAttrs.push(attrs[i].name);
					}
				}

				if (removeAttrs.length) {
					hasChanges = true;
				}

				removeAttrs.forEach(attr => {
					(nodeElm as Element).removeAttribute(attr);
				});
			}
		}

		return hasChanges;
	}

	private allowEdit(): boolean {
		return !(
			this.j.isInDestruct ||
			!this.j.isEditorMode() ||
			this.j.getReadOnly()
		);
	}

	private allowTagsHash = getHash(this.j.o.cleanHTML.allowTags);
	private denyTagsHash = getHash(this.j.o.cleanHTML.denyTags);

	/**
	 * Remove invisible chars if node has another chars
	 */
	@autobind
	private onKeyUpCleanUp(): void {
		const editor = this.j;

		if (!this.allowEdit()) {
			return;
		}

		const currentNode = editor.s.current();

		if (currentNode) {
			const currentParagraph = Dom.up(
				currentNode,
				Dom.isBlock,
				editor.editor
			);

			if (currentParagraph) {
				Dom.all(currentParagraph, node => {
					if (node && Dom.isText(node)) {
						if (
							node.nodeValue != null &&
							INV_REG().test(node.nodeValue) &&
							node.nodeValue.replace(INV_REG(), '').length !== 0
						) {
							node.nodeValue = node.nodeValue.replace(
								INV_REG(),
								''
							);

							if (
								node === currentNode &&
								editor.s.isCollapsed()
							) {
								editor.s.setCursorAfter(node);
							}
						}
					}
				});
			}
		}
	}

	private beforeCommand = (command: string): void | false => {
		if (command.toLowerCase() === 'removeformat') {
			this.onRemoveFormat();
			return false;
		}
	};

	/**
	 * Command: removeFormat
	 */
	private onRemoveFormat(): void {
		if (this.j.s.isCollapsed()) {
			this.removeFormatForCollapsedSelection();
		} else {
			this.removeFormatForSelection();
		}
	}

	/**
	 * For collapsed selection move cursor outside or split inline block
	 */
	private removeFormatForCollapsedSelection(
		fake?: Node
	): Nullable<Text> | void {
		const { s } = this.j;

		let fakeNode = fake;

		if (!fakeNode) {
			fakeNode = this.j.createInside.fake();
			s.range.insertNode(fakeNode);
			s.range.collapse();
		}

		const mainInline = Dom.furthest(
			fakeNode,
			this.isInlineBlock,
			this.j.editor
		);

		if (mainInline) {
			if (s.cursorOnTheLeft(mainInline)) {
				Dom.before(mainInline, fakeNode);
			} else if (s.cursorOnTheRight(mainInline)) {
				Dom.after(mainInline, fakeNode);
			} else {
				const leftHand = s.splitSelection(mainInline);
				leftHand && Dom.after(leftHand, fakeNode);
			}
		}

		if (!fake) {
			s.setCursorBefore(fakeNode);
			Dom.safeRemove(fakeNode);
		}
	}

	/**
	 * Element has inline display mode
	 */
	@autobind
	private isInlineBlock(node: Nullable<Node>): node is Node {
		return Dom.isInlineBlock(node) && !Dom.isTag(node, INSEPARABLE_TAGS);
	}

	/**
	 * Remove formatting for all selected elements
	 */
	private removeFormatForSelection(): void {
		const { s, editor } = this.j,
			{ range } = s,
			left = range.cloneRange(),
			right = range.cloneRange(),
			fakeLeft = this.j.createInside.fake(),
			fakeRight = this.j.createInside.fake();

		left.collapse(true);
		right.collapse(false);

		left.insertNode(fakeLeft);
		right.insertNode(fakeRight);

		range.setStartBefore(fakeLeft);
		range.collapse(true);
		s.selectRange(range);
		this.removeFormatForCollapsedSelection(fakeLeft);

		range.setEndAfter(fakeRight);
		range.collapse(false);
		s.selectRange(range);
		this.removeFormatForCollapsedSelection(fakeRight);

		const shouldUnwrap: Node[] = [];

		Dom.between(fakeLeft, fakeRight, node => {
			if (this.isInlineBlock(node)) {
				shouldUnwrap.push(node);
			}

			if (Dom.isElement(node) && attr(node, 'style')) {
				attr(node, 'style', null);
			}
		});

		shouldUnwrap.forEach(node => Dom.unwrap(node));

		const clearParent = (node: Node, left: boolean): true | void => {
			if (!findNotEmptySibling(node, left)) {
				const pn = node.parentNode as Element;

				if (pn && pn !== editor && attr(pn, 'style')) {
					attr(pn, 'style', null);
					clearParent(pn, left);

					return true;
				}
			}
		};

		clearParent(fakeLeft, true) && clearParent(fakeRight, false);

		range.setStartAfter(fakeLeft);
		range.setEndBefore(fakeRight);
		s.selectRange(range);

		Dom.safeRemove(fakeLeft);
		Dom.safeRemove(fakeRight);
	}

	private isRemovableNode(node: Node, current: Nullable<Node>): boolean {
		const allow = this.allowTagsHash;

		if (
			!Dom.isText(node) &&
			((allow && !allow[node.nodeName]) ||
				(this.denyTagsHash && this.denyTagsHash[node.nodeName]))
		) {
			return true;
		}

		// remove extra br
		if (
			current &&
			Dom.isTag(node, 'br') &&
			hasNotEmptyTextSibling(node) &&
			!hasNotEmptyTextSibling(node, true) &&
			Dom.up(node, Dom.isBlock, this.j.editor) !==
				Dom.up(current, Dom.isBlock, this.j.editor)
		) {
			return true;
		}

		return (
			this.j.o.cleanHTML.removeEmptyElements &&
			current != null &&
			Dom.isElement(node) &&
			node.nodeName.match(IS_INLINE) != null &&
			!Dom.isTemporary(node) &&
			trim((node as Element).innerHTML).length === 0 &&
			!Dom.isOrContains(node, current)
		);
	}

	/**
	 * Event handler when manually assigning a value to the HTML editor.
	 */
	@watch(':beforeSetNativeEditorValue')
	protected onBeforeSetNativeEditorValue(data: { value: string }): boolean {
		const sandBox = this.j.createInside.div();
		sandBox.innerHTML = data.value;
		this.onSafeHTML(sandBox);
		data.value = sandBox.innerHTML;
		return false;
	}

	@watch(':safeHTML')
	protected onSafeHTML(sandBox: HTMLElement): void {
		safeHTML(sandBox, this.j.o.cleanHTML);
	}

	/** @override */
	protected override beforeDestruct(): void {
		this.j.e.off('.cleanHtml');
		this.walker.destruct();
	}
}
