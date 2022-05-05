/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, Nullable, IDictionary } from 'jodit/types';
import { replaceOldTags } from 'jodit/plugins/fix/clean-html/helpers/visitor/cases/replace-old-tags';
import { tryRemoveNode } from 'jodit/plugins/fix/clean-html/helpers/visitor/cases/try-remove-node';
import { fillEmptyParagraph } from 'jodit/plugins/fix/clean-html/helpers/visitor/cases/fill-empty-paragraph';
import { allowAttributes } from 'jodit/plugins/fix/clean-html/helpers/visitor/cases/allow-attributes';

export function visitNodeWalker(
	jodit: IJodit,
	nodeElm: Node,
	currentSelectionNode: Nullable<Node>,
	allowTags: IDictionary | false,
	denyTags: IDictionary | false
): boolean {
	let hasChanges = false;

	hasChanges = replaceOldTags(jodit, nodeElm, hasChanges);

	if (
		tryRemoveNode(jodit, nodeElm, currentSelectionNode, allowTags, denyTags)
	) {
		return true;
	}

	hasChanges = fillEmptyParagraph(jodit, nodeElm, hasChanges);

	hasChanges = allowAttributes(jodit, nodeElm, hasChanges, allowTags);

	return hasChanges;
}
