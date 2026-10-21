/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/image-properties/README.md]]
 * @packageDocumentation
 * @module plugins/image-properties
 */

import type { IDestructible, IDialog, IJodit, IUIButton } from 'jodit/types';
import { cache, cached, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import {
	isAbortError,
	isNumeric,
	markOwner,
	toArray
} from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin/plugin';
import { Button } from 'jodit/core/ui/button';

import './config';

import type { ImagePropertiesState } from './interface';
import { UIImagePropertiesForm } from './ui/ui-image-form';
import { openImageEditorDialog } from './utils/open-image-editor';
import { openImagePopup } from './utils/open-image-popup';
import { readValuesFromImage } from './readers';
import { applyValuesToImage } from './writers';

/**
 * Plug-in for image editing window
 *
 * @example
 * ```javascript
 * const editor = Jodit.make('#editor', {
 *     image: {
 *         editSrc: false,
 *         editLink: false
 *     }
 * });
 * ```
 */

/**
 * Show dialog with image's options
 */
export class imageProperties extends Plugin {
	protected state: ImagePropertiesState = {
		image: new Image(),
		sourceImage: new Image(),
		get ratio(): number {
			const { naturalWidth, naturalHeight } = this.image;
			return naturalWidth / naturalHeight || 1;
		},
		sizeIsLocked: true,
		marginIsLocked: true,
		values: {
			style: '',
			imageSrc: '',
			borderRadius: 0,
			imageTitle: '',
			imageAlt: '',
			imageLink: '',
			imageLinkOpenInNewTab: false,
			imageWidth: 0,
			imageHeight: 0,
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			classes: '',
			id: '',
			align: ''
		}
	};

	private activeTabState: { activeTab: 'Image' | 'Advanced' } = {
		activeTab: 'Image'
	};

	@cache
	private get form(): UIImagePropertiesForm {
		return new UIImagePropertiesForm(
			this.j,
			this.state,
			this.activeTabState,
			{
				openImageEditor: () =>
					openImageEditorDialog(this.j, this.state),
				openImagePopup: target =>
					openImagePopup(this.j, this.dialog, this.state, target)
			}
		);
	}

	/**
	 * Dialog for form
	 */
	@cache
	private get dialog(): IDialog {
		const { j } = this;
		const dialog = j.dlg({
			minWidth: Math.min(400, screen.width),
			minHeight: 590,
			buttons: ['fullsize', 'dialog.close']
		});

		const buttons = this.__buttons;

		buttons.check.onAction(() => {
			applyValuesToImage(j, this.state, this.state.sourceImage);
			j.synchronizeValues();
			dialog.close();
		});

		buttons.remove.onAction(() => {
			const caret = j.s.createRange();
			caret.setStartBefore(this.state.sourceImage);
			caret.collapse(true);

			j.s.removeNode(this.state.sourceImage);
			dialog.close();
			j.s.selectRange(caret);
		});

		buttons.cancel.onAction(() => {
			dialog.close();
		});

		dialog.setHeader(j.i18n('Image properties'));

		dialog.setContent(this.form);

		dialog.setFooter([[buttons.cancel, buttons.remove], buttons.check]);

		// The dialog fires `afterClose` on its own emitter, not the editor's
		dialog.e.on(dialog, 'afterClose', () => {
			const { sourceImage } = this.state;

			if (j.isInDestruct || !Dom.isOrContains(j.editor, sourceImage)) {
				return;
			}

			if (j.o.image.selectImageAfterClose) {
				j.s.select(sourceImage);
				return;
			}

			const caret = j.s.createRange();
			caret.setStartAfter(sourceImage);
			caret.collapse(true);
			j.s.selectRange(caret);
		});

		dialog.setSize(j.o.image.dialogWidth);
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
	 * Open dialog editing image properties
	 *
	 * @example
	 * ```javascript
	 * const editor = Jodit.makeJodit('#editor');
	 *     img = editor.createInside.element('img');
	 *
	 * img.setAttribute('src', 'images/some-image.png');
	 * editor.s.insertImage(img);
	 * // open the properties of the editing window
	 * editor.events.fire('openImageProperties', img);
	 * ```
	 */
	protected open(): void | false {
		this.activeTabState.activeTab = 'Image';

		this.__lock();
		this.dialog.open().setModal(true).setPosition();

		this.__focusFirstField();

		this.async
			.promise((resolve, reject) =>
				readValuesFromImage(this.j, this.state).then(resolve, reject)
			)
			.catch((e: Error) => {
				if (!isAbortError(e)) {
					this.dialog.message.error(e.message);
				}
			})
			.finally(() => this.__unlock());

		return false;
	}

	/**
	 * Keys typed while the dialog is open must not reach the editor behind it,
	 * so focus the active tab's first field, or else the first field shown
	 */
	private __focusFirstField(): void {
		const fields = (box: HTMLElement): HTMLElement[] =>
			toArray(
				box.querySelectorAll<HTMLElement>('input, select, textarea')
			);

		fields(this.form.getElm('tabsBox')!)
			.concat(fields(this.form.container))
			.find(field => field.offsetParent != null)
			?.focus();
	}

	private __lock(): void {
		this.dialog.lock();
		this.form.setMod('lock', true);
		Object.values(this.__buttons).forEach(b => (b.state.disabled = true));
	}

	private __unlock(): void {
		this.dialog.unlock();
		this.form.setMod('lock', false);
		Object.values(this.__buttons).forEach(b => (b.state.disabled = false));
	}

	/** @override **/
	protected afterInit(editor: IJodit): void {
		const self = this;

		editor.e
			.on('afterConstructor changePlace', () => {
				editor.e
					.off(editor.editor, '.imageproperties')
					.on(
						editor.editor,
						'dblclick.imageproperties',
						(e: MouseEvent) => {
							const image = e.target;

							if (!Dom.isTag(image, 'img')) {
								return;
							}

							if (editor.o.image.openOnDblClick) {
								if (
									this.j.e.fire('openOnDblClick', image) ===
									false
								) {
									return;
								}

								self.state.sourceImage = image;
								self.state.image = image.cloneNode(
									true
								) as HTMLImageElement;

								if (!editor.o.readonly) {
									e.stopImmediatePropagation();
									e.preventDefault();

									self.open();
								}
							} else {
								e.stopImmediatePropagation();
								editor.s.select(image);
							}
						}
					);
			})
			.on(
				'openImageProperties.imageproperties',
				(image: HTMLImageElement) => {
					self.state.sourceImage = image;
					this.state.image = image.cloneNode(
						true
					) as HTMLImageElement;
					this.open();
				}
			);
	}

	@watch('state.image')
	protected async onStateValuesImageSrcChange(): Promise<void> {
		const { image, values } = this.state;
		if (!image.src) {
			return;
		}

		try {
			this.__lock();
			try {
				await image.decode();
			} catch (e: unknown) {
				console.error(e);
			}
			if (this.state.sizeIsLocked && isNumeric(values.imageWidth)) {
				const w = parseFloat(values.imageWidth.toString());
				values.imageHeight = Math.round(w / this.state.ratio);
			}
			this.j.e.fire('updateImageProperties.imageproperties', image);
		} catch (e: unknown) {
			this.j.alert((e as Error).message);
		} finally {
			this.__unlock();
		}
	}

	/** @override */
	protected beforeDestruct(editor: IJodit): void {
		Object.values(
			cached<Record<string, IDestructible>>(this, '__buttons') ?? {}
		).forEach(b => b.destruct());
		cached<IDestructible>(this, 'dialog')?.destruct();
		cached<IDestructible>(this, 'form')?.destruct();
		editor.e.off(editor.editor, '.imageproperties').off('.imageproperties');
	}
}

pluginSystem.add('imageProperties', imageProperties);
