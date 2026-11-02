/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui
 */

import { toArray } from 'jodit/core/helpers/array/to-array';

/**
 * Focuses the first text field shown in a form inside `box`, so that typing
 * fills it in rather than replacing the selected content, as in a dialog. A
 * form round `box`, as the image properties dialog's round its tabs, doesn't
 * count, and neither do fields outside a form, as the color picker's
 */
export function focusFormField(box: HTMLElement): void {
	toArray(box.getElementsByTagName('form'))
		.flatMap(form =>
			toArray(
				form.querySelectorAll<HTMLElement>(
					'input:not([type]), input[type="text"], input[type="url"], textarea'
				)
			)
		)
		.find(field => field.offsetParent)
		?.focus({ preventScroll: true });
}
