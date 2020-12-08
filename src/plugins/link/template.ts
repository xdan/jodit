/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, IUIForm } from '../../types';
import { UIBlock, UICheckbox, UIForm, UIInput, UISelect } from '../../core/ui/form';
import { UIButton } from '../../core/ui/button';

export const formTemplate = (editor: IJodit): IUIForm => {
	const { openInNewTabCheckbox, noFollowCheckbox, modeClassName } = editor.o.link;

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
		modeClassName
			? new UIBlock(editor, 
				[
					(modeClassName == 'input')
						? new UIInput(editor, {
							name: 'className',
							ref: 'className_input',
							label: 'Class name'
						})
						: (modeClassName == 'select')
							? new UISelect(editor, {
								name: 'className',
								ref: 'className_select',
								label: 'Class name',
								// TODO BB : avoir une option pour ça
								size: 3,
								// TODO BB : avoir une option pour ça
								multiple: true,
								// TODO BB : Récupérer la liste des classes via un autre module
								// TODO BB : ce module pourra récupérer les classes via :
								// TODO BB :   - les options de Jodit
								// TODO BB :   - une url à appeler en Ajax
								// TODO BB : il aura également une notion de context pour avoir des listes différentes selon que c'est un lien, un style, une table, ...
								options: [
									{ value: "", text: "" },
									{ value: "val1", text: "text1" },
									{ value: "val2", text: "text2" },
									{ value: "val3", text: "text3" }
								]
							})
							: null
				]
			)
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
