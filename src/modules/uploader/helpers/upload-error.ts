/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type { IUploaderAnswer, IUploadError, IUploadPlan } from 'jodit/types';
import { AnswerError } from 'jodit/core/helpers/utils/error';

// The connector refused these files: the handler can change the request and send it again
export class UploadError
	extends AnswerError<IUploaderAnswer>
	implements IUploadError
{
	constructor(
		message: string,
		answer: IUploaderAnswer,
		readonly files: File[],
		readonly retry: (plan?: Partial<IUploadPlan>) => Promise<unknown>
	) {
		super(message, answer, answer.data?.code);
		Object.setPrototypeOf(this, UploadError.prototype);
	}
}
