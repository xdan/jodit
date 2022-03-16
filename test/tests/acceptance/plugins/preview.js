/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Preview plugin', () => {
	it('should show the same content', () => {
		const jodit = getJodit();
		jodit.value =
			'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>';
		clickButton('preview', jodit);
		const dialog = getOpenedDialog(jodit);
		expect(dialog.querySelector('.jodit__preview-box').innerHTML).eq(
			'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>'
		);
	});

	describe('In iframe mode', () => {
		it('should show the same content', () => {
			const jodit = getJodit({ iframe: true });
			jodit.value =
				'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>';
			clickButton('preview', jodit);
			const dialog = getOpenedDialog(jodit);
			expect(
				dialog.querySelector('.jodit__preview-box iframe')
					.contentDocument.body.innerHTML
			).eq(
				'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>'
			);
		});

		describe('Double time', () => {
			it('should show the same content', () => {
				const jodit = getJodit({ iframe: true });
				jodit.value =
					'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>';
				clickButton('preview', jodit);
				const dialog = getOpenedDialog(jodit);
				expect(
					dialog.querySelector('.jodit__preview-box iframe')
						.contentDocument.body.innerHTML
				).eq(
					'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>'
				);

				dialog.component.close();
				clickButton('preview', jodit);
				const dialog2 = getOpenedDialog(jodit);
				expect(
					dialog2.querySelector('.jodit__preview-box iframe')
						.contentDocument.body.innerHTML
				).eq(
					'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>'
				);
			});
		});
	});
});
