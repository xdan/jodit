/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module request
 */

import type { AjaxOptions } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * A set of key/value pairs that configure the Ajax request. All settings are optional
		 */
		defaultAjaxOptions: AjaxOptions;
	}
}

Config.prototype.defaultAjaxOptions = {
	successStatuses: [200, 201, 202],

	dataType: 'json',
	method: 'GET',
	url: '',
	data: null,
	contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

	headers: {
		'X-REQUESTED-WITH': 'XMLHttpRequest' // compatible with jQuery
	},

	withCredentials: false,

	xhr(): XMLHttpRequest {
		return new XMLHttpRequest();
	}
} as AjaxOptions;
