/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { CallbackFunction } from './types';

export interface IObservableObject<T> {
	on(event: string | string[], callback: CallbackFunction): this;
	fire(event: string | string[], ...attr: any[]): void;
}
export type ObservableObject<T> = T & IObservableObject<T>;
