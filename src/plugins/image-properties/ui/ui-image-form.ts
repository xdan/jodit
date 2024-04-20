/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IComponent,
	IContainer,
	IElms,
	IJodit,
	Nullable
} from 'jodit/types';
import { debounce, hook, watch } from 'jodit/core/decorators';
import { component } from 'jodit/core/decorators/component/component';
import { attr, css, isNumeric } from 'jodit/core/helpers';
import { UIGroup } from 'jodit/core/ui/group/group';
import { Icon } from 'jodit/core/ui/icon';
import { TabsWidget } from 'jodit/modules/widget';

import type { ImagePropertiesAPI, ImagePropertiesState } from '../interface';

import { UIImageMainTab } from './ui-image-main-tab';
import { UIImagePositionTab } from './ui-image-position-tab';

import './ui-image-form.less';

/** @private */
@component
export class UIImagePropertiesForm extends UIGroup<IJodit> {
	override className(): string {
		return 'UIImagePropertiesForm';
	}

	override appendChildToContainer(): void {}

	override getElm<T extends IComponent & IContainer & IElms>(
		elementName: string
	): Nullable<HTMLElement> {
		const selfElm = super.getElm(elementName);
		if (selfElm) {
			return selfElm;
		}

		for (const child of this.elements) {
			const elm = child.getElm(elementName);
			if (elm) {
				return elm;
			}
		}

		return null;
	}

	private __mainTab = new UIImageMainTab(
		this.jodit,
		this.state,
		this.handlers
	);
	private __positionTab = new UIImagePositionTab(
		this.jodit,
		this.state,
		this.handlers
	);

	constructor(
		jodit: IJodit,
		private state: ImagePropertiesState,
		activeTabState: { activeTab: 'Image' | 'Advanced' },
		private handlers: ImagePropertiesAPI
	) {
		super(jodit);

		this.getElm('tabsBox')!.appendChild(
			TabsWidget(
				jodit,
				[
					{ name: 'Image', content: this.__mainTab },
					{ name: 'Advanced', content: this.__positionTab }
				],
				activeTabState
			)
		);

		this.setMod('lock-size', this.state.sizeIsLocked);

		this.append(this.__mainTab).append(this.__positionTab);
	}

	protected override render(): string {
		return `<form>
		<div class="jodit-grid jodit-grid_xs-column">
			<div class="jodit_col-lg-2-5 jodit_col-xs-5-5">
				<div class="&__view-box">
					<div class="&__imageView">
						<img class="&__imageViewSrc" src="" alt=""/>
					</div>
					<div class="jodit-form__group &__imageSizes">
						<input type="text" class="jodit-input &__imageWidth"/>
						<a class="&__lockSize">${Icon.get('lock')}</a>
						<input type="text" class="&__imageHeight jodit-input"/>
					</div>
				</div>
			</div>
			<div class="jodit_col-lg-3-5 jodit_col-xs-5-5 &__tabsBox"></div>
		</div>
	</form>`;
	}

	@hook('ready')
	@watch('state.sizeIsLocked')
	protected onChangeSizeIsLocked(): void {
		const lockSize = this.getElm('lockSize') as HTMLElement;
		const imageWidth = this.getElm('imageWidth') as HTMLInputElement;

		lockSize.innerHTML = Icon.get(
			this.state.sizeIsLocked ? 'lock' : 'unlock'
		);

		this.setMod('lock-size', this.state.sizeIsLocked);

		this.j.e.fire(imageWidth, 'change');
	}

	@watch('lockSize:click')
	protected onLockSizeClick(): void {
		this.state.sizeIsLocked = !this.state.sizeIsLocked;
	}

	@hook('ready')
	@watch(['state.values.imageWidth', 'state.values.imageHeight'])
	protected onStateValuesSizeChange(): void {
		const imageWidth = this.getElm('imageWidth') as HTMLInputElement;
		const imageHeight = this.getElm('imageHeight') as HTMLInputElement;

		if (imageWidth !== this.j.od.activeElement) {
			imageWidth.value = this.state.values.imageWidth.toString();
		}

		if (imageHeight !== this.j.od.activeElement) {
			imageHeight.value = this.state.values.imageHeight.toString();
		}
	}

	@watch([
		'imageWidth:change',
		'imageHeight:change',
		'imageWidth:keydown',
		'imageHeight:keydown',
		'imageWidth:mousedown',
		'imageHeight:mousedown',
		'imageWidth:paste',
		'imageHeight:paste'
	])
	@debounce()
	protected onImageWidthChange(e: Event): void {
		const imageWidth = this.getElm('imageWidth') as HTMLInputElement;
		const imageHeight = this.getElm('imageHeight') as HTMLInputElement;

		if (
			!this.state.sizeIsLocked ||
			!isNumeric(imageWidth.value) ||
			!isNumeric(imageHeight.value)
		) {
			this.state.values.imageWidth = imageWidth.value;
			this.state.values.imageHeight = imageHeight.value;
			return;
		}

		const w = parseFloat(imageWidth.value),
			h = parseFloat(imageHeight.value);

		if (e.target === imageWidth) {
			this.state.values.imageWidth = w;
			this.state.values.imageHeight = Math.round(w / this.state.ratio);
		} else {
			this.state.values.imageWidth = Math.round(h * this.state.ratio);
			this.state.values.imageHeight = h;
		}
	}

	@hook('ready')
	@watch('state.values.imageSrc')
	protected onStateValuesImageSrcChange(): void {
		const { imageSrc } = this.state.values;
		if (!imageSrc) {
			return;
		}
		const imageViewSrc = this.getElm('imageViewSrc') as HTMLImageElement;
		attr(imageViewSrc, 'src', imageSrc);

		const image = new Image();
		image.src = imageSrc;
		this.state.image = image;
	}

	@hook('ready')
	protected hideFieldByOptions(): void {
		const opt = this.j.o.image;

		(
			[
				['editSize', 'imageSizes'],
				['showPreview', 'imageView']
			] as const
		).forEach(([optKey, elmKey]) => {
			const elm = this.getElm(elmKey) as HTMLElement;
			css(elm, 'display', opt[optKey] ? null : 'none');
		});
	}
}
