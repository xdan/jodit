/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type {
	CanPromise,
	IControlType,
	IDictionary,
	IViewBased,
	IJodit,
	RejectablePromise,
	Nullable
} from 'jodit/types';
import { isFunction } from '../checker/is-function';
import { isPromise } from '../checker/is-promise';
import { isVoid } from '../checker/is-void';
import { isPlainObject } from '../checker/is-plain-object';
import { isString } from '../checker/is-string';
import { dataBind } from './data-bind';
import { css } from './css';
import { CamelCaseToKebabCase } from '../string/kebab-case';

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
 * Get attribute
 */
export function attr(elm: Element, key: string): null | string;

/**
 * Remove attribute
 */
export function attr(elm: Element, key: string, value: null): void;

/**
 * Set attribute
 */
export function attr(
	elm: Element,
	key: string,
	value: string | number | boolean | undefined | null
): null;

/**
 * Set or remove several attributes
 */
export function attr(
	elm: Element,
	attributes: IDictionary<string | number | boolean | null>
): null;

/**
 * Alias for `elm.getAttribute` but if set second argument `-{key}`
 * it will also check `data-{key}` attribute
 * if set `value` it is alias for setAttribute with same logic
 */
export function attr(
	elm: Element,
	keyOrAttributes: string | IDictionary<string | number | boolean | null>,
	value?: string | number | boolean | null
): null | string {
	if (!elm || !isFunction(elm.getAttribute)) {
		return null;
	}

	if (!isString(keyOrAttributes)) {
		Object.keys(keyOrAttributes).forEach(key => {
			const value = keyOrAttributes[key];

			if (isPlainObject(value) && key === 'style') {
				css(<HTMLElement>elm, value as IDictionary<string>);
			} else {
				if (key === 'className') {
					key = 'class';
				}

				attr(elm, key, value);
			}
		});

		return null;
	}

	let key = CamelCaseToKebabCase(keyOrAttributes);

	if (/^-/.test(key)) {
		const res = attr(elm, `data${key}`);

		if (res) {
			return res;
		}

		key = key.substr(1);
	}

	if (value !== undefined) {
		if (value == null) {
			elm.hasAttribute(key) && elm.removeAttribute(key);
		} else {
			elm.setAttribute(key, value.toString());
			return value.toString();
		}
	}

	return elm.getAttribute(key);
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
	callback: () => CanPromise<any>
): CanPromise<void> {
	if (isPromise(condition)) {
		return condition.finally(callback);
	}

	return callback();
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
