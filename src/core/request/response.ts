/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module request
 */

import type { IRequest, IResponse } from 'jodit/types';

export class Response<T> implements IResponse<T> {
	readonly status: number;
	readonly statusText: string;

	readonly request: IRequest;
	get url(): string {
		return this.request.url;
	}

	private readonly body: string | Blob;

	constructor(
		request: IRequest,
		status: number,
		statusText: string,
		body: string | Blob
	) {
		this.request = request;
		this.status = status;
		this.statusText = statusText;
		this.body = body;
	}

	async json(): Promise<T> {
		return JSON.parse(this.body as string);
	}

	text(): Promise<string> {
		return Promise.resolve(this.body as string);
	}

	async blob(): Promise<Blob> {
		return this.body as Blob;
	}
}
