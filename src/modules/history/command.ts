/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/history
 */

import type { IHistory, SnapshotType } from 'jodit/types';

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
		private readonly history: IHistory,
		readonly tick: number
	) {}
}
