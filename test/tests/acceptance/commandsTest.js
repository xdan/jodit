/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Commands Jodit Editor Tests', function () {
	describe('Command "formatBlock"', function () {
		it('Try exec the command "formatBlock" for several elements', function () {
			const editor = getJodit();
			editor.value = '<p>test</p><p>test2</p>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStartBefore(editor.editor.firstChild);
			range.setEndAfter(editor.editor.lastChild);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			expect(editor.value).equals('<h1>test</h1><h1>test2</h1>');
		});

		describe('Exec formatBlock for one inline element', function () {
			it('Should wrap this element and all nearest inline element in block', function () {
				const jodit = getJodit();
				jodit.value = 'stop <span>post</span> ice';
				const range = jodit.ed.createRange();
				range.setStart(jodit.editor.firstChild, 0);
				range.setEnd(jodit.editor.firstChild, 2);
				jodit.s.selectRange(range);

				jodit.execCommand('formatBlock', false, 'h1');

				expect(jodit.value).equals(
					'<h1>stop <span>post</span> ice</h1>'
				);
			});
		});

		describe('Exec formatBlock for STYLED block', function () {
			it('Should wrap this element and save previous styles', function () {
				const jodit = getJodit();
				jodit.value =
					'<p style="text-align: right">|stop <span>post</span> ice</p>';
				setCursorToChar(jodit);

				jodit.execCommand('formatBlock', false, 'h1');

				expect(jodit.value).equals(
					'<h1 style="text-align: right">stop <span>post</span> ice</h1>'
				);
			});
		});

		it('Try exec the command "formatBlock" in text node then selection is collapsed it should wrap it node in H1', function () {
			const editor = getJodit({
				disablePlugins: ['WrapTextNodes']
			});
			editor.value = 'test';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild, 2);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			editor.s.insertNode(editor.createInside.text(' a '));

			expect(editor.value).equals('<h1>te a st</h1>');
		});

		it('Try exec the command "formatBlock" in the end of text node then selection is collapsed it should wrap it node in H1', function () {
			const editor = getJodit({
				disablePlugins: ['WrapTextNodes']
			});
			editor.value = 'test';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild, 4);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			editor.s.insertNode(editor.createInside.text(' a '));

			expect(editor.value).equals('<h1>test a </h1>');
		});

		describe('Try exec the command "formatBlock" for several text nodes', function () {
			it('should wrap all these nodes inside tag', function () {
				const editor = getJodit();
				editor.value = '';

				editor.s.insertNode(editor.createInside.text('test'));
				editor.s.insertNode(editor.createInside.text(' test2'));
				editor.s.insertNode(editor.createInside.text(' test3'));
				editor.s.insertNode(
					editor.createInside.element('span', ' test4')
				);

				const range = editor.s.createRange(true);

				range.setStart(editor.editor.firstChild, 0);
				range.setEnd(editor.editor.lastChild, 0);

				editor.execCommand('formatBlock', false, 'h1');

				expect(editor.value).equals(
					'<h1>test test2 test3<span> test4</span></h1>'
				);
			});
		});

		describe('editor is empty', function () {
			it('Should create empty element and set cursor into it', function () {
				const editor = getJodit();
				editor.value = '';
				editor.s.focus();

				editor.execCommand('formatBlock', false, 'h1');
				editor.s.insertHTML('test');

				expect(editor.value).equals('<h1>test<br></h1>');
			});
		});

		describe('For UL>li elements', function () {
			describe('Select only LI', function () {
				it('Should replace all LI elements to P and unwrap it from UL', function () {
					const editor = getJodit();
					editor.value =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li>3</li>' +
						'</ul>';

					const range = editor.s.createRange();
					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.setEnd(
						editor.editor.firstChild.lastChild.firstChild,
						1
					);
					editor.s.selectRange(range);

					editor.execCommand('formatBlock', false, 'h1');
					expect(editor.value).equals(
						'<ul>' +
							'<li><h1>1</h1></li>' +
							'<li><h1>2</h1></li>' +
							'<li><h1>3</h1></li>' +
							'</ul>'
					);

					editor.execCommand('formatBlock', false, 'h1');

					expect(editor.value).equals(
						'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li>3</li>' +
							'</ul>'
					);
				});
			});

			describe('Select UL', function () {
				it('Should replace all LI elements to P and unwrap it from UL', function () {
					const editor = getJodit();
					editor.value =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li>3</li>' +
						'</ul>';

					const range = editor.s.createRange();
					range.selectNode(editor.editor.firstChild);
					editor.s.selectRange(range);

					editor.execCommand('formatBlock', false, 'h1');
					expect(editor.value).equals(
						'<ul>' +
							'<li><h1>1</h1></li>' +
							'<li><h1>2</h1></li>' +
							'<li><h1>3</h1></li>' +
							'</ul>'
					);

					editor.execCommand('formatBlock', false, 'h1');
					expect(editor.value).equals(
						'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li>3</li>' +
							'</ul>'
					);
				});
			});
		});
	});

	describe('Sub/Supscript native', function () {
		describe('sub', function () {
			it('Should insert selection im SUB element', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';
				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);
				editor.s.selectRange(range);
				editor.execCommand('subscript');
				expect(editor.value).equals('<p>te<sub>st</sub></p>');
			});
		});

		describe('sup', function () {
			it('Should insert selection im SUP element', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';
				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);
				editor.s.selectRange(range);
				editor.execCommand('superscript');
				expect(editor.value).equals('<p>te<sup>st</sup></p>');
			});
		});
	});

	describe('After exec some command', function () {
		it('should restore selection to previous', function () {
			const editor = getJodit();
			editor.value = '<p>test</p>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 2);
			range.setEnd(editor.editor.firstChild.firstChild, 3);
			//range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('italic');

			editor.s.insertNode(editor.createInside.text('top'));

			expect(editor.value).equals('<p>tetopt</p>');
		});
		describe('in collapsed selection', function () {
			it('should place cursor inward', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.collapse(true);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('underline');
				editor.s.insertNode(editor.createInside.text('data'));

				expect(editor.value).equals('<p>te<u>data</u>st</p>');
			});
		});
	});

	describe('formatBlock', function () {
		it('Should wrap or replace container to specialize tag', function () {
			const editor = getJodit();
			editor.value = '<p>testy oprst <span>lets go</span></p>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 5);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h5');

			expect(editor.value).equals(
				'<h5>testy oprst <span>lets go</span></h5>'
			);
		});

		it('Should wrap text into H1 tag near Table, but table must be after this tag', function () {
			const editor = getJodit({
				disablePlugins: ['WrapTextNodes']
			});
			editor.value = 'test<table><tr><td>post</td></tr></table>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setEnd(editor.editor.firstChild, 4);
			range.collapse(false);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			expect(editor.value).equals(
				'<h1>test</h1><table><tbody><tr><td>post</td></tr></tbody></table>'
			);
		});

		describe('justifyLeft', function () {
			it('Should set align for element which was created using formatBlock', function () {
				const editor = getJodit({
					disablePlugins: ['WrapTextNodes']
				});
				editor.value = 'testy oprst <span>lets go</span>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild, 5);
				range.collapse(true);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('formatBlock', false, 'h5');
				editor.execCommand('justifyLeft');
				editor.execCommand('fontSize', false, 14);

				expect(editor.value).equals(
					'<h5 style="text-align: left;">testy<span style="font-size: 14px;"></span> oprst <span>lets go</span></h5>'
				);
			});
		});

		it('Insert H1 inside TD should crearte new H1 withow replacement', function () {
			const editor = getJodit();
			editor.value = '<table><tr><td>1</td></tr></table>';

			const range = editor.s.createRange(true);

			range.selectNodeContents(editor.editor.querySelector('td'));

			editor.execCommand('formatBlock', false, 'h1');

			expect(editor.value).equals(
				'<table><tbody><tr><td><h1>1</h1></td></tr></tbody></table>'
			);
		});
	});

	describe('Colors', function () {
		it('Set colour for all selection should create <span></span> tags inside all paragraps', function () {
			const editor = getJodit();
			editor.value = '<p>1</p><p>2</p><p>3</p>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild, 0);
			range.setEnd(editor.editor.lastChild, 1);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('foreColor', false, '#f00');

			expect(
				'<p><span style="color: rgb(255, 0, 0);">1</span></p><p><span style="color: rgb(255, 0, 0);">2</span></p><p><span style="color: rgb(255, 0, 0);">3</span></p>'
			).equals(editor.value);
		});

		it('Set colour to collapsed position should create empty span and insert inward cursor', function () {
			const editor = getJodit({
				disablePlugins: ['WrapTextNodes']
			});
			editor.value = 'testy oprst <span>lets go</span>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild, 5);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('foreColor', false, '#f00');

			expect(editor.value).equals(
				'testy<span style="color: rgb(255, 0, 0);"></span> oprst <span>lets go</span>'
			);
		});
	});

	describe('Align', function () {
		it('Justify to right', function () {
			const editor = getJodit();
			editor.value = '<p>test</p>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 2);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifyright');

			expect(editor.value).equals(
				'<p style="text-align: right;">test</p>'
			);
		});

		it('Justify to center', function () {
			const editor = getJodit({
				disablePlugins: ['WrapTextNodes']
			});
			editor.value = 'test';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild, 2);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifycenter');

			expect(editor.value).equals(
				'<p style="text-align: center;">test</p>'
			);
		});

		it('Justify to left', function () {
			const editor = getJodit({
				disablePlugins: ['WrapTextNodes']
			});
			editor.value = 'test some text <span>test</span><br><p>data</p>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild, 8);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifyleft');

			expect(editor.value).equals(
				'<p style="text-align: left;">test some text <span>test</span><br></p><p>data</p>'
			);
		});

		it('Justify to left in element of unordered list', function () {
			const editor = getJodit();
			editor.value = '<ul><li>test</li><li>data</li></ul>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild.firstChild.firstChild, 2);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifyleft');

			expect(editor.value).equals(
				'<ul><li style="text-align: left;">test</li><li>data</li></ul>'
			);
		});

		it('Justify to full', function () {
			const editor = getJodit();
			editor.value = '<h1>test some text <span>test</span></h1>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 8);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifyfull');

			expect(editor.value).equals(
				'<h1 style="text-align: justify;">test some text <span>test</span></h1>'
			);
		});

		describe('Justify plain text with enter = br mode', function () {
			it('Should wrap this text in enterBlock element', function () {
				const editor = getJodit({
					enter: 'br'
				});
				editor.value = 'test';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild, 0);
				range.setEnd(editor.editor.firstChild, 4);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('justifyleft');

				expect(editor.value).equals(
					'<p style="text-align: left;">test</p>'
				);
			});
		});

		describe('Table cells', function () {
			describe('Selected table cells', function () {
				it('Should apply align to all selected cells', function () {
					const editor = getJodit();
					editor.value =
						'<table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';

					const td = editor.editor.querySelector('td'),
						pos = Jodit.modules.Helpers.position(td);

					simulateEvent(
						['mousedown', 'mouseup', 'click'],
						0,
						td,
						e => {
							Object.assign(e, {
								clientX: pos.left,
								clientY: pos.top
							});
						}
					);

					editor.s.select(
						editor.editor.querySelector('td').firstChild
					);

					editor.execCommand('justifyright');

					expect(sortAttributes(editor.value)).equals(
						'<table><tbody><tr><td style="text-align:right">1</td><td>2</td></tr></tbody></table>'
					);
				});

				describe('After change obe cell - select all', function () {
					it('Should apply align to whole table and remove from cells', function () {
						const editor = getJodit();
						editor.value =
							'<table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';

						simulateEvent(
							'mousedown',
							editor.editor.querySelector('td')
						);

						editor.s.select(
							editor.editor.querySelector('td').firstChild
						);

						editor.execCommand('justifyright');

						simulateEvent('click', editor.editor);

						editor.execCommand('selectall');
						editor.execCommand('justifyfull');

						expect(sortAttributes(editor.value)).equals(
							'<table style="text-align:justify"><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'
						);
					});
				});
			});
		});
	});

	describe('Register sustom command', function () {
		it('Should register command and hotkeys for it', function () {
			const editor = getJodit({
				disablePlugins: ['WrapTextNodes']
			});

			editor.value = 'test test test';
			const range = editor.s.createRange();
			range.setStart(editor.editor.firstChild, 4);
			range.setEnd(editor.editor.firstChild, 8);
			editor.s.selectRange(range);

			editor.registerCommand('someCommand', function () {
				this.setEditorValue('stop');
			});

			expect('stop').does.not.equal(editor.value);

			editor.execCommand('someCommand');
			expect('stop').equals(editor.value);

			editor.registerCommand('someCommands', {
				hotkeys: 'ctrl+d',
				exec: function () {
					this.setEditorValue('even');
				}
			});

			expect('even').does.not.equal(editor.value);
			// ctrl+d
			simulateEvent('keydown', 68, editor.editor, function (data) {
				// data.shiftKey = true;
				data.ctrlKey = true;
			});
			expect('even').equals(editor.value);
		});
	});
});
