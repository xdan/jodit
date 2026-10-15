/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/history/README.md]]
 * @packageDocumentation
 * @module modules/history
 */

import type {
	IDestructible,
	IHistory,
	IJodit,
	ISnapshot,
	IStack,
	SnapshotType
} from 'jodit/types';
import { ViewComponent } from 'jodit/core/component/view-component';
import { Config } from 'jodit/config';

import { Command } from './command';
import { Snapshot } from './snapshot';
import { Stack } from './stack';

declare module 'jodit/config' {
	interface Config {
		history: {
			enable: boolean;

			/**
			 * Limit of history length
			 */
			maxHistoryLength: number;

			/**
			 * How long a step stays open after its first change, in
			 * milliseconds. The changes made in that time are undone together.
			 */
			timeout: number;
		};
	}
}

Config.prototype.history = {
	enable: true,
	maxHistoryLength: Infinity,
	timeout: 1000
};

/**
 * The module monitors the status of the editor and creates / deletes the required number of Undo / Redo shots .
 */
export class History extends ViewComponent<IJodit> implements IHistory {
	/** @override */
	override className(): string {
		return 'History';
	}

	/**
	 * Return state of the WYSIWYG editor to step back
	 */
	redo(): void {
		this.__processPendingChanges();

		if (this.__stack.redo()) {
			this.startValue = this.snapshot.make();
			this.fireChangeStack();
		}
	}

	canRedo(): boolean {
		return !this.__hasPendingChanges && this.__stack.canRedo();
	}

	/**
	 * Return the state of the WYSIWYG editor to step forward
	 */
	undo(): void {
		this.__processPendingChanges();

		if (this.__stack.undo()) {
			this.startValue = this.snapshot.make();
			this.fireChangeStack();
		}
	}

	canUndo(): boolean {
		return this.__hasPendingChanges || this.__stack.canUndo();
	}

	clear(): void {
		this.startValue = this.snapshot.make();
		this.async.clearTimeout(this.__timer);
		this.__hasPendingChanges = false;
		this.__stack.clear();
		this.fireChangeStack();
	}

	get length(): number {
		return this.__stack.length;
	}

	private __startValue!: SnapshotType;

	protected get startValue(): SnapshotType {
		return this.__startValue;
	}

	protected set startValue(value: SnapshotType) {
		this.__startValue = value;
	}

	private readonly __stack: IStack;
	snapshot: ISnapshot & IDestructible;

	constructor(
		editor: IJodit,
		stack = new Stack(editor.o.history.maxHistoryLength),
		snapshot = new Snapshot(editor)
	) {
		super(editor);

		this.__stack = stack;
		this.snapshot = snapshot;

		if (editor.o.history.enable) {
			editor.e.on('afterAddPlace.history', () => {
				if (this.isInDestruct) {
					return;
				}

				this.startValue = this.snapshot.make();

				editor.events
					// save selection
					.on('internalChange internalUpdate', () => {
						this.__processPendingChanges();
						this.startValue = this.snapshot.make();
					})
					.on(
						editor.editor,
						[
							'changeSelection',
							'selectionstart',
							'selectionchange',
							'mousedown',
							'mouseup',
							'keydown',
							'keyup'
						]
							.map(f => f + '.history')
							.join(' '),
						() => {
							if (
								this.startValue.html ===
								this.j.getNativeEditorValue()
							) {
								this.startValue = this.snapshot.make();
							}
						}
					)
					.on(this, 'change.history', () => this.onChange());
			});
		}
	}

	private updateTick: number = 0;

	/**
	 * A step is open: changes have come in that are not in the stack yet
	 */
	private __hasPendingChanges: boolean = false;

	/**
	 * Records the open step `history.timeout` after its first change
	 */
	private __timer: number = 0;

	/**
	 * Update change counter
	 * @internal
	 */
	protected __upTick(): void {
		this.updateTick += 1;
	}

	/**
	 * Push new command in stack on some changes. The first change opens a
	 * step, and later ones join it until `history.timeout` has passed,
	 * however close together they come.
	 */
	private onChange(): void {
		// A transaction is over by the time the step is recorded, so it is
		// checked now
		if (this.snapshot.isBlocked || this.__hasPendingChanges) {
			return;
		}

		this.__hasPendingChanges = true;
		this.__timer = this.async.setTimeout(
			() => this.__processPendingChanges(),
			this.j.o.history.timeout
		);

		// With a timeout of 0 the step is already recorded. Otherwise
		// canUndo and canRedo count it from now
		if (this.__hasPendingChanges) {
			this.fireChangeStack();
		}
	}

	/**
	 * Push the open step's changes now
	 */
	private __processPendingChanges(): void {
		if (this.__hasPendingChanges) {
			this.__processChanges();
		}
	}

	/**
	 * @internal
	 */
	protected __processChanges(): void {
		if (this.snapshot.isBlocked || !this.j.o.history.enable) {
			return;
		}

		this.async.clearTimeout(this.__timer);
		this.__hasPendingChanges = false;
		this.updateStack();
	}

	/**
	 * Update history stack
	 */
	private updateStack(replace: boolean = false): void {
		const newValue = this.snapshot.make();

		if (Snapshot.equal(newValue, this.startValue)) {
			return;
		}

		// Only the selection moved, for example when the selection markers
		// went in before a switch to the source view. There is nothing to
		// undo, but the next change has to start from this selection.
		if (newValue.html === this.startValue.html) {
			this.startValue = newValue;
			return;
		}

		const newCommand = new Command(
			this.startValue,
			newValue,
			this,
			this.updateTick
		);

		if (replace) {
			const command = this.__stack.current();

			if (command && this.updateTick === command.tick) {
				this.__stack.replace(newCommand);
			}
		} else {
			this.__stack.push(newCommand);
		}

		this.startValue = newValue;
		this.fireChangeStack();
	}

	private fireChangeStack(): void {
		this.j && !this.j.isInDestruct && this.j.events?.fire('changeStack');
	}

	override destruct(): void {
		if (this.isInDestruct) {
			return;
		}

		if (this.j.events) {
			this.j.e.off('.history');
		}

		this.snapshot.destruct();

		super.destruct();
	}
}
