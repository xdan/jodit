/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import { component } from 'jodit/core/decorators/component/component';
import { hook } from 'jodit/core/decorators/hook/hook';
import { watch } from 'jodit/core/decorators/watch/watch';
import { css } from 'jodit/core/helpers';
import { UIGroup } from 'jodit/core/ui/group/group';

import type { ImagePropertiesAPI, ImagePropertiesState } from '../interface';

/** @private */
@component
export class UIImageMainTab extends UIGroup<IJodit> {
	override className(): string {
		return 'UIImageMainTab';
	}

	override appendChildToContainer(): void {
		// Do nothing
	}

	constructor(
		view: IJodit,
		private state: ImagePropertiesState,
		private handlers: ImagePropertiesAPI
	) {
		super(view);
	}

	protected override render(): string {
		return `<div class="jodit-form__group &__editSrc">
			<label>~Src~</label>
			<div class="jodit-input_group">
				<input class="jodit-input &__imageSrc" type="text"/>
				<div class="jodit-input_group-buttons &__fixImage">
						<a class="jodit-button &__changeImage">*image*</a>
						<a class="jodit-button &__editImage">*crop*</a>
				</div>
			</div>
		</div>
		<div class="jodit-form__group &__editTitle">
			<label>~Title~</label>
			<input type="text" class="jodit-input &__imageTitle"/>
		</div>
		<div class="jodit-form__group &__editAlt">
			<label>~Alternative~</label>
			<input type="text" class="jodit-input &__imageAlt"/>
		</div>
		<div class="jodit-form__group &__editLink">
			<label>~Link~</label>
			<input type="text" class="jodit-input &__imageLink"/>
		</div>
		<div class="jodit-form__group &__editLinkTarget">
			<label class="jodit_vertical_middle">
				<input type="checkbox" class="jodit-checkbox &__imageLinkOpenInNewTab"/>
				<span>~Open link in new tab~</span>
			</label>
		</div>`;
	}

	@watch('state.values.imageSrc')
	protected async onStateImageSrcChange(): Promise<void> {
		const imageSrc = this.getElm('imageSrc') as HTMLInputElement;
		imageSrc.value = this.state.values.imageSrc;
	}

	@watch('imageSrc:change')
	protected onImageSrcChange(): void {
		this.state.values.imageSrc = (
			this.getElm('imageSrc') as HTMLInputElement
		).value;
	}

	/**
	 * Open image editor
	 */
	@watch('editImage:click')
	protected onEditImageClick(e: MouseEvent): void {
		this.handlers.openImageEditor();
		e.stopPropagation();
	}

	/**
	 * Open popup with filebrowser/uploader buttons for image
	 */
	@watch('changeImage:click')
	protected onChangeImageClick(e: MouseEvent): void {
		this.handlers.openImagePopup(this.getElm('changeImage') as HTMLElement);
		e.stopPropagation();
	}

	@watch('state.values.imageTitle')
	protected onStateTitleChange(): void {
		const title = this.getElm('imageTitle') as HTMLInputElement;
		title.value = this.state.values.imageTitle;
	}

	@watch('imageTitle:change')
	protected onTitleChange(): void {
		this.state.values.imageTitle = (
			this.getElm('imageTitle') as HTMLInputElement
		).value;
	}

	@watch('state.values.imageAlt')
	protected onStateAltChange(): void {
		const alt = this.getElm('imageAlt') as HTMLInputElement;
		alt.value = this.state.values.imageAlt;
	}

	@watch('imageAlt:change')
	protected onAltChange(): void {
		this.state.values.imageAlt = (
			this.getElm('imageAlt') as HTMLInputElement
		).value;
	}

	@watch('state.values.imageLink')
	protected onStateImageLinkChange(): void {
		const imageLink = this.getElm('imageLink') as HTMLInputElement;
		imageLink.value = this.state.values.imageLink;
	}

	@watch('imageLink:change')
	protected onImageLinkChange(): void {
		this.state.values.imageLink = (
			this.getElm('imageLink') as HTMLInputElement
		).value;
	}

	@watch('state.values.imageLinkOpenInNewTab')
	protected onStateImageLinkOpenInNewTabChange(): void {
		const imageLinkOpenInNewTab = this.getElm(
			'imageLinkOpenInNewTab'
		) as HTMLInputElement;
		imageLinkOpenInNewTab.checked = this.state.values.imageLinkOpenInNewTab;
	}

	@watch('imageLinkOpenInNewTab:change')
	protected onImageLinkOpenInNewTabChange(): void {
		this.state.values.imageLinkOpenInNewTab = (
			this.getElm('imageLinkOpenInNewTab') as HTMLInputElement
		).checked;
	}

	@hook('ready')
	protected hideFieldByOptions(): void {
		const o = this.j.o;
		const opt = o.image;

		(
			[
				['editSrc', 'editSrc'],
				['editTitle', 'editTitle'],
				['editAlt', 'editAlt'],
				['editLink', 'editLink'],
				['editLink', 'editLinkTarget'],
				['useImageEditor', 'editImage']
			] as const
		).forEach(([optKey, elmKey]) => {
			const elm = this.getElm(elmKey) as HTMLElement;
			css(elm, 'display', opt[optKey] ? null : 'none');
		});

		const changeImage = this.getElm('changeImage') as HTMLElement;
		const needShowChangeImage = Boolean(
			o.filebrowser.ajax.url || o.uploader.url
		);
		css(changeImage, 'display', needShowChangeImage ? null : 'none');

		const editImage = this.getElm('editImage') as HTMLElement;
		const needShowEditImage =
			Boolean(o.filebrowser.ajax.url) && opt.useImageEditor;
		css(editImage, 'display', needShowEditImage ? null : 'none');

		const fixImage = this.getElm('fixImage') as HTMLElement;
		css(
			fixImage,
			'display',
			needShowChangeImage || needShowEditImage ? null : 'none'
		);
	}
}
