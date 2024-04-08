/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type {
	CanPromise,
	IControlType,
	IJodit,
	IViewBased,
	Nullable,
	RejectablePromise
} from 'jodit/types';
import { isPromise } from 'jodit/core/helpers/checker/is-promise';
import { isVoid } from 'jodit/core/helpers/checker/is-void';

import { attr } from './attr';
import { dataBind } from './data-bind';

/**
 * Call function with parameters
 *
 * @example
 * ```js
 * const f = Math.random();
 * Jodit.modules.Helpers.call(f > 0.5 ? Math.ceil : Math.floor, f);
 * ```
 */

export function call<T extends any[], R>(
	func: (...args: T) => R,
	...args: T
): R {
	return func(...args);
}

/**
 * Mark element for debugging
 */
export function markOwner(jodit: IViewBased, elm: HTMLElement): void {
	attr(elm, 'data-editor_id', jodit.id);

	!elm.component &&
		Object.defineProperty(elm, 'jodit', {
			value: jodit
		});
}

export function callPromise(
	condition: CanPromise<unknown>,
	callback?: () => CanPromise<any>
): CanPromise<void> {
	if (isPromise(condition)) {
		return condition
			.then(
				resp => resp,
				() => null
			)
			.finally(callback);
	}

	return callback?.();
}

/**
 * Allow load image in promise
 */
export const loadImage = (
	src: string,
	jodit: IViewBased
): RejectablePromise<HTMLImageElement> =>
	jodit.async.promise<HTMLImageElement>((res, rej) => {
		const image = new Image(),
			onError = (): void => {
				jodit.e.off(image);
				rej?.();
			},
			onSuccess = (): void => {
				jodit.e.off(image);
				res(image);
			};

		jodit.e
			.one(image, 'load', onSuccess)
			.one(image, 'error', onError)
			.one(image, 'abort', onError);

		image.src = src;

		if (image.complete) {
			onSuccess();
		}
	});

export const keys = (obj: object, own: boolean = true): string[] => {
	if (own) {
		return Object.keys(obj);
	}

	const props: string[] = [];

	for (const key in obj) {
		props.push(key);
	}

	return props;
};

/**
 * Memorize last user chose
 */
export const memorizeExec = <T extends IJodit = IJodit>(
	editor: T,
	_: unknown,
	{ control }: { control: IControlType<T> },
	preProcessValue?: (value: string) => string
): void | false => {
	const key = `button${control.command}`;

	let value = (control.args && control.args[0]) ?? dataBind(editor, key);

	if (isVoid(value)) {
		return false;
	}

	dataBind(editor, key, value);

	if (preProcessValue) {
		value = preProcessValue(value);
	}

	editor.execCommand(control.command as string, false, value ?? undefined);
};

/**
 * Get DataTransfer from different event types
 */
export const getDataTransfer = (
	event: ClipboardEvent | DragEvent
): Nullable<DataTransfer> => {
	if ((event as ClipboardEvent).clipboardData) {
		return (event as ClipboardEvent).clipboardData;
	}

	try {
		return (event as DragEvent).dataTransfer || new DataTransfer();
	} catch {
		return null;
	}
};
