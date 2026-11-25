/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/link
 */

/**
 * A link to choose from in the link form, from `link.list`
 */
export interface ILinkListItem {
	/**
	 * Shown in the list, and the text of a new link with none
	 */
	text: string;
	url: string;
	/**
	 * Shown in grey on the right, such as "Page" or "Form"
	 */
	description?: string;
}
