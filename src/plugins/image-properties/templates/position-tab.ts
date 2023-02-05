/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { IJodit } from 'jodit/types';
import { Icon } from 'jodit/core/ui/icon';

export function positionTab(editor: IJodit): HTMLElement {
	const opt = editor.o,
		i18n = editor.i18n.bind(editor),
		gi = Icon.get.bind(Icon);

	const classInput = [];
	if (opt.image.availableClasses.length > 0) {
		classInput.push(
			'<select data-ref="classes" class="jodit-input jodit-select">'
		);
		opt.image.availableClasses.forEach(item => {
			if (typeof item === 'string') {
				classInput.push(`<option value="${item}">${item}</option>`);
			} else {
				classInput.push(
					`<option value="${item[0]}">${item[1]}</option>`
				);
			}
		});
		classInput.push('</select>');
	} else {
		classInput.push(
			'<input data-ref="classes" type="text" class="jodit-input"/>'
		);
	}

	return editor.c.fromHTML(`<div style="${
		!opt.image.editMargins ? 'display:none' : ''
	}" class="jodit-form__group">
			<label>${i18n('Margins')}</label>
			<div class="jodit-grid jodit_vertical_middle">
				<input class="jodit_col-lg-1-5 jodit-input" data-ref="marginTop" type="text" placeholder="${i18n(
					'top'
				)}"/>
				<a style="text-align: center;" data-ref="lockMargin" class="jodit-properties__lock jodit_col-lg-1-5">${gi(
					'lock'
				)}</a>
				<input disabled="true" class="jodit_col-lg-1-5 jodit-input" data-ref="marginRight" type="text" placeholder="${i18n(
					'right'
				)}"/>
				<input disabled="true" class="jodit_col-lg-1-5 jodit-input" data-ref="marginBottom" type="text" placeholder="${i18n(
					'bottom'
				)}"/>
				<input disabled="true" class="jodit_col-lg-1-5 jodit-input" data-ref="marginLeft" type="text" placeholder="${i18n(
					'left'
				)}"/>
			</div>
		</div>
		<div
			style="${!opt.image.editAlign ? 'display:none' : ''}"
			class="jodit-form__group"
		>
			<label>${i18n('Align')}</label>
			<select data-ref="align" class="jodit-select">
				<option value="">${i18n('--Not Set--')}</option>
				<option value="left">${i18n('Left')}</option>
				<option value="center">${i18n('Center')}</option>
				<option value="right">${i18n('Right')}</option>
			</select>
		</div>
		<div style="${
			!opt.image.editStyle ? 'display:none' : ''
		}" class="jodit-form__group">
			<label>${i18n('Styles')}</label>
			<input data-ref="style" type="text" class="jodit-input"/>
		</div>
		<div style="${
			!opt.image.editClass ? 'display:none' : ''
		}" class="jodit-form__group">
			<label>${i18n('Classes')}</label>
			${classInput.join('')}
		</div>
		<div style="${
			!opt.image.editId ? 'display:none' : ''
		}" class="jodit-form__group">
			<label>Id</label>
			<input data-ref="id" type="text" class="jodit-input"/>
		</div>
		<div
			style="${!opt.image.editBorderRadius ? 'display:none' : ''}"
			class="jodit-form__group"
		>
			<label>${i18n('Border radius')}</label>
				<input data-ref="borderRadius" type="number" class="jodit-input"/>
		</div>`);
}
