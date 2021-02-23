/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { SnapshotType } from '../../types';
import type { Observer } from './observer';

export class Command {
	undo(): void {
		this.observer.snapshot.restore(this.oldValue);
	}

	redo(): void {
		this.observer.snapshot.restore(this.newValue);
	}

	constructor(
		readonly oldValue: SnapshotType,
		readonly newValue: SnapshotType,
		readonly observer: Observer,
		readonly tick: number
	) {}
}
