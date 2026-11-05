/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { IDialog, IFileBrowserCallBackData, IJodit } from 'jodit/types';
import { position } from 'jodit/core/helpers/size/position';
import { Popup } from 'jodit/core/ui/popup/popup';
import { getItems } from 'jodit/modules/uploader/helpers/normalize-uploader-data';
import { FileSelectorWidget } from 'jodit/modules/widget/file-selector/file-selector';

import type { ImagePropertiesState } from '../interface';

/** @private */
export function openImagePopup(
	j: IJodit,
	dialog: IDialog,
	state: ImagePropertiesState,
	button: HTMLElement
): void {
	const popup = new Popup(dialog);

	const closePopup = (): void => {
		popup.close();
		popup.destruct();
	};

	popup
		.setContent(
			FileSelectorWidget(
				j,
				{
					upload: (data: IFileBrowserCallBackData) => {
						const [item] = getItems(data);

						if (item) {
							state.values.imageSrc = data.baseurl + item.file;
						}

						closePopup();
					},

					filebrowser: async (data: IFileBrowserCallBackData) => {
						const [item] = data ? getItems(data) : [];

						if (item) {
							state.values.imageSrc = item.file;
							closePopup();
						}
					}
				},
				state.image,
				closePopup
			)
		)
		.open(() => position(button));
}
