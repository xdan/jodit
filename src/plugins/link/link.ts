/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IDictionary,
	IJodit,
	IControlType,
	IUIForm,
	IUIOption,
	Nullable
} from '../../types';
import { Config } from '../../config';
import { Dom } from '../../core/dom';
import {
	attr,
	convertMediaUrlToVideoEmbed,
	isString,
	isURL,
	refs,
	stripTags
} from '../../core/helpers';
import { formTemplate } from './template';
import { Plugin } from '../../core/plugin';
import { autobind } from '../../core/decorators';
import { Dialog, UIForm } from '../../modules';

/**
 * @property {object}  link `{@link link|link}` plugin's options
 * @property {boolean} link.followOnDblClick=true Follow lnk address after dblclick
 * @property {boolean} link.processVideoLink=true Replace inserted youtube/vimeo link toWYSIWYG `iframe`
 * @property {boolean} link.processPastedLink=true Wrap inserted link in &lt;a href="link">link&lt;/a>
 * @property {boolean} link.removeLinkAfterFormat=true When the button is pressed toWYSIWYG clean format,
 * if it was done on the link is removed like command `unlink`
 * @property {"input"|"select"|""} link.modeClassName="input" Use an input text to ask the classname or a select or not ask
 * @property {boolean} link.selectMultipleClassName=true Allow multiple choises (to use with modeClassName="select")
 * @property {number} link.selectSizeClassName=3 The size of the select (to use with modeClassName="select")
 * @property {IUIOption[]} link.selectOptionsClassName=[] The list of the option for the select (to use with modeClassName="select")
 * ex: [
 *			{ value: "", text: "" },
 *			{ value: "val1", text: "text1" },
 *			{ value: "val2", text: "text2" },
 *			{ value: "val3", text: "text3" }
 *		]
 */

declare module '../../config' {
	interface Config {
		link: {
			/**
			 * Template for the link dialog form
			 * @param editor
			 */
			formTemplate: (editor: IJodit) => string | HTMLElement | IUIForm;
			formClassName?: string;

			/**
			 * Follow link address after dblclick
			 */
			followOnDblClick: boolean;

			/**
			 * Replace inserted youtube/vimeo link toWYSIWYG `iframe`
			 */
			processVideoLink: boolean;

			/**
			 * Wrap inserted link in &lt;a href="link">link&lt;/a>
			 */
			processPastedLink: boolean;

			/**
			 * Show `no follow` checkbox in link dialog.
			 */
			noFollowCheckbox: boolean;

			/**
			 * Show `Open in new tab` checkbox in link dialog.
			 */
			openInNewTabCheckbox: boolean;

			modeClassName: 'input' | 'select';
			selectMultipleClassName: boolean;
			selectSizeClassName?: number;
			selectOptionsClassName: IUIOption[];

			hotkeys: string[];
		};
	}
}

Config.prototype.link = {
	formTemplate,
	followOnDblClick: false,
	processVideoLink: true,
	processPastedLink: true,
	noFollowCheckbox: true,
	openInNewTabCheckbox: true,
	modeClassName: 'input',
	selectMultipleClassName: true,
	selectSizeClassName: 3,
	selectOptionsClassName: [],
	hotkeys: ['ctrl+k', 'cmd+k']
};

Config.prototype.controls.unlink = {
	exec: (editor: IJodit, current: Node) => {
		const anchor: HTMLAnchorElement | false = Dom.closest(
			current,
			'a',
			editor.editor
		) as HTMLAnchorElement;

		if (anchor) {
			Dom.unwrap(anchor);
		}

		editor.setEditorValue();
		editor.e.fire('hidePopup');
	},
	tooltip: 'Unlink'
} as IControlType;

Config.prototype.controls.link = {
	isActive: (editor: IJodit): boolean => {
		const current = editor.s.current();
		return Boolean(current && Dom.closest(current, 'a', editor.editor));
	},

	popup: (editor: IJodit, current, self: IControlType, close: () => void) => {
		return editor.e.fire('generateLinkForm.link', current, close);
	},
	tags: ['a'],
	tooltip: 'Insert link'
} as IControlType;

/**
 * Process link. Insert, dblclick or remove format
 */
