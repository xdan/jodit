/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import { Icon } from 'jodit/core/ui';

export function template(j: IJodit): string {
	return `<div class="jodit-search">
			<div class="jodit-search__box">
				<div class="jodit-search__inputs">
					<input data-ref="query" tabindex="0" placeholder="${j.i18n(
						'Search for'
					)}" type="text"/>
					<input data-ref="replace" tabindex="0" placeholder="${j.i18n(
						'Replace with'
					)}" type="text"/>
				</div>
				<div class="jodit-search__counts">
					<span data-ref="counter-box">0/0</span>
				</div>
				<div class="jodit-search__buttons">
					<button data-ref="next" tabindex="0" type="button">${Icon.get(
						'angle-down'
					)}</button>
					<button data-ref="prev" tabindex="0" type="button">${Icon.get(
						'angle-up'
					)}</button>
					<button data-ref="cancel" tabindex="0" type="button">${Icon.get(
						'cancel'
					)}</button>
					<button data-ref="replace-btn" tabindex="0" type="button" class="jodit-ui-button">${j.i18n(
						'Replace'
					)}</button>
				</div>
			</div>
		</div>`;
}
