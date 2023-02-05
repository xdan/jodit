/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/history
 */

import type { SnapshotType } from 'jodit/types';
import type { History } from './history';

export class Command {
	undo(): void {
		this.history.snapshot.restore(this.oldValue);
	}

	redo(): void {
		this.history.snapshot.restore(this.newValue);
	}

	constructor(
		readonly oldValue: SnapshotType,
		readonly newValue: SnapshotType,
		private readonly history: History,
		readonly tick: number
	) {}
}
