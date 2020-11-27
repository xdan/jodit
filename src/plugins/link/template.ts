/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, IUIForm } from '../../types';
import { UIBlock, UICheckbox, UIForm, UIInput, UISelect } from '../../core/ui/form';
import { UIButton } from '../../core/ui/button';

export const formTemplate = (editor: IJodit): IUIForm => {
	const { openInNewTabCheckbox, noFollowCheckbox } = editor.o.link;

	return new UIForm(editor, [
		new UIBlock(editor, [
			new UIInput(editor, {
				name: 'url',
				type: 'url',
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
		// TODO BB : alimenter la liste des classes via les options du plugin
		// TODO BB : alimenter la liste des classes via un appel ajax défini dans les options du plugin
		// TODO BB : Mettre ça en option
		// TODO BB : Permettre une alternative avec juste un input text
		new UIBlock(
			editor,
			[
				new UISelect(editor, {
					name: 'className',
					ref: 'className_input',
					label: 'Class name',
					options: [
						{ value: "", text: "" },
						{ value: "val1", text: "text1" },
						{ value: "val2", text: "text2" },
						{ value: "val3", text: "text3" }
					]
				})
			]
		),
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
