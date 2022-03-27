/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/history/README.md]]
 * @packageDocumentation
 * @module modules/history
 */

import type {
	IJodit,
	SnapshotType,
	IHistory,
	ISnapshot,
	IStack,
	IDestructible
} from 'jodit/types';
import { Config } from 'jodit/config';
import { ViewComponent } from 'jodit/core/component';
import { Snapshot } from './snapshot';
import { Stack } from './stack';
import { Command } from './command';
import { debounce } from 'jodit/core/decorators';

declare module 'jodit/config' {
	interface Config {
		history: {
			enable: boolean;

			/**
			 * Limit of history length
			 */
			maxHistoryLength: number;

			/**
			 * Delay on every change
			 */
			timeout: number;
		};

		/**
		 * @deprecated Instead use `history`
		 */
		observer: this['history'];
	}
}

Config.prototype.history = {
	enable: true,
	maxHistoryLength: Infinity,
	timeout: 1000
};

Config.prototype.observer = Config.prototype.history;

/**
 * The module monitors the status of the editor and creates / deletes the required number of Undo / Redo shots .
 */
export class History extends ViewComponent<IJodit> implements IHistory {
	/** @override */
	override className(): string {
		return 'History';
	}

	private __startValue!: SnapshotType;

	protected get startValue(): SnapshotType {
		return this.__startValue;
	}

	protected set startValue(value: SnapshotType) {
		this.__startValue = value;
	}

	private readonly stack: IStack;
	public snapshot: ISnapshot & IDestructible;

	constructor(
		editor: IJodit,
		stack = new Stack(editor.o.history.maxHistoryLength),
		snapshot = new Snapshot(editor)
	) {
		super(editor);

		this.stack = stack;
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
					.on(this, 'change.history', this.onChange);
			});
		}
	}

	private updateTick: number = 0;

	upTick(): void {
		this.updateTick += 1;
	}

	/**
	 * Push new command in stack on some changes
	 */
	@debounce()
	private onChange(): void {
		this.processChanges();
	}

	processChanges(): void {
		if (this.snapshot.isBlocked) {
			return;
		}

		this.updateStack();
	}

	/**
	 * Update history stack
	 */
	private updateStack(replace: boolean = false): void {
		const newValue = this.snapshot.make();

		if (!Snapshot.equal(newValue, this.startValue)) {
			const newCommand = new Command(
				this.startValue,
				newValue,
				this,
				this.updateTick
			);

			if (replace) {
				const command = this.stack.current();

				if (command && this.updateTick === command.tick) {
					this.stack.replace(newCommand);
				}
			} else {
				this.stack.push(newCommand);
			}

			this.startValue = newValue;
			this.fireChangeStack();
		}
	}

	/**
	 * Return state of the WYSIWYG editor to step back
	 */
	redo(): void {
		if (this.stack.redo()) {
			this.startValue = this.snapshot.make();
			this.fireChangeStack();
		}
	}

	canRedo(): boolean {
		return this.stack.canRedo();
	}

	/**
	 * Return the state of the WYSIWYG editor to step forward
	 */
	undo(): void {
		if (this.stack.undo()) {
			this.startValue = this.snapshot.make();
			this.fireChangeStack();
		}
	}

	canUndo(): boolean {
		return this.stack.canUndo();
	}

	clear(): void {
		this.startValue = this.snapshot.make();
		this.stack.clear();
		this.fireChangeStack();
	}

	get length(): number {
		return this.stack.length;
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
