/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Preview plugin', () => {
	[
		[
			'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>',
			'<p>text</p><table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>'
		],
		[
			'<p>sdasdas <span style="font-size: 36px;">dasd</span> asd asd</p>',
			'<p>sdasdas <span style="font-size: 36px;">dasd</span> asd asd</p>'
		],
		[
			'<script>console.log(111);</script><p>111</p>',
			'<script>console.log(111);</script><p>111</p>'
		],
		[
			'<table><tbody><tr><th>1</th><td>2</td></tr></tbody></table><p>111</p>',
			'<table><tbody><tr><th>1</th><td>2</td></tr></tbody></table><p>111</p>'
		]
	].forEach(([source, result]) => {
		describe('For source ' + source, () => {
			it('should show the same content', () => {
				const jodit = getJodit();
				jodit.value = source;
				clickButton('preview', jodit);
				const dialog = getOpenedDialog(jodit);
				expect(
					dialog.querySelector('.jodit__preview-box').innerHTML
				).eq(result);
			});
		});
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
