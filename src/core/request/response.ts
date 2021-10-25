/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IRequest, IResponse } from '../../types';

export class Response<T> implements IResponse<T> {
	readonly status: number;
	readonly statusText: string;

	readonly request: IRequest;
	get url(): string {
		return this.request.url;
	}

	private readonly body: string;

	constructor(
		request: IRequest,
		status: number,
		statusText: string,
		body: string
	) {
		this.request = request;
		this.status = status;
		this.statusText = statusText;
		this.body = body;
	}

	async json(): Promise<T> {
		return JSON.parse(this.body);
	}

	text(): Promise<string> {
		return Promise.resolve(this.body);
	}
}
