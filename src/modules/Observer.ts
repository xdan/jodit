/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Config} from '../Config'
import {Component} from './Component'
import {Snapshot, SnapshotType} from './Snapshot'
import * as consts from '../constants';
import {Stack} from './Stack'
import {Jodit} from "../Jodit";
import {debounce} from "./Helpers";
/**
 * @property{object} observer module settings {@link Observer|Observer}
 * @property{int} observer.timeout=100 Delay on every change
 */
declare module "../Config" {
    interface Config {
        observer: {
            timeout: number;
        }
    }
}

Config.prototype.observer = {
    timeout: 100
};

export class Command {
    private observer: Observer;
    private oldValue: SnapshotType;
    private newValue: SnapshotType;

    constructor(oldValue: SnapshotType, newValue: SnapshotType, observer: Observer) {
        this.observer = observer;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
    execute() {}
    undo () {
        this.observer.snapshot.restore(this.oldValue);
    }
    redo () {
        this.observer.snapshot.restore(this.newValue);
    }
}

/**
 * The module monitors the status of the editor and creates / deletes the required number of Undo / Redo shots . To track changes in use {@link https://developer.mozilla.org/ru/docs/Web/API/MutationObserver|MutationObserver}
 *
 * @module Observer
 * @see {@link Snapshot|Snapshot}
 * @params {Jodit} parent Jodit main object
 */
export class Observer extends Component {

    /**
     * @property {Stack} stack
     */
    stack: Stack;

    /**
     * @property{Snapshot} snapshot
     */
    snapshot: Snapshot;

    private  __startValue: SnapshotType;
    private __newValue: SnapshotType;


    private onChangeStack = () => {
        this.__newValue = this.snapshot.make();
        if (!Snapshot.equal(this.__newValue, this.__startValue)) {
            this.stack.execute(new Command(this.__startValue, this.__newValue, this));
            this.__startValue = this.__newValue;
        }
    };

    constructor (editor: Jodit) {
        super(editor);

        this.stack = new Stack();

        this.stack.changed = () => {
            this.changed()
        };

        this.snapshot = new Snapshot(editor);

        this.__startValue = this.snapshot.make();

        this.stack.changed();

        const onChangeStack: Function = debounce(this.onChangeStack, this.jodit.options.observer.timeout);

        editor.events
            .on('updateToolbar', () => {
                this.stack.changed();
            })
            .on('change', () => {
                if (!this.snapshot.isBlocked) {
                    onChangeStack();
                }
            });
    }

    /**
     * There has been a change in the stack Undo/Redo
     *
     * @method changed
     */
    changed () {
        if (this.jodit.getMode() === consts.MODE_WYSIWYG) {
            this.jodit.events.fire('canRedo', this.stack.canRedo());
            this.jodit.events.fire('canUndo', this.stack.canUndo());
        }
    };

    /**
     * Return state of the WYSIWYG editor to step back
     * @method redo
     */
    redo () {
        this.stack.redo();
    }

    /**
     * Return the state of the WYSIWYG editor to step forward
     * @method undo
     */
    undo () {
        this.stack.undo();
    }
}