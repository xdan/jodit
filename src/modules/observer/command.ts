/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { SnapshotType } from '../../types';
import { Observer } from './observer';

export class Command {
	private observer: Observer;

	private oldValue: SnapshotType;
	private newValue: SnapshotType;

	public undo() {
		this.observer.snapshot.restore(this.oldValue);
	}
	public redo() {
		this.observer.snapshot.restore(this.newValue);
	}

	constructor(
		oldValue: SnapshotType,
		newValue: SnapshotType,
		observer: Observer
	) {
		this.observer = observer;
		this.oldValue = oldValue;
		this.newValue = newValue;
	}
}
