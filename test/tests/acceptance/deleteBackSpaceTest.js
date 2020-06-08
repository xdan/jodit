describe('Backspace/Delete key', function() {
	let editor, range;
	beforeEach(function() {
		editor = getJodit();
		editor.value = 'test';
		range = editor.s.createRange();
	});

	describe('For non collapsed range', function() {
		describe('Select part of text inside P element', function() {
			it('Should remove only selected range', function() {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

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

					const sel = editor.s.sel,
						range = editor.s.createRange();

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

					const sel = editor.s.sel,
						range = editor.s.createRange();

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

	describe('Edit simple text', function() {
		describe('BackSpace', function() {
			it('Should remove previous char before cursor', function() {
				range.setStart(editor.editor.firstChild, 2);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals('tst');
			});
		});

		describe('Delete', function() {
			it('Should remove next char after cursor', function() {
				range.setStart(editor.editor.firstChild, 2);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect(editor.value).equals('tet');
			});
		});

		describe('Near with invisible char', function() {
			describe('BackSpace', function() {
				it('Should remove previous char and invisible char before cursor', function() {
					editor.value = 'te' + Jodit.INVISIBLE_SPACE + 'st';

					range.setStart(editor.editor.firstChild, 3);
					range.collapse(true);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals('tst');
				});
			});

			describe('Delete', function() {
				it('Should remove next char and invisible char after cursor', function() {
					editor.value = 'te' + Jodit.INVISIBLE_SPACE + 'st';

					range.setStart(editor.editor.firstChild, 2);
					range.collapse(true);
					editor.s.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(editor.value).equals('tet');
				});
			});

			describe('After BackSpace/Delete left empty node', function() {
				describe('BackSpace', function() {
					it('Should remove whole node', function() {
						editor.value = Jodit.INVISIBLE_SPACE + 's';

						range.setStart(editor.editor.firstChild, 2);
						range.collapse(true);
						editor.s.selectRange(range);

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						expect(editor.getNativeEditorValue()).equals('');
					});
				});

				describe('Delete', function() {
					it('Should remove whole node', function() {
						editor.value = 'd' + Jodit.INVISIBLE_SPACE;

						range.setStart(editor.editor.firstChild, 0);
						range.collapse(true);
						editor.s.selectRange(range);

						simulateEvent(
							'keydown',
							Jodit.KEY_DELETE,
							editor.editor
						);

						expect(editor.getNativeEditorValue()).equals('');
					});
				});
			});
		});

		describe('Cursor after empty text node', function() {
			describe('BackSpace', function() {
				it('Should remove this empty text node and first normal char in previous node', function() {
					editor.editor.appendChild(
						editor.createInside.text(
							Jodit.INVISIBLE_SPACE.repeat(4)
						)
					);
					editor.editor.appendChild(
						editor.createInside.text(
							Jodit.INVISIBLE_SPACE.repeat(4) + 'stop'
						)
					);
					expect(editor.editor.childNodes.length).equals(3);

					range.setStart(editor.editor.lastChild, 4);
					range.collapse(true);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.editor.childNodes.length).equals(2);
					expect(editor.getNativeEditorValue()).equals('tesstop');
				});
			});

			describe('Delete', function() {
				it('Should remove this empty text node and first normal char in next node', function() {
					editor.editor.appendChild(
						editor.createInside.text(
							Jodit.INVISIBLE_SPACE.repeat(4)
						)
					);
					editor.editor.appendChild(
						editor.createInside.text(
							Jodit.INVISIBLE_SPACE.repeat(4) + 'stop'
						)
					);
					expect(editor.editor.childNodes.length).equals(3);

					range.setStart(editor.editor.firstChild, 4);
					range.collapse(true);
					editor.s.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(editor.editor.childNodes.length).equals(3);
					expect(editor.getNativeEditorValue()).equals('testtop');
				});
			});
		});
	});

	describe('Near with some inseparable element', function() {
		describe('Backspace', function() {
			it('Should remove this element like simple char', function() {
				editor.value = 'test<img/>test';

				range.setStartAfter(editor.editor.firstChild.nextSibling);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals('testtest');
			});
		});

		describe('Delete', function() {
			it('Should remove this element like simple char', function() {
				editor.value = 'test<hr/>test';

				range.setStartBefore(editor.editor.firstChild.nextSibling);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect(editor.value).equals('testtest');
			});
		});
	});

	describe('inside empty P', function() {
		describe('Backspace', function() {
			it('Should remove empty tag', function() {
				editor.value = '<p><br></p>';

				range.setStartBefore(editor.editor.firstChild.firstChild);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				editor.s.insertNode(editor.createInside.text(' 2 '));

				expect(editor.value).equals(' 2 ');
			});

			describe('Near has element', function() {
				it('Should remove empty tag and set cursor in previous element', function() {
					editor.value =
						'<table><tbody>' +
						'<tr><td></td></tr>' +
						'</tbody></table><p><br></p>';

					const range = editor.s.createRange();

					range.setStartBefore(editor.editor.lastChild.firstChild);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					editor.s.insertNode(
						editor.createInside.text(' 2 ')
					);

					expect(editor.value).equals(
						'<table><tbody>' +
							'<tr><td> 2 </td></tr>' +
							'</tbody></table>'
					);
				});
			});
		});

		describe('Delete', function() {
			it('Should remove empty tag', function() {
				editor.value = '<p><br></p>';

				range.setStartAfter(editor.editor.firstChild.firstChild);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				editor.s.insertNode(editor.createInside.text(' 2 '));

				expect(editor.value).equals(' 2 ');
			});

			describe('Near has element', function() {
				it('Should remove empty tag and set cursor in next element', function() {
					editor.value =
						'<p><br></p><table><tbody>' +
						'<tr><td></td></tr>' +
						'</tbody></table>';

					range.setStartAfter(editor.editor.firstChild.firstChild);
					editor.s.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					editor.s.insertNode(
						editor.createInside.text(' 2 ')
					);

					expect(editor.value).equals(
						'<table><tbody>' +
							'<tr><td> 2 </td></tr>' +
							'</tbody></table>'
					);
				});
			});
		});
	});

	describe('near empty tag', function() {
		describe('BR before P', function() {
			it('Should simple remove BR but cursor should leave inside P', function() {
				const editor = getJodit();

				editor.value = '<br><p>test</p>';

				const range = editor.s.createRange();

				// set cursor in start of element

				range.selectNodeContents(editor.editor.lastChild);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				editor.s.insertNode(editor.createInside.text(' 2 '));
				expect(editor.value).equals('<p> 2 test</p>');
			});
		});

		describe('HR before P', function() {
			it('Should simple remove HR but cursor should leave inside P', function() {
				const editor = getJodit();

				editor.value = '<p>lets</p><hr><p>test</p>';

				const range = editor.s.createRange();

				// set cursor in start of element

				range.selectNodeContents(editor.editor.lastChild);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				editor.s.insertNode(editor.createInside.text(' 2 '));
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

					const range = editor.s.createRange();

					// set cursor in start of element

					range.selectNodeContents(editor.editor.lastChild);
					range.collapse(true);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					editor.s.insertNode(
						editor.createInside.text(' 2 ')
					);
					expect(editor.value).equals('<p>lets</p><p> 2 test</p>');
				});
			});
		});

		describe('The neighbor is empty H1', function() {
			describe('Backspace', function() {
				it('Should simple remove this H1', function() {
					editor.value = '<h1></h1><p>test</p>';

					range.setStartBefore(editor.editor.lastChild.firstChild);
					editor.s.selectRange(range)

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals('<p>test</p>');
				});

				describe('H1 with BR', function() {
					it('Should simple remove this H1', function() {
						const editor = getJodit();

						editor.value = '<h1><br></h1><p>test</p>';

						range.selectNodeContents(editor.editor.lastChild);
						range.collapse(true);
						editor.s.sel.removeAllRanges();
						editor.s.sel.addRange(range);

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						expect(editor.value).equals('<p>test</p>');
					});
				});
			});

			describe('Delete', function() {
				it('Should simple remove this H1', function() {
					const editor = getJodit();

					editor.value = '<p>test</p><h1></h1>';

					const range = editor.s.createRange();

					// set cursor in start of element

					range.selectNodeContents(editor.editor.firstChild);
					range.collapse(false);
					editor.s.sel.removeAllRanges();
					editor.s.sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(editor.value).equals('<p>test</p>');
				});

				describe('H1 with BR', function() {
					it('Should simple remove this H1', function() {
						const editor = getJodit();

						editor.value = '<p>test</p><h1><br></h1>';

						const range = editor.s.createRange();

						// set cursor in start of element

						range.selectNodeContents(editor.editor.firstChild);
						range.collapse(false);
						editor.s.sel.removeAllRanges();
						editor.s.sel.addRange(range);

						simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

						expect(editor.value).equals('<p>test</p>');
					});
				});
			});
		});
	});

	describe('inside empty TD', function() {
		it('Should doing nothing', function() {
			const editor = getJodit();

			editor.value =
				'<table><tbody>' + '<tr><td></td></tr>' + '</tbody></table>';

			editor.s.setCursorIn(editor.editor.querySelector('td'));

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			expect(
				'<table><tbody>' + '<tr><td></td></tr>' + '</tbody></table>'
			).equals(editor.value);

			editor.s.focus();
			editor.s.insertNode(editor.createInside.text(' 2 '));

			expect(
				'<table><tbody>' + '<tr><td> 2 </td></tr>' + '</tbody></table>'
			).equals(editor.value);
		});
	});

	describe('after last char inside A', function() {
		it('Should remove empty tag and set cursor in previous element', function() {
			editor.value = '<a href="#test">t</a>';

			editor.s.setCursorIn(editor.editor.firstChild, false);

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect(editor.value).equals('');
		});
	});

	describe('Cursor after/before element', function() {
		describe('Backspace key', function() {
			it('Should remove that element', function() {
				const editor = getJodit();
				editor.value = '<p><img src="tests/artio.jpg"/>test</p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStartAfter(editor.editor.firstChild.firstChild);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<p>test</p>').equals(editor.value);

				editor.s.insertNode(editor.createInside.text(' a '));
				expect('<p> a test</p>').equals(editor.value);
			});

			describe('After P before Table', function() {
				it('Should remove P', function() {
					const editor = getJodit();
					editor.value =
						'<p><br></p><table><tbody><tr><td>1</td></tr></tbody></table>';

					const range = editor.s.createRange();

					range.setStartAfter(editor.editor.firstChild);
					range.collapse(true);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals(
						'<table><tbody><tr><td>1</td></tr></tbody></table>'
					);

					editor.s.insertNode(
						editor.createInside.text(' a ')
					);
					expect(editor.value).equals(
						' a <table><tbody><tr><td>1</td></tr></tbody></table>'
					);
				});
			});
		});

		describe('Delete key', function() {
			it('Should remove that element', function() {
				const editor = getJodit();
				editor.value = '<p>test<img src="tests/artio.jpg"/></p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStartBefore(editor.editor.querySelector('img'));
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect('<p>test</p>').equals(editor.value);

				editor.s.insertNode(editor.createInside.text(' a '));
				expect('<p>test a </p>').equals(editor.value);
			});
		});
	});

	describe('Enter backspace in the middle of two UL elements', function() {
		describe('In first LI of second UL', function() {
			it('Should connect both UL in one element', function() {
				editor.value =
					'<ul><li>Test</li></ul><ul><li>Some text</li></ul>';

				range.setStart(
					editor.editor.lastChild.firstChild.firstChild,
					0
				);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(sortAttributes(editor.value)).equals(
					'<ul><li>Test</li><li>Some text</li></ul>'
				);

				editor.s.insertNode(editor.createInside.text(' a '));

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

				const range = editor.s.createRange();

				range.setStart(editor.editor.firstChild.childNodes[1], 0);
				range.collapse(true);

				editor.s.focus();
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				expect(sortAttributes(editor.value)).equals(
					'<ul><li>Test</li></ul><p><br></p><ul><li>Some text</li></ul>'
				);

				editor.s.focus();
				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(sortAttributes(editor.value)).equals(
					'<ul><li>Test<br></li><li>Some text</li></ul>'
				);

				editor.s.focus();
				editor.s.insertNode(editor.createInside.text(' a '));
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

					const sel = editor.s.sel,
						range = editor.s.createRange();

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

					editor.s.insertNode(
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

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);
					expect('<ul><li>Some text</li></ul>').equals(editor.value);

					editor.s.insertNode(
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

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(
					editor.editor.firstChild.childNodes[0].firstChild,
					0
				);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<p>Test</p>').equals(editor.value);

				editor.s.insertNode(editor.createInside.text(' a '));
				expect('<p> a Test</p>').equals(editor.value);
			});
		});
		it('Should connect this LI with previous', function() {
			const editor = getJodit();
			editor.value = '<ul><li>Test</li><li>Some text</li></ul>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(
				editor.editor.firstChild.childNodes[1].firstChild,
				0
			);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect('<ul><li>TestSome text</li></ul>').equals(editor.value);

			editor.s.insertNode(editor.createInside.text(' a '));
			expect(editor.value).equals('<ul><li>Test a Some text</li></ul>');
		});
		describe('And enter Enter', function() {
			it('Should split this LI on two again', function() {
				const editor = getJodit();
				editor.value = '<ul><li>Test</li><li>Some text</li></ul>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

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
});
