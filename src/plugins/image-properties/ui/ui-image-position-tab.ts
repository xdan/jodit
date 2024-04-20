/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, ImageHAlign } from 'jodit/types';
import { component } from 'jodit/core/decorators/component/component';
import { hook } from 'jodit/core/decorators/hook/hook';
import { watch } from 'jodit/core/decorators/watch/watch';
import { css } from 'jodit/core/helpers';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { attr } from 'jodit/core/helpers/utils/attr';
import { UIElement } from 'jodit/core/ui/element';
import { Icon } from 'jodit/core/ui/icon';

import type { ImagePropertiesAPI, ImagePropertiesState } from '../interface';
import { normalSizeFromString } from '../utils/utils';

/** @private */
@component
export class UIImagePositionTab extends UIElement<IJodit> {
	className(): string {
		return 'UIImagePositionTab';
	}

	constructor(
		jodit: IJodit,
		private state: ImagePropertiesState,
		protected handlers: ImagePropertiesAPI
	) {
		super(jodit, {
			availableClasses: jodit.o.image.availableClasses
		});
	}

	protected override render({
		availableClasses
	}: {
		availableClasses?: string[] | Array<[string, string]>;
	}): string {
		return `<div class="jodit-form__group &__editMargins">
			<label>~Margins~</label>
			<div class="jodit-grid jodit_vertical_middle">
				<input class="jodit_col-lg-1-5 jodit-input &__marginTop" type="text" placeholder="~top~"/>
				<a style="text-align: center;" class="jodit-properties__lock jodit_col-lg-1-5 &__lockMargin">*lock*</a>
				<input disabled="disabled" class="jodit_col-lg-1-5 jodit-input &__marginRight" type="text" placeholder="~right~"/>
				<input disabled="disabled" class="jodit_col-lg-1-5 jodit-input &__marginBottom" type="text" placeholder="~bottom~"/>
				<input disabled="disabled" class="jodit_col-lg-1-5 jodit-input &__marginLeft" type="text" placeholder="~left~"/>
			</div>
		</div>
		<div class="jodit-form__group &__editAlign">
			<label>~Align~</label>
			<select class="jodit-select &__align">
				<option value="">~--Not Set--~</option>
				<option value="left">~Left~</option>
				<option value="center">~Center~</option>
				<option value="right">~Right~</option>
			</select>
		</div>
		<div class="jodit-form__group &__editStyle">
			<label>~Styles~</label>
			<input type="text" class="jodit-input &__style"/>
		</div>
		<div class="jodit-form__group &__editClass">
			<label>~Classes~</label>
			${((): string => {
				const classInput: string[] = [];

				if (availableClasses && availableClasses.length > 0) {
					classInput.push(
						'<select class="jodit-input jodit-select &__classes">'
					);

					availableClasses.forEach(item => {
						if (isString(item)) {
							classInput.push(
								`<option value="${item}">${item}</option>`
							);
						} else {
							classInput.push(
								`<option value="${item[0]}">${item[1]}</option>`
							);
						}
					});
					classInput.push('</select>');
				} else {
					classInput.push(
						'<input type="text" class="jodit-input &__classes"/>'
					);
				}

				return classInput.join('');
			})()}
		</div>
		<div class="jodit-form__group &__editId">
			<label>Id</label>
			<input type="text" class="jodit-input &__id"/>
		</div>
		<div
			class="jodit-form__group &__editBorderRadius"
		>
			<label>~Border radius~</label>
			<input type="number" class="jodit-input &__borderRadius"/>
		</div>`;
	}

	@hook('ready')
	@watch('state.values.align')
	protected onStateAlignChange(): void {
		const align = this.getElm('align') as HTMLSelectElement;
		align.value = this.state.values.align;
	}

	@watch('align:change')
	protected onChangeAlign(): void {
		const align = this.getElm('align') as HTMLSelectElement;
		this.state.values.align = align.value as ImageHAlign;
	}

	@hook('ready')
	@watch('state.values.borderRadius')
	protected onStateValuesBorderRadiusChange(): void {
		const borderRadius = this.getElm('borderRadius') as HTMLInputElement;
		borderRadius.value = this.state.values.borderRadius.toString();
	}

	@watch('borderRadius:change')
	protected onChangeBorderRadius(): void {
		const borderRadius = this.getElm('borderRadius') as HTMLInputElement;
		this.state.values.borderRadius = parseFloat(borderRadius.value);
	}

