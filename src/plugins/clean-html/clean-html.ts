/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/clean-html/README.md]]
 * @packageDocumentation
 * @module plugins/clean-html
 */

import type { IJodit, Nullable } from 'jodit/types';
import { autobind, hook, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { LazyWalker } from 'jodit/core/dom/lazy-walker';
import { pluginSystem } from 'jodit/core/global';
import { safeHTML } from 'jodit/core/helpers/html/safe-html';
import { Plugin } from 'jodit/core/plugin/plugin';

import './config';

import { replaceOldTags } from './helpers/visitor/filters/replace-old-tags';
import {
	getHash,
	removeFormatForCollapsedSelection,
	removeFormatForSelection,
	visitNodeWalker
} from './helpers';

/**
 * Clean HTML after removeFormat and insertHorizontalRule command
 */
const TRAILING_BR_BLOCKS =
	'p, div, li, td, th, h1, h2, h3, h4, h5, h6, blockquote';

export class cleanHtml extends Plugin {
	/** @override */
	override buttons: Plugin['buttons'] = [
		{
			name: 'eraser',
			group: 'font-style'
		}
	];

	constructor(jodit: IJodit) {
		super(jodit);

		// `@watch` binds once the plugin is ready, which is after the initial
		// value has already gone into the editor. The handlers that keep
		// markup out of the live tree have to be there from the start, or
		// event handlers in a textarea's content run before anything
		// sanitises them.
		jodit.e
			.on('safeHTML', this.onSafeHTML)
			.on('beforeSetNativeEditorValue', this.onBeforeSetNativeEditorValue)
			.on('afterSetNativeEditorValue', this.onAfterSetNativeEditorValue);
	}

	/** @override */
	protected override afterInit(): void {
		// The walker's own `:afterInit` watcher is bound on that very event,
		// so without this the first pass waited for the first key or click
		this.onChangeCleanHTML();
	}

	private get isEditMode(): boolean {
		return !(
			this.j.isInDestruct ||
			!this.j.isEditorMode() ||
			this.j.getReadOnly()
		);
	}

	/**
	 * Clean HTML code on every change
	 */
	@watch([':change', ':afterSetMode', ':afterInit', ':mousedown', ':keydown'])
	protected onChangeCleanHTML(): void {
		if (!this.isEditMode) {
			return;
		}

		const editor = this.j;

		this.walker.setWork(editor.editor);
		this.currentSelectionNode = editor.s.current();
	}

	private currentSelectionNode: Nullable<Node> = null;

	private walker: LazyWalker = new LazyWalker(this.j.async, {
		timeout: this.j.o.cleanHTML.timeout
	});

	@hook('ready')
	protected startWalker(): void {
		const { jodit } = this;

		const allow = getHash(this.j.o.cleanHTML.allowTags);
		const deny = getHash(this.j.o.cleanHTML.denyTags);

		this.walker
			.on('visit', (node: Node) =>
				visitNodeWalker(
					jodit,
					node,
					allow,
					deny,
					this.currentSelectionNode
				)
			)
			.on('end', (affected: boolean): void => {
				this.j.e.fire(
					affected
						? 'internalChange finishedCleanHTMLWorker'
						: 'finishedCleanHTMLWorker'
				);
			});
	}

	@watch(':beforeCommand')
	protected beforeCommand(command: string): void | false {
		if (command.toLowerCase() === 'removeformat') {
			if (this.j.s.isCollapsed()) {
				removeFormatForCollapsedSelection(this.j);
			} else {
				removeFormatForSelection(this.j);
			}

			return false;
		}
	}

	/**
	 * The value was sanitized in an inert document and has just been re-parsed
	 * into the live editor with scripting on. Where the two parsers disagree
	 * (`<noscript>`, raw-text elements), markup that was inert text a moment
	 * ago is a real element now, so the live tree is sanitized once more, in
	 * the same call stack, before any handler it might carry can fire.
	 */
	@autobind
	protected onAfterSetNativeEditorValue(): void {
		safeHTML(this.j.editor, this.j.o.cleanHTML);
	}

	/**
	 * Event handler when manually assigning a value to the HTML editor.
	 */
	@autobind
	protected onBeforeSetNativeEditorValue(data: { value: string }): boolean {
		const [sandBox, iframe] = this.j.o.cleanHTML.useIframeSandbox
			? this.j.createInside.sandbox()
			: [
					// an inert document never loads sub-resources, so the
					// images in the value are not re-requested from the
					// server on every assignment (e.g. on each change in
					// jodit-react). See #1237
					this.j.od.implementation.createHTMLDocument('').body
				];

		sandBox.innerHTML = data.value;
		this.j.e.fire('safeHTML', sandBox);
		this.__replaceOldTags(sandBox);
		data.value = sandBox.innerHTML;
		safeHTML(sandBox, { safeJavaScriptLink: true, removeOnError: true });
		Dom.safeRemove(iframe);
		return false;
	}

	/**
	 * Replace old tags (`<b>` with `<strong>`, `<i>` with `<em>`) in an
	 * assigned value straight away. The walker would get to them only after
	 * every node before them, seconds later on a long document, and until
	 * then Bold does not treat `<b>` as bold, and the swap can move the caret.
	 */
	private __replaceOldTags(box: HTMLElement): void {
		const { replaceOldTags: list, disableCleanFilter } = this.j.o.cleanHTML;

		if (!list || disableCleanFilter?.has('replaceOldTags')) {
			return;
		}

		Dom.each(box, node => {
			replaceOldTags(this.j, node, false);
		});
	}

	/**
	 * Collapse a value that holds only a single empty block (e.g.
	 * `<p><br></p>` left after deleting all content) to an empty string —
	 * opt-in via `cleanHTML.collapseEmptyValueToEmptyString`. See #1149
	 */
	@watch(':afterGetValueFromEditor')
	protected onAfterGetValueFromEditor(data: { value: string }): void {
		this.__singleQuotesInFontFamily(data);
		this.__removeTrailingBr(data);

		if (!this.j.o.cleanHTML.collapseEmptyValueToEmptyString) {
			return;
		}

		// Only a text block can be an empty caret container; a lone video,
		// iframe or icon has no children but is content in itself
		const lone = /^<([a-z][a-z0-9]*)\b[^>]*>(?:<br\/?>)?<\/\1>$/i.exec(
			data.value.trim()
		);

		if (lone && /^(p|div|h[1-6]|blockquote|pre)$/i.test(lone[1])) {
			data.value = '';
		}
	}

	/**
	 * Rewrite double-quoted font names inside `style` attributes with single
	 * quotes. The DOM always serialises them as `&quot;…&quot;`, and back ends
	 * that HTML-decode the value before storing it then produce
	 * `style="font-family: "Open Sans", …"` — broken markup. Single quotes
	 * survive that round trip. Names that already contain an apostrophe are
	 * left alone.
	 */
	/**
	 * Drop a `<br>` that is the last node of a block (or of the value) and
	 * follows other content — the caret placeholder browsers leave behind
	 * after typing into an empty block. An empty block (`<p><br></p>`) and a
	 * deliberate empty line (`text<br><br>`) are kept.
	 */
	private __removeTrailingBr(data: { value: string }): void {
		if (!this.j.o.cleanHTML.removeTrailingBr || !/<br/i.test(data.value)) {
			return;
		}

		const box = this.j.c.div();
		box.innerHTML = data.value;

		const blocks: Element[] = [
			box,
			...box.querySelectorAll(TRAILING_BR_BLOCKS)
		];

		blocks.forEach(block => {
			const last = block.lastChild;

			if (!Dom.isTag(last, 'br')) {
				return;
			}

			const prev = last.previousSibling;

			if (!prev || Dom.isTag(prev, 'br')) {
				return;
			}

			if (
				Dom.isText(prev) &&
				!prev.nodeValue?.trim() &&
				!prev.previousSibling
			) {
				return;
			}

			Dom.safeRemove(last);
		});

		data.value = box.innerHTML;
	}

	private __singleQuotesInFontFamily(data: { value: string }): void {
		if (
			!this.j.o.cleanHTML.singleQuotesInFontFamily ||
			!data.value.includes('&quot;')
		) {
			return;
		}

		data.value = data.value.replace(
			/\sstyle="([^"]*)"/gi,
			(attribute: string, css: string): string => {
				if (!css.includes('&quot;') || !/font-family/i.test(css)) {
					return attribute;
				}

				const normalized = css.replace(
					// `&quot;` itself ends with `;`, so the entity has to be
					// consumed as a unit or the declaration stops inside it.
					/font-family\s*:(?:&quot;|[^;])*/gi,
					(declaration: string): string =>
						declaration.includes("'")
							? declaration
							: declaration.replace(/&quot;/g, "'")
				);

				return attribute.replace(css, normalized);
			}
		);
	}

	@autobind
	protected onSafeHTML(sandBox: HTMLElement): void {
		const sanitizer = this.j.o.cleanHTML.sanitizer;

		if (sanitizer) {
			sandBox.innerHTML = sanitizer(sandBox.innerHTML);
		}

		safeHTML(sandBox, this.j.o.cleanHTML);
	}

	/** @override */
	protected override beforeDestruct(): void {
		this.j.e
			.off('safeHTML', this.onSafeHTML)
			.off(
				'beforeSetNativeEditorValue',
				this.onBeforeSetNativeEditorValue
			)
			.off('afterSetNativeEditorValue', this.onAfterSetNativeEditorValue);

		this.walker.destruct();
	}
}

pluginSystem.add('cleanHtml', cleanHtml);
