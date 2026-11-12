/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/anchor/README.md]]
 * @packageDocumentation
 * @module plugins/anchor
 */

import type { IJodit, IUIForm, Nullable } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { autobind, debounce, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { getContainer, pluginSystem } from 'jodit/core/global';
import {
	attr,
	camelCase,
	getAnchorName,
	getAnchors,
	isAnchor,
	position,
	toArray
} from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { UIButton } from 'jodit/core/ui/button';
import { UIBlock, UIForm, UIInput } from 'jodit/core/ui/form';

import './config';

const ICON =
	"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231e88e5' stroke-width='2.5' stroke-linejoin='round'%3E%3Cpath d='M6 3h12v18l-6-4-6 4z'/%3E%3C/svg%3E\")";

const MARKER = ['id', 'name']
	.map(key => `.jodit-wysiwyg a[${key}]:not([href]):empty::before`)
	.join(',');

/**
 * Each anchor's marker, in the editing area only
 */
const MARKER_STYLE = `${MARKER}{display:inline-block;width:.75em;height:1em;margin:0 .1em;vertical-align:-.15em;background:${ICON} center/contain no-repeat;cursor:pointer;content:''}`;

/**
 * The attribute `markAnchor` gives an anchor: an empty `<a>` with no `href`
 */
const MARK = ' contenteditable="false"';

/**
 * Inserts anchors, empty `<a id>` that links in the document reach as
 * `#name`, and renames and removes them
 */
export class anchor extends Plugin {
	/** @override */
	override buttons: Plugin['buttons'] = [
		{
			name: 'anchor',
			group: 'insert'
		}
	];

	/** @override */
	protected afterInit(jodit: IJodit): void {
		// It goes in the editing document, so iframe mode has it whatever `iframeStyle` holds
		getContainer(jodit, 'anchor', 'style', true).textContent = MARKER_STYLE;

		jodit.e
			.on('generateAnchorForm.anchor', this.__generateForm)
			.on('clickA touchstartA', this.__onClickA, { top: true });
	}

	/**
	 * An anchor gets its own popup, in place of the link's
	 */
	@autobind
	private __onClickA(target: HTMLElement, e?: Event): void | false {
		const { j } = this;

		if (j.o.readonly || !isAnchor(target)) {
			return;
		}

		j.e.stopPropagation(camelCase((e?.type ?? 'click') + '_a'));

		// Afresh, so a form left with a change unsaved shows the name it has
		j.e.fire(
			'showPopup',
			target,
			() => position(target, j),
			'anchor',
			true
		);

		return false;
	}

	/**
	 * Anchors are uneditable in the editor, so typing beside one never goes
	 * into it and it's deleted as a whole
	 */
	@watch([':change', ':afterInit', ':afterSetMode'])
	@debounce()
	protected onChange(): void {
		const { j } = this;

		if (j.isInDestruct || j.getMode() === consts.MODE_SOURCE) {
			return;
		}

		getAnchors(j.editor).forEach(markAnchor);
	}

	/**
	 * The editor's own attribute stays out of the value
	 */
	@watch(':afterGetValueFromEditor')
	protected onAfterGetValueFromEditor(data: { value: string }): void {
		data.value = unmarkAnchors(data.value);
	}

	/**
	 * The form that names a new anchor, or renames or removes `target`
	 */
	@autobind
	private __generateForm(
		target: Nullable<HTMLElement>,
		close: () => void
	): IUIForm {
		const { j } = this;
		const current = isAnchor(target) ? target : null;

		const input = new UIInput(j, {
			name: 'name',
			ref: 'name_input',
			label: 'Anchor',
			required: true
		});

		const buttons = [
			new UIButton(j, {
				name: 'insert',
				type: 'submit',
				variant: 'primary',
				text: current ? 'Update' : 'Insert'
			})
		];

		if (current) {
			input.value = getAnchorName(current);

			buttons.unshift(
				new UIButton(j, {
					name: 'remove',
					variant: 'default',
					text: 'Remove'
				}).onAction(() => {
					if (!j.o.readonly) {
						j.s.restore();
						Dom.safeRemove(current);
						j.synchronizeValues();
					}

					close();
				})
			);
		}

		const form = new UIForm(j, [
			new UIBlock(j, [input]),
			new UIBlock(j, buttons, { align: 'full' })
		]);

		if (current) {
			this.__dropForm();
			this.__form = form;

			// The toolbar's popup closes on Escape by itself; the anchor's own doesn't
			j.e.on(form.container, 'keydown', (e: KeyboardEvent) => {
				if (e.key === consts.KEY_ESC) {
					close();
					j.s.restore();
				}
			});
		}

		form.onSubmit(() => {
			// The editor can turn readonly while the form is open
			if (j.o.readonly) {
				close();
				return false;
			}

			const name = input.value.trim().replace(/^#/, '');

			const error = !name
				? 'Please fill out this field'
				: /\s/.test(name)
					? 'The name cannot contain spaces'
					: this.__isTaken(name, current)
						? 'This name is already in use'
						: '';

			if (error) {
				input.error = error;
				input.focus();
				return false;
			}

			j.s.restore();

			if (current) {
				this.__rename(current, name);
			} else {
				this.__insert(name);
			}

			j.synchronizeValues();
			close();

			return false;
		});

		j.async.requestIdleCallback(() => input.focus());

		return form;
	}

	/**
	 * The form in the anchor's own popup. The popup takes it out without
	 * destructing it when it shows something else, so it goes when the next
	 * one is made
	 */
	private __form: Nullable<IUIForm> = null;

	private __dropForm(): void {
		const form = this.__form;
		this.__form = null;

		if (form && !form.isInDestruct) {
			this.j.e.off(form.container, 'keydown');
			form.destruct();
		}
	}

	/**
	 * Another element in the document has the name as its `id`, or another
	 * anchor as its `name`
	 */
	private __isTaken(name: string, current: Nullable<HTMLElement>): boolean {
		return toArray(
			this.j.editor.querySelectorAll<HTMLElement>('[id], a[name]')
		).some(
			elm =>
				elm !== current &&
				(elm.id === name ||
					(isAnchor(elm) && attr(elm, 'name') === name))
		);
	}

	/**
	 * At the caret, or at the start of the selection. An anchor can't go in
	 * a link, so in one it goes just before it
	 */
	private __insert(name: string): void {
		const { j } = this;
		const anchor = j.createInside.element('a', { id: name });
		const range = j.s.range;

		markAnchor(anchor);

		if (!range.collapsed) {
			range.collapse(true);
			j.s.selectRange(range);
		}

		const link = Dom.closest(range.startContainer, 'a', j.editor);

		if (link) {
			Dom.before(link, anchor);
			j.s.setCursorAfter(anchor);
		} else {
			j.s.insertNode(anchor, true, false);
		}
	}

	/**
	 * Gives the anchor the new name in whichever of `id` and `name` it has,
	 * and the links to it the new `#name`, unless they still reach
	 * something else by the old one, as they do after a copy is pasted
	 */
	private __rename(current: HTMLAnchorElement, name: string): void {
		const old = getAnchorName(current);
		const shared = this.__isTaken(old, current);

		['id', 'name'].forEach(key => {
			if (current.hasAttribute(key)) {
				attr(current, key, name);
			}
		});

		if (shared) {
			return;
		}

		toArray(
			this.j.editor.querySelectorAll<HTMLAnchorElement>('a[href]')
		).forEach(link => {
			if (attr(link, 'href') === '#' + old) {
				attr(link, 'href', '#' + name);
			}
		});
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		this.__dropForm();

		jodit.e
			.off('generateAnchorForm.anchor', this.__generateForm)
			.off('clickA touchstartA', this.__onClickA);
	}
}

function markAnchor(anchor: HTMLAnchorElement): void {
	if (attr(anchor, 'contenteditable') !== 'false') {
		attr(anchor, 'contenteditable', false);
	}
}

/**
 * Takes `MARK` off each anchor in one pass over the tags, as a regex with
 * `[^>]*` backtracks quadratically on a long run of `<a` (CWE-1333)
 */
function unmarkAnchors(html: string): string {
	if (!html.includes(MARK)) {
		return html;
	}

	let result = '';
	let copied = 0;
	let cursor = 0;

	for (;;) {
		const start = html.indexOf('<', cursor);

		if (start === -1) {
			break;
		}

		const end = html.indexOf('>', start);

		if (end === -1) {
			break;
		}

		if (
			html.startsWith('<a', start) &&
			/\s/.test(html.charAt(start + 2)) &&
			html.startsWith('</a>', end + 1)
		) {
			const tag = html.slice(start, end);
			const at = tag.indexOf(MARK);

			if (at !== -1 && !/\shref=/.test(tag)) {
				result += html.slice(copied, start + at);
				copied = start + at + MARK.length;
			}
		}

		// Past the whole tag, so an `<a` inside one of its attributes is never read as a tag
		cursor = end + 1;
	}

	return copied === 0 ? html : result + html.slice(copied);
}

pluginSystem.add('anchor', anchor);
