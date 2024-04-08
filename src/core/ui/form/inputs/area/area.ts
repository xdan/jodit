/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/form
 */

import type { IUIInput, IUITextArea, IViewBased } from 'jodit/types';
import { watch } from 'jodit/core/decorators';
import { component } from 'jodit/core/decorators/component/component';
import { UIInput } from 'jodit/core/ui/form/inputs/input/input';

import './area.less';

@component
export class UITextArea extends UIInput implements IUITextArea {
	/** @override */
	override className(): string {
		return 'UITextArea';
	}

	/** @override */
	static override defaultState: IUITextArea['state'] = {
		...UIInput.defaultState,
		size: 5,
		resizable: true
	};

	declare nativeInput: HTMLTextAreaElement;

	protected override createNativeInput(
		options?: Partial<this['state']>
	): IUIInput['nativeInput'] {
		return this.j.create.element('textarea');
	}

	/** @override */
	override state: IUITextArea['state'] = { ...UITextArea.defaultState };

	constructor(jodit: IViewBased, state: Partial<IUITextArea['state']>) {
		super(jodit, state);

		Object.assign(this.state, state);

		if (this.state.resizable === false) {
			this.nativeInput.style.resize = 'none';
		}
	}

	@watch(['state.size', 'state.resizable'])
	protected onChangeStateSize(): void {
		const { size, resizable } = this.state;

		this.nativeInput.style.resize = resizable ? 'auto' : 'none';
		this.nativeInput.rows = size ?? 5;
	}
}
