/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

const SPACE = /\s/;
const DIGIT = /\d/;
const WORD_CHAR = /\w/;

// `content="Microsoft Word 15"` — the name followed by a space and a version digit
function hasGenerator(tag: string, name: string): boolean {
	let index = tag.indexOf(name);

	while (index !== -1) {
		const after = index + name.length;

		if (
			SPACE.test(tag.charAt(after)) &&
			DIGIT.test(tag.charAt(after + 1))
		) {
			return true;
		}

		index = tag.indexOf(name, after);
	}

	return false;
}

// `<meta name=ProgId content=Word.Document>`, `<meta name=Generator content="LibreOffice 7.6">`
function isOfficeMeta(tag: string): boolean {
	if (
		hasGenerator(tag, 'Microsoft Word') ||
		hasGenerator(tag, 'Microsoft Excel')
	) {
		return true;
	}

	const lower = tag.toLowerCase();
	const progId = lower.indexOf('progid');

	if (
		progId !== -1 &&
		(lower.indexOf('word.', progId) !== -1 ||
			lower.indexOf('excel.', progId) !== -1)
	) {
		return true;
	}

	return lower.includes('libreoffice') || lower.includes('openoffice');
}

// ` class=MsoNormal`, ` class="MsoListParagraph"` inside one tag
function hasMsoClass(tag: string): boolean {
	let index = tag.indexOf('class=');

	while (index !== -1) {
		if (index > 0 && SPACE.test(tag.charAt(index - 1))) {
			let value = index + 'class='.length;
			const quote = tag.charAt(value);

			if (quote === '"' || quote === "'") {
				value += 1;
			}

			if (tag.startsWith('Mso', value)) {
				return true;
			}
		}

		index = tag.indexOf('class=', index + 'class='.length);
	}

	return false;
}

// `style='mso-list:l0 level1 lfo1'` — an `mso-` property inside a style attribute with the given quote
function hasMsoStyle(data: string, quote: string): boolean {
	const open = 'style=' + quote;
	let index = data.indexOf(open);

	while (index !== -1) {
		const start = index + open.length;
		let end = data.indexOf(quote, start);

		if (end === -1) {
			end = data.length;
		}

		if (data.slice(start, end).includes('mso-')) {
			return true;
		}

		index = data.indexOf(open, end);
	}

	return false;
}

/**
 * Detect if string is HTML from MS Word, Excel or LibreOffice/OpenOffice
 *
 * The clipboard text is attacker controlled, so every check walks the string
 * once with `indexOf`: a regex with an unbounded group before a required
 * literal was quadratic on a long run of `<meta` and froze the tab.
 */
export function isHtmlFromWord(data: string): boolean {
	if (
		data.includes('urn:schemas-microsoft-com:office:word') ||
		data.includes('urn:schemas-microsoft-com:office:excel')
	) {
		return true;
	}

	// Each tag is taken once, from its `<` to the next `>`, so the scan stays linear
	let index = data.indexOf('<');

	while (index !== -1) {
		if (!WORD_CHAR.test(data.charAt(index + 1))) {
			index = data.indexOf('<', index + 1);
			continue;
		}

		let end = data.indexOf('>', index);

		if (end === -1) {
			end = data.length;
		}

		const tag = data.slice(index, end);

		if (
			(tag.slice(0, 5).toLowerCase() === '<meta' && isOfficeMeta(tag)) ||
			hasMsoClass(tag)
		) {
			return true;
		}

		index = data.indexOf('<', end);
	}

	return (
		hasMsoStyle(data, "'") ||
		(hasMsoStyle(data, '"') && data.includes('<font'))
	);
}
