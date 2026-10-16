/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/video-properties
 */

import type { IJodit } from 'jodit/types';
import { component } from 'jodit/core/decorators/component/component';
import { hook } from 'jodit/core/decorators/hook/hook';
import { watch } from 'jodit/core/decorators/watch/watch';
import { Dom } from 'jodit/core/dom/dom';
import { isNumeric } from 'jodit/core/helpers/checker/is-numeric';
import { attr } from 'jodit/core/helpers/utils/attr';
import { css } from 'jodit/core/helpers/utils/css';
import { UIElement } from 'jodit/core/ui/element';
import { Icon } from 'jodit/core/ui/icon';

import type {
	VideoPropertiesAPI,
	VideoPropertiesState,
	VideoPropertiesValues
} from '../interface';

import './ui-video-form.less';

const flags = {
	autoplay: 'Autoplay',
	loop: 'Loop',
	muted: 'Muted',
	controls: 'Controls'
} as const;

type Flag = keyof typeof flags & keyof VideoPropertiesValues;

const checkbox = ([flag, label]: [string, string]): string =>
	`<label class="jodit_vertical_middle">
		<input type="checkbox" class="jodit-checkbox &__${flag}"/>
		<span>~${label}~</span>
	</label>`;

/** @private */
@component
export class UIVideoPropertiesForm extends UIElement<IJodit> {
	override className(): string {
		return 'UIVideoPropertiesForm';
	}

	constructor(
		jodit: IJodit,
		private state: VideoPropertiesState,
		private handlers: VideoPropertiesAPI
	) {
		super(jodit);
	}

	protected override render(): string {
		return `<form>
			<div class="jodit-form__group &__previewBox">
				<img class="&__preview" alt=""/>
			</div>
			<div class="jodit-form__group &__sizes">
				<input type="text" class="jodit-input &__width" placeholder="~Width~" aria-label="~Width~"/>
				<a class="&__lockSize">*lock*</a>
				<input type="text" class="jodit-input &__height" placeholder="~Height~" aria-label="~Height~"/>
			</div>
			<div class="jodit-form__group &__editPoster">
				<label>~Poster~</label>
				<div class="jodit-input_group">
					<input type="text" class="jodit-input &__poster" placeholder="https://"/>
					<div class="jodit-input_group-buttons">
						<a class="jodit-button &__changePoster" title="~Upload~">*image*</a>
						<a class="jodit-button &__removePoster" title="~Remove~">*bin*</a>
					</div>
				</div>
			</div>
			<div class="jodit-form__group &__playback">
				${Object.entries(flags).map(checkbox).join('')}
			</div>
		</form>`;
	}

	private input(name: string): HTMLInputElement {
		return this.getElm(name) as HTMLInputElement;
	}

	private show(name: string, shown: boolean): void {
		css(this.getElm(name)!, 'display', shown ? null : 'none');
	}

	/**
	 * A video has every field, an embed only its size, and audio only its
	 * playback settings
	 */
	@hook('ready')
	@watch('state.media')
	protected onStateMediaChange(): void {
		const { media } = this.state;

		this.show('editPoster', Dom.isTag(media, 'video'));
		this.show('sizes', !Dom.isTag(media, 'audio'));
		this.show('playback', !Dom.isTag(media, 'iframe'));
		this.showPreview();
	}

	// A video's poster, when it has one
	private showPreview(): void {
		const { media, values } = this.state;
		const shown = Dom.isTag(media, 'video') && Boolean(values.poster);

		this.show('previewBox', shown);
		attr(this.getElm('preview')!, 'src', shown ? values.poster : null);
	}

	@hook('ready')
	protected hideChangePoster(): void {
		const { uploader, filebrowser } = this.j.o;

		// What FileSelectorWidget offers
		const canUpload =
			uploader.showTabInFileSelector !== false &&
			Boolean(
				uploader.url ||
				uploader.insertImageAsBase64URI ||
				uploader.customUploadFunction
			);
		const canBrowse = Boolean(
			filebrowser.ajax.url || filebrowser.items.url
		);

		this.show('changePoster', canUpload || canBrowse);
	}

	@hook('ready')
	@watch('state.values.poster')
	protected onStatePosterChange(): void {
		const { poster } = this.state.values;

		this.input('poster').value = poster;
		this.show('removePoster', Boolean(poster));
		this.showPreview();
	}

	@watch('poster:change')
	protected onPosterChange(): void {
		this.state.values.poster = this.input('poster').value;
	}

	@watch('changePoster:click')
	protected onChangePosterClick(e: MouseEvent): void {
		this.handlers.openPosterPopup(this.getElm('changePoster')!);
		e.stopPropagation();
	}

	@watch('removePoster:click')
	protected onRemovePosterClick(): void {
		this.state.values.poster = '';
	}

	@hook('ready')
	@watch('state.sizeIsLocked')
	protected onStateSizeIsLockedChange(): void {
		this.getElm('lockSize')!.innerHTML = Icon.get(
			this.state.sizeIsLocked ? 'lock' : 'unlock'
		);
	}

	@watch('lockSize:click')
	protected onLockSizeClick(): void {
		const { state } = this;
		const { values } = state;

		state.sizeIsLocked = !state.sizeIsLocked;

		if (state.sizeIsLocked && isNumeric(values.width)) {
			values.height = Math.round(
				parseFloat(values.width.toString()) / state.ratio
			);
		}
	}

	@hook('ready')
	@watch(['state.values.width', 'state.values.height'])
	protected onStateSizeChange(): void {
		const { values } = this.state;

		// Not the field being typed in
		(['width', 'height'] as const).forEach(key => {
			const input = this.input(key);

			if (input !== this.j.od.activeElement) {
				input.value = values[key].toString();
			}
		});
	}

	@watch(['width:input', 'height:input', 'width:change', 'height:change'])
	protected onSizeInput(e: Event): void {
		const { state } = this;
		const { values } = state;
		// Both read first, since setting one rewrites the other's field
		const width = this.input('width').value;
		const height = this.input('height').value;

		if (!state.sizeIsLocked || !isNumeric(width) || !isNumeric(height)) {
			values.width = width;
			values.height = height;
			return;
		}

		const w = parseFloat(width);
		const h = parseFloat(height);

		if (e.target === this.input('width')) {
			values.width = w;
			values.height = Math.round(w / state.ratio);
		} else {
			values.width = Math.round(h * state.ratio);
			values.height = h;
		}
	}

	/**
	 * Autoplay mutes it, and it keeps its controls unless it autoplays
	 */
	@hook('ready')
	@watch(Object.keys(flags).map(flag => `state.values.${flag}`))
	protected onStateFlagsChange(): void {
		const { values } = this.state;

		this.input('autoplay').checked = values.autoplay;
		this.input('loop').checked = values.loop;
		this.input('muted').checked = values.muted || values.autoplay;
		this.input('muted').disabled = values.autoplay;
		this.input('controls').checked = values.controls || !values.autoplay;
		this.input('controls').disabled = !values.autoplay;
	}

	@watch(Object.keys(flags).map(flag => `${flag}:change`))
	protected onFlagChange(e: Event): void {
		(Object.keys(flags) as Flag[]).forEach(flag => {
			const input = this.input(flag);

			if (e.target === input) {
				this.state.values[flag] = input.checked;
			}
		});
	}
}
