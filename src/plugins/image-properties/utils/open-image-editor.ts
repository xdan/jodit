/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { attr } from 'jodit/core/helpers/utils/attr';
import { openImageEditor } from 'jodit/modules/image-editor/image-editor';

import type { ImagePropertiesState } from '../interface';

/**
 * Open image editor dialog
 * @private
 */
export function openImageEditorDialog(
	j: IJodit,
	state: ImagePropertiesState
): void {
	const url: string = attr(state.image, 'src') || '',
		a = j.c.element('a'),
		loadExternal = (): void => {
			if (a.host !== location.host) {
				j.confirm(
					'You can only edit your own images. Download this image on the host?',
					yes => {
						if (yes && j.uploader) {
							j.uploader.uploadRemoteImage(
								a.href.toString(),
								resp => {
									j.alert(
										'The image has been successfully uploaded to the host!',
										() => {
											if (isString(resp.newfilename)) {
												state.values.imageSrc =
													resp.baseurl +
													resp.newfilename;
											}
										}
									);
								},
								error => {
									j.alert(
										'There was an error loading %s',
										error.message
									);
								}
							);
						}
					}
				);
				return;
			}
		};

	a.href = url;

	j.filebrowser.dataProvider
		.getPathByUrl(a.href.toString())
		.then(resp => {
			openImageEditor.call(
				j.filebrowser,
				a.href,
				resp.name,
				resp.path,
				resp.source,
				() => {
					const timestamp: number = new Date().getTime();

					state.values.imageSrc =
						url +
						(url.indexOf('?') !== -1 ? '' : '?') +
						'&_tmp=' +
						timestamp.toString();
				},
				error => {
					j.alert(error.message);
				}
			);
		})
		.catch(error => {
			j.alert(error.message, loadExternal);
		});
}
