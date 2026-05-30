/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Icon.makeIcon', () => {
	describe('Icon resolves to a plain-text (non-element) value', () => {
		// Regression for "Finder not working with React Package" (ticket 1db1255b):
		// a button whose icon is a plain-text/emoji glyph made fromHTML() return a
		// Text node, which has no classList, so the editor crashed on init with
		// "can't access property add, iconElement.classList is undefined".
		it('Should wrap the text glyph in an element instead of crashing', () => {
			const editor = getJodit({ extraIcons: { plainTextIcon: '★' } });

			const node = Jodit.modules.Icon.makeIcon(editor, {
				name: 'plainTextIcon',
				fill: ''
			});

			expect(node).is.not.null;
			// An Element node (nodeType 1), not a Text node (nodeType 3).
			expect(node.nodeType).equals(1);
			expect(node.textContent).equals('★');
			expect(node.classList.contains('jodit-icon')).is.true;
		});

		it('Should keep returning the SVG element directly for normal icons', () => {
			const editor = getJodit();

			const node = Jodit.modules.Icon.makeIcon(editor, {
				name: 'bold',
				fill: ''
			});

			expect(node).is.not.null;
			expect(node.nodeName.toLowerCase()).equals('svg');
			expect(node.classList.contains('jodit-icon')).is.true;
		});
	});
});
