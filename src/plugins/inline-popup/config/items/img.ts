/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type {
	HTMLTagNames,
	IControlType,
	IJodit,
	ImageHAlign
} from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { hAlignElement } from 'jodit/core/helpers/utils/align';
import { css } from 'jodit/core/helpers/utils/css';

export const align: IControlType<IJodit> = {
	name: 'left',
	childTemplate: (_, __, value: string) => value,
	list: ['Left', 'Right', 'Center', 'Normal'],
	exec: (editor: IJodit, elm, { control }): void | false => {
		if (
			!Dom.isTag(
				elm,
				new Set(['img', 'jodit', 'jodit-media'] as HTMLTagNames[])
			)
		) {
			return;
		}

		const command =
			control.args && isString(control.args[0])
				? control.args[0].toLowerCase()
				: '';

		if (!command) {
			return false;
		}

		hAlignElement(elm, command as ImageHAlign);

		if (
			Dom.isTag(
				elm,
				new Set(['jodit', 'jodit-media'] as HTMLTagNames[])
			) &&
			elm.firstElementChild
		) {
			hAlignElement(
				elm.firstElementChild as HTMLElement,
				command as ImageHAlign
			);
		}

		editor.synchronizeValues();

		editor.e.fire('recalcPositionPopup');
	},
	tooltip: 'Horizontal align'
};

export default [
	{
		name: 'delete',
		icon: 'bin',
		tooltip: 'Delete',
		exec: (editor: IJodit, image): void => {
			image && editor.s.removeNode(image);
		}
	},
	{
		name: 'pencil',
		exec(editor: IJodit, current): void {
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
