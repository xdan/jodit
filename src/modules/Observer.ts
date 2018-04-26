/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Config} from '../Config'
import {Component} from './Component'
import {Snapshot, SnapshotType} from './Snapshot'
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
            this.stack.push(new Command(this.__startValue, this.__newValue, this));
            this.__startValue = this.__newValue;
            this.changeStack();
        }
    };

    constructor (editor: Jodit) {
        super(editor);

        this.stack = new Stack();

        this.snapshot = new Snapshot(editor);

        const onChangeStack: Function = debounce(this.onChangeStack, editor.defaultTimeout);

        editor.events
            .on('afterInit', () => {
                this.__startValue = this.snapshot.make();
                editor.events
                    // save selection
                    .on('changeSelection selectionstart selectionchange mousedown mouseup keydown keyup', () => {
                        if (this.__startValue.html === this.jodit.getNativeEditorValue()) {
                            this.__startValue = this.snapshot.make();
                        }
                    })
                    .on('change', () => {
                        if (!this.snapshot.isBlocked) {
                            onChangeStack();
                        }
                    });
            });
    }

    /**
     * Return state of the WYSIWYG editor to step back
     */
    redo () {
        if (this.stack.redo()) {
            this.__startValue = this.snapshot.make();
            this.changeStack();
        }
    }

    /**
     * Return the state of the WYSIWYG editor to step forward
     */
    undo () {
        if (this.stack.undo()) {
            this.__startValue = this.snapshot.make();
            this.changeStack();
        }
    }

    clear() {
        this.__startValue = this.snapshot.make();
        this.stack.clear();
        this.changeStack();
    }

    changeStack() {
        this.jodit && this.jodit.events && this.jodit.events.fire('changeStack');
    }
}