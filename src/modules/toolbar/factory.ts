/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IToolbarCollection, IViewBased } from '../../types';
import { isJoditObject } from '../helpers/checker';
import { ToolbarCollection } from './collection';
import { JoditToolbarCollection } from './joditToolbarCollection';

/**
 * Collection factory
 * @param jodit
 */
export function makeCollection(jodit: IViewBased): IToolbarCollection {
	const collection = isJoditObject(jodit)
		? new JoditToolbarCollection(jodit)
		: new ToolbarCollection(jodit);

	if (jodit.options.textIcons) {
		collection.container.classList.add('jodit_text_icons');
	}

	return collection;
}
