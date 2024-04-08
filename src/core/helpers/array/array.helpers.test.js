/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Test array helpers', () => {
	describe('asArray', () => {
		it('Should return an array', () => {
			expect(Jodit.modules.Helpers.asArray(1)).to.be.an('array');
			expect(Jodit.modules.Helpers.asArray(1)).deep.eq([1]);
			expect(Jodit.modules.Helpers.asArray([1])).deep.eq([1]);
			expect(Jodit.modules.Helpers.asArray('1')).deep.eq(['1']);
		});
	});

	describe('splitArray', () => {
		it('Should return an array', () => {
			expect(Jodit.modules.Helpers.splitArray('1,3')).deep.eq(['1', '3']);
			expect(Jodit.modules.Helpers.splitArray(['1', '3'])).deep.eq([
				'1',
				'3'
			]);
		});
	});

	describe('toArray', () => {
		it('Should return an array', () => {
			expect(Jodit.modules.Helpers.toArray('13')).deep.eq(['1', '3']);
			expect(Jodit.modules.Helpers.toArray(['1', '3'])).deep.eq([
				'1',
				'3'
			]);
			expect(Jodit.modules.Helpers.toArray(1)).deep.eq([]);
		});
	});
});
