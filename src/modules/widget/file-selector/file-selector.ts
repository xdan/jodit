import {
	IFileBrowser,
	IFileBrowserCallBackData,
	IJodit,
	IUploader,
	IUploaderData
} from '../../../types';
import { isFunction, $$, attr, val } from '../../../core/helpers';
import { Dom } from '../../../core/dom';
import { TabOption, TabsWidget } from '../';

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
 * return widget.c('ImageSelector', {
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

	const tabs: TabOption[] = [];

	if (
		callbacks.upload &&
		editor.o.uploader &&
		(editor.o.uploader.url || editor.o.uploader.insertImageAsBase64URI)
	) {
		const dragbox = editor.c.fromHTML(
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
				let handler = isFunction(callbacks.upload)
					? callbacks.upload
					: editor.o.uploader.defaultHandlerSuccess;

				if (typeof handler === 'function') {
					handler.call(editor, resp);
				}
			},
			(error: Error) => {
				editor.e.fire('errorMessage', error.message);
			}
		);

		tabs.push({
			icon: 'upload',
			name: 'Upload',
			content: dragbox,
		});
	}

	if (callbacks.filebrowser) {
		if (editor.o.filebrowser.ajax.url || editor.o.filebrowser.items.url) {
			tabs.push({
				icon: 'folder',
				name: 'Browse',
				content: () => {
					close && close();

					if (callbacks.filebrowser) {
						(editor.getInstance('FileBrowser') as IFileBrowser).open(
							callbacks.filebrowser,
							isImage
						);
					}
				},
			});
		}
	}

	if (callbacks.url) {
		const form = editor.c.fromHTML(
				`<form onsubmit="return false;" class="jodit-form">
						<div class="jodit-form__group">
							<input class="jodit_input" type="text" required name="url" placeholder="http://"/>
						</div>
						<div class="jodit-form__group">
							<input class="jodit_input" type="text" name="text" placeholder="${editor.i18n(
								'Alternative text'
							)}"/>
						</div>
						<div style="text-align: right"><button class="jodit-button">${editor.i18n(
							'Insert'
						)}</button></div>
					</form>`
			) as HTMLFormElement,
			button = form.querySelector('button') as HTMLButtonElement,
			url = form.querySelector('input[name=url]') as HTMLInputElement;

		currentImage = null;

		if (
			elm &&
			!Dom.isText(elm) &&
			(Dom.isTag(elm, 'img') || $$('img', elm).length)
		) {
			currentImage = elm.tagName === 'IMG' ? elm : $$('img', elm)[0];
			val(form, 'input[name=url]', attr(currentImage, 'src'));
			val(form, 'input[name=text]', attr(currentImage, 'alt'));
			button.textContent = editor.i18n('Update');
		}

		if (elm && Dom.isTag(elm, 'a')) {
			val(form, 'input[name=url]', attr(elm, 'href'));
			val(form, 'input[name=text]', attr(elm, 'title'));
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

		tabs.push({
			icon: 'link',
			name: 'URL',
			content: form,
		});
	}

	return TabsWidget(editor, tabs);
};
