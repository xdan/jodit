/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit } from '../types/jodit';

import {
	IDictionary,
	IFileBrowser,
	IFileBrowserCallBackData,
	IRGB,
	IUploader,
	IUploaderData
} from '../types/';

import { Dom } from './Dom';
import {
	$$,
	each,
	hexToRgb,
	isPlainObject,
	isFunction,
	normalizeColor,
	val,
	hasBrowserColorPicker
} from './helpers/';
import { ToolbarIcon } from './toolbar/icon';

export namespace Widget {
	/**
	 * Build color picker
	 *
	 * @param {Jodit} editor
	 * @param {function} callback Callback 'function (color) {}'
	 * @param {string} [coldColor] Color value ex. #fff or rgb(123, 123, 123) or rgba(123, 123, 123, 1)
	 * @example
	 * ```javascript
	 * $tabs = TabsWidget(editor, {
	 *    'Text' : ColorPickerWidget(editor, function (color) {
	 *         box.style.color = color;
	 *     }, box.style.color),
	 *     'Background' : ColorPickerWidget(editor, function (color) {
	 *         box.style.backgroundColor = color;
	 *     }, box.style.backgroundColor),
	 * });
	 * ```
	 */
	export const ColorPickerWidget = (
		editor: IJodit,
		callback: (newColor: string) => void,
		coldColor: string
	): HTMLDivElement => {
		const valueHex = normalizeColor(coldColor),
			form: HTMLDivElement = editor.create.div('jodit_colorpicker'),
			iconEye: string = editor.options.textIcons
				? ''
				: ToolbarIcon.getIcon('eye'),
			iconEraser: string = editor.options.textIcons
				? `<span>${editor.i18n('eraser')}</span>`
				: ToolbarIcon.getIcon('eraser'),
			iconPalette: string = editor.options.textIcons
				? `<span>${editor.i18n('palette')}</span>`
				: ToolbarIcon.getIcon('palette'),
			setColor = (target: HTMLElement, color: string) => {
				target.innerHTML = ToolbarIcon.getIcon('eye');
				target.classList.add('active');

				const colorRGB: IRGB | null = hexToRgb(color);
				if (colorRGB) {
					(target.firstChild as HTMLElement).style.fill =
						'rgb(' +
						(255 - colorRGB.r) +
						',' +
						(255 - colorRGB.g) +
						',' +
						(255 - colorRGB.b) +
						')';
				}
			},

			eachColor = (colors: string[] | IDictionary<string[]>) => {
				const stack: string[] = [];

				if (isPlainObject(colors)) {
					Object.keys(colors).forEach(key => {
						stack.push(
							'<div class="jodit_colorpicker_group jodit_colorpicker_group-' +
								key +
								'">'
						);
						stack.push(eachColor((colors as any)[key]));
						stack.push('</div>');
					});

				} else if (Array.isArray(colors)) {
					colors.forEach(color => {
						stack.push(
							'<a ' +
								(valueHex === color ? ' class="active" ' : '') +
								' title="' +
								color +
								'" style="background-color:' +
								color +
								'" data-color="' +
								color +
								'" href="javascript:void(0)">' +
								(valueHex === color ? iconEye : '') +
								'</a>'
						);
					});
				}
				return stack.join('');
			};

		form.appendChild(
			editor.create.fromHTML(
				'<div>' + eachColor(editor.options.colors) + '</div>'
			)
		);

		form.appendChild(
			editor.create.fromHTML(
				'<a ' +
					(editor.options.textIcons
						? 'class="jodit_text_icon"'
						: '') +
					' data-color="" href="javascript:void(0)">' +
					iconEraser +
					'</a>'
			)
		);

		if (editor.options.showBrowserColorPicker && hasBrowserColorPicker()) {
			form.appendChild(
				editor.create.fromHTML(
					'<span>' +
						'<em ' +
						(editor.options.textIcons
							? 'class="jodit_text_icon"'
							: '') +
						'>' +
						iconPalette +
						'</em>' +
						'<input type="color" value=""/>' +
						'</span>'
				)
			);

			editor.events.on(form, 'change', (e: MouseEvent) => {
				e.stopPropagation();

				let target: HTMLInputElement = e.target as HTMLInputElement;

				if (
					!target ||
					!target.tagName ||
					target.tagName.toUpperCase() !== 'INPUT'
				) {
					return;
				}

				const color: string = target.value || '';

				if (color) {
					setColor(target, color);
				}

				if (callback && typeof callback === 'function') {
					callback(color);
				}

				e.preventDefault();
			});
		}

		editor.events.on(form, 'mousedown touchend', (e: MouseEvent) => {
			e.stopPropagation();

			let target: HTMLElement = e.target as HTMLElement;

			if (
				(!target ||
					!target.tagName ||
					target.tagName.toUpperCase() === 'SVG' ||
					target.tagName.toUpperCase() === 'PATH') &&
				target.parentNode
			) {
				target = Dom.closest(
					target.parentNode,
					'A',
					editor.editor
				) as HTMLElement;
			}
			if (target.tagName.toUpperCase() !== 'A') {
				return;
			}

			const active: HTMLElement | null = form.querySelector('a.active');
			if (active) {
				active.classList.remove('active');
				active.innerHTML = '';
			}

			const color: string = target.getAttribute('data-color') || '';

			if (color) {
				setColor(target, color);
			}

			if (callback && typeof callback === 'function') {
				callback(color);
			}

			e.preventDefault();
		});

		return form;
	};

