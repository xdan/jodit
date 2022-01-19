/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Dom } from '../../../../core/dom';
import { isString } from '../../../../core/helpers/checker';
import { css } from '../../../../core/helpers';
import { hAlignElement } from '../../../image/helpers';

export const align: IControlType<IJodit> = {
	name: 'left',
	childTemplate: (_, __, value: string) => value,
	list: ['Left', 'Right', 'Center', 'Normal'],
	exec: (editor: IJodit, elm, { control }): void | false => {
		if (!Dom.isTag(elm, ['img', 'jodit', 'jodit-media'])) {
			return;
		}

		const command = (
			control.args && isString(control.args[0])
				? control.args[0].toLowerCase()
				: ''
		) as Parameters<typeof hAlignElement>[1];

		if (!command) {
			return false;
		}

		hAlignElement(elm, command);
		if (Dom.isTag(elm, ['jodit', 'jodit-media']) && elm.firstElementChild) {
			hAlignElement(elm.firstElementChild as HTMLElement, command);
		}

		editor.setEditorValue();

		editor.e.fire('recalcPositionPopup');
	},
	tooltip: 'Horizontal align'
};

export default [
	{
		name: 'delete',
		icon: 'bin',
		tooltip: 'Delete',
		exec: (editor: IJodit, image) => {
			image && editor.s.removeNode(image);
		}
	},
	{
		name: 'pencil',
		exec(editor: IJodit, current) {
			const tagName = (current as HTMLElement).tagName.toLowerCase();

			if (tagName === 'img') {
				editor.e.fire('openImageProperties', current);
			}
		},
		tooltip: 'Edit'
	},
	{
		name: 'valign',
		list: ['Top', 'Middle', 'Bottom', 'Normal'],
		tooltip: 'Vertical align',
		exec: (editor: IJodit, image, { control }): void | false => {
			if (!Dom.isTag(image, 'img')) {
				return;
			}

			const command =
				control.args && isString(control.args[0])
					? control.args[0].toLowerCase()
					: '';

			if (!command) {
				return false;
			}

			css(image, 'vertical-align', command === 'normal' ? '' : command);

			editor.e.fire('recalcPositionPopup');
		}
	},
	align
] as Array<IControlType | string>;
