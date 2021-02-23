/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 *  Inserts HTML line breaks before all newlines in a string
 * @param html
 */
export function nl2br(html: string): string {
	return html.replace(/([^>])([\n\r]+)/g, '$1<br/>$2');
}