	@hook('ready')
	@watch('state.values.id')
	protected onStateValuesIdChange(): void {
		const id = this.getElm('id') as HTMLInputElement;
		id.value = this.state.values.id;
	}

	@watch('id:change')
	protected onChangeId(): void {
		const id = this.getElm('id') as HTMLInputElement;
		this.state.values.id = id.value;
	}

	@hook('ready')
	@watch('state.values.style')
	protected onStateValuesStyleChange(): void {
		const style = this.getElm('style') as HTMLInputElement;
		style.value = this.state.values.style;
	}

	@watch('style:change')
	protected onChangeStyle(): void {
		const style = this.getElm('style') as HTMLInputElement;
		this.state.values.style = style.value;
	}

	@hook('ready')
	@watch('state.values.classes')
	protected onStateValuesClassesChange(): void {
		const classes = this.getElm('classes') as HTMLInputElement;
		classes.value = this.state.values.classes;
	}

	@watch('classes:change')
	protected onChangClasses(): void {
		const classes = this.getElm('classes') as HTMLInputElement;
		this.state.values.classes = classes.value;
	}

	@watch('lockMargin:click')
	protected onLockMarginClick(e: MouseEvent): void {
		this.state.marginIsLocked = !this.state.marginIsLocked;
		e.preventDefault();
	}

	@hook('ready')
	@watch('state.marginIsLocked')
	protected onChangeMarginIsLocked(): void {
		const marginBottom = this.getElm('marginBottom')!;
		const marginRight = this.getElm('marginRight')!;
		const marginLeft = this.getElm('marginLeft')!;
		const lockMargin = this.getElm('lockMargin')!;

		[marginRight, marginBottom, marginLeft].forEach(elm => {
			attr(elm, 'disabled', this.state.marginIsLocked || null);
		});

		lockMargin.innerHTML = Icon.get(
			this.state.marginIsLocked ? 'lock' : 'unlock'
		);

		if (this.state.marginIsLocked) {
			const marginTop = this.state.values.marginTop;
			this.state.values.marginRight = marginTop as string;
			this.state.values.marginBottom = marginTop;
			this.state.values.marginLeft = marginTop as string;
		}
	}

	@hook('ready')
	@watch([
		'state.values.marginTop',
		'state.values.marginRight',
		'state.values.marginBottom',
		'state.values.marginLeft'
	])
	protected onStateValuesMarginChange(): void {
		const marginTop = this.getElm('marginTop') as HTMLInputElement;
		const marginRight = this.getElm('marginRight') as HTMLInputElement;
		const marginBottom = this.getElm('marginBottom') as HTMLInputElement;
		const marginLeft = this.getElm('marginLeft') as HTMLInputElement;

		marginTop.value = this.state.values.marginTop.toString();
		marginRight.value = this.state.values.marginRight.toString();
		marginBottom.value = this.state.values.marginBottom.toString();
		marginLeft.value = this.state.values.marginLeft.toString();
	}

	@watch([
		'marginTop:change',
		'marginRight:change',
		'marginBottom:change',
		'marginLeft:change'
	])
	protected onChangeMargin(): void {
		const marginTop = this.getElm('marginTop') as HTMLInputElement;
		const marginRight = this.getElm('marginRight') as HTMLInputElement;
		const marginBottom = this.getElm('marginBottom') as HTMLInputElement;
		const marginLeft = this.getElm('marginLeft') as HTMLInputElement;

		this.state.values.marginTop = normalSizeFromString(marginTop.value);

		if (this.state.marginIsLocked) {
			this.state.values.marginRight = this.state.values.marginTop;
			this.state.values.marginBottom = this.state.values.marginTop;
			this.state.values.marginLeft = this.state.values.marginTop;
		} else {
			this.state.values.marginRight = normalSizeFromString(
				marginRight.value
			);
			this.state.values.marginBottom = normalSizeFromString(
				marginBottom.value
			);
			this.state.values.marginLeft = normalSizeFromString(
				marginLeft.value
			);
		}
	}

	@hook('ready')
	protected hideFieldByOptions(): void {
		const opt = this.j.o.image;

		(
			[
				['editMargins', 'editMargins'],
				['editAlign', 'editAlign'],
				['editStyle', 'editStyle'],
				['editClass', 'editClass'],
				['editId', 'editId'],
				['editBorderRadius', 'editBorderRadius']
			] as const
		).forEach(([optKey, elmKey]) => {
			const elm = this.getElm(elmKey) as HTMLElement;
			css(elm, 'display', opt[optKey] ? null : 'none');
		});
	}
}
