/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/image-caption/README.md]]
 * @packageDocumentation
 * @module plugins/image-caption
 */

import type {
	HTMLTagNames,
	IJodit,
	MediaWrapper,
	Nullable,
	SnapshotType
} from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { autobind, debounce, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { getContainer, pluginSystem } from 'jodit/core/global';
import {
	attr,
	call,
	clearHAlign,
	css,
	getAlignClasses,
	getCaptionedImage,
	getCaptionWrapper,
	getHAlign,
	getImageCaption,
	hAlignElement,
	isNumeric,
	toArray
} from 'jodit/core/helpers';
import { cssInline } from 'jodit/core/helpers/utils/css';
import { Plugin } from 'jodit/core/plugin/plugin';
import { isMoved } from 'jodit/core/selection/helpers';

import './config';

const MARGINS = [
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left'
] as const;

const ARROWS = new Set([
	consts.KEY_UP,
	consts.KEY_DOWN,
	consts.KEY_LEFT,
	consts.KEY_RIGHT
]);

// Blocks that only hold text, which a block wrapper can't go inside
const TEXT_BLOCK = /^(P|H[1-6]|PRE)$/i;

// They would replace the caption with a heading, quote or list
const BLOCK_COMMANDS = new Set([
	'formatblock',
	'insertorderedlist',
	'insertunorderedlist'
]);

const PLACEHOLDER = 'data-jodit-placeholder';

/**
 * Jodit's focus colour round a caption being typed in, in place of the
 * browser's, and a placeholder in a blank caption. `:where` leaves both for
 * the content's own styles to change
 */
const CAPTION_STYLE =
	':where(.jodit-wysiwyg [contenteditable=false] [contenteditable=true]:focus){outline:1px solid var(--jd-color-border-selected,#1e88e5)}' +
	`:where(.jodit-wysiwyg [${PLACEHOLDER}]){position:relative}` +
	`:where(.jodit-wysiwyg [${PLACEHOLDER}])::before{position:absolute;top:0;right:0;left:0;padding:inherit;color:var(--jd-color-placeholder,#a5a5a5);content:attr(${PLACEHOLDER});pointer-events:none}`;

/**
 * Captions images: wraps an image in `imageCaption`'s elements and back, and
 * keeps the caret in the caption
 */
export class imageCaption extends Plugin {
	/** @override */
	protected afterInit(jodit: IJodit): void {
		// It goes in the editing document, so iframe mode has it whatever `iframeStyle` holds
		getContainer(jodit, 'imageCaption', 'style', true).textContent =
			CAPTION_STYLE;

		jodit.e.on('beforeCommandSelectall', this.__onSelectAll, {
			top: true
		});

		this.onChangePlace();
	}

	/**
	 * Gives `image` a caption, or takes it away, as `on` says, or else the
	 * other way round from how it is. Returns the caption it gave, or null
	 * when it took one away
	 */
	@watch(':toggleImageCaption')
	protected onToggleImageCaption(
		image: HTMLImageElement,
		on?: boolean
	): Nullable<HTMLElement> | void {
		const wrapper = getCaptionWrapper(this.j, image);

		if (wrapper && on !== true) {
			const fresh = this.__freshCaption(wrapper);

			if (fresh) {
				this.__unrecorded(() => this.__restore(fresh));
			} else {
				this.__uncaption(wrapper, image);
			}

			return null;
		}

		if (!wrapper && on !== false) {
			return this.__caption(image);
		}
	}

	/**
	 * The caption given last, while nothing has changed round it and it's
	 * still blank, so taking it off can put everything back as it was
	 */
	private __fresh: Nullable<FreshCaption> = null;

	private __freshCaption(wrapper: HTMLElement): Nullable<FreshCaption> {
		const fresh = this.__fresh;

		if (
			!fresh ||
			fresh.wrapper !== wrapper ||
			wrapper.parentNode !== fresh.parent ||
			wrapper.previousSibling !== fresh.previous ||
			wrapper.nextSibling !== fresh.next ||
			shape(wrapper, fresh.image) !== fresh.shape ||
			getImageCaption(this.j, wrapper) !== fresh.caption ||
			!Dom.isEmpty(fresh.caption)
		) {
			return null;
		}

		return fresh;
	}

	/**
	 * Giving a caption isn't a step in the history of its own, as the first
	 * thing typed in it is, so Undo never brings back a blank caption
	 */
	private __caption(image: HTMLImageElement): HTMLElement {
		const { j } = this;
		const { snapshot } = j.history;

		// The steps before it are recorded first
		j.setEditorValue();
		j.e.fire('internalUpdate');

		const before = snapshot.make();
		let fresh!: FreshCaption;

		snapshot.transaction(() => {
			fresh = this.__fresh = { ...this.__wrap(image), before };
			j.setEditorValue();
		});

		// The value is as it was, so no `change` updates the toolbars
		j.e.fire('updateToolbar');

		return fresh.caption;
	}

	/**
	 * Changes the content with no step in the history of its own, so Undo
	 * never brings back a blank caption. A step still open takes it in
	 */
	private __unrecorded(changes: () => void): void {
		const { j } = this;

		j.setEditorValue();
		this.__fresh = null;

		j.history.snapshot.transaction(() => {
			changes();
			j.setEditorValue();
		});

		j.e.fire('internalUpdate');
		j.e.fire('updateToolbar');
	}

	private __wrap(image: HTMLImageElement): Omit<FreshCaption, 'before'> {
		const { j } = this;
		const {
			wrapper: wrapperPart,
			inner,
			caption: captionPart
		} = j.o.imageCaption;

		const link = Dom.closest(image, 'a', j.editor);
		const target =
			link &&
			!link.textContent?.trim() &&
			link.getElementsByTagName('img').length === 1
				? link
				: image;

		const attributes = [attr(image, 'style'), attr(image, 'class')];
		const place = target.parentNode as Node;

		const width =
			cssInline(image, 'width') ||
			pixels(attr(image, 'width')) ||
			(image.offsetWidth ? `${image.offsetWidth}px` : '');

		const classes = getAlignClasses(j, image);
		const align = getHAlign(image, classes);
		clearHAlign(image, classes);

		const wrapper = this.__create(wrapperPart);
		const box = inner ? this.__create(inner) : wrapper;
		const caption = this.__create(captionPart);
		caption.appendChild(j.createInside.element('br'));

		const split = this.__insert(wrapper, target);

		if (box !== wrapper) {
			Dom.append(wrapper, box);
		}

		Dom.append(box, [target, caption]);

		moveMargins(image, wrapper);

		// The wrapper takes the image's width, and the image fills it, so the
		// caption wraps under the image
		if (width) {
			css(wrapper, 'width', width);
			css(image, 'width', '100%');
		}

		hAlignElement(wrapper, align, getAlignClasses(j, wrapper));
		this.__mark(wrapper);

		return {
			caption,
			wrapper,
			image,
			target,
			place,
			split,
			attributes,
			parent: wrapper.parentNode,
			previous: wrapper.previousSibling,
			next: wrapper.nextSibling,
			shape: shape(wrapper, image)
		};
	}

	/**
	 * Puts the image back as it was before its caption: in the line the
	 * caption split, and with its own alignment, margins and width. The image
	 * goes into the part of the line holding the caret, so the caret stays
	 */
	private __restore(fresh: Placed): void {
		const { wrapper, image, target, place, split, attributes } = fresh;

		if (!split) {
			Dom.before(wrapper, target);
		} else if (!split.head && !split.tail) {
			Dom.append(place, target);
			Dom.before(wrapper, split.block);
		} else {
			const { sel } = this.j.s;
			const caret = sel?.rangeCount
				? sel.getRangeAt(0).startContainer
				: null;
			const { head, tail } = split;

			if (head && !(tail && caret && Dom.isOrContains(tail, caret))) {
				Dom.append(head, [target, ...toArray(tail?.childNodes ?? [])]);
				Dom.safeRemove(tail);
			} else if (tail) {
				const first = tail.firstChild;

				[...toArray(head?.childNodes ?? []), target].forEach(node =>
					tail.insertBefore(node, first)
				);
				Dom.safeRemove(head);
			}
		}

		Dom.safeRemove(wrapper);
		attr(image, { style: attributes[0], class: attributes[1] });
	}

	private __uncaption(wrapper: HTMLElement, image: HTMLImageElement): void {
		const { j } = this;

		// Read while the wrapper is still one, with its caption
		const align = getHAlign(wrapper, getAlignClasses(j, wrapper));
		const width = cssInline(wrapper, 'width');

		Dom.safeRemove(getImageCaption(j, wrapper));

		const target = Dom.closest(image, 'a', wrapper) ?? image;

		moveMargins(wrapper, image);

		if (width) {
			css(image, 'width', width);
		}

		hAlignElement(image, align, getAlignClasses(j, image));

		// A block wrapper leaves the image in a paragraph of its own
		if (
			Dom.isBlock(wrapper) &&
			wrapper.parentNode === j.editor &&
			j.o.enter.toLowerCase() !== consts.BR
		) {
			const line = j.createInside.element(j.o.enter);
			Dom.before(wrapper, line);
			Dom.append(line, target);
		} else {
			Dom.before(wrapper, target);
		}

		Dom.safeRemove(wrapper);
	}

	private __create({ tag, className }: MediaWrapper): HTMLElement {
		return this.j.createInside.element(
			tag,
			className ? { class: className } : {}
		);
	}

	/**
	 * Puts `wrapper` where `target` is. A block can't go in a paragraph, so the
	 * paragraph is split round it, and a part left empty goes
	 */
	private __insert(
		wrapper: HTMLElement,
		target: HTMLElement
	): Nullable<Split> {
		const { j } = this;
		const block = Dom.isBlock(wrapper)
			? Dom.closest(target, Dom.isBlock, j.editor)
			: null;

		if (!block || !TEXT_BLOCK.test(block.nodeName)) {
			Dom.before(target, wrapper);
			return null;
		}

		const range = j.ed.createRange();
		range.setStartBefore(block);
		range.setEndBefore(target);
		const start = range.extractContents();

		range.setStartAfter(target);
		range.setEndAfter(block);
		const end = range.extractContents();

		const [head, tail] = [start, end].map((part, index) => {
			const line = part.firstChild as Nullable<HTMLElement>;

			if (!line || Dom.isEmpty(line)) {
				return null;
			}

			call(index ? Dom.after : Dom.before, block, line);
			return line;
		});

		Dom.before(block, wrapper);
		Dom.safeRemove(block);

		return { block, head, tail };
	}

	/**
	 * The wrapper can't be edited, apart from its caption, so typing can't
	 * land between the image and the caption
	 */
	private __mark(wrapper: HTMLElement): void {
		attr(wrapper, 'contenteditable', false);

		const caption = getImageCaption(this.j, wrapper);

		if (caption) {
			attr(caption, 'contenteditable', true);
			this.__placeholder(caption);
		}
	}

	private __placeholder(caption: HTMLElement): void {
		const text = Dom.isEmpty(caption) ? this.j.i18n('Caption') : null;

		if (attr(caption, PLACEHOLDER) !== text) {
			attr(caption, PLACEHOLDER, text);
		}
	}

	@watch([':change', ':afterInit', ':afterSetMode', ':changePlace'])
	@debounce()
	protected onChange(): void {
		const { j } = this;

		if (j.isInDestruct || j.getMode() === consts.MODE_SOURCE) {
			return;
		}

		toArray(
			j.editor.getElementsByTagName(j.o.imageCaption.wrapper.tag)
		).forEach(elm => {
			if (Dom.isHTMLElement(elm) && getCaptionedImage(j, elm)) {
				this.__mark(elm);
			}
		});
	}

	/**
	 * The placeholder goes with the first letter typed or pasted, and comes
	 * back when the last is deleted
	 */
	@watch([':input', ':keyup', ':afterPaste'])
	protected onInput(): void {
		const caption = this.__caretCaption();

		if (caption) {
			this.__placeholder(caption);
		}
	}

	/**
	 * The editor's own attributes stay out of the value, as the caption would
	 * be editable on the page. So does a caption given and left blank, as
	 * leaving it takes it off, so saving at once keeps the image as it was
	 */
	@watch(':afterGetValueFromEditor')
	protected onAfterGetValueFromEditor(data: { value: string }): void {
		if (!data.value.includes('contenteditable')) {
			return;
		}

		const { j } = this;
		const template = j.c.element('template');
		template.innerHTML = data.value;

		const wrappers = (root: ParentNode): HTMLElement[] =>
			toArray(
				root.querySelectorAll<HTMLElement>(j.o.imageCaption.wrapper.tag)
			).filter(wrapper => getCaptionedImage(j, wrapper));

		const copies = wrappers(template.content);
		const fresh = this.__fresh && this.__freshCaption(this.__fresh.wrapper);
		const copy = fresh && copies[wrappers(j.editor).indexOf(fresh.wrapper)];
		const placed = fresh && copy && placedIn(j, fresh, copy);
		let changed = false;

		if (placed) {
			this.__restore(placed);
			changed = true;
		}

		copies.forEach(wrapper => {
			[wrapper, getImageCaption(j, wrapper)].forEach(elm =>
				['contenteditable', PLACEHOLDER].forEach(name => {
					if (elm?.hasAttribute(name)) {
						elm.removeAttribute(name);
						changed = true;
					}
				})
			);
		});

		if (changed) {
			data.value = template.innerHTML;
		}
	}

	@watch(':changePlace')
	protected onChangePlace(): void {
		const { j } = this;

		// Captured, to come first: the editor's own `focusout` listener can stop
		// the event as it fires `blur`, and an image's `mousedown` listener
		// moves the focus before the press reaches the editor
		j.e
			.off([j.editor, j.ow, j.ew], '.imageCaption')
			.on(j.editor, 'focusout.imageCaption', this.__onFocusOut, {
				capture: true
			})
			.on(j.editor, 'mousedown.imageCaption', this.__onMouseDown, {
				capture: true
			})
			.on([j.ow, j.ew], 'mouseup.imageCaption', this.__onMouseUp);
	}

	private __press: Nullable<Node> = null;
	private __afterPress: HTMLElement[] = [];

	@autobind
	private __onMouseDown(event: MouseEvent): void {
		this.__press = event.target as Node;
	}

	/**
	 * A caption left blank goes when the focus leaves it. That's checked once
	 * the focus has landed, as switching windows or opening the editor's own
	 * popups keeps it, and once a press that took the focus is over, as the
	 * browsers fire no click when its target moves
	 */
	@autobind
	private __onFocusOut(event: FocusEvent): void {
		const caption = event.target as HTMLElement;

		if (
			getImageCaption(this.j, getCaptionWrapper(this.j, caption)) !==
			caption
		) {
			return;
		}

		if (this.__press) {
			this.__afterPress.push(caption);
		} else {
			this.__dropBlank(caption, null);
		}
	}

	@autobind
	private __onMouseUp(): void {
		const press = this.__press;
		this.__press = null;

		this.__afterPress
			.splice(0)
			.forEach(caption => this.__dropBlank(caption, press));
	}

	private __dropBlank(caption: HTMLElement, press: Nullable<Node>): void {
		// `async.setTimeout` runs a timeout of 0 at once
		this.j.async.setTimeout(() => {
			const { j } = this;
			const wrapper = getCaptionWrapper(j, caption);
			const image = getCaptionedImage(j, wrapper);

			if (
				!wrapper ||
				!image ||
				!Dom.isEmpty(caption) ||
				this.__keepsFocus(caption)
			) {
				return;
			}

			const clicked = Boolean(press && Dom.isOrContains(wrapper, press));
			const fresh = this.__freshCaption(wrapper);

			this.__unrecorded(() =>
				fresh ? this.__restore(fresh) : this.__uncaption(wrapper, image)
			);

			// The click opened the image's popup below the caption, so it
			// opens again below the image, as after the popup's Caption button
			if (clicked) {
				j.e.fire('recalcPositionPopup');
				j.e.fire('closeAllPopups');
			}
		}, 1);
	}

	/**
	 * The caption has the focus, or had it when another window took it, or
	 * the editor's own popups and dialogs have it, as the link form
	 */
	private __keepsFocus(caption: HTMLElement): boolean {
		const { j } = this;
		const doc = caption.ownerDocument;

		if (
			doc.activeElement === caption &&
			(doc.hasFocus() || !j.od.hasFocus())
		) {
			return true;
		}

		const active = j.od.activeElement;

		return Boolean(
			active &&
			active !== j.iframe &&
			!Dom.isOrContains(j.editor, active) &&
			(Dom.isOrContains(j.container, active) ||
				Dom.closest(
					active,
					elm =>
						Dom.isElement(elm) &&
						attr(elm, 'data-editor_id') === j.id,
					j.od.body
				))
		);
	}

	/**
	 * The caption the caret is in
	 */
	private __caretCaption(): Nullable<HTMLElement> {
		const { s } = this.j;

		if (!s.isInsideArea) {
			return null;
		}

		const node = s.range.startContainer;
		const caption = getImageCaption(
			this.j,
			getCaptionWrapper(this.j, node)
		);

		return caption && Dom.isOrContains(caption, node) ? caption : null;
	}

	/**
	 * Enter in a caption starts a line after the image, and Shift+Enter
	 * breaks the caption's line, as everywhere
	 */
	@watch(':beforeEnter')
	protected onBeforeEnter(event?: KeyboardEvent): false | void {
		const caption = event?.shiftKey ? null : this.__caretCaption();
		const wrapper = getCaptionWrapper(this.j, caption);

		if (!wrapper) {
			return;
		}

		const { j } = this;

		this.__focusEditor();

		// The Enter plugin breaks the line after an inline wrapper
		if (!Dom.isBlock(wrapper)) {
			j.s.setCursorAfter(wrapper);
			return;
		}

		const line = this.__line();
		Dom.after(wrapper, line);
		j.s.setCursorIn(line);
		j.synchronizeValues();

		return false;
	}

	/**
	 * The caption keeps the focus, as an editable element of its own, and
	 * would take the caret back, so the editor takes it before the caret
	 * leaves the caption
	 */
	private __focusEditor(): void {
		this.j.editor.focus({ preventScroll: true });
	}

	private __line(): HTMLElement {
		const { j } = this;
		const line = j.createInside.element(j.o.enter);

		if (!Dom.isTag(line, 'br')) {
			Dom.append(line, j.createInside.element('br'));
		}

		return line;
	}

	/**
	 * A caption holds text. An image, a table or a block put in it would end
	 * the captioned image, so it goes after the image, as Enter would
	 */
	@watch(':beforeInsertNode')
	protected onBeforeInsertNode(node: Node): void {
		const wrapper = getCaptionWrapper(this.j, this.__caretCaption());

		if (!wrapper || !holdsMoreThanText(node)) {
			return;
		}

		const { j } = this;
		this.__focusEditor();

		if (!Dom.isBlock(wrapper)) {
			j.s.setCursorAfter(wrapper);
			return;
		}

		const line = this.__line();
		Dom.after(wrapper, line);
		j.s.setCursorIn(line);
	}

	private __arrow: Nullable<{
		key: string;
		range: Range;
		caption: HTMLElement;
	}> = null;

	/**
	 * A selected captioned image goes as an image on a line of its own does,
	 * leaving the line empty, rather than joining the lines either side
	 */
	@watch(':beforeCommandDelete')
	protected onBeforeCommandDelete(): false | void {
		const wrapper = this.__selectedWrapper();

		if (!wrapper || !Dom.isBlock(wrapper)) {
			return;
		}

		const line = this.__line();
		Dom.before(wrapper, line);
		Dom.safeRemove(wrapper);
		this.j.s.setCursorIn(line);

		return false;
	}

	/**
	 * The captioned image the selection holds, as a click on the image selects
	 */
	private __selectedWrapper(): Nullable<HTMLElement> {
		const { s } = this.j;

		if (!s.isInsideArea || s.isCollapsed()) {
			return null;
		}

		const { startContainer, startOffset, endContainer, endOffset } =
			s.range;
		const node = startContainer.childNodes[startOffset];

		return startContainer === endContainer &&
			endOffset === startOffset + 1 &&
			getCaptionedImage(this.j, node)
			? (node as HTMLElement)
			: null;
	}

	@watch(':keydown')
	protected onKeyDown(event: KeyboardEvent): void {
		this.__arrow = null;

		// Typing replaces a selected captioned image, on the line it leaves
		if (
			event.key?.length === 1 &&
			!event.ctrlKey &&
			!event.metaKey &&
			this.__selectedWrapper()
		) {
			this.j.execCommand('Delete');
			return;
		}

		if (
			!ARROWS.has(event.key) ||
			event.shiftKey ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey ||
			!this.j.s.isCollapsed()
		) {
			return;
		}

		const caption = this.__caretCaption();

		if (caption) {
			this.__arrow = {
				key: event.key,
				range: this.j.s.range.cloneRange(),
				caption
			};
		}
	}

	/**
	 * An arrow key that couldn't move the caret in the caption takes it out,
	 * past the image, as the caption is an editable element of its own
	 */
	@watch(':keyup')
	protected onKeyUp(event: KeyboardEvent): void {
		const arrow = this.__arrow;
		this.__arrow = null;

		if (!arrow || event.key !== arrow.key || isMoved(this.j, arrow.range)) {
			return;
		}

		const wrapper = getCaptionWrapper(this.j, arrow.caption);

		if (!wrapper) {
			return;
		}

		const forward =
			arrow.key === consts.KEY_DOWN || arrow.key === consts.KEY_RIGHT;
		const { s } = this.j;

		this.__focusEditor();

		if (!Dom.isBlock(wrapper)) {
			if (forward) {
				s.setCursorAfter(wrapper);
			} else {
				s.setCursorBefore(wrapper);
			}

			return;
		}

		const sibling = Dom.findNotEmptySibling(wrapper, !forward);

		if (Dom.isHTMLElement(sibling)) {
			s.setCursorIn(sibling, forward);
			return;
		}

		if (Dom.isText(sibling)) {
			if (forward) {
				s.setCursorBefore(sibling);
			} else {
				s.setCursorAfter(sibling);
			}

			return;
		}

		const line = this.__line();
		call(forward ? Dom.after : Dom.before, wrapper, line);
		s.setCursorIn(line);
		this.j.synchronizeValues();
	}

	@watch(':beforeCommand')
	protected onBeforeCommand(command: string): false | void {
		const name = command.toLowerCase();

		if (BLOCK_COMMANDS.has(name) && this.__caretCaption()) {
			return false;
		}

		// A caption given and left blank was never a step, so Undo takes it off
		const fresh =
			name === 'undo' && this.__fresh
				? this.__freshCaption(this.__fresh.wrapper)
				: null;

		if (fresh) {
			this.__unrecorded(() => {
				this.__restore(fresh);
				this.j.history.snapshot.restore(fresh.before);
			});

			return false;
		}
	}

	/**
	 * Select all in a caption selects the caption, as the caption is an
	 * editable element of its own
	 */
	@autobind
	private __onSelectAll(): false | void {
		const caption = this.__caretCaption();

		if (caption) {
			this.j.e.stopPropagation('beforeCommandSelectall');
			this.j.s.select(caption, true);
			return false;
		}
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e
			.off('beforeCommandSelectall', this.__onSelectAll)
			.off([jodit.editor, jodit.ow, jodit.ew], '.imageCaption');
	}
}

interface Split {
	block: HTMLElement;
	head: Nullable<HTMLElement>;
	tail: Nullable<HTMLElement>;
}

interface FreshCaption {
	caption: HTMLElement;
	wrapper: HTMLElement;
	image: HTMLImageElement;
	target: HTMLElement;

	/** Where `target` was in the line */
	place: Node;

	/** The line the caption split round the image, and its parts */
	split: Nullable<Split>;

	/** The image's `style` and `class` before its caption */
	attributes: Array<Nullable<string>>;

	parent: Nullable<Node>;
	previous: Nullable<Node>;
	next: Nullable<Node>;
	shape: string;
	before: SnapshotType;
}

/** What putting a captioned image back as it was needs */
type Placed = Pick<
	FreshCaption,
	'wrapper' | 'image' | 'target' | 'place' | 'split' | 'attributes'
>;

/**
 * `fresh` in `wrapper`, a copy of its wrapper, with the lines round it, made
 * from the editor's value
 */
function placedIn(
	jodit: IJodit,
	fresh: FreshCaption,
	wrapper: HTMLElement
): Nullable<Placed> {
	const image = getCaptionedImage(jodit, wrapper);
	const { split } = fresh;

	if (!image) {
		return null;
	}

	const placed: Placed = {
		wrapper,
		image,
		target: Dom.closest(image, 'a', wrapper) ?? image,
		place: fresh.place,
		split: null,
		attributes: fresh.attributes
	};

	if (split) {
		const head = split.head ? wrapper.previousSibling : null;
		const tail = split.tail ? wrapper.nextSibling : null;

		if (
			(split.head && !Dom.isHTMLElement(head)) ||
			(split.tail && !Dom.isHTMLElement(tail))
		) {
			return null;
		}

		const block = split.block.cloneNode(true) as HTMLElement;

		placed.split = {
			block,
			head: head as Nullable<HTMLElement>,
			tail: tail as Nullable<HTMLElement>
		};
		placed.place = counterpart(split.block, fresh.place, block);
	}

	return placed;
}

/**
 * The node in `copy`, a clone of `root`, where `node` is in `root`
 */
function counterpart(root: Node, node: Node, copy: Node): Node {
	const path: number[] = [];

	for (let elm = node; elm !== root && elm.parentNode; elm = elm.parentNode) {
		path.unshift(toArray<Node>(elm.parentNode.childNodes).indexOf(elm));
	}

	return path.reduce((elm, index) => elm.childNodes[index], copy);
}

/**
 * The attributes of a caption's wrapper and image that the image's
 * alignment, margins and size are in
 */
function shape(wrapper: HTMLElement, image: HTMLImageElement): string {
	return [wrapper, image]
		.flatMap(elm => [attr(elm, 'style'), attr(elm, 'class')])
		.join('|');
}

/**
 * The node is, or holds, more than text and inline formatting: an image, a
 * table, a rule or another block
 */
function holdsMoreThanText(node: Node): boolean {
	if (!Dom.isElement(node) && !Dom.isFragment(node)) {
		return false;
	}

	return [node, ...toArray(node.querySelectorAll('*'))].some(
		elm =>
			Dom.isElement(elm) &&
			(Dom.isBlock(elm) ||
				consts.NO_EMPTY_TAGS.has(
					elm.nodeName.toLowerCase() as HTMLTagNames
				))
	);
}

/**
 * A `width` attribute's value as a CSS width
 */
function pixels(value: Nullable<string>): string {
	if (!value) {
		return '';
	}

	return isNumeric(value) ? `${value}px` : value;
}

function moveMargins(from: HTMLElement, to: HTMLElement): void {
	MARGINS.forEach(side => {
		const value = cssInline(from, side);

		if (value) {
			css(to, side, value);
			css(from, side, '');
		}
	});

	if (!attr(from, 'style')?.trim()) {
		attr(from, 'style', null);
	}
}

pluginSystem.add('imageCaption', imageCaption);
