/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit } from '../../types';

export const formTemplate = (editor: IJodit): string =>
	`<form class="jodit-form">
		<div class="jodit-form__group">
			<input ref="url_input" class="jodit-input" required type="text" name="url" placeholder="http://" type="text"/>
		</div>
		<div ref="content_input_box" class="jodit-form__group">
			<input ref="content_input" class="jodit-input" name="text" placeholder="${editor.i18n(
				'Text'
			)}" type="text"/>
		</div>
		<label ref="target_checkbox_box">
			<input ref="target_checkbox" class="jodit-checkbox" name="target" type="checkbox"/>
			<span>${editor.i18n('Open in new tab')}</span>
		</label>
		<label ref="nofollow_checkbox_box">
			<input ref="nofollow_checkbox" class="jodit-checkbox" name="nofollow" type="checkbox"/>
			<span>${editor.i18n('No follow')}</span>
		</label>
		<div class="jodit-buttons">
			<button ref="unlink" class="jodit-button" type="button">${editor.i18n(
				'Unlink'
			)}</button>
			<button ref="insert" class="jodit-button" type="submit">${editor.i18n(
				'Insert'
			)}</button>
		</div>
	<form/>`;
