/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/messages
 */

import type { IViewBased, MessageVariant } from 'jodit/types';
import { UIElement } from 'jodit/core/ui';
import { component } from 'jodit/core/decorators/component/component';

@component
export class UIMessage extends UIElement {
	className(): string {
		return 'UIMessage';
	}

	constructor(
		jodit: IViewBased,
		options: { text: string; variant: MessageVariant }
	) {
		super(jodit);
		this.setMod('active', true);
		this.setMod('variant', options.variant);
		this.container.textContent = options.text;
	}
}
