describe('Enter behavior Jodit Editor Tests', function() {
	describe('Backspace/Delete key', function() {
		describe('near empty tag', function() {
			describe('BR before P', function() {
				it('Should simple remove BR but cursor should leave inside P', function() {
					const editor = new Jodit(appendTestArea());

					editor.value = '<br><p>test</p>';

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

					editor.selection.insertNode(
						editor.create.inside.text(' 2 ')
					);
					expect(editor.value).equals('<p> 2 test</p>');
				});
			});

			describe('HR before P', function() {
				it('Should simple remove HR but cursor should leave inside P', function() {
					const editor = new Jodit(appendTestArea());

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
						editor.create.inside.text(' 2 ')
					);
					expect(editor.value).equals('<p>lets</p><p> 2 test</p>');
				});

				describe('HR has different display style', function() {
					it('Should also remove HR but cursor should leave inside P', function() {
						const editor = new Jodit(appendTestArea(), {
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
							editor.create.inside.text(' 2 ')
						);
						expect(editor.value).equals(
							'<p>lets</p><p> 2 test</p>'
						);
					});
				});
			});

			describe('Backspace and Previous was empty H1', function() {
				it('Should simple remove this H1', function() {
					const editor = new Jodit(appendTestArea());

					editor.value = '<h1></h1><p>test</p>';

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
				describe('H1 with BR', function() {
					it('Should simple remove this H1', function() {
						const editor = new Jodit(appendTestArea());

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
					const editor = new Jodit(appendTestArea());

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
						const editor = new Jodit(appendTestArea());

						editor.value = '<p>test</p><h1><br></h1>';

						const range = editor.selection.createRange();

						// set cursor in start of element

						range.selectNodeContents(editor.editor.firstChild);
						range.collapse(false);
						editor.selection.sel.removeAllRanges();
						editor.selection.sel.addRange(range);

						simulateEvent(
							'keydown',
							Jodit.KEY_DELETE,
							editor.editor
						);

						expect(editor.value).equals('<p>test</p>');
					});
				});
			});
		});

		describe('inside empty TD', function() {
			it('Should doing nothing', function() {
				const editor = new Jodit(appendTestArea());

				editor.value =
					'<table><tbody>' +
					'<tr><td></td></tr>' +
					'</tbody></table>';

				editor.selection.setCursorIn(editor.editor.querySelector('td'));

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
				expect(
					'<table><tbody>' + '<tr><td></td></tr>' + '</tbody></table>'
				).equals(editor.value);

				editor.selection.focus();
				editor.selection.insertNode(editor.create.inside.text(' 2 '));

				expect(
					'<table><tbody>' +
						'<tr><td> 2 </td></tr>' +
						'</tbody></table>'
				).equals(editor.value);
			});
		});

		describe('inside empty P', function() {
			it('Should remove empty tag and set cursor in previous element', function() {
				const editor = new Jodit(appendTestArea());

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
				editor.selection.insertNode(editor.create.inside.text(' 2 '));

				expect(editor.value).equals(
					'<table><tbody>' +
						'<tr><td> 2 </td></tr>' +
						'</tbody></table>'
				);
			});
		});

		describe('Cursor after/before element', function() {
			describe('Backspace key', function() {
				it('Should remove that element', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<p><img src="tests/artio.jpg"/>test</p>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStartAfter(editor.editor.firstChild.firstChild);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect('<p>test</p>').equals(editor.value);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);
					expect('<p> a test</p>').equals(editor.value);
				});
			});
			describe('Delete key', function() {
				it('Should remove that element', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<p>test<img src="tests/artio.jpg"/></p>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStartBefore(editor.editor.querySelector('img'));
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect('<p>test</p>').equals(editor.value);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);
					expect('<p>test a </p>').equals(editor.value);
				});
			});
		});

		describe('Enter backspace in the middle of two UL elements', function() {
			describe('In first LI of second UL', function() {
				it('Should connect both UL in one element', function() {
					const editor = new Jodit(appendTestArea());
					editor.value =
						'<ul><li>Test</li></ul><ul><li>Some text</li></ul>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(
						editor.editor.lastChild.firstChild.firstChild,
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

					expect('<ul><li>Test</li><li>Some text</li></ul>').equals(
						editor.value
					);

					editor.selection.focus();
					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);
					expect(
						'<ul><li>Test a </li><li>Some text</li></ul>'
					).equals(editor.value);
				});
			});
			describe('In the P element', function() {
				it('Should connect both UL in one element', function() {
					const editor = new Jodit(appendTestArea());
					editor.ownerWindow.focus();
					editor.value =
						'<ul><li>Test</li><li> </li><li>Some text</li></ul>';

					const range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.childNodes[1], 0);
					range.collapse(true);

					editor.selection.focus();
					editor.selection.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					expect(editor.value).equals(
						'<ul><li>Test</li></ul><p><br></p><ul><li>Some text</li></ul>'
					);

					editor.selection.focus();
					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals(
						'<ul><li>Test<br></li><li>Some text</li></ul>'
					);

					editor.selection.focus();
					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);
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
						const editor = new Jodit(appendTestArea());
						editor.value =
							'<ul><li>Test</li><li>Some text</li></ul>';

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
							editor.create.inside.text(' a ')
						);
						expect(
							'<p> a Test</p><ul><li>Some text</li></ul>'
						).equals(editor.value);
					});
				});
				describe('Enter delete', function() {
					it('Should remove all text content and after this remove that LI', function() {
						const editor = new Jodit(appendTestArea());
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

						simulateEvent(
							'keydown',
							Jodit.KEY_DELETE,
							editor.editor
						);
						expect('<ul><li>Some text</li></ul>').equals(
							editor.value
						);

						editor.selection.insertNode(
							editor.create.inside.text(' a ')
						);
						expect('<ul><li> a Some text</li></ul>').equals(
							editor.value
						);
					});
				});
			});
			describe('in alone LI', function() {
				it('Should remove this LI and UL and move all conntent in P', function() {
					const editor = new Jodit(appendTestArea());
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

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect('<p>Test</p>').equals(editor.value);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);
					expect('<p> a Test</p>').equals(editor.value);
				});
			});
			it('Should connect this LI with previous', function() {
				const editor = new Jodit(appendTestArea());
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

				editor.selection.insertNode(editor.create.inside.text(' a '));
				expect(editor.value).equals(
					'<ul><li>Test a Some text</li></ul>'
				);
			});
			describe('And enter Enter', function() {
				it('Should split this LI on two again', function() {
					const editor = new Jodit(appendTestArea());
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

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect('<ul><li>TestSome text</li></ul>').equals(
						editor.value
					);

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
					const editor = new Jodit(appendTestArea());
					editor.value = '<p>test</p>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.setEnd(editor.editor.firstChild.firstChild, 4);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect('<p>te</p>').equals(editor.value);
				});
			});
			describe('Select whole text inside element', function() {
				describe('Inside P', function() {
					it('Should remove selected range and remove this P', function() {
						const editor = new Jodit(appendTestArea());
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
						const editor = new Jodit(appendTestArea());
						editor.value =
							'<table><tbody><tr><td>test</td><td>1</td></tr></tbody></table>';

						const sel = editor.selection.sel,
							range = editor.selection.createRange();

						range.selectNodeContents(
							editor.editor.querySelector('td')
						);
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

	describe('Enter key', function() {
		describe('Enter BR', function() {
			it('Should simple insert BR element', function() {
				const editor = new Jodit(appendTestArea(), {
					enter: 'BR'
				});
				editor.value = 'test';
				editor.selection.setCursorAfter(editor.editor.firstChild);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				expect(editor.value).equals('test<br>');
				editor.selection.insertHTML('stop');
				expect(editor.value).equals('test<br>stop');
			});
		});

		describe('If Enter was pressed in not wrapped text in the end, it text ', function() {
			it('should be wrap in paragraph and cursor should be in next new paragraph', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = 'Some text';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild, 9);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text(' a '));

				expect(editor.value).equals('<p>Some text</p><p> a <br></p>');
			});
		});

		describe('If Enter was pressed in the end of SPAN inside P', function() {
			it('should simple create P>SPAN and move cursor inside this', function() {
				const editor = new Jodit(appendTestArea());
				editor.value =
					'<p>Some <span style="color: red">text</span></p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNodeContents(editor.editor.firstChild.lastChild);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text(' a '));

				expect(editor.value).equals(
					'<p>Some <span style="color: red">text</span></p><p><span style="color: red"> a <br></span></p>'
				);
			});
		});

		describe('If Enter was pressed in the end of STRONG inside P', function() {
			it('should simple create P>STRONG and move cursor inside this', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>Some <strong>text</strong></p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNodeContents(editor.editor.firstChild.lastChild);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text(' a '));

				expect(editor.value).equals(
					'<p>Some <strong>text</strong></p><p><strong> a <br></strong></p>'
				);
			});
		});

		describe('If Enter was pressed inside text without wrapper and near were some another elements', function() {
			it('should split that wrapper', function() {
				const editor = new Jodit(appendTestArea());
				editor.value =
					'as<span style="color: rgb(147, 101, 184);">da</span>s';

				const range = editor.selection.createRange();

				// set focus in the span
				range.setStart(
					editor.editor.firstChild.nextSibling.firstChild,
					1
				);
				range.collapse(true);
				editor.selection.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text(' a '));

				expect(editor.value).equals(
					'<p>as<span style="color: rgb(147, 101, 184);">d</span></p><p><span style="color: rgb(147, 101, 184);"> a a</span>s</p>'
				);
			});
		});

		describe('If Enter was pressed inside H1-6 that', function() {
			it('should be spliced on two', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<h1>Some text</h1>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 5);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text(' a '));

				expect(editor.value).equals('<h1>Some </h1><h1> a text</h1>');
			});
		});

		describe('If Enter was pressed inside H1-6 cursor ', function() {
			it('should be move in new paragraph below', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<h1>Some text</h1>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 9);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text(' a '));

				expect(editor.value).equals('<h1>Some text</h1><p> a <br></p>');
			});
		});

		describe('If Enter was pressed', function() {
			describe('Prevent plugin work', function() {
				it('Should prevent plugin work', function() {
					const editor = new Jodit(appendTestArea(), {
						enter: 'BR',
						events: {
							beforeEnter: function() {
								return false;
							}
						}
					});
					editor.value = 'test';
					editor.selection.setCursorAfter(editor.editor.firstChild);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					expect(editor.value).equals('test');
					editor.selection.insertHTML('stop');
					expect(editor.value).equals('teststop');
				});
			});

			describe('in not wrapped text in the start', function() {
				it('should wrap this text in paragraph and cursor should be in that, and before should be empty new paragraph', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = 'Some text';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild, 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);

					expect(editor.value).equals(
						'<p><br></p><p> a Some text</p>'
					);
				});
			});
		});

		describe('If Enter was pressed inside empty editor', function() {
			it('should be added 2 paragraph and cursor must be in second', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = ''; // empty
				editor.selection.focus();

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text(' a '));

				expect(editor.value).equals('<p><br></p><p> a <br></p>');
			});
		});

		describe('If Enter was pressed in no wrapped text, it text ', function() {
			it('should be wrap in paragraph and spliced on two parts', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = 'Some text';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild, 5);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text(' a '));

				expect(editor.value).equals('<p>Some </p><p> a text</p>');
			});
		});

		describe('Content editor after pressing the Enter key', function() {
			it('Should contain the specified tag settings', function() {
				const editor = new Jodit(appendTestArea());
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				expect(editor.value).equals(
					'<p><br></p><p><br></p><p><br></p><p><br></p>'
				);
			});

			describe('after this', function() {
				it('Should contain the specified tag settings and after this cursor must be inside that tag', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '';
					editor.selection.focus();

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					editor.selection.insertNode(
						editor.create.inside.text('test')
					);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					editor.selection.insertNode(
						editor.create.inside.text('test2')
					);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					editor.selection.insertNode(
						editor.create.inside.text('test3')
					);

					expect(editor.value).equals(
						'<p><br></p><p>test</p><p>test2</p><p>test3<br></p>'
					);
				});
			});
		});

		describe('Enter pressed inside P element', function() {
			describe('In the middle of element', function() {
				it('Should split paragraph', function() {
					const editor = new Jodit(appendTestArea());

					const p = editor.editorDocument.createElement('p'),
						node = editor.create.inside.text('Split paragraph');

					p.appendChild(node);

					editor.selection.insertNode(p);

					const range = editor.selection.createRange();

					range.setStart(node, 6);
					editor.selection.sel.removeAllRanges();
					editor.selection.sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text('a ')
					);

					expect(editor.value).equals(
						'<p>Split </p><p>a paragraph</p>'
					);
				});
				it('Should create new paragraph with same styles like as original', function() {
					const editor = new Jodit(appendTestArea());

					const p = editor.editorDocument.createElement('p'),
						node = editor.create.inside.text('Split paragraph');

					p.appendChild(node);
					p.style.textAlign = 'right';
					p.style.color = '#ff0000';

					editor.selection.insertNode(p);

					const range = editor.selection.createRange();

					range.setStart(node, 6);
					editor.selection.sel.removeAllRanges();
					editor.selection.sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text('a ')
					);

					expect(sortAttributes(editor.value)).equals(
						'<p style="color:#FF0000;text-align:right">Split </p><p style="color:#FF0000;text-align:right">a paragraph</p>'
					);
				});
			});
			describe('Enter pressed inside P element in the edge', function() {
				describe('If cursor in the right edge of paragraph after enter', function() {
					it('should move  cursor in another new paragraph', function() {
						const editor = new Jodit(appendTestArea());

						const p = editor.editorDocument.createElement('p'),
							p2 = editor.editorDocument.createElement('p');

						p.innerHTML = 'Split paragraph';
						p2.innerHTML = 'Test';
						editor.selection.insertNode(p);
						editor.selection.insertNode(p2);

						// set cursor in end of element
						editor.selection.setCursorIn(p, false);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.selection.insertNode(
							editor.create.inside.text('a ')
						);

						expect(editor.value).equals(
							'<p>Split paragraph</p><p>a <br></p><p>Test</p>'
						);
					});
				});
				describe('If cursor in the left edge of paragraph after enter', function() {
					it('should move cursor in another new paragraph before old place', function() {
						const editor = new Jodit(appendTestArea());

						const p = editor.editorDocument.createElement('p'),
							p2 = editor.editorDocument.createElement('p');

						p.innerHTML = 'Split paragraph';
						p2.innerHTML = 'Test';
						editor.selection.insertNode(p);
						editor.selection.insertNode(p2);

						const range = editor.selection.createRange();

						// set cursor in start of element
						range.setStart(p.firstChild, 0);
						range.collapse(true);
						editor.selection.sel.removeAllRanges();
						editor.selection.sel.addRange(range);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.selection.insertNode(
							editor.create.inside.text('a ')
						);

						expect(editor.value).equals(
							'<p><br></p><p>a Split paragraph</p><p>Test</p>'
						);
					});
				});
				describe('Copys styles', function() {
					it('should move  cursor in new paragraph an copy all styles from old', function() {
						const editor = new Jodit(appendTestArea());

						const p = editor.editorDocument.createElement('p'),
							p2 = editor.editorDocument.createElement('p');

						p.style.color = '#ff0000';
						p.style.textAlign = 'right';

						p.innerHTML = 'Split paragraph';
						p2.innerHTML = 'Test';
						editor.selection.insertNode(p);
						editor.selection.insertNode(p2);

						// set cursor in end of element
						editor.selection.setCursorIn(p, false);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.selection.insertNode(
							editor.create.inside.text('a ')
						);

						expect(sortAttributes(editor.value)).to.be.equal(
							'<p style="color:#FF0000;text-align:right">Split paragraph</p><p style="color:#FF0000;text-align:right">a <br></p><p>Test</p>'
						);
					});
				});
			});
		});

		describe('with table', function() {
			it('If cursor in TD tag', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = '<table><tr><td>text</td></tr></table>';

				const range = editor.selection.createRange();

				// set cursor in start of element
				range.selectNodeContents(editor.editor.querySelector('td'));
				range.collapse(true);
				editor.selection.selectRange(range);

				editor.selection.insertNode(
					editor.create.inside.text('split ')
				);

				expect(editor.value).equals(
					'<table><tbody><tr><td>split text</td></tr></tbody></table>'
				);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				expect(editor.value).equals(
					'<table><tbody><tr><td>split <br>text</td></tr></tbody></table>'
				);

				editor.selection.insertNode(
					editor.create.inside.text(' test ')
				);

				expect(editor.value).equals(
					'<table><tbody><tr><td>split <br> test text</td></tr></tbody></table>'
				);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				expect(editor.value).equals(
					'<table><tbody><tr><td>split <br> test <br>text</td></tr></tbody></table>'
				);

				editor.selection.insertNode(
					editor.create.inside.text(' stop ')
				);

				expect(editor.value).equals(
					'<table><tbody><tr><td>split <br> test <br> stop text</td></tr></tbody></table>'
				);
			});

			it('If cursor in right side of table', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = '<table><tr><td>test</td></tr></table>';

				const range = editor.selection.createRange();

				// set cursor in start of element
				range.setEndAfter(editor.editor.querySelector('table'));
				range.collapse(false);
				editor.selection.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(
					editor.create.inside.text('text'),
					false
				);

				expect(editor.value).equals(
					'<table><tbody><tr><td>test</td></tr></tbody></table><p>text<br></p>'
				);
			});
		});

		describe('with SHIFT button', function() {
			it('should insert <br> tag and move cursor after it.', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = 'test';

				const range = editor.selection.createRange();

				// set cursor in start of element
				range.setStart(editor.editor.firstChild, 2);
				range.collapse(true);
				editor.selection.sel.removeAllRanges();
				editor.selection.sel.addRange(range);

				simulateEvent(
					'keydown',
					Jodit.KEY_ENTER,
					editor.editor,
					function(options) {
						options.shiftKey = true;
					}
				);

				editor.selection.insertNode(
					editor.create.inside.text('split ')
				);

				expect(editor.value).equals('te<br>split st');

				simulateEvent(
					'keydown',
					Jodit.KEY_ENTER,
					editor.editor,
					function(options) {
						options.shiftKey = true;
					}
				);

				expect(editor.value).equals('te<br>split <br>st');
			});
		});

		describe('In PRE tag', function() {
			it('Should add <br> element', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = '<pre>test</pre>';

				editor.selection.setCursorIn(
					editor.editor.querySelector('pre'),
					false
				);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				editor.selection.insertNode(editor.create.inside.text('split'));

				expect('<pre>test<br>split</pre>').equals(
					sortAttributes(editor.value)
				);
			});
		});

		describe('Inside UL tag', function() {
			describe('enter mode = br', function() {
				describe('Inside LI tag in the end', function() {
					it('Should work like usual and add new LI element', function() {
						const editor = new Jodit(appendTestArea(), {
							enter: 'BR'
						});

						editor.value = '<ul><li>test</li></ul>';

						editor.selection.setCursorAfter(
							editor.editor.querySelector('ul>li').firstChild
						);
						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);
						editor.selection.insertNode(
							editor.create.inside.text('split')
						);

						expect(
							'<ul>' +
								'<li>test</li>' +
								'<li>split<br></li>' +
								'</ul>'
						).equals(sortAttributes(editor.value));
					});
				});
				describe('Inside empty LI tag', function() {
					it('Should work like usual and add insert new br after UL', function() {
						const editor = new Jodit(appendTestArea(), {
							enter: 'BR'
						});

						editor.value = '<ul><li>test</li><li> </li></ul>';

						editor.selection.setCursorAfter(
							editor.editor.querySelectorAll('ul>li')[1]
								.firstChild
						);
						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);
						editor.selection.insertNode(
							editor.create.inside.text('split')
						);

						expect(
							'<ul>' + '<li>test</li>' + '</ul>split<br>'
						).equals(sortAttributes(editor.value));
					});
				});
			});

			describe('In LI tag inside table cell', function() {
				it('Should work like usual', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<table>' +
						'<tbody>' +
						'<tr>' +
						'<td>' +
						'<ul><li>test</li></ul>' +
						'</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>';

					editor.selection.setCursorIn(
						editor.editor.querySelector('ul>li'),
						false
					);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					editor.selection.insertNode(
						editor.create.inside.text('split')
					);

					expect(
						'<table>' +
							'<tbody>' +
							'<tr>' +
							'<td>' +
							'<ul>' +
							'<li>test</li>' +
							'<li>split<br></li>' +
							'</ul>' +
							'</td>' +
							'</tr>' +
							'</tbody>' +
							'</table>'
					).equals(sortAttributes(editor.value));
				});
			});

			describe('In last LI tag', function() {
				describe('In tag was only one Image element but cursor was before it', function() {
					it('Should not add new P element and move image there', function() {
						const editor = new Jodit(appendTestArea());

						editor.value =
							'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li><img style="width:30px" src="tests/artio.jpg"></li>' +
							'</ul>';

						editor.selection.setCursorBefore(
							editor.editor.firstChild.lastChild.firstChild
						);
						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);
						editor.selection.insertNode(
							editor.create.inside.text('split ')
						);

						expect(
							'<ul>' +
								'<li>1</li>' +
								'<li>2</li>' +
								'<li><br></li>' +
								'<li>split <img src="tests/artio.jpg" style="width:30px"></li>' +
								'</ul>'
						).equals(sortAttributes(editor.value));
					});
				});
			});

			describe('If Enter was pressed inside first empty LI and it was alone LI in UL', function() {
				it('should be remove LI and UL and cursor must b inside new P', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<ul><li> </li></ul>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);

					expect(editor.value).equals('<p> a <br></p>');
				});
			});

			describe('If Enter was pressed inside empty LI', function() {
				it('should be removed and cursor must be after UL|OL', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<ul><li>Some text</li><li> </li></ul>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(
						editor.editor.firstChild.lastChild.firstChild,
						1
					);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);

					expect(editor.value).equals(
						'<ul><li>Some text</li></ul><p> a <br></p>'
					);
				});
			});

			describe('If Enter was pressed inside empty middle LI', function() {
				it('should split parent UL, remove LI, insert new P in the middle of two new Ul and insert cursor inside this', function() {
					const editor = new Jodit(appendTestArea());
					editor.value =
						'<ul><li>Test</li><li> </li><li>Some text</li></ul>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.childNodes[1], 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);

					expect(editor.value).equals(
						'<ul><li>Test</li></ul><p> a <br></p><ul><li>Some text</li></ul>'
					);
				});
			});

			describe('If Enter was pressed inside start of first(not empty) LI', function() {
				it('should add empty LI and cursor should not move', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<ul><li>Some text</li></ul>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);

					expect(editor.value).equals(
						'<ul><li><br></li><li> a Some text</li></ul>'
					);
				});
			});

			describe('If Enter was pressed inside start of first empty LI', function() {
				it('should remove this LI, and insert new P element before parent UL, cursor should move to inside it', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<ul><li> </li><li>Some text</li></ul>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);

					expect(editor.value).equals(
						'<p> a <br></p><ul><li>Some text</li></ul>'
					);
				});
			});

			describe('Enter was pressed inside P inside LI', function() {
				it('should add new LI with P and set cursor inside it', function() {
					const editor = new Jodit(appendTestArea());
					editor.value =
						'<ul>' +
						'<li><p>Line_1</p></li>' +
						'<li><p>Line_2</p></li>' +
						'</ul>';

					const range = editor.selection.createRange();

					range.setEndAfter(
						editor.editor.querySelector('p').firstChild
					);
					range.collapse(false);
					editor.selection.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);

					expect(editor.value).equals(
						'<ul>' +
							'<li><p>Line_1</p></li>' +
							'<li><p> a <br></p></li>' +
							'<li><p>Line_2</p></li>' +
							'</ul>'
					);
				});
			});
		});

		describe('Use BR instead P', function() {
			describe('Enter 3 times', function() {
				it('should create 3 BR elements and set cursor after these', function() {
					const editor = new Jodit(appendTestArea(), {
						enter: Jodit.BR
					});
					editor.value = 'Some text';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild, 9);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.selection.insertNode(
						editor.create.inside.text(' a ')
					);

					expect(editor.value).equals('Some text<br><br><br> a ');
				});
			});
		});

		describe('Press Enter inside SPAN with some color', function() {
			it('Should add new P element after this span and this SPAN sholud wrap in P', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = '<span style="color:red">test</span>';

				editor.selection.setCursorIn(
					editor.editor.querySelector('span'),
					false
				);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.selection.insertNode(editor.create.inside.text('test'));

				expect(sortAttributes(editor.value)).equals(
					'<p><span style="color:red">test</span></p><p><span style="color:red">test<br></span></p>'
				);
			});
		});
	});
});
