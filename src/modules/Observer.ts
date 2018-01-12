/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Config} from '../Config'
import {Component} from './Component'
import {Snapshot, SnapshotType} from './Snapshot'
import * as consts from '../constants';
import {Stack} from './Stack'
import {Jodit} from "../Jodit";
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
        this.observer.block(true);
        this.observer.snapshot.restore(this.oldValue);
    }
    redo () {
        this.observer.block(true);
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

    private __blocked: boolean = false;
    private oldblock: boolean = false;
    private __timer: number;
    // redobtn;
    // undobtn;
    private  __startValue: SnapshotType;
    private __newValue: SnapshotType;
    private __timeouts: number[] = [];


    private __onChange() {
        this.__newValue = this.snapshot.make();
        if (!Snapshot.equal(this.__newValue, this.__startValue)) {
            this.stack.execute(new Command(this.__startValue, this.__newValue, this));
            this.__startValue = this.__newValue;
        }
    }

    private __changeHandler() {
        if (this.__blocked) {
            this.block(false);
            return;
        }

        if (this.jodit.options.observer.timeout) {
            clearTimeout(this.__timer);
            this.__timer = setTimeout(this.__onChange.bind(this), this.jodit.options.observer.timeout);
            this.__timeouts[this.__timeouts.length] = this.__timer;
        } else {
            this.__onChange();
        }
    }

    constructor (editor: Jodit) {
        super(editor);

        this.stack = new Stack();

        this.stack.changed = () => {
            this.changed()
        };

        this.snapshot = new Snapshot(editor);

        this.__startValue = this.snapshot.make();

        this.stack.changed();


        editor.events
            .on('updateToolbar', () => {
                this.stack.changed();
            })
            .on('change afterCommand', (command: string) => {
                if (command !== 'undo' && command !== 'redo') {
                    this.__changeHandler()
                }
            });
    }

    /**
     * Called when module will be destroed
     */
    destruct () {
        this.__timeouts.forEach((timer) => {
            clearTimeout(timer);
        })
    }

    /**
     * Do not remember changes toWYSIWYG the stack Redo / Undo when it is not needed.
     * For example, if group operations, it is best toWYSIWYG remember only the result of the last operation .
     * However, in some operations itself Jodit launches block (true) and off you do not need toWYSIWYG own . therefore
     * You can use 1 and 0. 1 - Set the value toWYSIWYG true, but it will remember the current value . A 0 - restore the current value
     * @param {boolean|int} block = 1 do not remember . 1 can be used , and 0. 1 - establish a true value but will memorize the current value. A 0 - restore the current value
     * @example
     * ```javascript
     * parent.__nativeObserver.block(1);// если value has been true when you call parent.__nativeObserver.block(0); it will still be true
     * parent.selection.insertImage('some.png');
     * parent.selection.insertImage('some2.png');
     * parent.selection.insertImage('some4.png', 'Some image');
     * parent.__nativeObserver.block(0); // restore the value that was before parent.__nativeObserver.block(1)
     * parent.$editor.find('img').css('border', '1px solid #ccc'); // the stack will be filled soon , the last state
     * ```
     */
    block(block: boolean|number = 1) {
        if (block === true || block === false) {
            this.__blocked = block;
        } else if (block === 1) {
            this.oldblock = this.__blocked;
            this.__blocked = true;
        } else if (block === 0) {
            this.__blocked = this.oldblock !== undefined ? this.oldblock : false;
        }
    };

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