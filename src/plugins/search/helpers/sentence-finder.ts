/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/search
 */

import type {
	CanUndef,
	FuzzySearch,
	ISelectionRange,
	Nullable
} from 'jodit/types';
import { fuzzySearchIndex } from 'jodit/core/helpers/string/fuzzy-search-index';

export interface State {
	query: string;
	sentence: SentenceFinder;
}

interface QueueItem {
	startIndex: number;
	endIndex: number;
	node: Text;
}

export class SentenceFinder {
	private __queue: QueueItem[] = [];
	private __value: string = '';

	constructor(
		private readonly __searchIndex: FuzzySearch = fuzzySearchIndex
	) {}

	add(node: Text): void {
		const value = (node.nodeValue ?? '').toLowerCase();

		if (!value.length) {
			return;
		}

		const index = this.__value.length;

		this.__queue.push({
			startIndex: index,
			endIndex: index + value.length,
			node
		});

		this.__value += value;
	}

	ranges(needle: string, position: number = 0): Nullable<ISelectionRange[]> {
		const results: ISelectionRange[] = [];

		let index = position,
			len = 0,
			startQueueIndex = 0;

		// Find all ranges in substring
		do {
			[index, len] = this.__searchIndex(needle, this.__value, index);

			if (index !== -1) {
				let startContainer: CanUndef<Text>,
					startOffset: number = 0,
					endContainer: CanUndef<Text>,
					endOffset: number = 0;

				for (let i = startQueueIndex; i < this.__queue.length; i += 1) {
					if (!startContainer && this.__queue[i].endIndex > index) {
						startContainer = this.__queue[i].node;
						startOffset = index - this.__queue[i].startIndex;
					}

					if (
						startContainer &&
						this.__queue[i].endIndex >= index + len
					) {
						endContainer = this.__queue[i].node;
						endOffset = index + len - this.__queue[i].startIndex;
						startQueueIndex = i;
						break;
					}
				}

				if (startContainer && endContainer) {
					results.push({
						startContainer,
						startOffset,
						endContainer,
						endOffset
					});
				}

				index += len;
			}
		} while (index !== -1);

		return results.length === 0 ? null : results;
	}
}
