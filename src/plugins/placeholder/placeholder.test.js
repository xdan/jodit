/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Placeholder plugin', function () {
	describe('After init on empty textarea', function () {
		it('Should show placeholder', function () {
			const area = appendTestArea();

			area.value = '';

			const editor = Jodit.make(area);

			expect(
				editor.container.querySelectorAll('.jodit-placeholder')
					.length &&
					editor.container.querySelector('.jodit-placeholder').style
						.display === 'block'
			).is.true;
		});
	});

	describe('After init on not empty textarea', function () {
		it('Should hide placeholder', function () {
			const area = appendTestArea();
			area.value = '111';
			const editor = Jodit.make(area);
			expect(
				!editor.container.querySelectorAll('.jodit-placeholder').length
			).is.true;
		});

		describe('Empty P', function () {
			it('Should show placeholder', function () {
				const area = appendTestArea();
				area.value = '<p><br></p>';
				const editor = Jodit.make(area);

				expect(editor.container.querySelector('.jodit-placeholder')).is
					.not.null;
			});
		});

		describe('Empty UL/LI', function () {
			it('Should not show placeholder', function () {
				const area = appendTestArea();
				area.value = '<ul><li><br></li></ul>';
				const editor = Jodit.make(area);

				expect(editor.container.querySelector('.jodit-placeholder')).is
					.null;
			});
		});
		describe('Bare BR, as Firefox pads an empty editable body', function () {
			it('Should show placeholder', function () {
				const area = appendTestArea();
				area.value = '<br>';
				const editor = Jodit.make(area, { enter: 'br' });

				expect(editor.editor.innerHTML).equals('<br>');
				expect(editor.container.querySelector('.jodit-placeholder')).is
					.not.null;
			});
		});
	});

	describe('Add text inside editor', function () {
		it('should show placeholder', function () {
			const area = appendTestArea();
			const editor = Jodit.make(area);

			editor.value = '';

			expect(
				editor.container.querySelectorAll('.jodit-placeholder')
					.length &&
					editor.container.querySelector('.jodit-placeholder').style
						.display === 'block'
			).is.true;

			editor.s.insertNode(editor.createInside.text('test'));

			expect(
				!editor.container.querySelectorAll('.jodit-placeholder').length
			).is.true;
		});
	});

	describe('For element with fontsize 12px', function () {
		it("Should set Placeholder's fontsize", function () {
			const area = appendTestArea();
			const editor = Jodit.make(area);

			editor.editor.style.fontSize = '12px';
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			expect(
				editor.container.querySelectorAll('.jodit-placeholder')
					.length &&
					editor.container.querySelector('.jodit-placeholder').style
						.fontSize === '12px'
			).is.true;
		});
	});

	describe('For different align', function () {
		it("Should set Placeholder's text-align", function () {
			const editor = getJodit();

			editor.value = '<p>|<br></p>';
			setCursorToChar(editor);

			clickTrigger('left', editor);
			const list = getOpenedPopup(editor);
			clickButton('right', list);

			const placeholder = editor.container.querySelector(
				'[data-ref="placeholder"]'
			);

			expect(placeholder.style.textAlign === 'right').is.true;

			clickTrigger('left', editor);
			const list2 = getOpenedPopup(editor);
			clickButton('center', list2);

			expect(placeholder.style.textAlign === 'center').is.true;
		});
	});

	describe('For different editor padding', function () {
		it('Should set same padding for placeholder', function () {
			const editor = getJodit();
			applyGlobalStyle('.jodit-wysiwyg { padding: 16px !important; }');

			editor.value = '<p>|<br></p>';
			setCursorToChar(editor);

			const placeholder = editor.container.querySelector(
				'[data-ref="placeholder"]'
			);

			const style = editor.ow.getComputedStyle(placeholder);
			expect(style.paddingTop).eq('16px');
		});
	});

	describe('In iframe mode', function () {
		const stylesheet = css => 'data:text/css,' + encodeURIComponent(css);

		const placeholderOf = editor =>
			editor.container.querySelector('[data-ref="placeholder"]');

		it('Should measure again once a stylesheet of the editing document loads', async () => {
			const editor = getJodit({
				iframe: true,
				iframeStyle: '',
				iframeCSSLinks: [stylesheet('body{}')]
			});

			await delay(300);
			expect(placeholderOf(editor).style.paddingTop).equals('0px');

			// As a stylesheet does that arrives after the placeholder is shown
			editor.ed.querySelector('link').href =
				stylesheet('body{padding:40px}');
			await delay(300);

			expect(placeholderOf(editor).style.paddingTop).equals('40px');
		});

		it('Should take the font of the editing document', async () => {
			const editor = getJodit({
				iframe: true,
				iframeStyle: '',
				iframeCSSLinks: [stylesheet('body{font-family:monospace}')]
			});

			await delay(300);

			expect(
				editor.ow.getComputedStyle(placeholderOf(editor)).fontFamily
			).equals('monospace');
		});
	});

	// https://github.com/xdan/jodit/issues/1495
	describe('Empty block added after init', function () {
		it('Should take the margin of that block', function () {
			applyGlobalStyle('.jodit-wysiwyg p { margin-top: 20px; }');

			const editor = getJodit({
				wrapNodes: { emptyBlockAfterInit: true }
			});

			expect(editor.editor.innerHTML).equals('<p><br></p>');

			const placeholder = editor.container.querySelector(
				'[data-ref="placeholder"]'
			);

			expect(placeholder.style.marginTop).equals('20px');
		});
	});

	describe('Command on an empty editor whose value stays empty', function () {
		it("Should take the block's new line height", function () {
			const editor = getJodit({
				cleanHTML: { collapseEmptyValueToEmptyString: true }
			});

			editor.value = '<p>|<br></p>';
			setCursorToChar(editor);

			editor.execCommand('applyLineHeight', null, 2);

			const placeholder = editor.container.querySelector(
				'[data-ref="placeholder"]'
			);

			expect(placeholder.style.lineHeight).equals(
				editor.ew.getComputedStyle(editor.editor.firstElementChild)
					.lineHeight
			);
		});
	});

	describe('ReadOnly', function () {
		it('Should hide placeholder', function () {
			const table_editor_interface = appendTestArea();
			table_editor_interface.value = '';

			const editor = Jodit.make(table_editor_interface, {
				readonly: true
			});

			expect(
				!editor.container.querySelectorAll('.jodit-placeholder').length
			).is.true;
			editor.value = 'test';
			expect(
				!editor.container.querySelectorAll('.jodit-placeholder').length
			).is.true;
		});
	});
});
