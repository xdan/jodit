/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	HTMLTagNames,
	IDictionary,
	IJodit,
	Nullable,
	IPlugin
} from '../../types';
import { Config } from '../../config';
import {
	INVISIBLE_SPACE_REG_EXP as INV_REG,
	IS_INLINE,
	INSEPARABLE_TAGS
} from '../../core/constants';
import { Dom } from '../../modules';
import { isString, keys, trim } from '../../core/helpers';
import { Plugin } from '../../core/plugin';
import { autobind, debounce } from '../../core/decorators';
import { findNotEmptySibling } from '../keyboard/helpers';

/**
 * @property {object} cleanHTML {@link cleanHtml|cleanHtml}'s options
 * @property {boolean} cleanHTML.cleanOnPaste=true clean pasted html
 * @property {boolean} cleanHTML.replaceNBSP=true Replace &amp;nbsp; toWYSIWYG plain space
 * @property {boolean} cleanHTML.allowTags=false The allowTags option defines which elements will remain in the
 * edited text when the editor saves. You can use this toWYSIWYG limit the returned HTML toWYSIWYG a subset.
 * @example
 * ```javascript
 * var jodit = new Jodit('#editor', {
 *    cleanHTML: {
 *       cleanOnPaste: false
 *    }
 * });
 * ```
 * @example
 * ```javascript
 * var editor = Jodit('#editor', {
 *     cleanHTML: {
 *         allowTags: 'p,a[href],table,tr,td, img[src=1.png]' // allow only <p>,<a>,<table>,<tr>,<td>,<img> tags and
 *         for <a> allow only `href` attribute and <img> allow only `src` attribute == '1.png'
 *     }
 * });
 * editor.value = 'Sorry! <strong>Goodby</strong>\
 * <span>mr.</span> <a style="color:red" href="http://xdsoft.net">Freeman</a>';
 * console.log(editor.value); //Sorry! <a href="http://xdsoft.net">Freeman</a>
 * ```
 *
 * @example
 * ```javascript
 * var editor = Jodit('#editor', {
 *     cleanHTML: {
 *         allowTags: {
 *             p: true,
 *             a: {
 *                 href: true
 *             },
 *             table: true,
 *             tr: true,
 *             td: true,
 *             img: {
 *                 src: '1.png'
 *             }
 *         }
 *     }
 * });
 * ```
 */
declare module '../../config' {
	interface Config {
		cleanHTML: {
			timeout: number;
			replaceNBSP: boolean;
			fillEmptyParagraph: boolean;
			removeEmptyElements: boolean;
			replaceOldTags: IDictionary<HTMLTagNames> | false;
			allowTags: false | string | IDictionary<string>;
			denyTags: false | string | IDictionary<string>;
		};
	}
}

Config.prototype.cleanHTML = {
	timeout: 300,
	removeEmptyElements: true,
	fillEmptyParagraph: true,
	replaceNBSP: true,
	replaceOldTags: {
		i: 'em',
		b: 'strong'
	},
	allowTags: false,
	denyTags: false
};

Config.prototype.controls.eraser = {
	command: 'removeFormat',
	tooltip: 'Clear Formatting'
};

/**
 * Clean HTML after removeFormat and insertHorizontalRule command
 */
export class cleanHtml extends Plugin<IJodit> {
	/** @override */
	buttons: Plugin['buttons'] = [
		{
			name: 'eraser',
			group: 'font-style'
		}
	];

	/** @override */
	protected afterInit(jodit: IJodit): void {
		jodit.e
			.off('.cleanHtml')
			.on(
				'change.cleanHtml afterSetMode.cleanHtml afterInit.cleanHtml mousedown.cleanHtml keydown.cleanHtml',
				this.onChangeCleanHTML
			)
			.on('keyup.cleanHtml', this.onKeyUpCleanUp)
			.on('beforeCommand.cleanHtml', this.beforeCommand);
	}

	/**
	 * Clean HTML code on every change
	 */
	@debounce<IPlugin<IJodit>>(ctx => ctx.jodit.o.cleanHTML.timeout)
	private onChangeCleanHTML(): void {
		if (!this.allowEdit()) {
			return;
		}

		const editor = this.j;

		const current = editor.s.current();

		const replaceOldTags = editor.o.cleanHTML.replaceOldTags;

		if (replaceOldTags && current) {
			const tags = keys(replaceOldTags, false) as HTMLTagNames[];

			if (editor.s.isCollapsed()) {
				const oldParent = Dom.closest(current, tags, editor.editor);

				if (oldParent) {
					editor.s.save();

					const tagName: string =
						replaceOldTags[oldParent.nodeName.toLowerCase()] ||
						replaceOldTags[oldParent.nodeName];

					Dom.replace(
						oldParent as HTMLElement,
						tagName as HTMLTagNames,
						editor.createInside,
						true,
						false
					);

					editor.s.restore();
				}
			}
		}

		let node: Node | null = null;

		if (editor.editor.firstChild) {
			node = editor.editor.firstChild as Element;
		}

		const remove: Node[] = [];
		const work = this.visitNode(node, current, remove);

		remove.forEach(Dom.safeRemove);

		if (remove.length || work) {
			editor.events && editor.e.fire('synchro');
		}
	}

