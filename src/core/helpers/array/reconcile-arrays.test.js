/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test reconcileArrays', () => {
	const { reconcileArrays, applyArrayReconciliation } = Jodit.modules;

	describe('reconcileArrays', () => {
		describe('with primitive arrays', () => {
			it('should detect added items', () => {
				const oldArray = [1, 2, 3];
				const newArray = [1, 2, 3, 4, 5];
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added).to.deep.equal([4, 5]);
				expect(result.removed).to.deep.equal([]);
				expect(result.kept).to.deep.equal([1, 2, 3]);
				expect(result.moved).to.deep.equal([]);
			});

			it('should detect removed items', () => {
				const oldArray = [1, 2, 3, 4, 5];
				const newArray = [2, 4];
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added).to.deep.equal([]);
				expect(result.removed).to.deep.equal([1, 3, 5]);
				expect(result.kept).to.deep.equal([2, 4]);
				expect(result.moved).to.deep.equal([]);
			});

			it('should detect moved items', () => {
				const oldArray = [1, 2, 3, 4];
				const newArray = [3, 1, 2, 4];
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added).to.deep.equal([]);
				expect(result.removed).to.deep.equal([]);
				expect(result.kept.sort()).to.deep.equal([1, 2, 3, 4]);
				expect(result.moved).to.deep.equal([
					{ item: 3, from: 2, to: 0 },
					{ item: 1, from: 0, to: 1 },
					{ item: 2, from: 1, to: 2 }
				]);
			});

			it('should handle complete replacement', () => {
				const oldArray = [1, 2, 3];
				const newArray = [4, 5, 6];
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added).to.deep.equal([4, 5, 6]);
				expect(result.removed).to.deep.equal([1, 2, 3]);
				expect(result.kept).to.deep.equal([]);
				expect(result.moved).to.deep.equal([]);
			});

			it('should handle empty arrays', () => {
				const result1 = reconcileArrays([], [1, 2, 3]);
				expect(result1.added).to.deep.equal([1, 2, 3]);
				expect(result1.removed).to.deep.equal([]);
				expect(result1.kept).to.deep.equal([]);
				expect(result1.moved).to.deep.equal([]);

				const result2 = reconcileArrays([1, 2, 3], []);
				expect(result2.added).to.deep.equal([]);
				expect(result2.removed).to.deep.equal([1, 2, 3]);
				expect(result2.kept).to.deep.equal([]);
				expect(result2.moved).to.deep.equal([]);

				const result3 = reconcileArrays([], []);
				expect(result3.added).to.deep.equal([]);
				expect(result3.removed).to.deep.equal([]);
				expect(result3.kept).to.deep.equal([]);
				expect(result3.moved).to.deep.equal([]);
			});

			it('should handle duplicate values', () => {
				const oldArray = [1, 2, 2, 3];
				const newArray = [2, 3, 3, 4];
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added).to.deep.equal([4]);
				expect(result.removed).to.deep.equal([1]);
				expect(result.kept.sort()).to.deep.equal([2, 3]);
			});

			it('should detect complex movements with additions and removals', () => {
				const oldArray = [1, 2, 3, 4, 5];
				const newArray = [3, 5, 6, 1, 7];
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added.sort()).to.deep.equal([6, 7]);
				expect(result.removed.sort()).to.deep.equal([2, 4]);
				expect(result.kept.sort()).to.deep.equal([1, 3, 5]);
				expect(result.moved).to.include.deep.members([
					{ item: 3, from: 2, to: 0 },
					{ item: 5, from: 4, to: 1 },
					{ item: 1, from: 0, to: 3 }
				]);
			});

			it('should handle string arrays', () => {
				const oldArray = ['apple', 'banana', 'cherry'];
				const newArray = ['banana', 'date', 'apple'];
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added).to.deep.equal(['date']);
				expect(result.removed).to.deep.equal(['cherry']);
				expect(result.kept.sort()).to.deep.equal(['apple', 'banana']);
				expect(result.moved).to.include.deep.members([
					{ item: 'banana', from: 1, to: 0 },
					{ item: 'apple', from: 0, to: 2 }
				]);
			});
		});

		describe('with object arrays using key function', () => {
			it('should reconcile objects by id', () => {
				const oldArray = [
					{ id: 1, name: 'Alice' },
					{ id: 2, name: 'Bob' },
					{ id: 3, name: 'Charlie' }
				];
				const newArray = [
					{ id: 2, name: 'Bob' },
					{ id: 4, name: 'David' },
					{ id: 1, name: 'Alice' }
				];
				const result = reconcileArrays(
					oldArray,
					newArray,
					item => item.id
				);

				expect(result.added).to.deep.equal([{ id: 4, name: 'David' }]);
				expect(result.removed).to.deep.equal([
					{ id: 3, name: 'Charlie' }
				]);
				expect(result.kept.map(i => i.id).sort()).to.deep.equal([1, 2]);
				expect(result.moved).to.include.deep.members([
					{ item: { id: 1, name: 'Alice' }, from: 0, to: 2 }
				]);
			});

			it('should handle complex object properties', () => {
				const oldArray = [
					{ id: 'a', data: { value: 1 } },
					{ id: 'b', data: { value: 2 } }
				];
				const newArray = [
					{ id: 'b', data: { value: 2 } },
					{ id: 'c', data: { value: 3 } },
					{ id: 'a', data: { value: 1 } }
				];
				const result = reconcileArrays(
					oldArray,
					newArray,
					item => item.id
				);

				expect(result.added.map(i => i.id)).to.deep.equal(['c']);
				expect(result.removed).to.deep.equal([]);
				expect(result.kept.map(i => i.id).sort()).to.deep.equal([
					'a',
					'b'
				]);
			});

			it('should use composite keys', () => {
				const oldArray = [
					{ type: 'user', id: 1 },
					{ type: 'admin', id: 1 },
					{ type: 'user', id: 2 }
				];
				const newArray = [
					{ type: 'admin', id: 1 },
					{ type: 'user', id: 3 },
					{ type: 'user', id: 1 }
				];
				const result = reconcileArrays(
					oldArray,
					newArray,
					item => `${item.type}-${item.id}`
				);

				expect(result.added).to.deep.equal([{ type: 'user', id: 3 }]);
				expect(result.removed).to.deep.equal([{ type: 'user', id: 2 }]);
			});

			it('should handle null and undefined in key function', () => {
				const oldArray = [
					{ id: 1, name: 'One' },
					{ id: null, name: 'Null' },
					{ id: undefined, name: 'Undefined' }
				];
				const newArray = [
					{ id: undefined, name: 'Undefined' },
					{ id: 2, name: 'Two' },
					{ id: null, name: 'Null' }
				];
				const result = reconcileArrays(
					oldArray,
					newArray,
					item => item.id ?? 'no-id'
				);

				expect(result.added.map(i => i.name)).to.deep.equal(['Two']);
				expect(result.removed.map(i => i.name)).to.deep.equal(['One']);
			});
		});

		describe('edge cases', () => {
			it('should handle very large arrays efficiently', () => {
				const size = 10000;
				const oldArray = Array.from({ length: size }, (_, i) => i);
				const newArray = Array.from(
					{ length: size },
					(_, i) => i + size / 2
				);
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added.length).to.equal(size / 2);
				expect(result.removed.length).to.equal(size / 2);
				expect(result.kept.length).to.equal(size / 2);
			});

			it('should preserve reference equality for kept items', () => {
				const obj1 = { id: 1, value: 'a' };
				const obj2 = { id: 2, value: 'b' };
				const obj3 = { id: 3, value: 'c' };

				const oldArray = [obj1, obj2];
				const newArray = [obj2, obj3];
				const result = reconcileArrays(
					oldArray,
					newArray,
					item => item.id
				);

				expect(result.kept[0]).to.equal(obj2);
				expect(result.removed[0]).to.equal(obj1);
				expect(result.added[0]).to.equal(obj3);
			});

			it('should handle arrays with mixed types', () => {
				const oldArray = [1, 'two', { three: 3 }, null, undefined];
				const newArray = ['two', 4, null, { three: 3 }];
				const result = reconcileArrays(oldArray, newArray);

				expect(result.added.sort()).to.include(4);
				expect(result.removed).to.include(1);
				expect(result.removed).to.include(undefined);
			});
		});
	});

	describe('applyArrayReconciliation', () => {
		it('should transform primitive array correctly', () => {
			const oldArray = [1, 2, 3, 4];
			const newArray = [2, 5, 3, 1];
			const result = applyArrayReconciliation(oldArray, newArray);

			expect(result).to.deep.equal([2, 5, 3, 1]);
		});

		it('should preserve object references from old array when possible', () => {
			const obj1 = { id: 1, name: 'One' };
			const obj2 = { id: 2, name: 'Two' };
			const obj3 = { id: 3, name: 'Three' };
			const obj4 = { id: 4, name: 'Four' };

			const oldArray = [obj1, obj2, obj3];
			const newArray = [
				{ id: 2, name: 'Two' },
				obj4,
				{ id: 1, name: 'One' }
			];
			const result = applyArrayReconciliation(
				oldArray,
				newArray,
				item => item.id
			);

			expect(result[0]).to.equal(obj2);
			expect(result[1]).to.equal(obj4);
			expect(result[2]).to.equal(obj1);
			expect(result.length).to.equal(3);
		});

		it('should handle empty arrays', () => {
			expect(applyArrayReconciliation([], [])).to.deep.equal([]);
			expect(applyArrayReconciliation([1, 2], [])).to.deep.equal([]);
			expect(applyArrayReconciliation([], [1, 2])).to.deep.equal([1, 2]);
		});

		it('should maintain order of new array', () => {
			const oldArray = ['a', 'b', 'c', 'd'];
			const newArray = ['d', 'b', 'e', 'a'];
			const result = applyArrayReconciliation(oldArray, newArray);

			expect(result).to.deep.equal(['d', 'b', 'e', 'a']);
		});

		it('should work with key function for objects', () => {
			const oldArray = [
				{ key: 'a', value: 1 },
				{ key: 'b', value: 2 }
			];
			const newArray = [
				{ key: 'b', value: 20 },
				{ key: 'c', value: 30 },
				{ key: 'a', value: 10 }
			];
			const result = applyArrayReconciliation(
				oldArray,
				newArray,
				item => item.key
			);

			expect(result[0]).to.equal(oldArray[1]);
			expect(result[1]).to.deep.equal({ key: 'c', value: 30 });
			expect(result[2]).to.equal(oldArray[0]);
		});
	});
});
