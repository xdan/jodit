/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Enter behavior Tests', function () {
	describe('Enter key', function () {
		describe('Enter BR', function () {
			it('Should simple insert BR element', function () {
				const editor = getJodit({
					enter: 'br'
				});

				editor.value = 'test';
				editor.s.setCursorAfter(editor.editor.firstChild);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				expect(editor.value).equals('test<br><br>');
				editor.s.insertHTML('stop');
				expect(editor.value).equals('test<br>stop<br>');
			});
		});

		describe('If Enter was pressed in not wrapped text in the end, it text ', function () {
			it('should be wrap in paragraph and cursor should be in next new paragraph', function () {
				const editor = getJodit();
				editor.value = '<p>Some text|</p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals('<p>Some text</p><p> a </p>');
			});

			describe('Inside BODY for iframe and editHTMLDocumentMode', function () {
				it('should work like in usual case', function () {
					const editor = getJodit({
						editHTMLDocumentMode: true,
						iframe: true,
						iframeStyle: '',
						iframeCSSLinks: Jodit.atom([])
					});

					editor.value = '<p>Some text|</p>';
					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(
						sortAttributes(editor.value).replace(
							/<style class="jodit jodit--container jodit-box _theme_default"><\/style>/,
							''
						)
					).equals(
						'<!DOCTYPE html><html lang="en" style="overflow-y:hidden">' +
							'<head><title>Jodit Editor</title></head>' +
							'<body spellcheck="false"><p>Some text</p><p> a </p></body>' +
							'</html>'
					);
				});
			});
		});

		describe('If Enter was pressed in the end of SPAN inside P', function () {
			it('should simple create P>SPAN and move cursor inside this', function () {
				const editor = getJodit();
				editor.value =
					'<p>Some <span style="color: red">text|</span></p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals(
					'<p>Some <span style="color: red">text</span></p><p><span style="color: red"> a </span></p>'
				);
			});
		});

		describe('If Enter was pressed in the end of STRONG inside P', function () {
			it('should simple create P>STRONG and move cursor inside this', function () {
				const editor = getJodit();
				editor.value = '<p>Some <strong>text|</strong></p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals(
					'<p>Some <strong>text</strong></p><p><strong> a </strong></p>'
				);
			});
		});

		describe('If Enter was pressed inside text without wrapper and near were some another elements', function () {
			it('should split that wrapper', function () {
				const editor = getJodit();
				editor.value =
					'as<span style="color: rgb(147, 101, 184);">da</span>s';

				const range = editor.s.createRange();

				// set focus in the span
				range.setStart(
					editor.editor.firstChild.firstChild.nextSibling.firstChild,
					1
				);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals(
					'<p>as<span style="color: rgb(147, 101, 184);">d</span></p><p><span style="color: rgb(147, 101, 184);"> a a</span>s</p>'
				);
			});
		});

		describe('If Enter was pressed inside H1-6 that', function () {
			it('should be spliced on two', function () {
				const editor = getJodit();
				editor.value = '<h1>Some text</h1>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 5);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals('<h1>Some </h1><h1> a text</h1>');
			});
		});

		describe('If Enter was pressed inside H1-6 cursor ', function () {
			it('should be move in new paragraph below', function () {
				const editor = getJodit();
				editor.value = '<h1>Some text|</h1>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals('<h1>Some text</h1><p> a </p>');
			});
		});

		describe('If Enter was pressed', function () {
			describe('Prevent plugin work', function () {
				it('Should prevent plugin work', function () {
					const editor = getJodit({
						enter: 'BR',
						events: {
							beforeEnter: function () {
								return false;
							}
						}
					});
					editor.value = 'test';
					editor.s.setCursorAfter(editor.editor.firstChild);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					expect(editor.value).equals('test');
					editor.s.insertHTML('stop');
					expect(editor.value).equals('teststop');
				});
			});

			describe('in not wrapped text in the start', function () {
				it('should wrap this text in paragraph and cursor should be in that, and before should be empty new paragraph', function () {
					const editor = getJodit();
					editor.value = 'Some text';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(editor.editor.firstChild, 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<p><br></p><p> a Some text</p>'
					);
				});
			});
		});

		describe('If Enter was pressed inside empty editor', function () {
			it('should be added 2 paragraph and cursor must be in second', function () {
				const editor = getJodit();

				editor.value = '<p><br></p>'; // empty
				editor.s.focus();

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals('<p><br></p><p> a </p>');
			});
		});

		describe('If Enter was pressed in no wrapped text, it text ', function () {
			it('should be wrap in paragraph and spliced on two parts', function () {
				const editor = getJodit();
				editor.value = 'Some text';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 5);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals('<p>Some </p><p> a text</p>');
			});
		});

		describe('Content editor after pressing the Enter key', function () {
			it('Should contain the specified tag settings', function () {
				const editor = getJodit();
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				expect(editor.value).equals(
					'<p><br></p><p><br></p><p><br></p><p><br></p>'
				);
			});

			describe('after this', function () {
				it('Should contain the specified tag settings and after this cursor must be inside that tag', function () {
					const editor = getJodit();
					editor.value = '<p>|<br></p>';
					setCursorToChar(editor);
					editor.s.focus();

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					editor.s.insertNode(editor.createInside.text('test'));

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					editor.s.insertNode(editor.createInside.text('test2'));

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					editor.s.insertNode(editor.createInside.text('test3'));

					expect(editor.value).equals(
						'<p><br></p><p>test</p><p>test2</p><p>test3</p>'
					);
				});
			});
		});

		describe('Enter pressed inside P element', function () {
			describe('In the middle of element', function () {
				it('Should split paragraph', function () {
					const editor = getJodit();

					const p = editor.ed.createElement('p'),
						node = editor.createInside.text('Split paragraph');

					p.appendChild(node);

					editor.s.insertNode(p);

					const range = editor.s.createRange();

					range.setStart(node, 6);
					editor.s.sel.removeAllRanges();
					editor.s.sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text('a '));

					expect(editor.value).equals(
						'<p>Split </p><p>a paragraph</p>'
					);
				});
				it('Should create new paragraph with same styles like as original', function () {
					const editor = getJodit();

					const p = editor.ed.createElement('p'),
						node = editor.createInside.text('Split paragraph');

					p.appendChild(node);
					p.style.textAlign = 'right';
					p.style.color = '#ff0000';

					editor.s.insertNode(p);

					const range = editor.s.createRange();

					range.setStart(node, 6);
					editor.s.sel.removeAllRanges();
					editor.s.sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text('a '));

					expect(sortAttributes(editor.value)).equals(
						'<p style="color:#FF0000;text-align:right">Split </p><p style="color:#FF0000;text-align:right">a paragraph</p>'
					);
				});
			});

			describe('Enter pressed inside P element in the edge', function () {
				describe('If cursor in the right edge of paragraph after enter', function () {
					it('should move  cursor in another new paragraph', function () {
						const editor = getJodit();
						editor.value = '<p>Split paragraph|</p><p>Test</p>';
						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.s.insertNode(editor.createInside.text('a '));

						expect(editor.value).equals(
							'<p>Split paragraph</p><p>a </p><p>Test</p>'
						);
					});
				});

				describe('If cursor in the left edge of paragraph after enter', function () {
					it('should move cursor in another new paragraph before old place', function () {
						const editor = getJodit();
						editor.value = '<p>|Split paragraph</p><p>Test</p>';
						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.s.insertNode(editor.createInside.text('a '));

						expect(editor.value).equals(
							'<p><br></p><p>a Split paragraph</p><p>Test</p>'
						);
					});
				});
				describe('Copys styles', function () {
					it('should move  cursor in new paragraph an copy all styles from old', function () {
						const editor = getJodit();
						editor.value =
							'<p style="color:#FF0000;text-align:right">Split paragraph|</p><p>Test</p>';
						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.s.insertNode(editor.createInside.text('a '));

						expect(sortAttributes(editor.value)).to.be.equal(
							'<p style="color:#FF0000;text-align:right">Split paragraph</p><p style="color:#FF0000;text-align:right">a </p><p>Test</p>'
						);
					});
				});
			});
		});

		describe('with table', function () {
			it('If cursor in TD tag', function () {
				const editor = getJodit();

				editor.value = '<table><tr><td>|text</td></tr></table>';
				setCursorToChar(editor);

				editor.s.insertNode(editor.createInside.text('split '));

				replaceCursorToChar(editor);
				expect(editor.value).equals(
					'<table><tbody><tr><td>split |text</td></tr></tbody></table>'
				);
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				expect(editor.value).equals(
					'<table><tbody><tr><td>split <br>text</td></tr></tbody></table>'
				);

				editor.s.insertNode(editor.createInside.text(' test '));

				expect(editor.value).equals(
					'<table><tbody><tr><td>split <br> test text</td></tr></tbody></table>'
				);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				expect(editor.value).equals(
					'<table><tbody><tr><td>split <br> test <br>text</td></tr></tbody></table>'
				);

				editor.s.insertNode(editor.createInside.text(' stop '));

				expect(editor.value).equals(
					'<table><tbody><tr><td>split <br> test <br> stop text</td></tr></tbody></table>'
				);
			});

			it('If cursor in right side of table', function () {
				const editor = getJodit();

				editor.value =
					'<table><tr><td>test</td></tr></table><p>|<br></p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text('text'), false);

				expect(editor.value).equals(
					'<table><tbody><tr><td>test</td></tr></tbody></table><p><br></p><p>text</p>'
				);
			});
		});

		describe('with SHIFT button', function () {
			it('should insert <br> tag and move cursor after it.', function () {
				const editor = getJodit();

				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				simulateEvent(
					'keydown',
					Jodit.KEY_ENTER,
					editor.editor,
					function (options) {
						options.shiftKey = true;
					}
				);

				editor.s.insertNode(editor.createInside.text('split '));

				expect(editor.value).equals('<p>te<br>split st</p>');

				simulateEvent(
					'keydown',
					Jodit.KEY_ENTER,
					editor.editor,
					function (options) {
						options.shiftKey = true;
					}
				);

				expect(editor.value).equals('<p>te<br>split <br>st</p>');
			});
		});

		describe('In PRE or BLOCKQUOTE tag', function () {
			it('Should add <br> element', function () {
				const editor = getJodit({
					disablePlugins: ['paste-code']
				});

				editor.value = '<pre>test</pre>';

				editor.s.setCursorIn(editor.editor.querySelector('pre'), false);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				editor.s.insertNode(editor.createInside.text('split'));

				expect(sortAttributes(editor.value)).equals(
					'<pre>test<br>split<br></pre>'
				);
			});

			describe('with SHIFT button', function () {
				describe('In the end', function () {
					it('should add new P element after PRE', function () {
						const editor = getJodit({
							disablePlugins: ['paste-code']
						});

						editor.value = '<pre>test|</pre>';
						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor,
							function (options) {
								options.shiftKey = true;
							}
						);

						editor.s.insertNode(editor.createInside.text('split '));

						expect(editor.value).equals(
							'<pre>test</pre><p>split </p>'
						);
					});
				});

				describe('In the start', function () {
					it('should add new P element before blockquote', function () {
						const editor = getJodit({
							disablePlugins: ['paste-code'] // For PRO version
						});

						editor.value = '<blockquote>|test</blockquote>';

						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor,
							function (options) {
								options.shiftKey = true;
							}
						);

						editor.s.insertNode(editor.createInside.text('split '));

						replaceCursorToChar(editor);

						expect(editor.value).equals(
							'<p><br></p><blockquote>split |test</blockquote>'
						);
					});
				});

				describe('In the middle', function () {
					it('should split PRE element', function () {
						const editor = getJodit({
							disablePlugins: ['paste-code']
						});

						editor.value = '<pre>test</pre>';

						editor.s
							.createRange(true)
							.setStart(editor.editor.firstChild.firstChild, 2);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor,
							function (options) {
								options.shiftKey = true;
							}
						);

						editor.s.insertNode(editor.createInside.text('split '));

						expect(editor.value).equals(
							'<pre>te</pre><pre>split st</pre>'
						);
					});
				});
			});
		});

		describe('Inside UL tag', function () {
			describe('enter mode = br', function () {
				describe('Inside LI tag in the end', function () {
					it('Should work like usual and add new LI element', function () {
						const editor = getJodit({
							enter: 'BR'
						});

						editor.value = '<ul><li>test|</li></ul>';
						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);
						editor.s.insertNode(editor.createInside.text('split'));

						expect(
							'<ul>' +
								'<li>test</li>' +
								'<li>split</li>' +
								'</ul>'
						).equals(sortAttributes(editor.value));
					});
				});

				describe('Inside empty LI tag', function () {
					it('Should work like usual and add insert new br after UL', function () {
						const editor = getJodit({
							enter: 'BR'
						});

						editor.value = '<ul><li>test</li><li> </li></ul>';

						editor.s.setCursorAfter(
							editor.editor.querySelectorAll('ul>li')[1]
								.firstChild
						);
						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);
						editor.s.insertNode(editor.createInside.text('split'));

						expect(
							'<ul>' + '<li>test</li>' + '</ul>split<br>'
						).equals(sortAttributes(editor.value));
					});
				});
			});

			describe('In LI tag inside table cell', function () {
				it('Should work like usual', function () {
					const editor = getJodit();

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

					editor.s.setCursorIn(
						editor.editor.querySelector('ul>li'),
						false
					);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					editor.s.insertNode(editor.createInside.text('split'));

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

			describe('In last LI tag', function () {
				describe('In tag was only one Image element but cursor was before it', function () {
					it('Should not add new P element and move image there', function () {
						const editor = getJodit();

						editor.value =
							'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li><img style="width:30px" src="tests/artio.jpg"></li>' +
							'</ul>';

						editor.s.setCursorBefore(
							editor.editor.firstChild.lastChild.firstChild
						);
						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);
						editor.s.insertNode(editor.createInside.text('split '));

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

			describe('If Enter was pressed inside first empty LI and it was alone LI in UL', function () {
				it('should be remove LI and UL and cursor must b inside new P', function () {
					const editor = getJodit();
					editor.value = '<ul><li> </li></ul>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals('<p> a </p>');
				});
			});

			describe('If Enter was pressed inside empty LI', function () {
				it('should be removed and cursor must be after UL|OL', function () {
					const editor = getJodit();
					editor.value = '<ul><li>Some text</li><li>| </li></ul>';
					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<ul><li>Some text</li></ul><p> a </p>'
					);
				});
			});

			describe('If Enter was pressed inside empty middle LI', function () {
				it('should split parent UL, remove LI, insert new P in the middle of two new Ul and insert cursor inside this', function () {
					const editor = getJodit();
					editor.value =
						'<ul><li>Test</li><li>| </li><li>Some text</li></ul>';
					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<ul><li>Test</li></ul><p> a </p><ul><li>Some text</li></ul>'
					);
				});
			});

			describe('Inside not empty LI', function () {
				describe('In the middle of LI', function () {
					it('should split LI on two parts', function () {
						const editor = getJodit();
						editor.value =
							'<ul>\n' +
							'\t<li>first</li>\n' +
							'\t<li>second</li>\n' +
							'\t<li>third</li>\n' +
							'</ul>';

						const range = editor.s.createRange(true);

						range.setStart(
							editor.editor.querySelectorAll('li')[1].firstChild,
							3
						);
						range.collapse(true);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.s.insertNode(editor.createInside.text(' a '));

						expect(editor.value).equals(
							'<ul>\n' +
								'\t<li>first</li>\n' +
								'\t<li>sec</li>' +
								'<li> a ond</li>\n' +
								'\t<li>third</li>\n' +
								'</ul>'
						);
					});

					describe('With Shift', function () {
						it('should only add new BR', function () {
							const editor = getJodit();
							editor.value =
								'<ul>\n' +
								'\t<li>first</li>\n' +
								'\t<li>second</li>\n' +
								'\t<li>third</li>\n' +
								'</ul>';

							const range = editor.s.createRange(true);

							range.setStart(
								editor.editor.querySelectorAll('li')[1]
									.firstChild,
								3
							);
							range.collapse(true);

							simulateEvent(
								'keydown',
								Jodit.KEY_ENTER,
								editor.editor,
								function (options) {
									options.shiftKey = true;
								}
							);

							editor.s.insertNode(
								editor.createInside.text(' a ')
							);

							expect(editor.value).equals(
								'<ul>\n' +
									'\t<li>first</li>\n' +
									'\t<li>sec<br> a ond</li>\n' +
									'\t<li>third</li>\n' +
									'</ul>'
							);
						});
					});
				});
			});

			describe('If Enter was pressed inside start of first(not empty) LI', function () {
				it('should add empty LI and cursor should not move', function () {
					const editor = getJodit();
					editor.value = '<ul><li>Some text</li></ul>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<ul><li><br></li><li> a Some text</li></ul>'
					);
				});
			});

			describe('If Enter was pressed inside start of first empty LI', function () {
				it('should remove this LI, and insert new P element before parent UL, cursor should move to inside it', function () {
					const editor = getJodit();
					editor.value = '<ul><li>| </li><li>Some text</li></ul>';

					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<p> a </p><ul><li>Some text</li></ul>'
					);
				});
			});

			describe('Enter was pressed inside P inside LI', function () {
				it('should add new LI with P and set cursor inside it', function () {
					const editor = getJodit();
					editor.value =
						'<ul>' +
						'<li><p>Line_1|</p></li>' +
						'<li><p>Line_2</p></li>' +
						'</ul>';

					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<ul>' +
							'<li><p>Line_1</p></li>' +
							'<li><p> a </p></li>' +
							'<li><p>Line_2</p></li>' +
							'</ul>'
					);
				});
			});
		});

		describe('Use BR instead P', function () {
			describe('Enter 3 times', function () {
				it('should create 3 BR elements and set cursor after these', function () {
					const editor = getJodit({
						enter: Jodit.BR
					});
					editor.value = 'Some text';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(editor.editor.firstChild, 9);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));
					replaceCursorToChar(editor);
					expect(editor.value).equals(
						'Some text<br><br><br> a |<br>'
					);
				});
			});
		});

		describe('Press Enter inside SPAN with some color', function () {
			it('Should add new P(with SPAN with same style) element after this span and this SPAN should wrap in P', function () {
				const editor = getJodit();

				editor.value = '<p><span style="color:red">test|</span></p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				editor.s.insertNode(editor.createInside.text('test'));

				expect(sortAttributes(editor.value)).equals(
					'<p><span style="color:red">test</span></p><p><span style="color:red">test</span></p>'
				);
			});

			describe('Enter two times', function () {
				it('Should add 2 P', function () {
					const editor = getJodit();

					editor.value =
						'<p><span style="color:red">test|</span></p>';

					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text('test'));

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="color:red">test</span></p>' +
							'<p><span style="color:red"><br></span></p>' +
							'<p><span style="color:red">test</span></p>'
					);
				});
			});
		});

		describe('After table', function () {
			it('Should add P directly after table', function () {
				const editor = getJodit();

				editor.value =
					'<p>test</p><table><tbody><tr><td>table</td></tr></tbody></table><p>pop</p><p>tost</p>';

				const range = editor.s.range;
				range.setStartAfter(editor.editor.querySelector('table'));
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				replaceCursorToChar(editor);

				expect(sortAttributes(editor.value)).equals(
					'<p>test</p>' +
						'<table><tbody><tr><td>table</td></tr></tbody></table>' +
						'<p>|<br></p>' +
						'<p>pop</p>' +
						'<p>tost</p>'
				);
			});
		});

		describe('Cases', () => {
			[
				['<pre>|test</pre>', '<pre><br>|test</pre>'],
				[
					'<pre>|test</pre>',
					'<p><br></p><pre>|test</pre>',
					undefined,
					opt => {
						opt.shiftKey = true;
					}
				],
				['<pre>test<br><br>|</pre>', '<pre>test</pre><p>|<br></p>'],
				['test|', 'test<br>|<br>', { enter: 'br' }],
				['<p>test|</p>', '<p>test</p><p>|<br></p>'],
				[
					'<p><a href="#index">test|</a></p>',
					'<p><a href="#index">test</a></p><p>|<br></p>'
				],
				[
					'test<a href="#index">test|</a>',
					'test<a href="#index">test</a><br>|<br>',
					{ enter: 'br' }
				],
				[
					'<p><strong>test|</strong></p>',
					'<p><strong>test</strong></p><p><strong>|<br></strong></p>'
				],
				[
					'<ul><li>test|</li></ul>',
					'<ul><li>test</li><li>|<br></li></ul>'
				],
				[
					'<ul><li>test</li><li>|<br></li></ul>',
					'<ul><li>test</li></ul><p>|<br></p>'
				],
				[
					'<ul><li>|<br></li><li>test</li></ul>',
					'<p>|<br></p><ul><li>test</li></ul>'
				],
				[
					'<ul><li>1</li><li><ul><li>2|</li></ul></li></ul>',
					'<ul><li>1</li><li><ul><li>2</li><li>|<br></li></ul></li></ul>'
				],
				[
					'<ul><li>1</li><li><ul><li>2</li><li>|<br></li></ul></li></ul>',
					'<ul><li>1</li><li><ul><li>2</li></ul></li><li>|<br></li></ul>'
				],
				[
					'<ul><li>1</li><li><br><ul><li>|<br></li><li>2</li></ul></li></ul>',
					'<ul><li>1</li><li><br></li><li>|<br><ul><li>2</li></ul></li></ul>'
				],
				[
					'<ul><li>1</li><li><br><ul><li>2</li><li>|<br></li></ul></li></ul>',
					'<ul><li>1</li><li><br><ul><li>2</li></ul></li><li>|<br></li></ul>'
				],
				[
					'<ul><li>1</li><li><ul><li>2</li><li>|<br></li><li>3</li></ul></li></ul>',
					'<ul><li>1</li><li><ul><li>2</li></ul></li><li>|<br><ul><li>3</li></ul></li></ul>'
				],
				[
					'<ul><li>1</li><li><ul><li>2</li></ul></li><li>|<br></li></ul>',
					'<ul><li>1</li><li><ul><li>2</li></ul></li></ul><p>|<br></p>'
				]
			].forEach(([source, result, options, mod]) => {
				describe('For source: ' + source, () => {
					it('Should be result: ' + result, () => {
						const editor = getJodit(options);
						editor.value = source;
						setCursorToChar(editor);
						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor,
							mod
						);
						replaceCursorToChar(editor);
						expect(editor.value).eq(result);
					});
				});
			});
		});
	});
});
