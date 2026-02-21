/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test group ui', () => {
	const { UIGroup, UIButton } = Jodit.modules;

	let editor;
	beforeEach(() => {
		editor = getJodit();
	});

	describe('UIGroup', () => {
		describe('setMod', () => {
			describe('syncMod === true', () => {
				it('should set mod for all children', () => {
					const group = new UIGroup(editor);
					group.syncMod = true;
					const button = new UIButton(editor);
					const button2 = new UIButton(editor);
					group.append(button);
					group.append(button2);
					group.setMod('test', 123);
					expect(button.getMod('test')).eq(123);
					expect(button2.getMod('test')).eq(123);
				});
			});

			describe('syncMod === false', () => {
				it('should not set mod for all children', () => {
					const group = new UIGroup(editor);
					const button = new UIButton(editor);
					const button2 = new UIButton(editor);
					group.append(button);
					group.append(button2);
					group.setMod('test', 123);
					expect(button.getMod('test')).not.eq(123);
					expect(button2.getMod('test')).not.eq(123);
				});
			});
		});

		describe('append with index', () => {
			it('should append element at the beginning when index is 0', () => {
				const group = new UIGroup(editor);

				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);
				const button3 = new UIButton(editor);

				group.append(button1);
				group.append(button2);

				group.append(button3, 0);

				expect(group.elements[0]).eq(button3);
				expect(group.elements[1]).eq(button1);
				expect(group.elements[2]).eq(button2);
				expect(group.container.children[0]).eq(button3.container);
			});

			it('should append element at the end when index equals elements length', () => {
				const group = new UIGroup(editor);
				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);
				const button3 = new UIButton(editor);

				group.append(button1);
				group.append(button2);
				group.append(button3, 2);

				expect(group.elements[0]).eq(button1);
				expect(group.elements[1]).eq(button2);
				expect(group.elements[2]).eq(button3);
				expect(group.container.children[2]).eq(button3.container);
			});

			it('should append element in the middle at specified index', () => {
				const group = new UIGroup(editor);
				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);
				const button3 = new UIButton(editor);

				group.append(button1);
				group.append(button2);
				group.append(button3, 1);

				expect(group.elements[0]).eq(button1);
				expect(group.elements[1]).eq(button3);
				expect(group.elements[2]).eq(button2);
				expect(group.container.children[1]).eq(button3.container);
			});

			it('should clamp negative index to 0', () => {
				const group = new UIGroup(editor);
				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);
				const button3 = new UIButton(editor);

				group.append(button1);
				group.append(button2);
				group.append(button3, -5);

				expect(group.elements[0]).eq(button3);
				expect(group.elements[1]).eq(button1);
				expect(group.elements[2]).eq(button2);
				expect(group.container.children[0]).eq(button3.container);
			});

			it('should clamp large index to elements length', () => {
				const group = new UIGroup(editor);
				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);
				const button3 = new UIButton(editor);

				group.append(button1);
				group.append(button2);
				group.append(button3, 100);

				expect(group.elements[0]).eq(button1);
				expect(group.elements[1]).eq(button2);
				expect(group.elements[2]).eq(button3);
				expect(group.container.children[2]).eq(button3.container);
			});

			it('should append at the end when index is undefined', () => {
				const group = new UIGroup(editor);
				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);
				const button3 = new UIButton(editor);

				group.append(button1);
				group.append(button2);
				group.append(button3, undefined);

				expect(group.elements[0]).eq(button1);
				expect(group.elements[1]).eq(button2);
				expect(group.elements[2]).eq(button3);
				expect(group.container.children[2]).eq(button3.container);
			});

			it('should append at the end when no index provided', () => {
				const group = new UIGroup(editor);
				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);
				const button3 = new UIButton(editor);

				group.append(button1);
				group.append(button2);
				group.append(button3);

				expect(group.elements[0]).eq(button1);
				expect(group.elements[1]).eq(button2);
				expect(group.elements[2]).eq(button3);
			});

			it('should handle index 0 on empty group', () => {
				const group = new UIGroup(editor);
				const button = new UIButton(editor);

				group.append(button, 0);

				expect(group.elements[0]).eq(button);
				expect(group.container.children[0]).eq(button.container);
			});

			it('should work with string distElement parameter as before', () => {
				class SomeGroup extends UIGroup {
					render() {
						return '<div><div class="&__one"></div><div class="&__two"></div></div>';
					}
				}
				const group = new SomeGroup(editor);
				const subGroup = new UIGroup(editor);

				group.append(subGroup, 'two');

				const button = new UIButton(editor);
				group.append(button, 'one');

				expect(group.getElm('one').contains(button.container)).is.true;
				expect(group.getElm('two').contains(subGroup.container)).is
					.true;
			});

			it('should throw error when using index with array of elements', () => {
				const group = new UIGroup(editor);
				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);

				expect(() => {
					group.append([button1, button2], 0);
				}).to.throw(
					'You can not use index when append array of elements'
				);
			});

			it('should have role', () => {
				const group = new UIGroup(editor);
				expect(group.container.getAttribute('role')).eq('list');
			});
		});
	});
});
