/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Clean html plugin', function () {
	describe('Exec bold for collapsed range and move cursor in another place', () => {
		it('Should remove empty STRONG element', async () => {
			const editor = getJodit({
				cleanHTML: {
					timeout: 0
				}
			});

			editor.value = '<p>test|test</p>';

			setCursorToChar(editor);

			editor.execCommand('bold');
			await editor.async.requestIdlePromise();
			replaceCursorToChar(editor);
			expect(editor.value).equals('<p>test<strong>|</strong>test</p>');

			setCursorToChar(editor);

			const range = editor.ed.createRange();
			range.setStart(editor.editor.firstChild.lastChild, 2);
			range.collapse(true);
			editor.s.selectRange(range);

			simulateEvent('mousedown', editor.editor);
			await editor.async.requestIdlePromise();

			expect(editor.value).equals('<p>testtest</p>');
		});
	});

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
						'<p>test <img src="" onclick="alert(111)" alt=""></p>',
						'<p>test <img src="" alt=""></p>'
					],
					[
						'<p>test <a src="" href="javascript:alert(111)">click</a></p>',
						'<p>test <a src="" href="http://javascript:alert(111)">click</a></p>'
					],
					[
						'<p>test <img src="" onerror="alert(111)" onclick="alert(111)" alt="§"></p>',
						// Autotest resplace onerror => _onerror just for test inside beforeSetNativeEditorValue
						'<p>test <img _onclick="alert(111)" _onerror="alert(111)" alt="§" src=""></p>',
						false,
						{
							cleanHTML: {
								removeOnError: false,
								removeEventAttributes: false
							}
						}
					],
					[
						'<p>test <a src="" href="javascript:alert(111)">click</a></p>',
						'<p>test <a src="" href="javascript:alert(111)">click</a></p>',
						false,
						{ cleanHTML: { safeJavaScriptLink: false } }
					]
				].forEach(function (test) {
					(test[4] ? describe.only : describe)(
						`For "${test[0]}"`,
						function () {
							it(`Should clean to "${sortAttributes(
								test[1]
							)}"`, function () {
								const editor = getJodit({
									disablePlugins: ['WrapNodes'],
									cleanHTML: { useIframeSandbox },
									...test[3]
								});

								editor.e.on(
									'beforeSetNativeEditorValue',
									data => {
										data.value = data.value.replace(
											/on(error|click)/g,
											'_on$1'
										);
										return false;
									}
								);

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
						}
					);
				});
			});
		});
	});

	describe('History', function () {
		it('Should not change history stack length', async () => {
			const editor = getJodit({
				cleanHTML: {
					timeout: 0
				}
			});

			editor.value = '<p>test <b>old</b> test</p>';
			expect(editor.history.length).eq(1);

			await editor.async.promise(resolve =>
				editor.e.on('finishedCleanHTMLWorker', resolve)
			);

			expect(editor.value).equals(
				'<p>test <strong>old</strong> test</p>'
			);

			expect(editor.history.length).eq(1);
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
		describe('Parameter', function () {
			[
				[
					'<p>te<strong>stop</strong>st</p><h1>pop</h1>',
					'<p>test</p>',
					{
						cleanHTML: {
							timeout: 0,
							allowTags: 'p'
						}
					}
				],
				[
					'<p>te<strong>stop</strong>s<span>t</span></p><h1>pop</h1>',
					'<p>te<strong>stop</strong>s</p>',
					{
						cleanHTML: {
							allowTags: {
								p: true,
								strong: true
							}
						}
					}
				],
				[
					'<p>some text<script async="" id="cr1" src="https://post.crowdriff.com/js/crowdriff.js" type="text/javascript"></script></p>',
					'<p>some text<script async="" id="cr1" src="https://post.crowdriff.com/js/crowdriff.js" type="text/javascript"></script></p>',
					{
						cleanHTML: {
							allowTags: {
								p: true,
								script: true
							}
						}
					}
				]
			].forEach(([html, result, options]) => {
				describe(`For ${html}`, () => {
					it('Should remove all tags not in allowTags options', async () => {
						const editor = getJodit(options);
						editor.value = html;
						await waitingForEvent(
							editor,
							'finishedCleanHTMLWorker'
						);
						expect(editor.value).equals(result);
					});
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

		describe('Time checking', () => {
			it('Should work fast', done => {
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
			}).timeout(2500);
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
					expect(cnt(editor.editor)).eq(3);
					done();
				});
			});
		});
	});

	describe('Security features', function () {
		describe('removeEventAttributes (default: true)', function () {
			it('Should remove onerror attribute', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value = '<p>test <img src="x" onerror="alert(1)"></p>';
				expect(editor.value).equals('<p>test <img src="x"></p>');
			});

			it('Should remove onclick attribute', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value = '<p><span onclick="alert(1)">text</span></p>';
				expect(editor.value).equals('<p><span>text</span></p>');
			});

			it('Should remove onload attribute', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value = '<p><img src="x" onload="alert(1)"></p>';
				expect(editor.value).equals('<p><img src="x"></p>');
			});

			it('Should remove onmouseover attribute', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value =
					'<p><a href="#" onmouseover="alert(1)">link</a></p>';
				expect(editor.value).equals('<p><a href="#">link</a></p>');
			});

			it('Should remove onfocus attribute', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value = '<p><a href="#" onfocus="alert(1)">link</a></p>';
				expect(editor.value).equals('<p><a href="#">link</a></p>');
			});

			it('Should remove multiple on* attributes at once', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value =
					'<p><img src="x" onerror="a(1)" onload="a(2)" onclick="a(3)"></p>';
				expect(editor.value).equals('<p><img src="x"></p>');
			});

			describe('When disabled', function () {
				it('Should keep on* attributes', function () {
					const editor = getJodit({
						disablePlugins: ['WrapNodes'],
						cleanHTML: {
							removeEventAttributes: false,
							removeOnError: false,
							useIframeSandbox: false
						}
					});
					editor.value =
						'<p><span onclick="alert(1)">text</span></p>';
					expect(editor.value).equals(
						'<p><span onclick="alert(1)">text</span></p>'
					);
				});
			});
		});

		describe('safeJavaScriptLink (default: true)', function () {
			it('Should neutralize javascript: URIs', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value = '<p><a href="javascript:alert(1)">click</a></p>';
				expect(
					editor.value.indexOf('javascript:alert') === -1 ||
						editor.value.indexOf('http://javascript:') !== -1
				).is.true;
			});
		});

		describe('denyTags (default: script,iframe,object,embed)', function () {
			['script', 'iframe', 'object', 'embed'].forEach(function (tag) {
				it('Should remove <' + tag + '> by default', function (done) {
					const editor = getJodit({
						cleanHTML: { timeout: 0 }
					});
					editor.value = '<p>text</p><' + tag + '></' + tag + '>';

					editor.e.on('finishedCleanHTMLWorker', () => {
						expect(editor.value.indexOf('<' + tag)).equals(-1);
						done();
					});
				});
			});
		});

		describe('safeLinksTarget (default: true)', function () {
			it('Should add rel="noopener noreferrer" to target="_blank" links', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value =
					'<p><a href="https://example.com" target="_blank">link</a></p>';
				const a = editor.editor.querySelector('a');
				expect(a.getAttribute('rel')).contains('noopener');
				expect(a.getAttribute('rel')).contains('noreferrer');
			});

			it('Should not touch links without target="_blank"', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value = '<p><a href="https://example.com">link</a></p>';
				const a = editor.editor.querySelector('a');
				expect(a.getAttribute('rel')).is.null;
			});

			it('Should preserve existing rel values', function () {
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: { useIframeSandbox: false }
				});
				editor.value =
					'<p><a href="https://example.com" target="_blank" rel="nofollow">link</a></p>';
				const a = editor.editor.querySelector('a');
				const rel = a.getAttribute('rel');
				expect(rel).contains('nofollow');
				expect(rel).contains('noopener');
				expect(rel).contains('noreferrer');
			});

			describe('When disabled', function () {
				it('Should not add rel attribute', function () {
					const editor = getJodit({
						disablePlugins: ['WrapNodes'],
						cleanHTML: {
							safeLinksTarget: false,
							useIframeSandbox: false
						}
					});
					editor.value =
						'<p><a href="https://example.com" target="_blank">link</a></p>';
					const a = editor.editor.querySelector('a');
					expect(a.getAttribute('rel')).is.null;
				});
			});
		});

		describe('allowedStyles', function () {
			it('Should strip disallowed CSS properties', function (done) {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0,
						allowedStyles: {
							'*': ['color', 'font-size']
						}
					}
				});
				editor.value =
					'<p style="color: red; background-image: url(evil); font-size: 14px">text</p>';
				editor.e.on('finishedCleanHTMLWorker', () => {
					const p = editor.editor.querySelector('p');
					const style = p.getAttribute('style') || '';
					expect(style).contains('color');
					expect(style).contains('font-size');
					expect(style).does.not.contain('background-image');
					done();
				});
			});

			it('Should support tag-specific rules', function (done) {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0,
						allowedStyles: {
							'*': ['color'],
							img: ['width', 'height']
						}
					}
				});
				editor.value = '<p style="color: red; width: 100px">text</p>';
				editor.e.on('finishedCleanHTMLWorker', () => {
					const p = editor.editor.querySelector('p');
					const style = p.getAttribute('style') || '';
					expect(style).contains('color');
					expect(style).does.not.contain('width');
					done();
				});
			});

			it('Should remove style attribute entirely if no properties remain', function (done) {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0,
						allowedStyles: {
							'*': ['color']
						}
					}
				});
				editor.value =
					'<p style="background-image: url(evil)">text</p>';
				editor.e.on('finishedCleanHTMLWorker', () => {
					const p = editor.editor.querySelector('p');
					expect(p.getAttribute('style')).is.null;
					done();
				});
			});

			describe('When false (default)', function () {
				it('Should not filter CSS properties', function (done) {
					const editor = getJodit({
						cleanHTML: {
							timeout: 0,
							allowedStyles: false
						}
					});
					editor.value =
						'<p style="color: red; background-image: url(test)">text</p>';
					editor.e.on('finishedCleanHTMLWorker', () => {
						const p = editor.editor.querySelector('p');
						const style = p.getAttribute('style') || '';
						expect(style).contains('color');
						expect(style).contains('background-image');
						done();
					});
				});
			});
		});

		describe('sanitizer hook', function () {
			it('Should call custom sanitizer before inserting value', function () {
				let called = false;
				const editor = getJodit({
					disablePlugins: ['WrapNodes'],
					cleanHTML: {
						sanitizer: function (html) {
							called = true;
							return html.replace(
								/<script[^>]*>.*?<\/script>/gi,
								''
							);
						},
						useIframeSandbox: false
					}
				});
				editor.value = '<p>text</p><script>alert(1)</script>';
				expect(called).is.true;
				expect(editor.value).does.not.contain('script');
			});
		});

		describe('sandboxIframesInContent (default: true)', function () {
			it('Should add sandbox attribute to iframes in content via walker', function (done) {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0,
						denyTags: 'script' // allow iframes for this test
					}
				});
				editor.value =
					'<p>text</p><iframe src="https://example.com"></iframe>';
				editor.e.on('finishedCleanHTMLWorker', () => {
					const iframe = editor.editor.querySelector('iframe');
					if (iframe) {
						expect(iframe.hasAttribute('sandbox')).is.true;
					}
					done();
				});
			});

			describe('When disabled', function () {
				it('Should not add sandbox attribute', function (done) {
					const editor = getJodit({
						cleanHTML: {
							timeout: 0,
							denyTags: 'script',
							sandboxIframesInContent: false
						}
					});
					editor.value =
						'<p>text</p><iframe src="https://example.com"></iframe>';
					editor.e.on('finishedCleanHTMLWorker', () => {
						const iframe = editor.editor.querySelector('iframe');
						if (iframe) {
							expect(iframe.hasAttribute('sandbox')).is.false;
						}
						done();
					});
				});
			});
		});

		describe('convertUnsafeEmbeds (default: [object, embed])', function () {
			it('Should convert <embed> to sandboxed <iframe> via walker', function (done) {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0,
						denyTags: 'script' // allow embed for this test
					}
				});
				editor.value =
					'<p>text</p><embed src="https://example.com/video.swf" width="400" height="300">';
				editor.e.on('finishedCleanHTMLWorker', () => {
					expect(
						editor.editor.querySelectorAll('embed').length
					).equals(0);
					const iframe = editor.editor.querySelector('iframe');
					if (iframe) {
						expect(iframe.getAttribute('src')).equals(
							'https://example.com/video.swf'
						);
						expect(iframe.hasAttribute('sandbox')).is.true;
					}
					done();
				});
			});

			describe('When disabled', function () {
				it('Should keep embed elements', function (done) {
					const editor = getJodit({
						cleanHTML: {
							timeout: 0,
							denyTags: 'script',
							convertUnsafeEmbeds: false
						}
					});
					editor.value =
						'<p>text</p><embed src="https://example.com/video.swf">';
					editor.e.on('finishedCleanHTMLWorker', () => {
						expect(
							editor.editor.querySelectorAll('embed').length
						).equals(1);
						done();
					});
				});
			});

			describe('Custom tag list', function () {
				it('Should convert only tags in the list', function (done) {
					const editor = getJodit({
						cleanHTML: {
							timeout: 0,
							denyTags: 'script',
							convertUnsafeEmbeds: Jodit.atom(['applet'])
						}
					});
					editor.value =
						'<p>text</p><embed src="https://example.com/a.swf"><applet data="https://example.com/b.jar"></applet>';
					editor.e.on('finishedCleanHTMLWorker', () => {
						expect(
							editor.editor.querySelectorAll('embed').length
						).equals(1);
						expect(
							editor.editor.querySelectorAll('applet').length
						).equals(0);
						const iframe = editor.editor.querySelector('iframe');
						if (iframe) {
							expect(iframe.getAttribute('src')).equals(
								'https://example.com/b.jar'
							);
							expect(iframe.hasAttribute('sandbox')).is.true;
						}
						done();
					});
				});
			});
		});
	});
});
