/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/video
 */

import type { IControlType, IJodit, IUIForm } from 'jodit/types';
import { convertMediaUrlToVideoEmbed } from 'jodit/core/helpers';
import { Button } from 'jodit/core/ui/button';
import { UIBlock, UIForm, UIInput, UITextArea } from 'jodit/core/ui/form';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';
import { type TabOption, TabsWidget } from 'jodit/modules/widget';

import videoIcon from './video.svg';

Icon.set('video', videoIcon);

Config.prototype.controls.video = {
	popup: (editor: IJodit, current, close) => {
		const formLink: IUIForm = new UIForm(editor, [
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
						formLink.submit()
					)
				])
			]),
			formCode: IUIForm = new UIForm(editor, [
				new UIBlock(editor, [
					new UITextArea(editor, {
						name: 'code',
						required: true,
						label: 'Embed code'
					})
				]),
				new UIBlock(editor, [
					Button(editor, '', 'Insert', 'primary').onAction(() =>
						formCode.submit()
					)
				])
			]),
			tabs: TabOption[] = [],
			insertCode = (code: string): void => {
				editor.s.restore();
				editor.s.insertHTML(code);
				close();
			};

		editor.s.save();

		tabs.push(
			{
				icon: 'link',
				name: 'Link',
				content: formLink.container
			},
			{
				icon: 'source',
				name: 'Code',
				content: formCode.container
			}
		);

		formLink.onSubmit(data => {
			insertCode(convertMediaUrlToVideoEmbed(data.url));
		});

		formCode.onSubmit(data => {
			insertCode(data.code);
		});

		return TabsWidget(editor, tabs);
	},

	tags: ['iframe'],
	tooltip: 'Insert youtube/vimeo video'
} as IControlType;
