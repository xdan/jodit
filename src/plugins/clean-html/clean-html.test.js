/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Clean html plugin', function () {
	describe('Click remove format button', function () {
		[true, false].forEach(useIframeSandbox => {
			describe(`State useIframeSandbox: ${useIframeSandbox}`, () => {
				[
					[
						'start <span style="background-color: red; color: blue;">test test test|</span>',
						'start <span style="background-color: red; color: blue;">test test test</span> pop ',
						' pop '
					],

					[
						'|<a href="#test" style="background-color: red; color: blue;">start</a> <span style="background-color: red; color: blue;">test test test|</span>',
						'<a href="#test">start</a> test test test'
					],

					[
						'<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">|line 1</p>\n' +
							'<p><br></p>\n' +
							'<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">line 2</p>\n' +
							'<p><br></p>\n' +
							'<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">line 4|</p>\n',
						'<p dir="ltr">line 1</p>\n' +
							'<p><br></p>\n' +
							'<p dir="ltr">line 2</p>\n' +
							'<p><br></p>\n' +
							'<p dir="ltr">line 4</p>\n'
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
						'<p>asdasda<a href="https://xdan.ru/copysite/?lang=en">sdsa</a>d</p>\n'
					],
					[
						'<p>test <img src="" onerror="alert(111)" alt=""></p>',
						'<p>test <img src="" alt=""></p>'
					],
					[
						'<p>test <a src="" href="javascript:alert(111)">click</a></p>',
						'<p>test <a src="" href="http://javascript:alert(111)">click</a></p>'
					],
					[
						'<p>test <img src="" onerror="alert(111)" alt="§"></p>',
						'<p>test <img src="" _onerror="alert(111)" alt="§"></p>',
						false,
						{ cleanHTML: { removeOnError: false } }
					],
					[
						'<p>test <a src="" href="javascript:alert(111)">click</a></p>',
						'<p>test <a src="" href="javascript:alert(111)">click</a></p>',
						false,
						{ cleanHTML: { safeJavaScriptLink: false } }
					]
				].forEach(function (test) {
					describe(`For "${test[0]}"`, function () {
						it(`Should clean to "${sortAttributes(
							test[1]
						)}"`, function () {
							const editor = getJodit({
								disablePlugins: ['WrapNodes'],
								cleanHTML: { useIframeSandbox },
								...test[3]
							});

							editor.e.on('beforeSetNativeEditorValue', data => {
								data.value = data.value.replace(
									'onerror',
									'_onerror'
								);
								return false;
							});

							editor.value = test[0];

							if (!setCursorToChar(editor)) {
								const range = editor.s.createRange();
								range.selectNodeContents(editor.editor);
								editor.s.selectRange(range);
							}

							clickButton('eraser', editor);

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
		});
	});

	describe('History', function () {
		it('Should not change history stack length', function (done) {
			const editor = getJodit({
				cleanHTML: {
					timeout: 0
				}
			});

			editor.value = '<p>test <b>old</b> test</p>';
			expect(editor.history.length).eq(1);

			editor.e.on('finishedCleanHTMLWorker', () => {
				expect(editor.value).equals(
					'<p>test <strong>old</strong> test</p>'
				);

				expect(editor.history.length).eq(1);
				done();
			});
		});

		describe('Replace old tags', function () {
			it('Should replace old tags to new', function (done) {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0
					}
				});

				editor.value = 'test <b>old</b> test';

				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals(
						'<p>test <strong>old</strong> test</p>'
					);

					expect(editor.element.value).equals(
						'<p>test <strong>old</strong> test</p>'
					);
					done();
				});
			});
		});

		describe('Replace custom tags', function () {
			it('Should replace tags', function (done) {
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

				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals(
						'<div>test <strong>ol some d</strong> test</div>'
					);
					done();
				});
			});
		});

		describe('Disable', function () {
			it('Should not replace old tags to new', function (done) {
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

				simulateEvent('mousedown', editor.editor);

				editor.s.insertHTML(' some ');

				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals(
						'<p>test <b>ol some d</b> test</p>'
					);
					done();
				});
			});
		});
	});

	describe('Deny tags', function () {
		describe('Parameter like string', function () {
			it('Should remove all tags in denyTags options', function (done) {
				const editor = getJodit({
					cleanHTML: {
						denyTags: 'p'
					}
				});

				editor.value = '<p>te<strong>stop</strong>st</p><h1>pop</h1>';

				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals('<h1>pop</h1>');
					done();
				});
			});
		});
	});

	describe('Allow tags', function () {
		describe('Parameter like string', function () {
			it('Should remove all tags not in allowTags options', function (done) {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0,
						allowTags: 'p'
					}
				});

				editor.value = '<p>te<strong>stop</strong>st</p><h1>pop</h1>';
				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals('<p>test</p>');
					done();
				});
			});
		});

		describe('Parameter like hash', function () {
			it('Should remove all tags not in allowTags options', function (done) {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0,
						allowTags: {
							p: true
						}
					}
				});
				editor.value = '<p>te<strong>stop</strong>st</p><h1>pop</h1>';
				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals('<p>test</p>');
					done();
				});
			});
		});

		describe('Allow attributes', function () {
			it('Should remove all attributes from element and remove not in allowTags options', function (done) {
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

				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals(
						'<p style="color: red;">test</p>'
					);
					done();
				});
			});
		});

		describe('Time checking', function () {
			it('Should work fast', function (done) {
				unmockPromise();

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

				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals(
						'<p style="color: red;">test</p>'.repeat(500)
					);
					done();
				});
			}).timeout(1500);
		});
	});

	describe('Fullfill empty paragraph', function () {
		it('Should fill in empty paragraph', function (done) {
			const editor = getJodit({
				cleanHTML: {
					timeout: 0,
					fillEmptyParagraph: true
				}
			});
			editor.value = '<p></p><p></p><div></div>';
			editor.e.on('finishedCleanHTMLWorker', () => {
				expect(editor.value).equals(
					'<p><br></p><p><br></p><div><br></div>'
				);
				done();
			});
		});

		describe('Switch off fillEmptyParagraph option', function () {
			it('Should not fill in empty paragraph', function (done) {
				const editor = getJodit({
					cleanHTML: {
						fillEmptyParagraph: false
					}
				});
				editor.value = '<p></p><p></p><div></div>';
				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(editor.value).equals('<p></p><p></p><div></div>');
					done();
				});
			});
		});
	});

	describe('Remove extra BR', () => {
		it('should not remove necessary BR', function (done) {
			const editor = getJodit();

			editor.value =
				'<p><strong>Text<br> </strong>New line with text</p>\n<p>test test test test test </p>';

			simulateEvent('mousedown', editor.editor.querySelectorAll('p')[1]);
			simulateEvent('mouseup', editor.editor.querySelectorAll('p')[1]);
			simulateEvent('click', editor.editor.querySelectorAll('p')[1]);
			simulateEvent('focus', editor.editor.querySelectorAll('p')[1]);

			editor.e.on('finishedCleanHTMLWorker', () => {
				expect(editor.value).equals(
					'<p><strong>Text<br> </strong>New line with text</p>\n<p>test test test test test </p>'
				);
				done();
			});
		});
	});

	describe('Remove extra text nodes', () => {
		const cnt = elm =>
			elm.childNodes.length +
			Array.from(elm.childNodes).reduce((c, n) => c + cnt(n), 0);

		describe('Empty nodes', function () {
			it('should remove all empty text nodes', function (done) {
				const editor = getJodit();

				editor.value = '<p>test|</p>';
				setCursorToChar(editor);
				expect(cnt(editor.editor)).eq(2);

				editor.s.insertNode(editor.createInside.text(''), false, false);
				expect(cnt(editor.editor)).eq(3);

				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(cnt(editor.editor)).eq(2);
					done();
				});
			});

			describe('Disable rule `removeEmptyTextNode`', () => {
				it('should not remove all empty text nodes', function (done) {
					const editor = getJodit({
						cleanHTML: {
							disableCleanFilter: new Set(['removeEmptyTextNode'])
						}
					});

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);
					expect(cnt(editor.editor)).eq(2);

					editor.s.insertNode(
						editor.createInside.text(''),
						false,
						false
					);

					expect(cnt(editor.editor)).eq(3);

					editor.e.on('finishedCleanHTMLWorker', () => {
						expect(cnt(editor.editor)).eq(3);
						done();
					});
				});
			});
		});

		describe('Invisible nodes', function () {
			it('should remove all invisible text nodes', function (done) {
				const editor = getJodit();

				editor.value = '<p>test|</p>';
				setCursorToChar(editor);
				expect(cnt(editor.editor)).eq(2);

				editor.s.insertNode(
					editor.createInside.text(Jodit.constants.INVISIBLE_SPACE),
					false,
					false
				);
				expect(cnt(editor.editor)).eq(3);

				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(cnt(editor.editor)).eq(2);
					done();
				});
			});
		});
	});
});
