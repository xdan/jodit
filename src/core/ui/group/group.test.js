/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	});
});
