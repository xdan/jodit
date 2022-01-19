/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/observer/README.md]]
 * @packageDocumentation
 * @module modules/observer
 */

import type { IJodit, SnapshotType, IObserver } from 'jodit/types';
import { Config } from 'jodit/config';
import { ViewComponent } from 'jodit/core/component';
import { Snapshot } from './snapshot';
import { Stack } from './stack';
import { Command } from './command';
import { debounce } from 'jodit/core/decorators';

declare module 'jodit/config' {
	interface Config {
		observer: {
			/**
			 * Limit of history length
			 */
			maxHistoryLength: number;

			/**
			 * Delay on every change
			 */
			timeout: number;
		};
	}
}

Config.prototype.observer = {
	maxHistoryLength: Infinity,
	timeout: 100
};

/**
 * The module monitors the status of the editor and creates / deletes the required number of Undo / Redo shots .
 */
export class Observer extends ViewComponent<IJodit> implements IObserver {
	/** @override */
	className(): string {
		return 'Observer';
	}

	private __startValue!: SnapshotType;

	protected get startValue(): SnapshotType {
		return this.__startValue;
	}

	protected set startValue(value: SnapshotType) {
		this.__startValue = value;
	}

	stack: Stack = new Stack(this.j.o.observer.maxHistoryLength);
	snapshot: Snapshot = new Snapshot(this.j);

	private updateTick: number = 0;

	upTick(): void {
		this.updateTick += 1;
	}

	/**
	 * Push new command in stack on some changes
	 */
	@debounce()
	private onChange(): void {
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

	/**
	 * Return the state of the WYSIWYG editor to step forward
	 */
	undo(): void {
		if (this.stack.undo()) {
			this.startValue = this.snapshot.make();
			this.fireChangeStack();
		}
	}

	clear(): void {
		this.startValue = this.snapshot.make();
		this.stack.clear();
		this.fireChangeStack();
	}

	replaceSnapshot(): void {
		this.updateStack(true);
	}

	private fireChangeStack(): void {
		this.j && !this.j.isInDestruct && this.j.events?.fire('changeStack');
	}

	constructor(editor: IJodit) {
		super(editor);

		editor.e.on('afterAddPlace.observer', () => {
			if (this.isInDestruct) {
				return;
			}

			this.startValue = this.snapshot.make();

			editor.events
				// save selection
				.on('internalChange', () => {
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
						.map(f => f + '.observer')
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
				.on(this, 'change.observer', this.onChange);
		});
	}

	override destruct(): void {
		if (this.j.events) {
			this.j.e.off('.observer');
		}

		this.snapshot.destruct();

		super.destruct();
	}
}
