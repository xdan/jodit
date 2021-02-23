/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Tooltip plugin tests', function () {
	describe('Native tooltip', function () {
		it('Should have different tooltip for each language', function () {
			const area = appendTestArea();

			const editor = new Jodit(area, {
				toolbarAdaptive: false,
				useNativeTooltip: true,
				buttons: 'indent,outdent',
				language: 'en'
			});

			expect(
				getButton('outdent', editor).parentElement.getAttribute('title')
			).is.not.null;

			const title = getButton(
				'outdent',
				editor
			).parentElement.getAttribute('title');

			editor.destruct();

			const editor2 = new Jodit(area, {
				toolbarAdaptive: false,
				useNativeTooltip: true,
				buttons: 'indent,outdent',
				language: 'ru'
			});

			expect(
				getButton('outdent', editor2).parentElement.getAttribute(
					'title'
				)
			).is.not.null;

			expect(title).does.not.equal(
				getButton('outdent', editor2).parentElement.getAttribute(
					'title'
				)
			);
		});
	});

	describe('Jodit tooltip', function () {
		it('Should have different tooltip for each language', function () {
			const area = appendTestArea();

			let editor = new Jodit(area, {
				toolbarAdaptive: false,
				useNativeTooltip: false,
				buttons: 'indent,outdent',
				showTooltipDelay: 0,
				language: 'en'
			});

			let button = getButton('indent', editor);

			expect(button).is.not.null;

			simulateEvent('mouseenter', 0, button);

			let tooltip = editor.ownerDocument.querySelector('.jodit-tooltip');
			expect(tooltip).is.not.null;
			const title = tooltip.textContent;
			editor.destruct();

			editor = new Jodit(area, {
				toolbarAdaptive: false,
				useNativeTooltip: false,
				showTooltipDelay: 0,
				buttons: 'indent,outdent',
				language: 'ru'
			});

			button = getButton('indent', editor);
			expect(button).is.not.null;

			simulateEvent('mousemove', button);

			tooltip = editor.ownerDocument.querySelector('.jodit-tooltip');

			expect(tooltip).is.not.null;
			simulateEvent('mouseleave', button);
			expect(tooltip.parentNode).is.not.null;

			expect(parseInt(tooltip.style.left, 10)).equals(-5000);

			expect(title).does.not.equal(tooltip.textContent);
		});
	});
});
