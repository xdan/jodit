/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Fullsize plugin', function () {
	describe('Toggle fullsize', function () {
		it('Should resize all boxes to first state', () => {
			const editor = getJodit({
				history: {
					timeout: 0
				}
			});

			const checkSizes = ['container', 'workplace', 'editor'];

			const initialSizes = checkSizes.map(
					key => editor[key].offsetHeight
				),
				equal = (a, b) => Math.abs(a - b) <= 2;

			editor.toggleFullSize(true);
			checkSizes.map((key, index) => {
				expect(equal(editor[key].offsetHeight, initialSizes[index])).is
					.false;
			});

			editor.toggleFullSize(false);

			checkSizes.map(function (key, index) {
				expect(
					equal(editor[key].offsetHeight, initialSizes[index])
				).is.true;
			});
		});

		function checkAllParents(editor, enabled) {
			let parent = editor.container.parentNode;

			while (parent && parent.nodeType === Node.ELEMENT_NODE) {
				expect(
					parent.classList.contains('jodit_fullsize-box_true')
				).equals(enabled);
				parent = parent.parentNode;
			}
		}

		describe('globalFullSize', () => {
			describe('set fullsize', () => {
				it('Should set special class for all parents', () => {
					const editor = getJodit();
					editor.toggleFullSize(true);
					checkAllParents(editor, true);
				});
			});

			describe('remove fullsize', () => {
				it('Should remove special class for all parents', () => {
					const editor = getJodit();
					editor.toggleFullSize(true);
					editor.toggleFullSize(false);
					checkAllParents(editor, false);
				});

				describe('Several fullsize blocks', () => {
					it('Should remove special class for all parents only for latest block', () => {
						const editor = getJodit();
						editor.toggleFullSize(true);
						const dialog = editor.dlg();
						dialog.open('test');
						dialog.toggleFullSize(true);

						checkAllParents(editor, true);

						dialog.toggleFullSize(false);
						checkAllParents(editor, true);

						editor.toggleFullSize(false);
						checkAllParents(editor, false);
					});
				});

				describe('Close dialog', () => {
					it('Should work same way', () => {
						const editor = getJodit();
						const dialog = editor.dlg();
						dialog.open('test');
						dialog.toggleFullSize(true);

						checkAllParents(dialog, true);

						dialog.close();
						checkAllParents(dialog, false);
					});
				});
			});
		});
	});
});
