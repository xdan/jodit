/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/image-processor/README.md]]
 * @packageDocumentation
 * @module plugins/image-processor
 */

import type { IDictionary, IJodit, IStorage } from 'jodit/types';
import { SOURCE_CONSUMER } from 'jodit/core/constants';
import { cached, debounce, watch } from 'jodit/core/decorators';
import { pluginSystem } from 'jodit/core/global';
import { $$, dataBind } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { dataURItoBlob } from 'jodit/modules/uploader/helpers/data-uri-to-blob';

import './config';

const JODIT_IMAGE_PROCESSOR_BINDED = '__jodit_imageprocessor_binded';
const JODIT_IMAGE_BLOB_ID = JODIT_IMAGE_PROCESSOR_BINDED + 'blob-id';

/**
 * Change editor's size after load all images
 */
export class imageProcessor extends Plugin {
	protected afterInit(jodit: IJodit): void {}

	protected beforeDestruct(jodit: IJodit): void {
		const buffer = cached<IStorage>(jodit, 'buffer');
		const list = buffer?.get<IDictionary>(JODIT_IMAGE_BLOB_ID);

		if (buffer && list) {
			const keys = Object.keys(list);

			for (const uri of keys) {
				URL.revokeObjectURL(uri);
			}

			buffer.delete(JODIT_IMAGE_BLOB_ID);
		}
	}

	@watch(':afterGetValueFromEditor')
	protected onAfterGetValueFromEditor(
		data: { value: string },
		consumer?: string
	): void {
		if (consumer !== SOURCE_CONSUMER) {
			return this.onBeforeSetElementValue(data);
		}
	}

	@watch(':beforeSetElementValue')
	protected onBeforeSetElementValue(data: { value: string }): void {
		const { jodit: editor } = this;

		if (!editor.o.imageProcessor.replaceDataURIToBlobIdInView) {
			return;
		}

		const list = editor.buffer.get<IDictionary>(JODIT_IMAGE_BLOB_ID);

		if (list) {
			const keys = Object.keys(list);

			for (const uri of keys) {
				while (data.value.includes(uri)) {
					data.value = data.value.replace(uri, list[uri]);
				}
			}
		}
	}

	@watch([':change', ':afterInit', ':changePlace'])
	@debounce()
	protected async afterChange(data: { value: string }): Promise<void> {
		const { jodit: editor } = this;

		if (!editor.editor) {
			return;
		}

		$$('img', editor.editor).forEach(elm => {
			if (!dataBind(elm, JODIT_IMAGE_PROCESSOR_BINDED)) {
				dataBind(elm, JODIT_IMAGE_PROCESSOR_BINDED, true);

				if (!elm.complete) {
					editor.e.on(elm, 'load', function ElementOnLoad() {
						!editor.isInDestruct && editor.e?.fire('resize');

						editor.e.off(elm, 'load', ElementOnLoad);
					});
				}

				if (elm.src && /^data:/.test(elm.src)) {
					replaceDataURIToBlobUUID(editor, elm);
				}

				editor.e.on(elm, 'mousedown touchstart', () => {
					editor.s.select(elm);
				});
			}
		});
	}
}

function replaceDataURIToBlobUUID(editor: IJodit, elm: HTMLImageElement): void {
	if (!editor.o.imageProcessor.replaceDataURIToBlobIdInView) {
		return;
	}

	if (typeof ArrayBuffer === 'undefined' || typeof URL === 'undefined') {
		return;
	}

	const dataUri = elm.src;

	let blob: Blob;

	try {
		blob = dataURItoBlob(dataUri);
	} catch {
		// A data URI the browser accepts but we cannot decode is not worth
		// breaking the editor over — keep the image as it is
		return;
	}

	elm.src = URL.createObjectURL(blob);
	editor.e.fire('internalUpdate');

	const { buffer } = editor;

	const list: IDictionary =
		buffer.get<IDictionary>(JODIT_IMAGE_BLOB_ID) || {};

	list[elm.src] = dataUri;

	editor.buffer.set(JODIT_IMAGE_BLOB_ID, list);
}

pluginSystem.add('imageProcessor', imageProcessor);