	/**
	 * Build tabs system
	 *
	 * @param {Jodit} editor
	 * @param {object} tabs PlainObject where 'key' will be tab's Title and `value` is tab's content
	 * @param {object} state You can use for this param any HTML element for remembering active tab
	 * @param {string} state.activeTab
	 *
	 * @example
	 * ```javascript
	 * let tabs = widget.create('Tabs', {
	 *    'Images': '<div>Images</div>',
	 *    'Title 2': Jodit.modules.Helpers.dom('<div>Some content</div>'),
	 *    'Color Picker': ColorPickerWidget(editor, function (color) {
	 *         box.style.color = color;
	 *     }, box.style.color),
	 * });
	 * ```
	 */
	export const TabsWidget = (
		editor: IJodit,
		tabs: IDictionary<(() => void) | HTMLElement>,
		state?: { __activeTab: string }
	): HTMLDivElement => {
		const box: HTMLDivElement = editor.create.div('jodit_tabs'),
			tabBox: HTMLDivElement = editor.create.div('jodit_tabs_wrapper'),
			buttons: HTMLDivElement = editor.create.div('jodit_tabs_buttons'),
			nameToTab: IDictionary<{
				button: HTMLElement;
				tab: HTMLElement;
			}> = {};

		let firstTab: string = '',
			tabcount: number = 0;

		box.appendChild(buttons);
		box.appendChild(tabBox);

		each<(() => void) | HTMLElement>(tabs, (name: string, tabOptions) => {
			const tab = editor.create.div('jodit_tab'),
				button = editor.create.element('a', {
					href: 'javascript:void(0);'
				});

			if (!firstTab) {
				firstTab = name.toString();
			}

			button.innerHTML = /<svg/.test(name.toString())
				? name
				: editor.i18n(name.toString());
			buttons.appendChild(button);

			if (typeof tabOptions !== 'function') {
				tab.appendChild(tabOptions);
			} else {
				tab.appendChild(editor.create.div('jodit_tab_empty'));
			}

			tabBox.appendChild(tab);

			editor.events.on(button, 'mousedown touchend', (e: MouseEvent) => {
				$$('a', buttons).forEach(a => {
					a.classList.remove('active');
				});
				$$('.jodit_tab', tabBox).forEach(a => {
					a.classList.remove('active');
				});

				button.classList.add('active');
				tab.classList.add('active');

				if (typeof tabOptions === 'function') {
					tabOptions.call(editor);
				}

				e.stopPropagation();

				if (state) {
					state.__activeTab = name.toString();
				}

				return false;
			});

			nameToTab[name] = {
				button,
				tab
			};

			tabcount += 1;
		});

		if (!tabcount) {
			return box;
		}

		$$('a', buttons).forEach(a => {
			a.style.width = (100 / tabcount).toFixed(10) + '%';
		});

		if (!state || !state.__activeTab || !nameToTab[state.__activeTab]) {
			nameToTab[firstTab].button.classList.add('active');
			nameToTab[firstTab].tab.classList.add('active');
		} else {
			nameToTab[state.__activeTab].button.classList.add('active');
			nameToTab[state.__activeTab].tab.classList.add('active');
		}

		return box;
	};

	/**
	 * Generate 3 tabs
	 * upload - Use Drag and Drop
	 * url - By specifying the image url
	 * filebrowser - After opening the file browser . In the absence of one of the parameters will be less tabs
	 *
	 * @params {Object} callbacks Object with keys `url`, `upload` and `filebrowser`, values which are callback
	 * functions with different parameters
	 * @param {Function} callbacks.upload - function that will be called when the user selects a file or using drag
	 * and drop files to the `Upload` tab
	 * @param {Function} callbacks.url - function that will be called when the user enters the URL of the tab image
	 * and alternative text for images
	 * @param {Function} callbacks.filebrowser - function that will be called when the user clicks on the file browser
	 * tab, and then choose any image in the window that opens, faylbrauzera
	 * @params {HTMLNode} image image object
	 * @example
	 * ```javascript
	 * let widget = new Jodit.modules.Widget(editor);
	 *
	 * return widget.create('ImageSelector', {
	 *      url: function (url, alt) {
	 *          editor.selections.insertImage(url);
	 *      },
	 *      upload: function (images) {
	 *          editor.selections.insertImage(images[0]);
	 *      },
	 *      filebrowser: function (images) {
	 *          editor.selections.insertImage(images[0]);
	 *      }
	 * }, image);
	 * ```
	 */

