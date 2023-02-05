/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type {
	CallbackFunction,
	CanUndef,
	IComponent,
	SnapshotType
} from './types';

export interface ICommand {
	tick: number;
	undo(): void;
	redo(): void;
}

export interface IStack {
	readonly length: number;
	clear(): void;
	push(command: ICommand): void;
	replace(command: ICommand): void;
	current(): CanUndef<ICommand>;
	undo(): boolean;
	redo(): boolean;
	canUndo(): boolean;
	canRedo(): boolean;
}

export interface ISnapshot {
	readonly isBlocked: boolean;
	make(): SnapshotType;
	restoreOnlySelection(snapshot: SnapshotType): void;
	restore(snapshot: SnapshotType): void;
	transaction(changes: () => void): void;
}

export interface IHistory {
	readonly snapshot: ISnapshot;

	redo(): void;
	canRedo(): boolean;

	undo(): void;
	canUndo(): boolean;

	clear(): void;

	readonly length: number;
}
