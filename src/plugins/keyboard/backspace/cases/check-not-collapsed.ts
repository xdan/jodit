/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { IJodit } from '../../../../types';

/**
 * On Not collapsed selection - should only remove whole selected content
 *
 * @example
 * ```html
 * <p>first | stop</p><p>second | stop</p>
 * ```
 * result
 * ```html
 * <p>first | stop</p>
 * ```
 */
export function checkNotCollapsed(jodit: IJodit): boolean {
	if (!jodit.s.isCollapsed()) {
		jodit.execCommand('Delete');
		return true;
	}

	return false;
}
