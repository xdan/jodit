/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

/**
 * Detect if string is HTML from MS Word, Excel or LibreOffice/OpenOffice
 */
export function isHtmlFromWord(data: string): boolean {
	return (
		data.search(/<meta.*?Microsoft Excel\s[\d].*?>/) !== -1 ||
		data.search(/<meta.*?Microsoft Word\s[\d].*?>/) !== -1 ||
		// `<meta name=ProgId content=Word.Document>` — attribute values are
		// unquoted in the raw Word clipboard fragment
		data.search(/<meta[^>]*?ProgId[^>]*?(Word|Excel)\./i) !== -1 ||
		// LibreOffice/OpenOffice Writer & Calc
		data.search(/<meta[^>]*?(LibreOffice|OpenOffice)/i) !== -1 ||
		// Office namespaces on the root element of the clipboard fragment
		data.search(/urn:schemas-microsoft-com:office:(word|excel)/) !== -1 ||
		// `class=MsoNormal` and friends (unquoted/quoted)
		data.search(/<\w[^>]*\sclass=("|')?Mso/) !== -1 ||
		// the raw Word clipboard uses SINGLE quotes: style='mso-…'
		data.search(/style='[^']*mso-/) !== -1 ||
		(data.search(/style="[^"]*mso-/) !== -1 && data.search(/<font/) !== -1)
	);
}
