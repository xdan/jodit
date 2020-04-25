/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../../config';
import { IJodit, SnapshotType } from '../../types';
import { Component } from '../../core/component';
import { Snapshot } from './snapshot';
import { Stack } from './stack';
import { Command } from './command';

/**
 * @property {object} observer module settings {@link Observer|Observer}
 * @property {int} observer.timeout=100 Delay on every change
 */
declare module '../../config' {
	interface Config {
		observer: {
			timeout: number;
		};
	}
}

Config.prototype.observer = {
	timeout: 100
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
	jodit!: IJodit;

	private startValue!: SnapshotType;

	private onChangeStack = () => {
		const newValue = this.snapshot.make();

		if (!Snapshot.equal(newValue, this.startValue)) {
			this.stack.push(new Command(this.startValue, newValue, this));

			this.startValue = newValue;
			this.changeStack();
		}
	};

	stack: Stack = new Stack();
	snapshot: Snapshot;

	/**
	 * Return state of the WYSIWYG editor to step back
	 */
	redo() {
		if (this.stack.redo()) {
			this.startValue = this.snapshot.make();
			this.changeStack();
		}
	}

	/**
	 * Return the state of the WYSIWYG editor to step forward
	 */
	undo() {
		if (this.stack.undo()) {
			this.startValue = this.snapshot.make();
			this.changeStack();
		}
	}

	clear() {
		this.startValue = this.snapshot.make();
		this.stack.clear();
		this.changeStack();
	}

	private changeStack() {
		this.j && !this.j.isInDestruct && this.j.events?.fire('changeStack');
	}

	constructor(editor: IJodit) {
		super(editor);
		this.snapshot = new Snapshot(editor);

		const onChangeStack = editor.async.debounce(
			this.onChangeStack,
			editor.defaultTimeout
		);

		editor.e.on('afterAddPlace.observer', () => {
			if (this.isInDestruct) {
				return;
			}

			this.startValue = this.snapshot.make();
			editor.events
				// save selection
				.on(
					editor.editor,
					[
						'changeSelection.observer',
						'selectionstart.observer',
						'selectionchange.observer',
						'mousedown.observer',
						'mouseup.observer',
						'keydown.observer',
						'keyup.observer'
					].join(' '),
					() => {
						if (
							this.startValue.html ===
							this.j.getNativeEditorValue()
						) {
							this.startValue = this.snapshot.make();
						}
					}
				)
				.on(this, 'change.observer', () => {
					if (!this.snapshot.isBlocked) {
						onChangeStack();
					}
				});
		});
	}

	destruct(): any {
		if (this.j.events) {
			this.j.e.off('.observer');
		}

		this.snapshot.destruct();

		delete this.snapshot;
		delete this.stack;
		delete this.startValue;

		super.destruct();
	}
}
