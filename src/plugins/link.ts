/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { convertMediaURLToVideoEmbed, isURL, refs } from '../modules/helpers/';
import { Select } from '../modules/Selection';
import { IDictionary, IJodit } from '../types';
import { IControlType } from '../types/toolbar';

/**
 * @property {object}  link `{@link link|link}` plugin's options
 * @property {boolean} link.followOnDblClick=true Follow lnk address after dblclick
 * @property {boolean} link.processVideoLink=true Replace inserted youtube/vimeo link toWYSIWYG `iframe`
 * @property {boolean} link.processPastedLink=true Wrap inserted link in &lt;a href="link">link&lt;/a>
 * @property {boolean} link.removeLinkAfterFormat=true When the button is pressed toWYSIWYG clean format,
 * if it was done on the link is removed like command `unlink`
 */

declare module '../Config' {
	interface Config {
		link: {
			followOnDblClick: boolean;
			processVideoLink: boolean;
			processPastedLink: boolean;
			removeLinkAfterFormat: boolean;
			noFollowCheckbox: boolean;
			openInNewTabCheckbox: boolean;
		};
	}
}

Config.prototype.link = {
	followOnDblClick: true,
	processVideoLink: true,
	processPastedLink: true,
	removeLinkAfterFormat: true,
	noFollowCheckbox: true,
	openInNewTabCheckbox: true
};

Config.prototype.controls.unlink = {
	exec: (editor: IJodit, current: Node) => {
		const anchor: HTMLAnchorElement | false = Dom.closest(
			current,
			'A',
			editor.editor
		) as HTMLAnchorElement;

		if (anchor) {
			Dom.unwrap(anchor);
		}

		editor.events.fire('hidePopup');
	},
	tooltip: 'Unlink'
} as IControlType;

Config.prototype.controls.link = {
	isActive: (editor: IJodit): boolean => {
		const current: Node | false = editor.selection.current();
		return current && Dom.closest(current, 'a', editor.editor) !== false;
	},

	popup: (
		editor: IJodit,
		current: HTMLElement | false,
		self: IControlType,
		close: () => void
	) => {
		const i18n = editor.i18n.bind(editor),
			{ openInNewTabCheckbox, noFollowCheckbox } = editor.options.link,
			form: HTMLFormElement = editor.create.fromHTML(
				`<form class="jodit_form">
						<div class="jodit_form_group">
							<input ref="url_input" class="jodit_input" required type="text" name="url" placeholder="http://" type="text"/>
						</div>
						<div ref="content_input_box" class="jodit_form_group">
							<input ref="content_input" class="jodit_input" name="text" placeholder="${i18n(
								'Text'
							)}" type="text"/>
						</div>
						<label ref="target_checkbox_box">
							<input ref="target_checkbox" class="jodit_checkbox" name="target" type="checkbox"/>
							<span>${i18n('Open in new tab')}</span>
						</label>
						<label ref="nofollow_checkbox_box">
							<input ref="nofollow_checkbox" class="jodit_checkbox" name="nofollow" type="checkbox"/>
							<span>${i18n('No follow')}</span>
						</label>
						<div class="jodit_buttons">
							<button ref="unlink" class="jodit_button jodit_unlink_button" type="button">${i18n(
								'Unlink'
							)}</button>
							<button ref="insert" class="jodit_button jodit_link_insert_button" type="submit">${i18n(
								'Insert'
							)}</button>
						</div>
					<form/>`,
				{
					target_checkbox_box: openInNewTabCheckbox,
					nofollow_checkbox_box: noFollowCheckbox
				}
			) as HTMLFormElement;

		const elements = refs(form),
			{ insert, unlink, content_input_box } = elements,
			{
				target_checkbox,
				nofollow_checkbox,
				url_input,
				content_input
			} = elements as IDictionary<HTMLInputElement>,
			currentElement = current,
			isImageContent = Dom.isImage(currentElement, editor.editorWindow);

		if (isImageContent) {
			Dom.hide(content_input_box);
		}

		if (!isImageContent && current) {
			content_input.value = current.textContent || '';
		}

		if (current && Dom.closest(current, 'A', editor.editor)) {
			current = Dom.closest(current, 'A', editor.editor) as HTMLElement;
		} else {
			current = false;
		}

		if (current) {
			url_input.value = current.getAttribute('href') || '';

			if (openInNewTabCheckbox) {
				target_checkbox.checked =
					current.getAttribute('target') === '_blank';
			}

			if (noFollowCheckbox) {
				nofollow_checkbox.checked =
					current.getAttribute('rel') === 'nofollow';
			}

			insert.textContent = i18n('Update');
		} else {
			Dom.hide(unlink);
		}

		const selInfo = editor.selection.save();

		if (unlink) {
			editor.events.on(unlink, 'click', (e: MouseEvent) => {
				if (current) {
					Dom.unwrap(current);
				}

				editor.selection.restore(selInfo);
				close();
				e.preventDefault();
			});
		}

		editor.events.on(form, 'submit', (event: Event) => {
			event.preventDefault();

			const a =
				(current as HTMLAnchorElement) ||
				editor.create.inside.element('a');

			if (!url_input.value.trim().length) {
				url_input.focus();
				url_input.classList.add('jodit_error');
				return false;
			}

			a.setAttribute('href', url_input.value);

			if (!isImageContent) {
				a.textContent = content_input.value;
			}

			if (openInNewTabCheckbox) {
				if (target_checkbox.checked) {
					a.setAttribute('target', '_blank');
				} else {
					a.removeAttribute('target');
				}
			}

			if (noFollowCheckbox) {
				if (nofollow_checkbox.checked) {
					a.setAttribute('rel', 'nofollow');
				} else {
					a.removeAttribute('rel');
				}
			}

			if (!current) {
				if (!isImageContent) {
					editor.selection.restore(selInfo);
					editor.selection.insertNode(a);
				} else {
					currentElement && Dom.wrap(currentElement, a, editor);
					editor.selection.restore(selInfo);
				}
			}

			close();
			return false;
		});

		return form;
	},
	tags: ['a'],
	tooltip: 'Insert link'
} as IControlType;

