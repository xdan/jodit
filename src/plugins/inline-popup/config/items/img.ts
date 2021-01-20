/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IControlType, IJodit } from '../../../../types';
import { Dom } from '../../../../core/dom';
import { isString } from '../../../../core/helpers/checker';
import { clearCenterAlign, css } from '../../../../core/helpers';

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
	{
		name: 'left',
		childTemplate: (_, __, value: string) => value,
		list: ['Left', 'Right', 'Center', 'Normal'],
		exec: (editor: IJodit, image, { control }): void | false => {
			if (!Dom.isTag(image, 'img')) {
				return;
			}

			const command: string =
				control.args && isString(control.args[0])
					? control.args[0].toLowerCase()
					: '';

			if (!command) {
				return false;
			}

			if (command !== 'normal') {
				if (['right', 'left'].indexOf(command) !== -1) {
					css(image, 'float', command);
					clearCenterAlign(image);
				} else {
					css(image, 'float', '');
					css(image, {
						display: 'block',
						'margin-left': 'auto',
						'margin-right': 'auto'
					});
				}
			} else {
				if (
					css(image, 'float') &&
					['right', 'left'].indexOf(
						(css(image, 'float') as string).toLowerCase()
					) !== -1
				) {
					css(image, 'float', '');
				}

				clearCenterAlign(image);
			}

			editor.setEditorValue();

			editor.e.fire('recalcPositionPopup');
		},
		tooltip: 'Horizontal align'
	}
] as Array<IControlType | string>;