	private allowEdit(): boolean {
		return !(
			this.j.isInDestruct ||
			!this.j.isEditorMode() ||
			this.j.getReadOnly()
		);
	}

	private visitNode = (
		nodeElm: Nullable<Element | Node>,
		current: Nullable<Node>,
		remove: Node[]
	): boolean => {
		let work = false;

		if (!nodeElm) {
			return work;
		}

		if (this.isRemovableNode(nodeElm, current)) {
			remove.push(nodeElm);
			return this.visitNode(nodeElm.nextSibling, current, remove);
		}

		if (
			this.j.o.cleanHTML.fillEmptyParagraph &&
			Dom.isBlock(nodeElm, this.j.ew) &&
			Dom.isEmpty(nodeElm, /^(img|svg|canvas|input|textarea|form|br)$/)
		) {
			const br = this.j.createInside.element('br');

			nodeElm.appendChild(br);
			work = true;
		}

		const allow = this.allowTagsHash;

		if (allow && allow[nodeElm.nodeName] !== true) {
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
					work = true;
				}

				removeAttrs.forEach(attr => {
					(nodeElm as Element).removeAttribute(attr);
				});
			}
		}

		work = this.visitNode(nodeElm.firstChild, current, remove) || work;
		work = this.visitNode(nodeElm.nextSibling, current, remove) || work;

		return work;
	};

	private static getHash(
		tags: false | string | IDictionary<string>
	): IDictionary | false {
		const attributesReg = /([^[]*)\[([^\]]+)]/;
		const seperator = /[\s]*,[\s]*/,
			attrReg = /^(.*)[\s]*=[\s]*(.*)$/;
		const tagsHash: IDictionary = {};

		if (isString(tags)) {
			tags.split(seperator).map((elm: string) => {
				elm = trim(elm);
				const attr: RegExpExecArray | null = attributesReg.exec(elm),
					allowAttributes: IDictionary<string | boolean> = {},
					attributeMap = (attrName: string) => {
						attrName = trim(attrName);

						const val: string[] | null = attrReg.exec(attrName);

						if (val) {
							allowAttributes[val[1]] = val[2];
						} else {
							allowAttributes[attrName] = true;
						}
					};

				if (attr) {
					const attr2: string[] = attr[2].split(seperator);
					if (attr[1]) {
						attr2.forEach(attributeMap);
						tagsHash[attr[1].toUpperCase()] = allowAttributes;
					}
				} else {
					tagsHash[elm.toUpperCase()] = true;
				}
			});

			return tagsHash;
		}

		if (tags) {
			Object.keys(tags).forEach(tagName => {
				tagsHash[tagName.toUpperCase()] = tags[tagName];
			});

			return tagsHash;
		}

		return false;
	}

	private allowTagsHash: IDictionary | false = cleanHtml.getHash(
		this.j.o.cleanHTML.allowTags
	);

	private denyTagsHash: IDictionary | false = cleanHtml.getHash(
		this.j.o.cleanHTML.denyTags
	);

	/**
	 * Remove invisible chars if node has another chars
	 */
	private onKeyUpCleanUp = () => {
		const editor = this.j;

		if (!this.allowEdit()) {
			return;
		}

		const currentNode = editor.s.current();

		if (currentNode) {
			const currentParagraph = Dom.up(
				currentNode,
				node => Dom.isBlock(node, editor.ew),
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
	};

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
	 * @param node
	 */
	@autobind
	private isInlineBlock(node: Nullable<Node>): node is Node {
		return Dom.isInlineBlock(node) && !Dom.isTag(node, INSEPARABLE_TAGS);
	}

	/**
	 * Remove formatting for all selected elements
	 */
	private removeFormatForSelection(): void {
		const { s } = this.j,
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
		});

		shouldUnwrap.forEach(node => Dom.unwrap(node));

		const clearParent = (node: Node, left: boolean): true | void => {
			if (!findNotEmptySibling(node, left)) {
				const pn = node.parentNode as Element;

				if (pn && pn !== s.area && pn.getAttribute('style')) {
					pn.removeAttribute('style');
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
			cleanHtml.hasNotEmptyTextSibling(node) &&
			!cleanHtml.hasNotEmptyTextSibling(node, true) &&
			Dom.up(
				node,
				node => Dom.isBlock(node, this.j.ew),
				this.j.editor
			) !==
				Dom.up(
					current,
					node => Dom.isBlock(node, this.j.ew),
					this.j.editor
				)
		) {
			return true;
		}

		return (
			this.j.o.cleanHTML.removeEmptyElements &&
			current != null &&
			Dom.isElement(node) &&
			node.nodeName.match(IS_INLINE) != null &&
			!this.j.s.isMarker(node) &&
			trim((node as Element).innerHTML).length === 0 &&
			!Dom.isOrContains(node, current)
		);
	}

	private static hasNotEmptyTextSibling(node: Node, next = false): boolean {
		let prev: Node | null = next ? node.nextSibling : node.previousSibling;

		while (prev) {
			if (Dom.isElement(prev) || !Dom.isEmptyTextNode(prev)) {
				return true;
			}

			prev = next ? prev.nextSibling : prev.previousSibling;
		}

		return false;
	}

	/** @override */
	protected beforeDestruct(): void {
		this.j.e.off('.cleanHtml');
	}
}
