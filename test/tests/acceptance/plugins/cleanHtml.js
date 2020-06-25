/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Clean html plugin', function() {
	describe('Click remove format button', function() {
		describe('For range selection', function() {
			it('Should clear selected HTML fragment', function() {
				const editor = getJodit({
					disablePlugins: ['WrapTextNodes']
				});

				const button = getButton('eraser', editor);
				expect(button).is.not.null;

				[
					[
						'<p>as<strong>da</strong>sd</p>' +
							'<p>asd<strong>as</strong>d</p>' +
							'<p>a<strong>sdsad</strong>a</p>',
						function(range) {
							range.selectNodeContents(editor.editor);
						},
						'<p>asdasd</p>' + '<p>asdasd</p>' + '<p>asdsada</p>'
					],
					[
						'<p>four <strong style="background-color: red; color: blue;"><span style="align-content: baseline;">rust blog go</span>st</strong> elm</p>',
						function(range) {
							const elm = editor.editor.querySelector('span');
							range.setStart(elm.firstChild, 5);
							range.setEnd(elm.firstChild, 9);
						},
						'<p>four <strong style="background-color: red; color: blue;"><span style="align-content: baseline;">rust </span></strong>' +
							'blog' +
							'<strong style="background-color: red; color: blue;"><span style="align-content: baseline;"> go</span>st</strong> elm</p>'
					],
					[
						'<p>five <strong style="background-color: red; color: blue;">one two three</strong> elm</p>',
						function(range) {
							const elm = editor.editor.querySelector('strong');
							range.setStart(elm.firstChild, 4);
							range.setEnd(elm.firstChild, 7);
						},
						'<p>five <strong style="background-color: red; color: blue;">one </strong>' +
							'two' +
							'<strong style="background-color: red; color: blue;"> three</strong> elm</p>'
					],
					[
						'three <strong style="background-color: red; color: blue;">one two three</strong> elm',
						function(range) {
							const elm = editor.editor.querySelector('strong');
							range.setStart(elm.firstChild, 4);
							range.setEnd(elm.firstChild, 7);
						},
						'three <strong style="background-color: red; color: blue;">one </strong>' +
							'two' +
							'<strong style="background-color: red; color: blue;"> three</strong> elm'
					],
					[
						'one <span style="background-color: red; color: blue;">test test test</span> elm',
						'span',
						'one test test test elm'
					],
					[
						'two <strong style="background-color: red; color: blue;">test test test</strong> elm',
						'strong',
						'two test test test elm'
					]
				].forEach(function(test) {
					editor.value = test[0];

					const range = editor.s.createRange();

					if (typeof test[1] === 'string') {
						range.setStartBefore(
							editor.editor.querySelector(test[1])
						);
						range.setEndAfter(editor.editor.querySelector(test[1]));
					} else {
						test[1](range);
					}

					editor.s.selectRange(range);
					simulateEvent('click', 0, button);

					expect(editor.value).equals(test[2]);
				});
			});
		});

		describe('For collapsed selection', function() {
			it('Should move cursor outside from styled element', function() {
				const editor = getJodit({
					disablePlugins: ['WrapTextNodes']
				});

				[
					[
						'start <span style="background-color: red; color: blue;">test test test</span>',
						'span',
						'start <span style="background-color: red; color: blue;">test test test</span> pop '
					],

					[
						'start <strong>test test test</strong>',
						'strong',
						'start <strong>test test test</strong> pop '
					],

					[
						'start <strong><em>test test test</em></strong>',
						'em',
						'start <strong><em>test test test</em></strong> pop '
					]
				].forEach(function(test) {
					editor.value = test[0];

					const range = editor.s.createRange();
					range.selectNodeContents(
						editor.editor.querySelector(test[1])
					);
					range.collapse(false);

					editor.s.selectRange(range);

					const button = getButton('eraser', editor);

					simulateEvent('click', 0, button);

					editor.s.insertHTML(' pop ');

					expect(editor.value).equals(test[2]);
				});
			});
		});
	});

	describe('Replace old tags', function() {
		it('Should replace old tags to new', function() {
			const editor = getJodit({
				cleanHTML: {
					timeout: 0
				}
			});

			editor.value = 'test <b>old</b> test';

			const range = editor.s.createRange(true);
			range.setStart(editor.editor.querySelector('b').firstChild, 2);
			range.collapse(true);

			simulateEvent('mousedown', 0, editor.editor);

			editor.s.insertHTML(' some ');

			expect(editor.value).equals('<p>test <strong>ol some d</strong> test</p>');
		});

		describe('Replace custom tags', function() {
			it('Should replace tags', function() {
				const editor = getJodit({
					cleanHTML: {
						replaceOldTags: {
							p: 'div'
						},
						timeout: 0
					}
				});
				editor.value = '<p>test <b>old</b> test</p>';

				const range = editor.s.createRange(true);
				range.setStart(editor.editor.querySelector('b').firstChild, 2);
				range.collapse(true);

				simulateEvent('mousedown', 0, editor.editor);

				editor.s.insertHTML(' some ');

				expect(editor.value).equals(
					'<div>test <strong>ol some d</strong> test</div>'
				);
			});
		});

		describe('Disable', function() {
			it('Should not replace old tags to new', function() {
				const editor = getJodit({
					cleanHTML: {
						replaceOldTags: false,
						timeout: 0
					}
				});

				editor.value = 'test <b>old</b> test';

				const range = editor.s.createRange(true);
				range.setStart(editor.editor.querySelector('b').firstChild, 2);
				range.collapse(true);

				simulateEvent('mousedown', 0, editor.editor);

				editor.s.insertHTML(' some ');

				expect(editor.value).equals('<p>test <b>ol some d</b> test</p>');
			});
		});
	});

	describe('Deny tags', function() {
		describe('Parameter like string', function() {
			it('Should remove all tags in denyTags options', function() {
				const editor = getJodit({
					cleanHTML: {
						denyTags: 'p'
					}
				});
				editor.value = '<p>te<strong>stop</strong>st</p><h1>pop</h1>';
				expect(editor.value).equals('<h1>pop</h1>');
			});
		});
	});

	describe('Allow tags', function() {
		describe('Parameter like string', function() {
			it('Should remove all tags not in allowTags options', function() {
				const editor = getJodit({
					cleanHTML: {
						allowTags: 'p'
					}
				});
				editor.value = '<p>te<strong>stop</strong>st</p><h1>pop</h1>';
				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Parameter like hash', function() {
			it('Should remove all tags not in allowTags options', function() {
				const editor = getJodit({
					cleanHTML: {
						allowTags: {
							p: true
						}
					}
				});
				editor.value = '<p>te<strong>stop</strong>st</p><h1>pop</h1>';
				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Allow attributes', function() {
			it('Should remove all attributes from element and remove not in allowTags options', function() {
				const editor = getJodit({
					cleanHTML: {
						allowTags: {
							p: {
								style: true
							}
						}
					}
				});
				editor.value =
					'<p style="color: red;" data-id="111">te<strong>stop</strong>st</p><h1>pop</h1>';
				expect(editor.value).equals('<p style="color: red;">test</p>');
			});
		});

		describe('Time checking', function() {
			it('Should work fast', function() {
				const editor = getJodit({
					cleanHTML: {
						allowTags: {
							p: {
								style: true
							}
						}
					}
				});
				editor.value = '<p style="color: red;" data-id="111">te<strong>stop</strong>st</p><h1>pop</h1>'.repeat(
					500
				);
				expect(editor.value).equals(
					'<p style="color: red;">test</p>'.repeat(500)
				);
			}).timeout(1500);
		});
	});

	describe('Fullfill empty paragraph', function() {
		it('Should fill in empty paragraph', function() {
			const editor = getJodit({
				cleanHTML: {
					fillEmptyParagraph: true
				}
			});
			editor.value = '<p></p><p></p><div></div>';
			expect(editor.value).equals(
				'<p><br></p><p><br></p><div><br></div>'
			);
		});

		describe('Switch off fillEmptyParagraph option', function() {
			it('Should not fill in empty paragraph', function() {
				const editor = getJodit({
					cleanHTML: {
						fillEmptyParagraph: false
					}
				});
				editor.value = '<p></p><p></p><div></div>';
				expect(editor.value).equals('<p></p><p></p><div></div>');
			});
		});
	});
});
