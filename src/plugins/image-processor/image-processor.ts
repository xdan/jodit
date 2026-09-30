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
import { INVISIBLE_SPACE_REG_EXP, SOURCE_CONSUMER } from 'jodit/core/constants';
import { autobind, cached, debounce, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { $$, dataBind } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { dataURItoBlob } from 'jodit/modules/uploader/helpers/data-uri-to-blob';

import './config';

import './image-processor.less';

const JODIT_IMAGE_PROCESSOR_BINDED = '__jodit_imageprocessor_binded';
const JODIT_IMAGE_BLOB_ID = JODIT_IMAGE_PROCESSOR_BINDED + 'blob-id';
const IMAGE_SELECTED = 'jodit-wysiwyg_image-selected';

/**
 * Change editor's size after load all images
 */
export class imageProcessor extends Plugin {
	protected afterInit(jodit: IJodit): void {
		jodit.e.on(jodit.ed, 'selectionchange', this.onSelectionChange);
	}

	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off(jodit.ed, 'selectionchange', this.onSelectionChange);
		jodit.editor.classList.remove(IMAGE_SELECTED);

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

	/**
	 * While the selection is an image, only the image is highlighted: Safari
	 * paints the rest of a block image's line with its parent's highlight. See #1528
	 */
	@autobind
	private onSelectionChange(): void {
		const { jodit } = this;

		jodit.editor.classList.toggle(IMAGE_SELECTED, isImageSelected(jodit));
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
					removeCaretText(elm);
					editor.s.select(elm);
				});
			}
		});
	}
}

function isImageSelected(jodit: IJodit): boolean {
	const { sel } = jodit.s;

	if (!sel || !sel.rangeCount) {
		return false;
	}

	const { startContainer, startOffset, endContainer, endOffset } =
		sel.getRangeAt(0);

	return (
		startContainer === endContainer &&
		endOffset === startOffset + 1 &&
		Dom.isTag(startContainer.childNodes[startOffset], 'img') &&
		Dom.isOrContains(jodit.editor, startContainer)
	);
}

/**
 * Remove the invisible-space text beside an image, which only held a caret.
 * Selecting the image replaces the caret, and with the text still after a
 * block image, Safari highlights the rest of the image's line. See #1512
 */
function removeCaretText(elm: HTMLImageElement): void {
	for (const side of ['previousSibling', 'nextSibling'] as const) {
		let node = elm[side];

		while (
			Dom.isText(node) &&
			!node.nodeValue?.replace(INVISIBLE_SPACE_REG_EXP(), '')
		) {
			const next: ChildNode | null = node[side];
			Dom.safeRemove(node);
			node = next;
		}
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
