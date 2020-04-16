import { IDictionary, IFileBrowser, IFileBrowserCallBackData, IJodit, IUploader, IUploaderData } from '../../../types';
import { isFunction, $$, attr, val } from '../../../core/helpers';
import { Icon } from '../../../core/ui';
import { Dom } from '../../../core/dom';
import { TabsWidget } from '../';

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
	upload?:
		| ((this: IJodit, data: IFileBrowserCallBackData) => void)
		| true;
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
				let handler = isFunction(callbacks.upload)
					? callbacks.upload
					: editor.options.uploader.defaultHandlerSuccess;

				if (typeof handler === 'function') {
					handler.call(editor, resp);
				}
			},
			(error: Error) => {
				editor.events.fire('errorMessage', error.message);
			}
		);

		const icon = editor.options.textIcons ? '' : Icon.get('upload');
		tabs[icon + editor.i18n('Upload')] = dragbox;
	}

	if (callbacks.filebrowser) {
		if (
			editor.options.filebrowser.ajax.url ||
			editor.options.filebrowser.items.url
		) {
			const icon = editor.options.textIcons ? '' : Icon.get('folder');
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

		const icon = editor.options.textIcons ? '' : Icon.get('link');

		tabs[icon + ' URL'] = form;
	}

	return TabsWidget(editor, tabs);
};