/**
 * Process link. Insert, dbclick or remove format
 *
 * @module plugins/link
 */
export function link(jodit: IJodit) {
	if (jodit.options.link.followOnDblClick) {
		jodit.events.on('afterInit changePlace', () => {
			jodit.events
				.off('dblclick.link')
				.on(
				jodit.editor,
				'dblclick.link',
				function(this: HTMLAnchorElement, e: MouseEvent) {
					const href: string | null = this.getAttribute('href');
					if (href) {
						location.href = href;
						e.preventDefault();
					}
				},
				'a'
			);
		});
	}
	if (jodit.options.link.processPastedLink) {
		jodit.events.on(
			'processPaste.link',
			(event: ClipboardEvent, html: string): HTMLAnchorElement | void => {
				if (isURL(html)) {
					if (jodit.options.link.processVideoLink) {
						const embed = convertMediaURLToVideoEmbed(html);

						if (embed !== html) {
							return jodit.create.inside.fromHTML(
								embed
							) as HTMLAnchorElement;
						}
					}

					const a = jodit.create.inside.element('a');

					a.setAttribute('href', html);
					a.textContent = html;

					return a;
				}
			}
		);
	}
	if (jodit.options.link.removeLinkAfterFormat) {
		jodit.events.on('afterCommand.link', (command: string) => {
			const sel: Select = jodit.selection;

			let newtag: Node, node: Node | false;

			if (command === 'removeFormat') {
				node = sel.current();
				if (node && node.nodeName !== 'A') {
					node = Dom.closest(node, 'A', jodit.editor);
				}
				if (node && node.nodeName === 'A') {
					if (
						(node as HTMLElement).innerHTML ===
						(node as HTMLElement).textContent
					) {
						newtag = jodit.editorDocument.createTextNode(
							(node as HTMLElement).innerHTML
						);
					} else {
						newtag = jodit.editorDocument.createElement('span');
						(newtag as HTMLElement).innerHTML = (node as HTMLElement).innerHTML;
					}

					if (node.parentNode) {
						node.parentNode.replaceChild(newtag, node);
						jodit.selection.setCursorIn(newtag, true);
					}
				}
			}
		});
	}
}
