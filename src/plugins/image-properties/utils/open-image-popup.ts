/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDialog, IFileBrowserCallBackData, IJodit } from 'jodit/types';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { position } from 'jodit/core/helpers/size/position';
import { Popup } from 'jodit/core/ui/popup/popup';
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
						if (data.files && data.files.length) {
							state.values.imageSrc =
								data.baseurl + data.files[0];
						}

						closePopup();
					},

					filebrowser: async (data: IFileBrowserCallBackData) => {
						if (data && isArray(data.files) && data.files.length) {
							state.values.imageSrc = data.files[0];
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
