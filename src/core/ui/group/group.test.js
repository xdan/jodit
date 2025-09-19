/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
		});

		describe('canUpdate', () => {
			it('should return true for elements with update method', () => {
				const group = new UIGroup(editor);
				const button = new UIButton(editor);

				expect(group.canUpdate(button)).to.be.true;
			});

			it('should return false for elements without update method', () => {
				const group = new UIGroup(editor);
				const mockElement = {
					container: document.createElement('div'),
					parentElement: null
				};

				expect(group.canUpdate(mockElement)).to.be.false;
			});

			it('should return false for elements with non-function update property', () => {
				const group = new UIGroup(editor);
				const mockElement = {
					container: document.createElement('div'),
					parentElement: null,
					update: 'not a function'
				};

				expect(group.canUpdate(mockElement)).to.be.false;
			});
		});

		describe('update', () => {
			it('should call update on all children that can be updated', () => {
				const group = new UIGroup(editor);
				const button1 = new UIButton(editor);
				const button2 = new UIButton(editor);

				let button1Updated = false;
				let button2Updated = false;

				button1.update = () => {
					button1Updated = true;
				};
				button2.update = () => {
					button2Updated = true;
				};

				group.append(button1);
				group.append(button2);
				group.update();

				expect(button1Updated).to.be.true;
				expect(button2Updated).to.be.true;
			});

			it('should skip elements without update method', () => {
				const group = new UIGroup(editor);
				const button = new UIButton(editor);
				const mockElement = {
					container: document.createElement('div'),
					parentElement: null,
					name: 'mock'
				};

				let buttonUpdated = false;
				button.update = () => {
					buttonUpdated = true;
				};

				group.append(button);
				group.elements.push(mockElement);

				expect(() => {
					group.update();
				}).to.not.throw();

				expect(buttonUpdated).to.be.true;
			});

			it('should skip elements with non-function update property', () => {
				const group = new UIGroup(editor);
				const button = new UIButton(editor);
				const mockElement = {
					container: document.createElement('div'),
					parentElement: null,
					update: 'not a function'
				};

				let buttonUpdated = false;
				button.update = () => {
					buttonUpdated = true;
				};

				group.append(button);
				group.elements.push(mockElement);

				expect(() => {
					group.update();
				}).to.not.throw();

				expect(buttonUpdated).to.be.true;
			});

			it('should update size mod after updating children', () => {
				const group = new UIGroup(editor);
				const button = new UIButton(editor);

				group.append(button);
				group.buttonSize = 'large';
				group.update();

				expect(group.getMod('size')).to.equal('large');
			});

			it('should handle empty elements array', () => {
				const group = new UIGroup(editor);

				expect(() => {
					group.update();
				}).to.not.throw();
			});

			it('should update nested groups', () => {
				const parentGroup = new UIGroup(editor);
				const childGroup = new UIGroup(editor);
				const button = new UIButton(editor);

				let childGroupUpdated = false;
				let buttonUpdated = false;

				childGroup.update = function () {
					childGroupUpdated = true;
					UIGroup.prototype.update.call(this);
				};

				button.update = () => {
					buttonUpdated = true;
				};

				childGroup.append(button);
				parentGroup.append(childGroup);
				parentGroup.update();

				expect(childGroupUpdated).to.be.true;
				expect(buttonUpdated).to.be.true;
			});
		});
	});
});
