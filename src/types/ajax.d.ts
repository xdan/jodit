/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDestructible, IDictionary } from './types';
import { IViewBased } from './view';

export type DataVariant =
	| IDictionary<string>
	| null
	| FormData
	| string
	| IDictionary<string | IDictionary>;

export interface IRequest {
	url: string;
	method: string;
	data: DataVariant;
}

export interface IAjax extends IDestructible {
	status: number;

	response: string;

	options: AjaxOptions;
	o: this['options'];

	jodit: IViewBased;

	abort(): IAjax;

	send(): Promise<any>;

	prepareRequest(): IRequest;
}

export interface AjaxOptions {
	dataType?: string;
	method?: string;

	url?: string;

	data: DataVariant;

	contentType?: string | false;

	headers?: IDictionary<string> | null;

	withCredentials?: boolean;

	queryBuild?: (
		this: IAjax,
		obj: string | IDictionary<string | object> | FormData,
		prefix?: string
	) => string | FormData;

	xhr?: () => XMLHttpRequest;

	onProgress?: (percentage: number) => void;
}
