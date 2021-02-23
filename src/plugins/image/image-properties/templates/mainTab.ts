/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../../../../types';
import { Icon } from '../../../../core/ui';

export function mainTab(editor: IJodit): HTMLElement {
	const opt = editor.o,
		i18n = editor.i18n.bind(editor),
		gi = Icon.get.bind(Icon),
		hasFbUrl = opt.filebrowser.ajax.url || opt.uploader.url,
		hasEditor = opt.image.useImageEditor;

	return editor.c.fromHTML(`<div style="${
		!opt.image.editSrc ? 'display:none' : ''
	}" class="jodit-form__group">
			<label>${i18n('Src')}</label>
			<div class="jodit-input_group">
				<input data-ref="imageSrc" class="jodit-input" type="text"/>
				<div
					class="jodit-input_group-buttons"
					style="${hasFbUrl ? '' : 'display: none'}"
				>
						<a
							data-ref="changeImage"
							class="jodit-button"
						>${gi('image')}</a>
						<a
							data-ref="editImage"
							class="jodit-button"
							style="${hasEditor ? '' : 'display: none'}"
						>${gi('crop')}</a>
				</div>
			</div>
		</div>
		<div style="${
			!opt.image.editTitle ? 'display:none' : ''
		}" class="jodit-form__group">
			<label>${i18n('Title')}</label>
			<input data-ref="imageTitle" type="text" class="jodit-input"/>
		</div>
		<div style="${
			!opt.image.editAlt ? 'display:none' : ''
		}" class="jodit-form__group">
			<label>${i18n('Alternative')}</label>
			<input data-ref="imageAlt" type="text" class="jodit-input"/>
		</div>
		<div style="${
			!opt.image.editLink ? 'display:none' : ''
		}" class="jodit-form__group">
			<label>${i18n('Link')}</label>
			<input data-ref="imageLink" type="text" class="jodit-input"/>
		</div>
		<div style="${
			!opt.image.editLink ? 'display:none' : ''
		}" class="jodit-form__group">
			<label class="jodit_vertical_middle">
				<input data-ref="imageLinkOpenInNewTab" type="checkbox" class="jodit-checkbox"/>
				<span>${i18n('Open link in new tab')}</span>
			</label>
		</div>`);
}
