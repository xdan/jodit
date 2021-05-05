/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IJodit, IUIForm } from '../../../types';
import { Config } from '../../../config';
import { TabOption, TabsWidget } from '../../../modules/widget';
import { convertMediaUrlToVideoEmbed } from '../../../core/helpers';
import { UIForm, UIInput, UITextArea, UIBlock } from '../../../core/ui/form';
import { Button } from '../../../core/ui/button';

Config.prototype.controls.video = {
	popup: (editor: IJodit, current, control, close) => {
		const bylink: IUIForm = new UIForm(editor, [
				new UIBlock(editor, [
					new UIInput(editor, {
						name: 'url',
						required: true,
						label: 'URL',
						placeholder: 'https://',
						validators: ['url']
					})
				]),
				new UIBlock(editor, [
					Button(editor, '', 'Insert', 'primary').onAction(() =>
						bylink.submit()
					)
				])
			]),
			bycode: IUIForm = new UIForm(editor, [
				new UIBlock(editor, [
					new UITextArea(editor, {
						name: 'code',
						required: true,
						label: 'Embed code'
					})
				]),
				new UIBlock(editor, [
					Button(editor, '', 'Insert', 'primary').onAction(() =>
						bycode.submit()
					)
				])
			]),
			tabs: TabOption[] = [],
			insertCode = (code: string) => {
				editor.s.restore();
				editor.s.insertHTML(code);
				close();
			};

		editor.s.save();

		tabs.push(
			{
				icon: 'link',
				name: 'Link',
				content: bylink.container
			},
			{
				icon: 'source',
				name: 'Code',
				content: bycode.container
			}
		);

		bylink.onSubmit(data => {
			insertCode(convertMediaUrlToVideoEmbed(data.url));
		});

		bycode.onSubmit(data => {
			insertCode(data.code);
		});

		return TabsWidget(editor, tabs);
	},

	tags: ['iframe'],
	tooltip: 'Insert youtube/vimeo video'
} as IControlType;
