/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Fullsize plugin', function () {
	describe('Toggle fullsize', function () {
		it('Should resize all boxes to first state', function () {
			const editor = getJodit({
				history: {
					timeout: 0
				}
			});
			const chacksizes = ['container', 'workplace', 'editor'];
			const sizes = chacksizes.map(function (key) {
					return editor[key].offsetHeight;
				}),
				equal = function (a, b) {
					return Math.abs(a - b) <= 2;
				};

			editor.toggleFullSize(true);
			chacksizes.map(function (key, index) {
				expect(equal(editor[key].offsetHeight, sizes[index])).is.false;
			});

			editor.toggleFullSize(false);

			chacksizes.map(function (key, index) {
				expect(equal(editor[key].offsetHeight, sizes[index])).is.true;
			});
		});
	});
});
