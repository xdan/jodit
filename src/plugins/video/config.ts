/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/video
 */

import type { IControlType, IJodit, IUIForm, IUploaderData } from 'jodit/types';
import { call, convertMediaUrlToVideoEmbed } from 'jodit/core/helpers';
import { Button } from 'jodit/core/ui/button';
import { UIBlock, UIForm, UIInput, UITextArea } from 'jodit/core/ui/form';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';
import { type TabOption, TabsWidget, UploadTab } from 'jodit/modules/widget';

import videoIcon from './video.svg';

declare module 'jodit/config' {
	interface Config {
		video: {
			/**
			 * Custom function for parsing video URL to embed code
			 * ```javascript
			 * Jodit.make('#editor', {
			 * 		video: {
			 * 			// Defaul behavior
			 * 			parseUrlToVideoEmbed: (url, size) => Jodit.modules.Helpers.convertMediaUrlToVideoEmbed(url, size)
			 * 		}
			 * });
			 * ```
			 */
			parseUrlToVideoEmbed?: (
				url: string,
				{
					width,
					height
				}?: {
					width?: number;
					height?: number;
				}
			) => string;
			/**
			 * Default width for video iframe. Default: 400
			 */
			defaultWidth?: number;
			/**
			 * Default height for video iframe. Default: 345
			 */
			defaultHeight?: number;
			/**
			 * Inserts the videos uploaded from the popup's Upload tab, which is shown
			 * when `uploader.url` or `uploader.customUploadFunction` is set. By default
			 * each one goes in as `<video controls src="…">`.
			 * ```javascript
			 * Jodit.make('#editor', {
			 * 		video: {
			 * 			defaultHandlerSuccess(data) {
			 * 				data.files.forEach(file => {
			 * 					this.s.insertHTML(`<video controls preload="metadata" src="${data.baseurl + file}"></video>`);
			 * 				});
			 * 			}
			 * 		}
			 * });
			 * ```
			 */
			defaultHandlerSuccess?: (this: IJodit, data: IUploaderData) => void;
		};
	}
}

function insertVideos(this: IJodit, data: IUploaderData): void {
	data.files?.forEach(file => {
		this.s.insertNode(
			this.createInside.element('video', {
				controls: '',
				src: data.baseurl + file
			})
		);
	});
}

Config.prototype.video = {
	parseUrlToVideoEmbed: convertMediaUrlToVideoEmbed,
	defaultWidth: 400,
	defaultHeight: 345,
	defaultHandlerSuccess: insertVideos
};

Icon.set('video', videoIcon);

Config.prototype.controls.video = {
	popup: (jodit: IJodit, current, close) => {
		const formLink: IUIForm = new UIForm(jodit, [
				new UIBlock(jodit, [
					new UIInput(jodit, {
						name: 'url',
						required: true,
						label: 'URL',
						placeholder: 'https://',
						validators: ['url']
					})
				]),
				new UIBlock(jodit, [
					Button(jodit, '', 'Insert', 'primary').onAction(() =>
						formLink.submit()
					)
				])
			]),
			formCode: IUIForm = new UIForm(jodit, [
				new UIBlock(jodit, [
					new UITextArea(jodit, {
						name: 'code',
						required: true,
						label: 'Embed code'
					})
				]),
				new UIBlock(jodit, [
					Button(jodit, '', 'Insert', 'primary').onAction(() =>
						formCode.submit()
					)
				])
			]),
			tabs: TabOption[] = [],
			insertCode = (code: string): void => {
				jodit.s.restore();
				jodit.s.insertHTML(code);
				close();
			};

		jodit.s.save();

		const { uploader } = jodit.o;

		// Base64 alone would put whole video files into the content
		if (
			uploader.showTabInFileSelector !== false &&
			(uploader.url || uploader.customUploadFunction)
		) {
			tabs.push(
				UploadTab(
					jodit,
					data => {
						jodit.s.restore();
						(
							jodit.o.video?.defaultHandlerSuccess ?? insertVideos
						).call(jodit, data);
					},
					{ label: 'Drop file', accept: 'video/*' }
				)
			);
		}

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
			insertCode(
				call(
					jodit.o.video?.parseUrlToVideoEmbed ??
						convertMediaUrlToVideoEmbed,
					data.url,
					{
						width: jodit.o.video?.defaultWidth,
						height: jodit.o.video?.defaultHeight
					}
				)
			);
		});

		formCode.onSubmit(data => {
			insertCode(data.code);
		});

		return TabsWidget(jodit, tabs);
	},

	tags: ['iframe'],
	tooltip: 'Insert youtube/vimeo video'
} as IControlType;
