describe('Backspace/Delete key', function() {
	describe('near empty tag', function() {
		describe('BR before P', function() {
			it('Should simple remove BR but cursor should leave inside P', function() {
				const editor = getJodit();

				editor.value = '<br><p>test</p>';

				const range = editor.selection.createRange();

				// set cursor in start of element

				range.selectNodeContents(editor.editor.lastChild);
				range.collapse(true);
				editor.selection.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				editor.selection.insertNode(editor.createInside.text(' 2 '));
				expect(editor.value).equals('<p> 2 test</p>');
			});
		});

		describe('HR before P', function() {
			it('Should simple remove HR but cursor should leave inside P', function() {
				const editor = getJodit();

				editor.value = '<p>lets</p><hr><p>test</p>';

				const range = editor.selection.createRange();

				// set cursor in start of element

				range.selectNodeContents(editor.editor.lastChild);
				range.collapse(true);
				editor.selection.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				editor.selection.insertNode(editor.createInside.text(' 2 '));
				expect(editor.value).equals('<p>lets</p><p> 2 test</p>');
			});

			describe('HR has different display style', function() {
				it('Should also remove HR but cursor should leave inside P', function() {
					const editor = getJodit({
						iframe: true,
						iframeStyle:
							Jodit.defaultOptions.iframeStyle +
							'hr {display: inline-block;}'
					});

					editor.value = '<p>lets</p><hr><p>test</p>';

					const range = editor.selection.createRange();

					// set cursor in start of element

					range.selectNodeContents(editor.editor.lastChild);
					range.collapse(true);
					editor.selection.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					editor.selection.insertNode(
						editor.createInside.text(' 2 ')
					);
					expect(editor.value).equals('<p>lets</p><p> 2 test</p>');
				});
			});
		});

		describe('Backspace and Previous was empty H1', function() {
			it('Should simple remove this H1', function() {
				const editor = getJodit();

				editor.value = '<h1></h1><p>test</p>';

				const range = editor.selection.createRange();

				// set cursor in start of element

				range.selectNodeContents(editor.editor.lastChild);
				range.collapse(true);
				editor.selection.sel.removeAllRanges();
				editor.selection.sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals('<p>test</p>');
			});

			describe('H1 with BR', function() {
				it('Should simple remove this H1', function() {
					const editor = getJodit();

					editor.value = '<h1><br></h1><p>test</p>';

					const range = editor.selection.createRange();

					// set cursor in start of element

					range.selectNodeContents(editor.editor.lastChild);
					range.collapse(true);
					editor.selection.sel.removeAllRanges();
					editor.selection.sel.addRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals('<p>test</p>');
				});
			});
		});

		describe('Delete and next was empty H1', function() {
			it('Should simple remove this H1', function() {
				const editor = getJodit();

				editor.value = '<p>test</p><h1></h1>';

				const range = editor.selection.createRange();

				// set cursor in start of element

				range.selectNodeContents(editor.editor.firstChild);
				range.collapse(false);
				editor.selection.sel.removeAllRanges();
				editor.selection.sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect(editor.value).equals('<p>test</p>');
			});
			describe('H1 with BR', function() {
				it('Should simple remove this H1', function() {
					const editor = getJodit();

					editor.value = '<p>test</p><h1><br></h1>';

					const range = editor.selection.createRange();

					// set cursor in start of element

					range.selectNodeContents(editor.editor.firstChild);
					range.collapse(false);
					editor.selection.sel.removeAllRanges();
					editor.selection.sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(editor.value).equals('<p>test</p>');
				});
			});
		});
	});

	describe('inside empty TD', function() {
		it('Should doing nothing', function() {
			const editor = getJodit();

			editor.value =
				'<table><tbody>' + '<tr><td></td></tr>' + '</tbody></table>';

			editor.selection.setCursorIn(editor.editor.querySelector('td'));

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			expect(
				'<table><tbody>' + '<tr><td></td></tr>' + '</tbody></table>'
			).equals(editor.value);

			editor.selection.focus();
			editor.selection.insertNode(editor.createInside.text(' 2 '));

			expect(
				'<table><tbody>' + '<tr><td> 2 </td></tr>' + '</tbody></table>'
			).equals(editor.value);
		});
	});

	describe('inside empty P', function() {
		it('Should remove empty tag and set cursor in previous element', function() {
			const editor = getJodit();

			editor.value =
				'<table><tbody>' +
				'<tr><td></td></tr>' +
				'</tbody></table><p><br></p>';

			const range = editor.selection.createRange();

			// set cursor in start of element
			editor.selection.focus();
			range.selectNodeContents(editor.editor.lastChild);
			range.collapse(true);
			editor.selection.selectRange(range);

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			editor.selection.focus();
			editor.selection.insertNode(editor.createInside.text(' 2 '));

			expect(editor.value).equals(
				'<table><tbody>' + '<tr><td> 2 </td></tr>' + '</tbody></table>'
			);
		});
	});

	describe('inside empty A', function() {
		it('Should remove empty tag and set cursor in previous element', function() {
			const editor = getJodit();

			editor.value = '<a href="#test">test</a>';

			editor.selection.setCursorIn(editor.editor.firstChild, false);

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect(editor.value).equals('<a href="#test">tes</a>');

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect(editor.value).equals('');
		});
	});

	describe('Cursor after/before element', function() {
		describe('Backspace key', function() {
			it('Should remove that element', function() {
				const editor = getJodit();
				editor.value = '<p><img src="tests/artio.jpg"/>test</p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStartAfter(editor.editor.firstChild.firstChild);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<p>test</p>').equals(editor.value);

				editor.selection.insertNode(editor.createInside.text(' a '));
				expect('<p> a test</p>').equals(editor.value);
			});
		});
		describe('Delete key', function() {
			it('Should remove that element', function() {
				const editor = getJodit();
				editor.value = '<p>test<img src="tests/artio.jpg"/></p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStartBefore(editor.editor.querySelector('img'));
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect('<p>test</p>').equals(editor.value);

				editor.selection.insertNode(editor.createInside.text(' a '));
				expect('<p>test a </p>').equals(editor.value);
			});
		});
	});

	describe('Enter backspace in the middle of two UL elements', function() {
		describe('In first LI of second UL', function() {
			it('Should connect both UL in one element', function() {
				const editor = getJodit();
				editor.value =
					'<ul><li>Test</li></ul><ul><li>Some text</li></ul>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(
					editor.editor.lastChild.firstChild.firstChild,
					0
				);
				range.collapse(true);
				editor.selection.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(sortAttributes(editor.value)).equals(
					'<ul><li>Test</li><li>Some text</li></ul>'
				);

				editor.selection.focus();
				editor.selection.insertNode(editor.createInside.text(' a '));

				expect(sortAttributes(editor.value)).equals(
					'<ul><li>Test a </li><li>Some text</li></ul>'
				);
			});
		});

		describe('In the P element', function() {
			it('Should connect both UL in one element', function() {
				const editor = getJodit();
				editor.ownerWindow.focus();
				editor.value =
					'<ul><li>Test</li><li> </li><li>Some text</li></ul>';

				const range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.childNodes[1], 0);
				range.collapse(true);

				editor.selection.focus();
				editor.selection.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				expect(sortAttributes(editor.value)).equals(
					'<ul><li>Test</li></ul><p><br></p><ul><li>Some text</li></ul>'
				);

				editor.selection.focus();
				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(sortAttributes(editor.value)).equals(
					'<ul><li>Test<br></li><li>Some text</li></ul>'
				);

				editor.selection.focus();
				editor.selection.insertNode(editor.createInside.text(' a '));
				expect(editor.value).equals(
					'<ul><li>Test a <br></li><li>Some text</li></ul>'
				);
			});
		});
	});

	describe('Enter backspace/delete in the start of some LI', function() {
		describe('in first LI', function() {
			describe('Enter backspace', function() {
				it('Should remove this LI and move all conntent in P', function() {
					const editor = getJodit();
					editor.value = '<ul><li>Test</li><li>Some text</li></ul>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect('<p>Test</p><ul><li>Some text</li></ul>').equals(
						editor.value
					);

					editor.selection.insertNode(
						editor.createInside.text(' a ')
					);
					expect('<p> a Test</p><ul><li>Some text</li></ul>').equals(
						editor.value
					);
				});
			});
			describe('Enter delete', function() {
				it('Should remove all text content and after this remove that LI', function() {
					const editor = getJodit();
					editor.value =
						'<ul><li>' +
						Jodit.INVISIBLE_SPACE +
						'</li><li>Some text</li></ul>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);
					expect('<ul><li>Some text</li></ul>').equals(editor.value);

					editor.selection.insertNode(
						editor.createInside.text(' a ')
					);
					expect('<ul><li> a Some text</li></ul>').equals(
						editor.value
					);
				});
			});
		});
		describe('in alone LI', function() {
			it('Should remove this LI and UL and move all conntent in P', function() {
				const editor = getJodit();
				editor.value = '<ul><li>Test</li></ul>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(
					editor.editor.firstChild.childNodes[0].firstChild,
					0
				);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<p>Test</p>').equals(editor.value);

				editor.selection.insertNode(editor.createInside.text(' a '));
				expect('<p> a Test</p>').equals(editor.value);
			});
		});
		it('Should connect this LI with previous', function() {
			const editor = getJodit();
			editor.value = '<ul><li>Test</li><li>Some text</li></ul>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(
				editor.editor.firstChild.childNodes[1].firstChild,
				0
			);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect('<ul><li>TestSome text</li></ul>').equals(editor.value);

			editor.selection.insertNode(editor.createInside.text(' a '));
			expect(editor.value).equals('<ul><li>Test a Some text</li></ul>');
		});
		describe('And enter Enter', function() {
			it('Should split this LI on two again', function() {
				const editor = getJodit();
				editor.value = '<ul><li>Test</li><li>Some text</li></ul>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(
					editor.editor.firstChild.childNodes[1].firstChild,
					0
				);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<ul><li>TestSome text</li></ul>').equals(editor.value);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				expect(editor.value).equals(
					'<ul><li>Test</li><li>Some text</li></ul>'
				);
			});
		});
	});

	describe('For non collapsed range', function() {
		describe('Select part of text inside P element', function() {
			it('Should remove only selected range', function() {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<p>te</p>').equals(editor.value);
			});
		});
		describe('Select whole text inside element', function() {
			describe('Inside P', function() {
				it('Should remove selected range and remove this P', function() {
					const editor = getJodit();
					editor.value = '<p>test</p>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.selectNodeContents(editor.editor.firstChild);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect('').equals(editor.value);
				});
			});
			describe('Inside table cell', function() {
				it('Should only remove selected range', function() {
					const editor = getJodit();
					editor.value =
						'<table><tbody><tr><td>test</td><td>1</td></tr></tbody></table>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.selectNodeContents(editor.editor.querySelector('td'));
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(
						'<table><tbody><tr><td></td><td>1</td></tr></tbody></table>'
					).equals(editor.value.replace('<br>', ''));
				});
			});
		});
	});
});
