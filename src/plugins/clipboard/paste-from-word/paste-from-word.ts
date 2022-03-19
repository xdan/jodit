/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/clipboard/paste-from-word/README.md]]
 * @packageDocumentation
 * @module plugins/clipboard/paste-from-word
 */

import type { IJodit } from 'jodit/types';
import type {
	PasteEvent,
	InsertMode
} from 'jodit/plugins/clipboard/paste/interface';

import { Plugin } from 'jodit/core/plugin';
import {
	applyStyles,
	cleanFromWord,
	isHtmlFromWord,
	isString,
	stripTags
} from 'jodit/core/helpers';
import {
	INSERT_AS_HTML,
	INSERT_AS_TEXT,
	INSERT_ONLY_TEXT
} from 'jodit/core/constants';
import {
	askInsertTypeDialog,
	pasteInsertHtml
} from 'jodit/plugins/clipboard/paste/helpers';
import type { PastedData } from 'jodit/plugins/clipboard/paste/interface';
import { watch } from 'jodit/src/core/decorators';

import './config';

export class PasteFromWord extends Plugin {
	protected override afterInit(jodit: IJodit): void {}
	protected override beforeDestruct(jodit: IJodit): void {}

	/**
	 * Try if text is Word's document fragment and try process this
	 */
	@watch(':processHTML')
	protected processWordHTML(
		e: PasteEvent,
		text: string,
		texts: PastedData
	): boolean {
		const { j } = this,
			{
				processPasteFromWord,
				askBeforePasteFromWord,
				defaultActionOnPasteFromWord,
				defaultActionOnPaste,
				pasteFromWordActionList
			} = j.o;

		if (processPasteFromWord && isHtmlFromWord(text)) {
			if (askBeforePasteFromWord) {
				askInsertTypeDialog(
					j,
					'The pasted content is coming from a Microsoft Word/Excel document. ' +
						'Do you want to keep the format or clean it up?',
					'Word Paste Detected',
					insertType => {
						this.insertFromWordByType(e, text, insertType, texts);
					},
					pasteFromWordActionList
				);
			} else {
				this.insertFromWordByType(
					e,
					text,
					defaultActionOnPasteFromWord || defaultActionOnPaste,
					texts
				);
			}

			return true;
		}

		return false;
	}

	/**
	 * Clear extra styles and tags from Word's pasted text
	 */
	protected insertFromWordByType(
		e: PasteEvent,
		html: string,
		insertType: InsertMode,
		texts: PastedData
	): void {
		switch (insertType) {
			case INSERT_AS_HTML: {
				html = applyStyles(html);

				if (this.j.o.beautifyHTML) {
					const value = this.j.events?.fire('beautifyHTML', html);

					if (isString(value)) {
						html = value;
					}
				}

				break;
			}

			case INSERT_AS_TEXT: {
				html = cleanFromWord(html);
				break;
			}

			case INSERT_ONLY_TEXT: {
				html = stripTags(cleanFromWord(html));
				break;
			}
		}

		pasteInsertHtml(e, this.j, html);
	}
}
