/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/group
 */

import { UIElement } from 'jodit/core/ui/element';
import { component } from 'jodit/core/decorators';

@component
export class UISeparator extends UIElement {
	override className(): string {
		return 'UISeparator';
	}
}
