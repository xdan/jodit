/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
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
