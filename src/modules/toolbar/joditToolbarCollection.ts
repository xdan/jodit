/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { ToolbarCollection } from './collection';
import { ToolbarEditorButton } from './button/editorButton';
import { IJodit } from '../../types/jodit';
import { IControlTypeStrong, IToolbarButton } from '../../types';

export class JoditToolbarCollection extends ToolbarCollection<IJodit> {
	/** @override */
	createButton(control: IControlTypeStrong): IToolbarButton {
		return new ToolbarEditorButton(this.jodit, control);
	}


	/** @override */
	getTarget(): Node | void {
		return this.jodit.selection.current() || undefined;
	}
}