	interface ImageSelectorCallbacks {
		url?: (this: IJodit, url: string, alt: string) => void;
		filebrowser?: (data: IFileBrowserCallBackData) => void;
		upload?: ((this: IJodit, data: IFileBrowserCallBackData) => void) | true;
	}

	/**
	 *
	 * @param {Jodit} editor
	 * @param {Widget.ImageSelectorCallbacks} callbacks
	 * @param {HTMLElement} elm
	 * @param {Function} close Close popup
	 * @param {boolean} isImage
	 * @return {HTMLDivElement}
	 * @constructor
	 */
	export const FileSelectorWidget = (
		editor: IJodit,
		callbacks: ImageSelectorCallbacks,
		elm: HTMLElement | null,
		close: () => void,
		isImage: boolean = true
	): HTMLDivElement => {
		let currentImage: any;

		const tabs: IDictionary<HTMLElement> | IDictionary<() => void> = {};

		if (
			callbacks.upload &&
			editor.options.uploader &&
			(editor.options.uploader.url ||
				editor.options.uploader.insertImageAsBase64URI)
		) {
			const dragbox = editor.create.fromHTML(
				'<div class="jodit_draganddrop_file_box">' +
					`<strong>${editor.i18n(
						isImage ? 'Drop image' : 'Drop file'
					)}</strong>` +
					`<span><br>${editor.i18n('or click')}</span>` +
					`<input type="file" accept="${
						isImage ? 'image/*' : '*'
					}" tabindex="-1" dir="auto" multiple=""/>` +
					'</div>'
			);

			editor.getInstance<IUploader>('Uploader').bind(
				dragbox,
				(resp: IUploaderData) => {
					let handler = isFunction(callbacks.upload) ? callbacks.upload : editor.options.uploader.defaultHandlerSuccess;

					if (typeof handler === 'function') {
						handler.call(editor, resp);
					}
				},
				(error: Error) => {
					editor.events.fire('errorMessage', error.message);
				}
			);

			const icon = editor.options.textIcons
				? ''
				: ToolbarIcon.getIcon('upload');
			tabs[icon + editor.i18n('Upload')] = dragbox;
		}

		if (callbacks.filebrowser) {
			if (
				editor.options.filebrowser.ajax.url ||
				editor.options.filebrowser.items.url
			) {
				const icon = editor.options.textIcons
					? ''
					: ToolbarIcon.getIcon('folder');
				tabs[icon + editor.i18n('Browse')] = () => {
					close && close();
					if (callbacks.filebrowser) {
						(editor.getInstance(
							'FileBrowser'
						) as IFileBrowser).open(callbacks.filebrowser, isImage);
					}
				};
			}
		}

		if (callbacks.url) {
			const form = editor.create.fromHTML(
		`<form onsubmit="return false;" class="jodit_form">
						<div class="jodit_form_group">
							<input class="jodit_input" type="text" required name="url" placeholder="http://"/>
						</div>
						<div class="jodit_form_group">
							<input class="jodit_input" type="text" name="text" placeholder="${editor.i18n('Alternative text')}"/>
						</div>
						<div style="text-align: right"><button class="jodit_button">${editor.i18n('Insert')}</button></div>
					</form>`
				) as HTMLFormElement,
				button = form.querySelector(
					'button'
				) as HTMLButtonElement,
				url = form.querySelector(
					'input[name=url]'
				) as HTMLInputElement;

			currentImage = null;

			if (
				elm &&
				!Dom.isText(elm) &&
				(Dom.isTag(elm, 'img') || $$('img', elm).length)
			) {
				currentImage = elm.tagName === 'IMG' ? elm : $$('img', elm)[0];
				val(form, 'input[name=url]', currentImage.getAttribute('src'));
				val(form, 'input[name=text]', currentImage.getAttribute('alt'));
				button.textContent = editor.i18n('Update');
			}

			if (
				elm &&
				Dom.isTag(elm, 'a')
			) {
				val(form, 'input[name=url]', elm.getAttribute('href') || '');
				val(form, 'input[name=text]', elm.getAttribute('title') || '');
				button.textContent = editor.i18n('Update');
			}

			form.addEventListener(
				'submit',
				(event: Event) => {
					event.preventDefault();
					event.stopPropagation();

					if (!val(form, 'input[name=url]')) {
						url.focus();
						url.classList.add('jodit_error');
						return false;
					}

					if (typeof callbacks.url === 'function') {
						callbacks.url.call(
							editor,
							val(form, 'input[name=url]'),
							val(form, 'input[name=text]')
						);
					}

					return false;
				},
				false
			);

			const icon = editor.options.textIcons
				? ''
				: ToolbarIcon.getIcon('link');

			tabs[icon + ' URL'] = form;
		}

		return TabsWidget(editor, tabs);
	};
}
