/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../../../../types';
import { Icon } from '../../../../core/ui';

export function form(editor: IJodit): HTMLElement {
	const { showPreview, editSize } = editor.o.image,
		gi = Icon.get.bind(Icon);

	return editor.c.fromHTML(`<form class="jodit-properties">
		<div class="jodit-grid jodit-grid_xs-column">
			<div class="jodit_col-lg-2-5 jodit_col-xs-5-5">
				<div class="jodit-properties_view_box">
					<div style="${
						!showPreview ? 'display:none' : ''
					}" class="jodit-properties_image_view">
						<img data-ref="imageViewSrc" src="" alt=""/>
					</div>
					<div style="${
						!editSize ? 'display:none' : ''
					}" class="jodit-form__group jodit-properties_image_sizes">
						<input data-ref="imageWidth" type="text" class="jodit-input"/>
						<a data-ref="lockSize" class="jodit-properties__lock">${gi('lock')}</a>
						<input data-ref="imageHeight" type="text" class="imageHeight jodit-input"/>
					</div>
				</div>
			</div>
			<div data-ref="tabsBox" class="jodit_col-lg-3-5 jodit_col-xs-5-5"></div>
		</div>
	</form>`);
}
