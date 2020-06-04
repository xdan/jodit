/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import 'classlist-polyfill';
import 'es6-promise/auto';

if (!Array.from) {
	Array.from = <T>(object: T[]): T[] => {
		'use strict';
		return [].slice.call(object);
	};
}

// for ie11
if (!Array.prototype.includes) {
	Array.prototype.includes = function(value: any) {
		return this.indexOf(value) > -1;
	};
}

if (!Array.prototype.find) {
	Array.prototype.find = function(value: any) {
		return this.indexOf(value) > -1 ? value : undefined;
	};
}
