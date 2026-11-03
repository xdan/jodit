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
		if (!isAnchor(target)) {
			return;
		}

		const { j } = this;

		j.e.stopPropagation(camelCase((e?.type ?? 'click') + '_a'));
		j.e.fire('showPopup', target, () => position(target, j), 'anchor');

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
		if (!data.value.includes('contenteditable')) {
			return;
		}

		const template = this.j.c.element('template');
		template.innerHTML = data.value;

		const marked = getAnchors(template.content).filter(anchor =>
			anchor.hasAttribute('contenteditable')
		);

		if (marked.length) {
			marked.forEach(anchor => anchor.removeAttribute('contenteditable'));
			data.value = template.innerHTML;
		}
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
					j.s.restore();
					Dom.safeRemove(current);
					j.synchronizeValues();
					close();
				})
			);
		}

		const form = new UIForm(j, [
			new UIBlock(j, [input]),
			new UIBlock(j, buttons, { align: 'full' })
		]);

		// The toolbar's popup closes on Escape by itself; the anchor's own doesn't
		if (current) {
			j.e.on(form.container, 'keydown', (e: KeyboardEvent) => {
				if (e.key === consts.KEY_ESC) {
					close();
					j.s.restore();
				}
			});
		}

		form.onSubmit(() => {
			const name = input.value.trim().replace(/^#/, '');

			const error = /\s/.test(name)
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

pluginSystem.add('anchor', anchor);
