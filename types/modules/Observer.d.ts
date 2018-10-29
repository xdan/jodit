/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Component } from './Component';
import { Snapshot, SnapshotType } from './Snapshot';
import { Stack } from './Stack';
import { Jodit } from "../Jodit";
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
export declare class Command {
    private observer;
    private oldValue;
    private newValue;
    constructor(oldValue: SnapshotType, newValue: SnapshotType, observer: Observer);
    undo(): void;
    redo(): void;
}
/**
 * The module monitors the status of the editor and creates / deletes the required number of Undo / Redo shots . To track changes in use {@link https://developer.mozilla.org/ru/docs/Web/API/MutationObserver|MutationObserver}
 *
 * @module Observer
 * @see {@link Snapshot|Snapshot}
 * @params {Jodit} parent Jodit main object
 */
export declare class Observer extends Component {
    /**
     * @property {Stack} stack
     */
    stack: Stack;
    /**
     * @property{Snapshot} snapshot
     */
    snapshot: Snapshot;
    private __startValue;
    private __newValue;
    private onChangeStack;
    constructor(editor: Jodit);
    /**
     * Return state of the WYSIWYG editor to step back
     */
    redo(): void;
    /**
     * Return the state of the WYSIWYG editor to step forward
     */
    undo(): void;
    clear(): void;
    changeStack(): void;
}
