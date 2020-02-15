describe('Commands Jodit Editor Tests', function() {
	describe('Command "formatBlock"', function() {
		it('Try exec the command "formatBlock" for several elements', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>test</p><p>test2</p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStartBefore(editor.editor.firstChild);
			range.setEndAfter(editor.editor.lastChild);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			expect(editor.value).equals('<h1>test</h1><h1>test2</h1>');
		});
		describe('Exec formatBlock for one inline element', function() {
			it('Should wrap this element and all nearest inine element in block', function() {
				const jodit = new Jodit(appendTestArea());
				jodit.value = 'stop <span>post</span> ice';
				const range = jodit.editorDocument.createRange();
				range.setStart(jodit.editor.firstChild, 0);
				range.setEnd(jodit.editor.firstChild, 2);
				jodit.selection.selectRange(range);

				jodit.execCommand('formatBlock', false, 'h1');

				expect(jodit.value).equals(
					'<h1>stop <span>post</span> ice</h1>'
				);
			});
		});

		it('Try exec the command "formatBlock" in text node then selection is collapsed it should wrap it node in H1', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = 'test';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild, 2);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			editor.selection.insertNode(editor.create.inside.text(' a '));

			expect(editor.value).equals('<h1>te a st</h1>');
		});
		it('Try exec the command "formatBlock" in the end of text node then selection is collapsed it should wrap it node in H1', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = 'test';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild, 4);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			editor.selection.insertNode(editor.create.inside.text(' a '));

			expect(editor.value).equals('<h1>test a </h1>');
		});

		it('Try exec the command "formatBlock" for several text nodes', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '';

			editor.selection.insertNode(editor.create.inside.text('test'));
			editor.selection.insertNode(editor.create.inside.text(' test2'));
			editor.selection.insertNode(editor.create.inside.text(' test3'));
			editor.selection.insertNode(
				editor.create.inside.element('span', ' test4')
			);

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild, 0);
			range.setEnd(editor.editor.lastChild, 0);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			expect(editor.value).equals(
				'<h1>test test2 test3<span> test4</span></h1>'
			);
		});

		describe('editor is empty', function() {
			it('Should create empty element and set cursor into it', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '';
				editor.selection.focus();

				editor.execCommand('formatBlock', false, 'h1');
				editor.selection.insertHTML('test');

				expect(editor.value).equals('<h1>test<br></h1>');
			});
		});

		describe('For UL>li elements', function() {
			describe('Select only LI', function() {
				it('Should replace all LI elements to P and unwrap it from UL', function() {
					const editor = new Jodit(appendTestArea());
					editor.value =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li>3</li>' +
						'</ul>';

					const range = editor.selection.createRange();
					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.setEnd(
						editor.editor.firstChild.lastChild.firstChild,
						1
					);
					editor.selection.selectRange(range);

					editor.execCommand('formatBlock', false, 'h1');
					expect(editor.value).equals(
						'<ul>' +
							'<li><h1>1</h1></li>' +
							'<li><h1>2</h1></li>' +
							'<li><h1>3</h1></li>' +
							'</ul>'
					);

					editor.execCommand('formatBlock', false, 'p');
					expect(editor.value).equals(
						'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li>3</li>' +
							'</ul>'
					);
				});
			});
			describe('Select UL', function() {
				it('Should replace all LI elements to P and unwrap it from UL', function() {
					const editor = new Jodit(appendTestArea());
					editor.value =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li>3</li>' +
						'</ul>';

					const range = editor.selection.createRange();
					range.selectNode(editor.editor.firstChild);
					editor.selection.selectRange(range);

					editor.execCommand('formatBlock', false, 'h1');
					expect(editor.value).equals(
						'<ul>' +
							'<li><h1>1</h1></li>' +
							'<li><h1>2</h1></li>' +
							'<li><h1>3</h1></li>' +
							'</ul>'
					);

					editor.execCommand('formatBlock', false, 'p');
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

	describe('Sub/Supscript native', function() {
		describe('sub', function() {
			it('Should insert selection im SUB element', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test</p>';
				const range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);
				editor.selection.selectRange(range);
				editor.execCommand('subscript');
				expect(editor.value).equals('<p>te<sub>st</sub></p>');
			});
		});
		describe('sup', function() {
			it('Should insert selection im SUP element', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test</p>';
				const range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);
				editor.selection.selectRange(range);
				editor.execCommand('superscript');
				expect(editor.value).equals('<p>te<sup>st</sup></p>');
			});
		});
	});
	describe('Bold command', function() {
		describe('For box with style="font-weight:bold"', function() {
			it('should wrap selected text in STRONG element without questions', function() {
				const editor = new Jodit(appendTestArea()),
					style = document.createElement('style');

				editor.value = '<p>test</p>';
				style.innerHTML = 'p {font-weight: bold !important};';
				document.body.appendChild(style);

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.firstChild.firstChild, 4);
				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');

				style.parentNode.removeChild(style);
				expect(editor.value).equals('<p><strong>test</strong></p>');
			});
		});
		it('Should insert a few chars and again exec bold. Bold mode should be switch off', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = 'test';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.selectNodeContents(editor.editor.firstChild);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('bold');

			editor.selection.insertNode(editor.create.inside.text('abc'));

			editor.execCommand('bold');

			editor.selection.insertNode(editor.create.inside.text('def'));

			expect(editor.value).equals('test<strong>abc</strong>def');
		});
		describe('for some text', function() {
			it('should wrap this text in STRONG element', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = 'test';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNodeContents(editor.editor.firstChild);
				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');

				expect(editor.value).equals('<strong>test</strong>');
			});
			describe('inside STRONG element ', function() {
				it('from start of this element, should unwrap this text', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<strong>test</strong>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.setEnd(editor.editor.firstChild.firstChild, 2);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals('te<strong>st</strong>');
				});
				it('near end of this element, should unwrap this text', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<strong>test</strong>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.setEnd(editor.editor.firstChild.firstChild, 4);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals('<strong>te</strong>st');
				});
				it('in the middle of this element, should unwrap this text', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<strong>test</strong>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 1);
					range.setEnd(editor.editor.firstChild.firstChild, 3);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals(
						'<strong>t</strong>es<strong>t</strong>'
					);
				});
				it('should unwrap this part and after exec "bold" again it should create 3 STRONG elements', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<strong>1 2 3</strong>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 1);
					range.setEnd(editor.editor.firstChild.firstChild, 4);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');
					editor.execCommand('bold');

					expect(editor.value).equals(
						'<strong>1</strong><strong> 2 </strong><strong>3</strong>'
					);
				});
			});
			it('that contains a few STRONG elements, should unwrap all of these', function() {
				const editor = new Jodit(appendTestArea());
				editor.value =
					'<strong>test</strong> test <strong>test</strong>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.lastChild.firstChild, 4);
				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');

				expect(editor.value).equals('test test test');
			});
		});
		describe('Try exec the command "bold"', function() {
			it('Should wrap selected text in STRONG element', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test</p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNodeContents(editor.editor.firstChild);
				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');

				expect(editor.value).equals('<p><strong>test</strong></p>');
			});
			describe('Try exec the command "bold" twice', function() {
				it('Should unwrap strong elements', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<p>test</p>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.selectNodeContents(editor.editor.firstChild);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');
					editor.execCommand('bold');

					expect(editor.value).equals('<p>test</p>');
				});
			});
		});
		describe('Try exec the command "bold" for font-weight: 700 Element', function() {
			it('should ubnwrap selected srtong element', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<span style="font-weight: 700">test</span>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNodeContents(editor.editor.firstChild);
				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');
				// editor.execCommand('bold');

				expect(editor.value).equals('test');
			});
		});
		describe('Exec bold for collapsed range and move cursor in another place', function() {
			it('Should remove STRONG element', function() {
				const editor = new Jodit(appendTestArea(), {
					cleanHTML: {
						timeout: 0
					}
				});

				editor.value = 'testtest';
				const range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild, 4);
				range.collapse(true);
				editor.selection.selectRange(range);

				editor.execCommand('bold');
				expect(editor.value).equals('test<strong></strong>test');

				range.setStart(editor.editor.lastChild, 2);
				range.collapse(true);
				editor.selection.selectRange(range);
				simulateEvent('mousedown', 0, editor.editor);
				expect(editor.value).equals('testtest');
			});
		});
		describe('Exec bold command for SPAN with font-size', function() {
			it('Should leave both font-size and font-weight rules', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<span style="font-size: 36px;">asdasd</span>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.firstChild.firstChild, 6);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');

				expect(sortAttributes(editor.value)).equals(
					sortAttributes(
						'<span style="font-size: 36px;"><strong>asdasd</strong></span>'
					)
				);
			});
		});
	});

	describe('After exec some command', function() {
		it('should restore selection to previous', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>test</p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 2);
			range.setEnd(editor.editor.firstChild.firstChild, 3);
			//range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('italic');

			editor.selection.insertNode(editor.create.inside.text('top'));

			expect(editor.value).equals('<p>tetopt</p>');
		});
		describe('in collapsed selection', function() {
			it('should place cursor inward', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test</p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.collapse(true);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('underline');
				editor.selection.insertNode(editor.create.inside.text('data'));

				expect(editor.value).equals('<p>te<u>data</u>st</p>');
			});
		});
	});

	describe('insertUnorderedList', function() {
		it('Run command insertUnorderedList should wrap or replace all paragraphs to ul>li', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>test</p><p>test</p><p>test</p>';

			editor.execCommand('selectAll');
			editor.execCommand('insertUnorderedList');

			expect(editor.value).equals(
				'<ul><li>test</li><li>test</li><li>test</li></ul>'
			);
		});
		it('If press Enter inside <li> in the end it should create new <li> and cursor must be in it', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<ul><li>test</li></ul>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild.firstChild, 4);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

			editor.selection.insertNode(editor.create.inside.text(' a '));

			expect(editor.value).equals(
				'<ul><li>test</li><li> a <br></li></ul>'
			);
		});
		it('If press Enter inside <li> inside some text should split that text and created new <li> and cursor must be in it', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<ul><li>test</li></ul>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild.firstChild, 2);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

			editor.selection.insertNode(editor.create.inside.text(' a '));

			expect(editor.value).equals('<ul><li>te</li><li> a st</li></ul>');
		});
	});
	describe('formatBlock', function() {
		it('Should wrap or replace container to specialize tag', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>testy oprst <span>lets go</span></p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 5);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h5');

			expect(editor.value).equals(
				'<h5>testy oprst <span>lets go</span></h5>'
			);
		});

		it('Should wrap text into H1 tag near Table, but table must be after this tag', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = 'test<table><tr><td>post</td></tr></table>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setEnd(editor.editor.firstChild, 4);
			range.collapse(false);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			expect(editor.value).equals(
				'<h1>test</h1><table><tbody><tr><td>post</td></tr></tbody></table>'
			);
		});

		describe('justifyLeft', function() {
			it('Should set align for element which was created using formatBlock', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = 'testy oprst <span>lets go</span>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

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

		it('Insert H1 inside TD should crearte new H1 withow replacement', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<table><tr><td>1</td></tr></table>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.selectNodeContents(editor.editor.querySelector('td'));
			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('formatBlock', false, 'h1');

			expect(editor.value).equals(
				'<table><tbody><tr><td><h1>1</h1></td></tr></tbody></table>'
			);
		});
	});
	describe('Colors', function() {
		it('Set colour for all selection should create <span></span> tags inside all paragraps', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>1</p><p>2</p><p>3</p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild, 0);
			range.setEnd(editor.editor.lastChild, 1);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('foreColor', false, '#f00');

			expect(
				'<p><span style="color: rgb(255, 0, 0);">1</span></p><p><span style="color: rgb(255, 0, 0);">2</span></p><p><span style="color: rgb(255, 0, 0);">3</span></p>'
			).equals(editor.value);
		});
		it('Set colour to collapsed position should create empty span and insert inward cursor', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = 'testy oprst <span>lets go</span>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

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
	describe('Fonts', function() {
		describe('Set font size', function() {
			it('should create attribute style="font-size:value"', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p> testy oprst <span>lets go</span></p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNode(editor.editor.querySelector('span'));

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('fontSize', false, 12);

				expect(editor.value).equals(
					'<p> testy oprst <span style="font-size: 12px;">lets go</span></p>'
				);

				editor.execCommand('fontSize', false, '12%');
				expect(editor.value).equals(
					'<p> testy oprst <span style="font-size: 12%;">lets go</span></p>'
				);
			});
			describe('For box with style="font-size:12px"', function() {
				it('should wrap selected text in SPAN with style="font-size:12px" element without questions', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = 'test';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.selectNodeContents(editor.editor.firstChild);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.editor.style.fontSize = '12px';

					editor.execCommand('fontSize', false, 12);

					expect(editor.value).equals(
						'<span style="font-size: 12px;">test</span>'
					);
				});
			});
		});
		describe('Set font family', function() {
			describe('For box with style="font-name:Arial"', function() {
				it('should wrap selected text in SPAN with style="font-family:Arial" element without questions', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<p>test</p>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.setEnd(editor.editor.firstChild.firstChild, 4);

					sel.removeAllRanges();
					sel.addRange(range);

					editor.editor.style.fontFamily = 'Arial';

					editor.execCommand('fontName', false, 'Arial');

					expect(editor.value).equals(
						'<p>te<span style="font-family: Arial;">st</span></p>'
					);
				});
			});
			it('should create attribute style="font-family:value"', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test</p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('fontName', false, 'Arial');

				expect(editor.value).equals(
					'<p>te<span style="font-family: Arial;">st</span></p>'
				);
			});
		});
	});

	describe('Align', function() {
		it('Justify to right', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>test</p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 2);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifyright');

			expect(editor.value).equals(
				'<p style="text-align: right;">test</p>'
			);
		});

		it('Justify to center', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = 'test';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild, 2);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifycenter');

			expect(editor.value).equals(
				'<p style="text-align: center;">test</p>'
			);
		});
		it('Justify to left', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = 'test some text <span>test</span><br><p>data</p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild, 8);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifyleft');

			expect(editor.value).equals(
				'<p style="text-align: left;">test some text <span>test</span><br></p><p>data</p>'
			);
		});

		it('Justify to left in element of unordered list', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<ul><li>test</li><li>data</li></ul>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild.firstChild, 2);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifyleft');

			expect(editor.value).equals(
				'<ul><li style="text-align: left;">test</li><li>data</li></ul>'
			);
		});

		it('Justify to full', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<h1>test some text <span>test</span></h1>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 8);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('justifyfull');

			expect(editor.value).equals(
				'<h1 style="text-align: justify;">test some text <span>test</span></h1>'
			);
		});

		describe('Justify plain text with enter = br mode', function() {
			it('Should wrap this text in enterBlock element', function() {
				const editor = new Jodit(appendTestArea(), {
					enter: 'br'
				});
				editor.value = 'test';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

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

		describe('Table cells', function() {
			describe('Selected table cells', function() {
				it('Should apply align to all selected cells', function() {
					const editor = Jodit.make(appendTestArea());
					editor.value =
						'<table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';

					simulateEvent(
						'mousedown',
						0,
						editor.editor.querySelector('td')
					);

					editor.selection.select(
						editor.editor.querySelector('td').firstChild
					);
					editor.execCommand('justifyright');

					expect(sortAttributes(editor.value)).equals(
						'<table><tbody><tr><td  style="text-align:right">1</td><td>2</td></tr></tbody></table>'
					);
				});

				describe('After change obe cell - select all', function() {
					it('Should apply align to whole table and remove from cells', function() {
						const editor = Jodit.make(appendTestArea());
						editor.value =
							'<table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';

						simulateEvent(
							'mousedown',
							0,
							editor.editor.querySelector('td')
						);

						editor.selection.select(
							editor.editor.querySelector('td').firstChild
						);

						editor.execCommand('justifyright');

						simulateEvent(
							'mousedown',
							0,
							editor.editor.firstChild
						);

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

	describe('Register sustom command', function() {
		it('Should register command and hotkeys for it', function() {
			const editor = new Jodit(appendTestArea());

			editor.value = 'test test test';
			const range = editor.selection.createRange();
			range.setStart(editor.editor.firstChild, 4);
			range.setEnd(editor.editor.firstChild, 8);
			editor.selection.selectRange(range);

			editor.registerCommand('someCommand', function() {
				this.setEditorValue('stop');
			});

			expect('stop').does.not.equal(editor.value);

			editor.execCommand('someCommand');
			expect('stop').equals(editor.value);

			editor.registerCommand('someCommands', {
				hotkeys: 'ctrl+d',
				exec: function() {
					this.setEditorValue('even');
				}
			});

			expect('even').does.not.equal(editor.value);
			// ctrl+d
			simulateEvent('keydown', 68, editor.editor, function(data) {
				// data.shiftKey = true;
				data.ctrlKey = true;
			});
			expect('even').equals(editor.value);
		});
	});
});
