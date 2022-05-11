/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export function lastIndexOf(reg: RegExp, str: string): number {
	for (let i = str.length - 1; i >= 0; i -= 1) {
		const char = str[i];
		if (reg.test(char)) {
			return i;
		}
	}

	return -1;
}

export function voiceCommand(
	before: string,
	text: string,
	after: string,
	selectionStart: number,
	selectionEnd: number
): [string, string, string, number, number] {
	switch (text.trim().toLowerCase().replace('.', '')) {
		case 'новая строка':
		case 'новая строчка':
		case 'энтер энтер':
		case 'энтер':
		case 'перенос перенос':
		case 'перенос':
		case 'carry':
		case 'newline':
		case 'enter':
			text = '\n';
			break;
		case 'тире':
			text = ' - ';
			break;
		case 'вопрос':
		case 'знак вопроса':
		case 'вопросительный знак':
		case 'question':
			text = '?';
			break;
		case 'exclamation mark':
		case 'восклицательный знак':
			text = '!';
			break;
		case 'header':
		case 'заголовок':
			text = '#';
			break;
		case 'space':
		case 'пробел':
			text = ' ';
			break;
		case 'underline':
		case 'подчеркивание':
		case 'нижнее подчеркивание':
			text = '-';
			break;
		case 'hyphen':
		case 'дефис':
			text = '-';
			break;
		case 'кавычках':
		case 'кавычка':
		case 'кавычки':
		case 'quote':
			text = '`';
			break;
		case 'dot':
		case 'точка':
			text = '. ';
			break;
		case 'comma':
		case 'запятая':
			text = ', ';
			break;

		case 'select all':
		case 'выделить все':
			selectionStart = 0;
			selectionEnd = before.length + after.length;
			text = '';
			break;
		case 'delete':
		case 'удали':
		case 'удалить': {
			if (selectionStart === selectionEnd) {
				const indexSpace = lastIndexOf(/[\s\n]/, before);
				before =
					indexSpace !== -1 ? before.substring(0, indexSpace) : '';
				selectionStart = indexSpace !== -1 ? indexSpace : 0;
				selectionEnd = selectionStart;
			} else {
				before = before.substring(0, selectionStart);
				after = after.substring(selectionEnd - selectionStart);
				selectionEnd = selectionStart;
			}
			text = '';

			break;
		}

		default:
			text = !/[\n`]$/s.test(before) ? ' ' + text : text;
	}

	return [
		before,
		text,
		after,
		selectionStart + text.length,
		selectionEnd + text.length
	];
}
