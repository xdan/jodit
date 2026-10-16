/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/video-properties/README.md]]
 * @packageDocumentation
 * @module plugins/video-properties
 */

import type {
	IDestructible,
	IDialog,
	IFileBrowserCallBackData,
	IUIButton
} from 'jodit/types';
import { cache, cached, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { position } from 'jodit/core/helpers/size/position';
import { markOwner } from 'jodit/core/helpers/utils/utils';
import { Plugin } from 'jodit/core/plugin/plugin';
import { Button } from 'jodit/core/ui/button';
import { Popup } from 'jodit/core/ui/popup/popup';
import { FileSelectorWidget } from 'jodit/modules/widget/file-selector/file-selector';

import type { VideoPropertiesState } from './interface';
import { UIVideoPropertiesForm } from './ui/ui-video-form';
import { editedMedia, readValues } from './readers';
import { replaceMedia } from './replace';
import { applyValues } from './writers';

import { videoTabs } from 'jodit/plugins/video/config';

/**
 * Show a dialog with the size, poster and playback settings of a video, an
 * embed or audio. The media popup's Edit button opens it:
 *
 * ```javascript
 * editor.events.fire('openVideoProperties', video);
 * ```
 */
export class videoProperties extends Plugin {
	protected state: VideoPropertiesState = {
		target: this.j.c.element('video'),
		media: this.j.c.element('video'),
		ratio: 1,
		sizeIsLocked: true,
		values: {
			width: '',
			height: '',
			poster: '',
			autoplay: false,
			loop: false,
			muted: false,
			controls: true
		}
	};

	// The size as it was read, so an unchanged one isn't written
	private __readSize: string = '';

	private get __size(): string {
		const { width, height } = this.state.values;
		return `${width}x${height}`;
	}

	@cache
	private get form(): UIVideoPropertiesForm {
		return new UIVideoPropertiesForm(this.j, this.state, {
			openPosterPopup: target => this.__openPosterPopup(target)
		});
	}

	@cache
	private get dialog(): IDialog {
		const { j } = this;
		const dialog = j.dlg({
			minWidth: Math.min(400, screen.width),
			buttons: ['dialog.close']
		});

		const buttons = this.__buttons;

		buttons.check.onAction(() => {
			applyValues(j, this.state, this.__size !== this.__readSize);
			j.synchronizeValues();
			dialog.close();
		});

		buttons.remove.onAction(() => {
			j.s.removeNode(this.state.target);
			dialog.close();
		});

		buttons.cancel.onAction(() => {
			dialog.close();
		});

		dialog.setContent(this.form);
		dialog.setFooter([[buttons.cancel, buttons.remove], buttons.check]);
		markOwner(j, dialog.container);

		return dialog;
	}

	@cache
	private get __buttons(): Record<string, IUIButton> {
		const { j } = this;

		return {
			check: Button(j, 'ok', 'Apply', 'primary'),
			remove: Button(j, 'bin', 'Delete'),
			cancel: Button(j, 'cancel', 'Cancel')
		};
	}

	/**
	 * Open the dialog for the media `target` is, or is the wrapper of
	 */
	@watch(':openVideoProperties')
	protected open(target: HTMLElement): void {
		const media = editedMedia(target);

		if (!media) {
			return;
		}

		this.state.target = target;
		this.state.media = media;
		readValues(this.state);
		this.__readSize = this.__size;

		this.dialog.setHeader(
			this.j.i18n(
				Dom.isTag(media, 'audio')
					? 'Audio properties'
					: 'Video properties'
			)
		);
		this.dialog.open().setModal(true).setPosition();
	}

	/**
	 * The video popup's tabs for the media popup's Replace: what they insert
	 * takes the place of the media `target` is, or is the wrapper of
	 */
	@watch(':generateReplaceVideoTabs')
	protected onGenerateReplaceVideoTabs(
		target: HTMLElement,
		close: () => void
	): HTMLElement {
		return videoTabs(this.j, close, insert =>
			replaceMedia(this.j, target, insert)
		);
	}

	private __openPosterPopup(button: HTMLElement): void {
		const { j, state } = this;
		const popup = new Popup(this.dialog);

		const close = (): void => {
			popup.close();
			popup.destruct();
		};

		popup
			.setContent(
				FileSelectorWidget(
					j,
					{
						upload: (data: IFileBrowserCallBackData) => {
							if (data.files && data.files.length) {
								state.values.poster =
									data.baseurl + data.files[0];
							}

							close();
						},

						filebrowser: (data: IFileBrowserCallBackData) => {
							if (isArray(data.files) && data.files.length) {
								state.values.poster = data.files[0];
								close();
							}
						}
					},
					null,
					close
				)
			)
			.open(() => position(button));
	}

	/** @override */
	protected afterInit(): void {}

	/** @override */
	protected beforeDestruct(): void {
		Object.values(
			cached<Record<string, IDestructible>>(this, '__buttons') ?? {}
		).forEach(b => b.destruct());
		cached<IDestructible>(this, 'dialog')?.destruct();
		cached<IDestructible>(this, 'form')?.destruct();
	}
}

pluginSystem.add('videoProperties', videoProperties);