export class link extends Plugin {
	/** @override */
	buttons: Plugin['buttons'] = [
		{
			name: 'link',
			group: 'insert'
		}
	];

	/** @override */
	protected afterInit(jodit: IJodit): void {
		if (jodit.o.link.followOnDblClick) {
			jodit.e.on('dblclick.link', this.onDblClickOnLink);
		}

		if (jodit.o.link.processPastedLink) {
			jodit.e.on('processPaste.link', this.onProcessPasteLink);
		}

		jodit.e.on('generateLinkForm.link', this.generateForm);
		jodit.registerCommand('openLinkDialog', {
			exec: () => {
				const dialog = new Dialog({
					resizable: false
				});

				const htmlForm = this.generateForm(jodit.s.current(), () => {
					dialog.close();
				}) as UIForm;

				htmlForm.container.classList.add('jodit-dialog_alert');
				dialog.setContent(htmlForm);
				dialog.open();

				jodit.async.requestIdleCallback(() => {
					const { url_input } = refs(htmlForm.container);
					url_input?.focus();
				});
			},
			hotkeys: jodit.o.link.hotkeys
		});
	}

	@autobind
	private onDblClickOnLink(e: MouseEvent) {
		if (!Dom.isTag(e.target, 'a')) {
			return;
		}

		const href = attr(e.target, 'href');

		if (href) {
			location.href = href;
			e.preventDefault();
		}
	}

	@autobind
	private onProcessPasteLink(
		ignore: ClipboardEvent,
		html: string
	): HTMLAnchorElement | void {
		const { jodit } = this;

		if (isURL(html)) {
			if (jodit.o.link.processVideoLink) {
				const embed = convertMediaUrlToVideoEmbed(html);

				if (embed !== html) {
					return jodit.createInside.fromHTML(
						embed
					) as HTMLAnchorElement;
				}
			}

			const a = jodit.createInside.element('a');

			a.setAttribute('href', html);
			a.textContent = html;

			jodit.e.stopPropagation('processPaste');

			return a;
		}
	}

