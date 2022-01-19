/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/observer
 */

import type { SnapshotType } from 'jodit/types';
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
