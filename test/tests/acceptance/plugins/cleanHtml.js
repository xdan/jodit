/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Clean html plugin', function () {
	describe('Click remove format button', function () {
		describe('For range selection', function () {
			[
				[
					'start <span style="background-color: red; color: blue;">test test test|</span>',
					'start <span style="background-color: red; color: blue;">test test test</span> pop ',
					' pop '
				],

				[
					'start <strong>test test test|</strong>',
					'start <strong>test test test</strong> pop ',
					' pop '
				],

				[
					'start <strong><em>test test test|</em></strong>',
					'start <strong><em>test test test</em></strong> pop ',
					' pop '
				],

				[
					'start <strong><em>test test| test</em></strong>',
					'start <strong><em>test test</em></strong> pop <strong><em> test</em></strong>',
					' pop '
				],
				[
					'<p>as<strong>da</strong>sd</p>' +
						'<p>asd<strong>as</strong>d</p>' +
						'<p>a<strong>sdsad</strong>a</p>',

					'<p>asdasd</p><p>asdasd</p><p>asdsada</p>'
				],
				[
					'<p>fo|ur <strong style="background-color: red; color: blue;">about <span style="align-content: baseline;">rust blog| go</span>st</strong> elm</p>',

					'<p>four about rust blog<strong style="background-color: red; color: blue;"><span style="align-content: baseline;"> go</span>st</strong> elm</p>'
				],
				[
					'<p>four <strong style="background-color: red; color: blue;">ab|out <span style="align-content: baseline;">rust blog| go</span>st</strong> elm</p>',

					'<p>four <strong style="background-color: red; color: blue;">ab</strong>' +
						'out rust blog' +
						'<strong style="background-color:red;color:blue"><span style="align-content:baseline"> go</span>st</strong> elm</p>'
				],
				[
					'<p>four <strong style="background-color: red; color: blue;"><span style="align-content: baseline;">rust |blog| go</span>st</strong> elm</p>',

					'<p>four <strong style="background-color: red; color: blue;"><span style="align-content: baseline;">rust </span></strong>' +
						'blog' +
						'<strong style="background-color:red;color:blue"><span style="align-content:baseline"> go</span>st</strong> elm</p>'
				],
				[
					'<p>f|ive <strong style="background-color: red; color: blue;">one two three</strong> elm</p>' +
						'<p>five <strong style="background-color: red; color: blue;">one| d</strong>two</p>',

					'<p>five one two three elm</p><p>five one<strong style="background-color: red; color: blue;"> d</strong>two</p>'
				],
				[
					'<p>f|ive <strong style="background-color: red; color: blue;">one two three</strong> elm</p>' +
						'<p>five <strong style="background-color: red; color: blue;">one|</strong>two</p>',

					'<p>five one two three elm</p>' + '<p>five onetwo</p>'
				],
				[
					'<p>five <strong style="background-color: red; color: blue;">one |two three</strong> elm</p>' +
						'<p>five <strong style="background-color: red; color: blue;">one|</strong>two</p>',

					'<p>five <strong style="background-color: red; color: blue;">one </strong>two three elm</p>' +
						'<p>five onetwo</p>'
				],
				[
					'<p>five <strong style="background-color: red; color: blue;">one |two| three</strong> elm</p>',

					'<p>five <strong style="background-color: red; color: blue;">one </strong>' +
						'two' +
						'<strong style="background-color: red; color: blue;"> three</strong> elm</p>'
				],
				[
					'one <span style="background-color: red; color: blue;">|test test test|</span> elm',
					'one test test test elm'
				],
				[
					'<p style="color: red">|one <span style="background-color: red; color: blue;">test test test</span> elm|</p>',
					'<p>one test test test elm</p>'
				],
				[
					'<p style="color: red">one |<span style="background-color: red; color: blue;">test test test</span> elm|</p>',
					'<p style="color:red">one test test test elm</p>'
				],
				[
					'two |<strong style="background-color: red; color: blue;">test test test</strong>| elm',
					'two test test test elm'
				],
				[
					'<p><strong><em><u>as<span style="color: rgb(26, 188, 156);">da</span>s<span style="font-family: Impact,Charcoal,sans-serif;">da</span></u></em></strong><a href="https://xdan.ru/copysite/?lang=en"><strong><em><u><span style="font-family: Impact,Charcoal,sans-serif;">sds</span>a</u></em></strong></a><strong><em><u><s>d</s></u></em></strong></p>\n',
					'<p>asdasdasdsad</p>\n'
				]
			].forEach(function (test) {
				describe(`For "${test[0]}"`, function () {
					it(`Should clean to "${sortAttributes(
						test[1]
					)}"`, function () {
						const editor = getJodit({
							disablePlugins: ['WrapTextNodes']
						});

						const button = getButton('eraser', editor);
						editor.value = test[0];

						if (!setCursorToChar(editor)) {
							const range = editor.s.createRange();
							range.selectNodeContents(editor.editor);
							editor.s.selectRange(range);
						}

						simulateEvent('click', button);

						if (test[2]) {
							editor.s.insertHTML(test[2]);
						}

						expect(sortAttributes(editor.value)).equals(
							sortAttributes(test[1])
						);
					});
				});
			});
		});

		// describe('For collapsed selection', function () {
		// 	it('Should move cursor outside from styled element', function () {
		// 		const editor = getJodit({
		// 			disablePlugins: ['WrapTextNodes']
		// 		});
		//
		// 		[
		//
		// 		].forEach(function (test) {
		// 			editor.value = test[0];
		//
		// 			const range = editor.s.createRange();
		// 			range.selectNodeContents(
		// 				editor.editor.querySelector(test[1])
		// 			);
		// 			range.collapse(false);
		//
		// 			editor.s.selectRange(range);
		//
		// 			const button = getButton('eraser', editor);
		//
		// 			simulateEvent('click', 0, button);
		//
		// 			editor.s.insertHTML(' pop ');
		//
		// 			expect(editor.value).equals(test[2]);
		// 		});
		// 	});
		// });
	});

	describe('Replace old tags', function () {
		it('Should replace old tags to new', function () {
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

			expect(editor.value).equals(
				'<p>test <strong>ol some d</strong> test</p>'
			);
		});

		describe('Replace custom tags', function () {
			it('Should replace tags', function () {
				const editor = getJodit({
					cleanHTML: {
						replaceOldTags: {
							p: 'div'
						},
						timeout: 0
					}
				});
				editor.s.focus();
				editor.value = '<p>test <b>ol|d</b> test</p>';
				setCursorToChar(editor);

				simulateEvent('mousedown', editor.editor);

				editor.s.insertHTML(' some ');

				expect(editor.value).equals(
					'<div>test <strong>ol some d</strong> test</div>'
				);
			});
		});

		describe('Disable', function () {
			it('Should not replace old tags to new', function () {
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

				expect(editor.value).equals(
					'<p>test <b>ol some d</b> test</p>'
				);
			});
		});
	});

	describe('Deny tags', function () {
		describe('Parameter like string', function () {
			it('Should remove all tags in denyTags options', function () {
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

	describe('Allow tags', function () {
		describe('Parameter like string', function () {
			it('Should remove all tags not in allowTags options', function () {
				const editor = getJodit({
					cleanHTML: {
						allowTags: 'p'
					}
				});
				editor.value = '<p>te<strong>stop</strong>st</p><h1>pop</h1>';
				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Parameter like hash', function () {
			it('Should remove all tags not in allowTags options', function () {
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

		describe('Allow attributes', function () {
			it('Should remove all attributes from element and remove not in allowTags options', function () {
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

		describe('Time checking', function () {
			it('Should work fast', function () {
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
					'<p style="color: red;" data-id="111">te<strong>stop</strong>st</p><h1>pop</h1>'.repeat(
						500
					);
				expect(editor.value).equals(
					'<p style="color: red;">test</p>'.repeat(500)
				);
			}).timeout(1500);
		});
	});

	describe('Fullfill empty paragraph', function () {
		it('Should fill in empty paragraph', function () {
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

		describe('Switch off fillEmptyParagraph option', function () {
			it('Should not fill in empty paragraph', function () {
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
