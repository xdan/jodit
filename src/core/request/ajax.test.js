/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Ajax module', () => {
	describe('Constructor', () => {
		it('Should allow to expand options', () => {
			const async = new Jodit.modules.Ajax({ someField: 1, timeout: 10 });
			expect(async.options.timeout).equals(10);
			expect(async.options.headers).deep.equals({
				'X-REQUESTED-WITH': 'XMLHttpRequest'
			});
			expect(async.options.successStatuses).deep.equals([200, 201, 202]);
			expect(async.options.someField).equals(1);
		});
	});
});
