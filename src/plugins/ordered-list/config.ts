/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/ordered-list
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { dataBind } from 'jodit/core/helpers/utils/data-bind';
import { Icon } from 'jodit/core/ui/icon';

const memoExec: IControlType<IJodit>['exec'] = (
	jodit,
	_,
	{ control }
): void => {
	const key = `button${control.command}`;

	const value = (control.args && control.args[0]) ?? dataBind(jodit, key);

	dataBind(jodit, key, value);

	jodit.execCommand(
		control.command as string,
		false,
		value === 'default' ? null : value
	);
};

Icon.set('ol', require('./icons/ol.svg')).set('ul', require('./icons/ul.svg'));

Config.prototype.controls.ul = {
	command: 'insertUnorderedList',
	tags: ['ul'],
	tooltip: 'Insert Unordered List',

	list: {
		default: 'Default',
		circle: 'Circle',
		disc: 'Dot',
		square: 'Quadrate'
	},
	exec: memoExec
} as IControlType;

Config.prototype.controls.ol = {
	command: 'insertOrderedList',
	tags: ['ol'],
	tooltip: 'Insert Ordered List',

	list: {
		default: 'Default',
		'lower-alpha': 'Lower Alpha',
		'lower-greek': 'Lower Greek',
		'lower-roman': 'Lower Roman',
		'upper-alpha': 'Upper Alpha',
		'upper-roman': 'Upper Roman'
	},
	exec: memoExec
} as IControlType;
