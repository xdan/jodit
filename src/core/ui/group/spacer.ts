/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/group
 */

import { component } from 'jodit/core/decorators/component/component';
import { UIElement } from 'jodit/core/ui/element';

@component
export class UISpacer extends UIElement {
	override className(): string {
		return 'UISpacer';
	}
}
