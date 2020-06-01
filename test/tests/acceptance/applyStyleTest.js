describe('Test Selection.applyStyle method', function () {
	describe('Bold command', function() {
		describe('For box with style="font-weight:bold"', function() {
			it('should wrap selected text in STRONG element without questions', function() {
				const editor = getJodit(),
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
			const editor = getJodit();
			editor.value = 'test';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.selectNodeContents(editor.editor.firstChild);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.execCommand('bold');

			editor.selection.insertNode(editor.createInside.text('abc'));

			editor.execCommand('bold');

			editor.selection.insertNode(editor.createInside.text('def'));

			expect(editor.value).equals('test<strong>abc</strong>def');
		});

		describe('for some text', function() {
			it('should wrap this text in STRONG element', function() {
				const editor = getJodit();
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
					const editor = getJodit();
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
					const editor = getJodit();
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
					const editor = getJodit();
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
					const editor = getJodit();
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

				describe('For collapsed selection', function () {
					it('should split this element and set cursor between two parts', function() {
						const editor = getJodit();
						editor.value = '<strong>test</strong>';

						const range = editor.selection.createRange();

						range.setStart(editor.editor.firstChild.firstChild, 2);
						range.collapse(true);
						editor.selection.selectRange(range);

						editor.execCommand('bold');
						editor.selection.insertHTML('stop')

						expect(editor.value).equals(
							'<strong>te</strong>stop<strong>st</strong>'
						);
					});
				});
			});

			it('that contains a few STRONG elements, should unwrap all of these', function() {
				const editor = getJodit();
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
				const editor = getJodit();
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
					const editor = getJodit();
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
				const editor = getJodit();
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
				const editor = getJodit({
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
				const editor = getJodit();
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

	describe('Fonts', function() {
		describe('Set font size', function() {
			it('should create attribute style="font-size:value"', function() {
				const editor = getJodit();
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
					const editor = getJodit();
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
					const editor = getJodit();
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
				const editor = getJodit();
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

		describe('Set font size and family', function() {
			it('should create attribute style="font-family:value;font-size:value"', function() {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('fontName', false, 'Arial');
				editor.execCommand('fontSize', false, 12);

				expect(sortAttributes(editor.value)).equals(
					'<p>te<span style="font-family:Arial;font-size:12px">st</span></p>'
				);
			});
		});
	});
});
