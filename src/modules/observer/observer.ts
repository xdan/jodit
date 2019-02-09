/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../../Config';
import { IJodit, SnapshotType } from '../../types';
import { Component } from '../Component';
import { debounce } from '../helpers/async';
import { Snapshot } from '../Snapshot';
import { Stack } from '../Stack';
import { Command } from './command';

/**
 * @property{object} observer module settings {@link Observer|Observer}
 * @property{int} observer.timeout=100 Delay on every change
 */
declare module '../../Config' {
    interface Config {
        observer: {
            timeout: number;
        };
    }
}

Config.prototype.observer = {
    timeout: 100,
};

/**
 * The module monitors the status of the editor and creates / deletes the required number of Undo / Redo shots .
 * To track changes in use {@link https://developer.mozilla.org/ru/docs/Web/API/MutationObserver|MutationObserver}
 *
 * @module Observer
 * @see {@link Snapshot|Snapshot}
 * @params {Jodit} parent Jodit main object
 */
export class Observer extends Component<IJodit> {
    private __startValue: SnapshotType;
    private __newValue: SnapshotType;

    private onChangeStack = () => {
        this.__newValue = this.snapshot.make();
        if (!Snapshot.equal(this.__newValue, this.__startValue)) {
            this.stack.push(
                new Command(this.__startValue, this.__newValue, this)
            );
            this.__startValue = this.__newValue;
            this.changeStack();
        }
    };

    /**
     * @property {Stack} stack
     */
    public stack: Stack;

    /**
     * @property{Snapshot} snapshot
     */
    public snapshot: Snapshot;

    /**
     * Return state of the WYSIWYG editor to step back
     */
    public redo() {
        if (this.stack.redo()) {
            this.__startValue = this.snapshot.make();
            this.changeStack();
        }
    }

    /**
     * Return the state of the WYSIWYG editor to step forward
     */
    public undo() {
        if (this.stack.undo()) {
            this.__startValue = this.snapshot.make();
            this.changeStack();
        }
    }

    public clear() {
        this.__startValue = this.snapshot.make();
        this.stack.clear();
        this.changeStack();
    }

    public changeStack() {
        this.jodit &&
            !this.jodit.isDestructed &&
            this.jodit.events &&
            this.jodit.events.fire('changeStack');
    }

    constructor(editor: IJodit) {
        super(editor);

        this.stack = new Stack();

        this.snapshot = new Snapshot(editor);

        const onChangeStack = debounce(
            this.onChangeStack,
            editor.defaultTimeout
        );

        editor.events.on('afterInit.observer', () => {
            if (this.isDestructed) {
                return;
            }

            this.__startValue = this.snapshot.make();
            editor.events
                // save selection
                .on(
                    'changeSelection.observer selectionstart.observer selectionchange.observer mousedown.observer mouseup.observer keydown.observer keyup.observer',
                    () => {
                        if (
                            this.__startValue.html ===
                            this.jodit.getNativeEditorValue()
                        ) {
                            this.__startValue = this.snapshot.make();
                        }
                    }
                )
                .on('change.observer', () => {
                    if (!this.snapshot.isBlocked) {
                        onChangeStack();
                    }
                });
        });
    }
    destruct(): any {
        if (this.jodit.events) {
            this.jodit.events.off('.observer');
        }

        this.snapshot.destruct();
        delete this.snapshot;

        delete this.stack;

        super.destruct();
    }
}
