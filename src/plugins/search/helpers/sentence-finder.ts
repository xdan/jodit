/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CanUndef, ISelectionRange, Nullable } from 'jodit/types';
import { trim } from 'jodit/core/helpers';
import * as consts from 'jodit/core/constants';

export interface State {
	query: string;
	sentence: SentenceFinder;
}

interface QueueItem {
	startIndex: number;
	endIndex: number;
	node: Text;
}

const n = (s: string): string =>
	trim(s.toLowerCase().replace(consts.SPACE_REG_EXP(), ' '));

export class SentenceFinder {
	private queue: QueueItem[] = [];
	private value: string = '';

	add(node: Text): void {
		const value = node.nodeValue ?? '';

		if (!value.length) {
			return;
		}

		const index = this.value.length;

		this.queue.push({
			startIndex: index,
			endIndex: index + value.length,
			node
		});

		this.value += value;
	}

	ranges(needle: string, position: number = 0): Nullable<ISelectionRange[]> {
		needle = n(needle);

		if (!this.value.includes(needle, position)) {
			return null;
		}

		const results: ISelectionRange[] = [];

		let index = position,
			startQueueIndex = 0;

		// Find all ranges in substring
		do {
			index = this.value.indexOf(needle, index);

			if (index !== -1) {
				let startContainer: CanUndef<Text>,
					startOffset: number = 0,
					endContainer: CanUndef<Text>,
					endOffset: number = 0;

				for (let i = startQueueIndex; i < this.queue.length; i += 1) {
					if (!startContainer && this.queue[i].endIndex > index) {
						startContainer = this.queue[i].node;
						startOffset = index - this.queue[i].startIndex;
					}

					if (
						startContainer &&
						this.queue[i].endIndex >= index + needle.length
					) {
						endContainer = this.queue[i].node;
						endOffset =
							index + needle.length - this.queue[i].startIndex;
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

				index += needle.length;
			}
		} while (index !== -1);

		return results.length === 0 ? null : results;
	}
}
