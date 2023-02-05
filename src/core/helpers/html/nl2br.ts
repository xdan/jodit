/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

/**
 *  Inserts HTML line breaks before all newlines in a string
 */
export function nl2br(html: string): string {
	return html.replace(/\r\n|\r|\n/g, '<br/>');
}
