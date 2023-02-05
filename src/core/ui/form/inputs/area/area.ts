/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/form/inputs
 */

import './area.less';

import type { IUITextArea, IViewBased } from 'jodit/types';
import { UIInput } from 'jodit/core/ui/form/inputs/input/input';
import { component } from 'jodit/core/decorators/component/component';

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

	override nativeInput!: HTMLTextAreaElement;

	/** @override */
	override state: IUITextArea['state'] = { ...UITextArea.defaultState };

	/** @override */
	protected override createContainer(options: this['state']): HTMLElement {
		this.nativeInput = this.j.create.element('textarea');

		return super.createContainer(options);
	}

	constructor(jodit: IViewBased, state: Partial<IUITextArea['state']>) {
		super(jodit, state);
		Object.assign(this.state, state);

		if (this.state.resizable === false) {
			this.nativeInput.style.resize = 'none';
		}
	}
}
