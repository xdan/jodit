/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, IUIForm } from '../../types';
import {
	UIBlock,
	UICheckbox,
	UIForm,
	UIInput,
	UISelect
} from '../../core/ui/form';
import { UIButton } from '../../core/ui/button';

export const formTemplate = (editor: IJodit): IUIForm => {
	const {
		openInNewTabCheckbox,
		noFollowCheckbox,
		modeClassName,
		selectSizeClassName,
		selectMultipleClassName,
		selectOptionsClassName
	} = editor.o.link;

	return new UIForm(editor, [
		new UIBlock(editor, [
			new UIInput(editor, {
				name: 'url',
				type: 'text',
				ref: 'url_input',
				label: 'URL',
				placeholder: 'http://',
				required: true
			})
		]),
		new UIBlock(
			editor,
			[
				new UIInput(editor, {
					name: 'content',
					ref: 'content_input',
					label: 'Text'
				})
			],
			{
				ref: 'content_input_box'
			}
		),
		modeClassName
			? new UIBlock(editor, [
					(() => {
						if (modeClassName === 'input') {
							return new UIInput(editor, {
								name: 'className',
								ref: 'className_input',
								label: 'Class name'
							});
						}

						if (modeClassName === 'select') {
							return new UISelect(editor, {
								name: 'className',
								ref: 'className_select',
								label: 'Class name',
								size: selectSizeClassName,
								multiple: selectMultipleClassName,
								options: selectOptionsClassName
							});
						}

						return null;
					})()
			  ])
			: null,
		openInNewTabCheckbox
			? new UICheckbox(editor, {
					name: 'target',
					ref: 'target_checkbox',
					label: 'Open in new tab'
			  })
			: null,
		noFollowCheckbox
			? new UICheckbox(editor, {
					name: 'nofollow',
					ref: 'nofollow_checkbox',
					label: 'No follow'
			  })
			: null,
		new UIBlock(
			editor,
			[
				new UIButton(editor, {
					name: 'unlink',
					status: 'default',
					text: 'Unlink'
				}),
				new UIButton(editor, {
					name: 'insert',
					type: 'submit',
					status: 'primary',
					text: 'Insert'
				})
			],
			{
				align: 'full'
			}
		)
	]);
};