	@autobind
	private generateForm(
		current: Nullable<Node>,
		close: Function
	): HTMLElement | IUIForm {
		const { jodit } = this;

		const i18n = jodit.i18n.bind(jodit),
			{
				openInNewTabCheckbox,
				noFollowCheckbox,
				formTemplate,
				formClassName,
				modeClassName
			} = jodit.o.link;

		const html = formTemplate(jodit),
			form = isString(html)
				? (jodit.c.fromHTML(html, {
						target_checkbox_box: openInNewTabCheckbox,
						nofollow_checkbox_box: noFollowCheckbox
				  }) as HTMLFormElement)
				: html,
			htmlForm = Dom.isElement(form) ? form : form.container;

		const elements = refs(htmlForm),
			{ insert, unlink, content_input_box } = elements,
			{ target_checkbox, nofollow_checkbox, url_input } =
				elements as IDictionary<HTMLInputElement>,
			currentElement = current,
			isImageContent = Dom.isImage(currentElement, jodit.ew);

		let { content_input } = elements as IDictionary<HTMLInputElement>;

		const { className_input } = elements as IDictionary<HTMLInputElement>,
			{ className_select } = elements as IDictionary<HTMLSelectElement>;

		if (!content_input) {
			content_input = jodit.c.element('input', {
				type: 'hidden',
				ref: 'content_input'
			});
		}

		if (formClassName) {
			htmlForm.classList.add(formClassName);
		}

		if (isImageContent) {
			Dom.hide(content_input_box);
		}

		let link: false | HTMLAnchorElement;

		const getSelectionText = () =>
			link
				? link.innerText
				: stripTags(jodit.s.range.cloneContents(), jodit.ed);

		if (current && Dom.closest(current, 'a', jodit.editor)) {
			link = Dom.closest(current, 'a', jodit.editor) as HTMLAnchorElement;
		} else {
			link = false;
		}

		if (!isImageContent && current) {
			content_input.value = getSelectionText();
		}

		if (link) {
			url_input.value = attr(link, 'href') || '';

			if (modeClassName) {
				switch (modeClassName) {
					case 'input':
						if (className_input) {
							className_input.value = attr(link, 'class') || '';
						}
						break;

					case 'select':
						if (className_select) {
							for (
								let i = 0;
								i < className_select.selectedOptions.length;
								i++
							) {
								const option = className_select.options.item(i);

								if (option) {
									option.selected = false;
								}
							}

							const classNames = attr(link, 'class') || '';

							classNames.split(' ').forEach(className => {
								if (className) {
									for (
										let i = 0;
										i < className_select.options.length;
										i++
									) {
										const option =
											className_select.options.item(i);

										if (
											option?.value &&
											option.value === className
										) {
											option.selected = true;
										}
									}
								}
							});
						}
						break;
				}
			}

			if (openInNewTabCheckbox && target_checkbox) {
				target_checkbox.checked = attr(link, 'target') === '_blank';
			}

			if (noFollowCheckbox && nofollow_checkbox) {
				nofollow_checkbox.checked = attr(link, 'rel') === 'nofollow';
			}

			insert.textContent = i18n('Update');
		} else {
			Dom.hide(unlink);
		}

		jodit.editor.normalize();
		const snapshot = jodit.observer.snapshot.make();

		if (unlink) {
			jodit.e.on(unlink, 'click', (e: MouseEvent) => {
				jodit.observer.snapshot.restore(snapshot);

				if (link) {
					Dom.unwrap(link);
				}

				jodit.setEditorValue();

				close();
				e.preventDefault();
			});
		}

		const onSubmit = (): false => {
			if (!url_input.value.trim().length) {
				url_input.focus();
				url_input.classList.add('jodit_error');
				return false;
			}

			let links: HTMLAnchorElement[];

			jodit.s.removeMarkers();
			jodit.editor.normalize();
			jodit.observer.snapshot.restore(snapshot);

			const textWasChanged =
				getSelectionText() !== content_input.value.trim();

			const ci = jodit.createInside;

			if (!link) {
				if (!jodit.s.isCollapsed()) {
					const node = jodit.s.current();

					if (Dom.isTag(node, ['img'])) {
						links = [Dom.wrap(node, 'a', ci) as HTMLAnchorElement];
					} else {
						links = jodit.s.wrapInTag('a') as HTMLAnchorElement[];
					}
				} else {
					const a = ci.element('a');
					jodit.s.insertNode(a, false, false);
					links = [a];
				}
			} else {
				links = [link];
			}

			links.forEach(a => {
				attr(a, 'href', url_input.value);

				if (modeClassName && (className_input ?? className_select)) {
					if (modeClassName === 'input') {
						if (
							className_input.value === '' &&
							a.hasAttribute('class')
						) {
							attr(a, 'class', null);
						}

						if (className_input.value !== '') {
							attr(a, 'class', className_input.value);
						}
					} else if (modeClassName === 'select') {
						if (a.hasAttribute('class')) {
							attr(a, 'class', null);
						}

						for (
							let i = 0;
							i < className_select.selectedOptions.length;
							i++
						) {
							const className =
								className_select.selectedOptions.item(i)?.value;

							if (className) {
								a.classList.add(className);
							}
						}
					}
				}

				if (!isImageContent) {
					if (content_input.value.trim().length) {
						if (textWasChanged) {
							a.textContent = content_input.value;
						}
					} else {
						a.textContent = url_input.value;
					}
				}

				if (openInNewTabCheckbox && target_checkbox) {
					attr(
						a,
						'target',
						target_checkbox.checked ? '_blank' : null
					);
				}

				if (noFollowCheckbox && nofollow_checkbox) {
					attr(
						a,
						'rel',
						nofollow_checkbox.checked ? 'nofollow' : null
					);
				}
			});

			jodit.setEditorValue();

			close();

			return false;
		};

		if (Dom.isElement(form)) {
			jodit.e.on(form, 'submit', (event: Event) => {
				event.preventDefault();
				event.stopImmediatePropagation();
				onSubmit();
				return false;
			});
		} else {
			form.onSubmit(onSubmit);
		}

		return form;
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e
			.off('generateLinkForm.link', this.generateForm)
			.off('dblclick.link', this.onDblClickOnLink)
			.off('processPaste.link', this.onProcessPasteLink);
	}
}
