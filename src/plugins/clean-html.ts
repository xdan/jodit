/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import {
	INVISIBLE_SPACE,
	INVISIBLE_SPACE_REG_EXP,
	INVISIBLE_SPACE_REG_EXP as INV_REG,
	SPACE_REG_EXP,
	IS_INLINE
} from '../constants';
import { Dom } from '../modules/Dom';
import { normalizeNode, trim } from '../modules/helpers/';
import { HTMLTagNames, IDictionary, IJodit } from '../types';
import { Plugin } from '../modules/Plugin';

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
 *         for <a> allow only `href` attribute and <img> allow only `src` atrribute == '1.png'
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
declare module '../Config' {
	interface Config {
		cleanHTML: {
			timeout: number;
			replaceNBSP: boolean;
			fillEmptyParagraph: boolean;
			removeEmptyElements: boolean;
			replaceOldTags: IDictionary<string> | false;
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
export class cleanHtml extends Plugin {
	protected afterInit(jodit: IJodit): void {
		jodit.events
			.off('.cleanHtml')
			.on(
				'change.cleanHtml afterSetMode.cleanHtml afterInit.cleanHtml mousedown.cleanHtml keydown.cleanHtml',
				jodit.async.debounce(
					this.onChange,
					jodit.options.cleanHTML.timeout
				)
			)
			.on('keyup.cleanHtml', this.onKeyUpCleanUp)
			.on('beforeCommand.cleanHtml', this.beforeCommand)
			.on('afterCommand.cleanHtml', this.afterCommand);
	}

	private onChange = () => {
		if (!this.allowEdit()) {
			return;
		}

		const editor = this.jodit;

		const current = editor.selection.current();

		const replaceOldTags = editor.options.cleanHTML.replaceOldTags;

		if (replaceOldTags && current) {
			const tags = Object.keys(replaceOldTags).join('|');

			if (editor.selection.isCollapsed()) {
				const oldParent: Node | false = Dom.closest(
					current,
					tags,
					editor.editor
				);

				if (oldParent) {
					const selInfo = editor.selection.save(),
						tagName: string =
							replaceOldTags[oldParent.nodeName.toLowerCase()] ||
							replaceOldTags[oldParent.nodeName];

					Dom.replace(
						oldParent as HTMLElement,
						tagName as HTMLTagNames,
						editor.create.inside,
						true,
						false
					);

					editor.selection.restore(selInfo);
				}
			}
		}

		let node: Node | null = null;

		if (editor.editor.firstChild) {
			node = editor.editor.firstChild as Element;
		}

		const remove: Node[] = [];
		const work = this.checkNode(node, current, remove);

		remove.forEach(Dom.safeRemove);

		if (remove.length || work) {
			editor.events && editor.events.fire('syncho');
		}
	};

	private allowEdit(): boolean {
		return !(
			this.jodit.isInDestruct ||
			!this.jodit.isEditorMode() ||
			this.jodit.getReadOnly()
		);
	}

	private checkNode = (
		nodeElm: Element | Node | null,
		current: Node | false,
		remove: Node[]
	): boolean => {
		let work = false;

		if (!nodeElm) {
			return work;
		}

		if (this.isRemovableNode(nodeElm, current)) {
			remove.push(nodeElm);
			return this.checkNode(nodeElm.nextSibling, current, remove);
		}

		if (
			this.jodit.options.cleanHTML.fillEmptyParagraph &&
			Dom.isBlock(nodeElm, this.jodit.editorWindow) &&
			Dom.isEmpty(nodeElm, /^(img|svg|canvas|input|textarea|form|br)$/)
		) {
			const br = this.jodit.create.inside.element('br');

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

		work = this.checkNode(nodeElm.firstChild, current, remove) || work;
		work = this.checkNode(nodeElm.nextSibling, current, remove) || work;

		return work;
	};

	private static getHash(
		tags: false | string | IDictionary<string>
	): IDictionary | false {
		const attributesReg = /([^\[]*)\[([^\]]+)]/;
		const seperator = /[\s]*,[\s]*/,
			attrReg = /^(.*)[\s]*=[\s]*(.*)$/;
		const tagsHash: IDictionary = {};

		if (typeof tags === 'string') {
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
		this.jodit.options.cleanHTML.allowTags
	);

	private denyTagsHash: IDictionary | false = cleanHtml.getHash(
		this.jodit.options.cleanHTML.denyTags
	);

	// remove invisible chars if node has another chars
	private onKeyUpCleanUp = () => {
		const editor = this.jodit;

		if (!this.allowEdit()) {
			return;
		}

		const currentNode = editor.selection.current();

		if (currentNode) {
			const currentParagraph: Node | false = Dom.up(
				currentNode,
				node => Dom.isBlock(node, editor.editorWindow),
				editor.editor
			);

			if (currentParagraph) {
				Dom.all(currentParagraph, node => {
					if (node && Dom.isText(node)) {
						if (
							node.nodeValue !== null &&
							INV_REG.test(node.nodeValue) &&
							node.nodeValue.replace(INV_REG, '').length !== 0
						) {
							node.nodeValue = node.nodeValue.replace(
								INV_REG,
								''
							);

							if (
								node === currentNode &&
								editor.selection.isCollapsed()
							) {
								editor.selection.setCursorAfter(node);
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

	private afterCommand = (command: string) => {
		if (command.toLowerCase() === 'inserthorizontalrule') {
			this.onInsertHorizontalLine();
			return;
		}
	};

	private onInsertHorizontalLine() {
		const hr: HTMLHRElement | null = this.jodit.editor.querySelector(
			'hr[id=null]'
		);

		if (hr) {
			let node = Dom.next(
				hr,
				node => Dom.isBlock(node, this.jodit.editorWindow),
				this.jodit.editor,
				false
			) as Node | null;

			if (!node) {
				node = this.jodit.create.inside.element(
					this.jodit.options.enter
				);

				if (node) {
					Dom.after(hr, node as HTMLElement);
				}
			}

			this.jodit.selection.setCursorIn(node);
		}
	}

	private onRemoveFormat() {
		const sel = this.jodit.selection;
		const current = sel.current();

		if (!current) {
			return;
		}

		const up = (node: Node | null) =>
			node && Dom.up(node, Dom.isInlineBlock, this.jodit.editor);

		let parentNode = up(current),
			anotherParent = parentNode;

		while (anotherParent) {
			anotherParent = up(anotherParent.parentNode);

			if (anotherParent) {
				parentNode = anotherParent;
			}
		}

		const collapsed = sel.isCollapsed();

		const range = sel.range;

		let fragment: DocumentFragment | null = null;

		if (!collapsed) {
			fragment = range.extractContents();
		}

		if (parentNode) {
			const tmp = this.jodit.create.inside.text(INVISIBLE_SPACE);
			range.insertNode(tmp);
			const insideParent = Dom.isOrContains(parentNode, tmp, true);
			Dom.safeRemove(tmp);
			range.collapse(true);

			if (
				insideParent &&
				parentNode.parentNode &&
				parentNode.parentNode !== fragment
			) {
				const second = this.jodit.selection.splitSelection(
					parentNode as HTMLElement
				);
				this.jodit.selection.setCursorAfter(second || parentNode);

				if (Dom.isEmpty(parentNode)) {
					Dom.safeRemove(parentNode);
				}
			}
		}

		if (fragment) {
			sel.insertNode(this.cleanFragment(fragment));
		}
	}

	private cleanFragment(fragment: Node): Node {
		Dom.each(fragment, node => {
			if (Dom.isElement(node) && IS_INLINE.test(node.nodeName)) {
				this.cleanFragment(node);
				Dom.unwrap(node);
			}
		});

		return fragment;
	}

	/**
	 * @deprecated
	 * @param elm
	 * @param onlyRemoveFont
	 */
	private cleanNode = (
		elm: Node,
		onlyRemoveFont: boolean = false
	): false | void => {
		switch (elm.nodeType) {
			case Node.ELEMENT_NODE:
				Dom.each(elm, child => {
					this.cleanNode(child, onlyRemoveFont);
				});

				if (Dom.isTag(elm, 'font')) {
					Dom.unwrap(elm);
				} else if (!onlyRemoveFont) {
					// clean some "style" attributes in selected range
					Array.from((elm as Element).attributes).forEach(
						(attr: Attr) => {
							if (
								['src', 'href', 'rel', 'content'].indexOf(
									attr.name.toLowerCase()
								) === -1
							) {
								(elm as Element).removeAttribute(attr.name);
							}
						}
					);

					normalizeNode(elm);
				}
				break;

			case Node.TEXT_NODE:
				if (
					!onlyRemoveFont &&
					this.jodit.options.cleanHTML.replaceNBSP &&
					Dom.isText(elm) &&
					elm.nodeValue !== null &&
					elm.nodeValue.match(SPACE_REG_EXP)
				) {
					elm.nodeValue = elm.nodeValue
						.replace(INVISIBLE_SPACE_REG_EXP, '')
						.replace(SPACE_REG_EXP, ' ');
				}
				break;

			default:
				Dom.safeRemove(elm);
		}
	};

	private isRemovableNode(node: Node, current: Node | false): boolean {
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
				node => Dom.isBlock(node, this.jodit.editorWindow),
				this.jodit.editor
			) !==
				Dom.up(
					current,
					node => Dom.isBlock(node, this.jodit.editorWindow),
					this.jodit.editor
				)
		) {
			return true;
		}

		return (
			this.jodit.options.cleanHTML.removeEmptyElements &&
			current !== false &&
			Dom.isElement(node) &&
			node.nodeName.match(IS_INLINE) !== null &&
			!this.jodit.selection.isMarker(node) &&
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

	protected beforeDestruct(jodit: IJodit): void {
		this.jodit.events.off('.cleanHtml');
	}
}
