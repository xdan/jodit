/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from "../Config";
import { Jodit } from "../Jodit";
import { Component } from "./Component";
import { debounce } from "./Helpers";
import { Snapshot, SnapshotType } from "./Snapshot";
import { Stack } from "./Stack";

/**
 * @property{object} observer module settings {@link Observer|Observer}
 * @property{int} observer.timeout=100 Delay on every change
 */
declare module "../Config" {
    interface Config {
        observer: {
            timeout: number;
        };
    }
}

Config.prototype.observer = {
    timeout: 100,
};

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

    constructor(oldValue: SnapshotType, newValue: SnapshotType, observer: Observer) {
        this.observer = observer;
        this.oldValue = oldValue;
        this.newValue = newValue;
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

    private  __startValue: SnapshotType;
    private __newValue: SnapshotType;

    private onChangeStack = () => {
        this.__newValue = this.snapshot.make();
        if (!Snapshot.equal(this.__newValue, this.__startValue)) {
            this.stack.push(new Command(this.__startValue, this.__newValue, this));
            this.__startValue = this.__newValue;
            this.changeStack();
        }
    }

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
        this.jodit && this.jodit.events && this.jodit.events.fire("changeStack");
    }

    constructor(editor: Jodit) {
        super(editor);

        this.stack = new Stack();

        this.snapshot = new Snapshot(editor);

        const onChangeStack: Function = debounce(this.onChangeStack, editor.defaultTimeout);

        editor.events
            .on("afterInit", () => {
                this.__startValue = this.snapshot.make();
                editor.events
                    // save selection
                    .on("changeSelection selectionstart selectionchange mousedown mouseup keydown keyup", () => {
                        if (this.__startValue.html === this.jodit.getNativeEditorValue()) {
                            this.__startValue = this.snapshot.make();
                        }
                    })
                    .on("change", () => {
                        if (!this.snapshot.isBlocked) {
                            onChangeStack();
                        }
                    });
            });
    }
}
