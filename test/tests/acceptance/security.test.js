/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Security test', () => {
	describe('XSS', () => {
		describe('From source', () => {
			describe('Set HTML with onerror JS', () => {
				it('Should remove this unsafe attribute', () => {
					const editor = getJodit();
					editor.value =
						'<math><iframe></iframe></math><img src onerror=alert(document.cookie)/>';

					expect(sortAttributes(editor.value)).eq(
						'<p><math><iframe></iframe></math><img src=""></p>'
					);
				});

				it('Should remove this unsafe attribute2', () => {
					const editor = getJodit();
					editor.value =
						'<html>' +
						'<body>' +
						'<meta name=Generator content="Microsoft Word 15">' +
						'<img src="" onerror="alert(123)" />' +
						'</body>' +
						'</html>';

					expect(sortAttributes(editor.value)).eq(
						'<p><meta content="Microsoft Word 15" name="Generator"><img src=""></p>'
					);
				});
			});

			describe('Create JS link', () => {
				it('Should change this unsafe attribute to safe', () => {
					const editor = getJodit();

					editor.value =
						'<p><a href="javascript:alert(\'yo\');"></a></p>';

					expect(sortAttributes(editor.value)).eq(
						'<p><a href="http://javascript:alert(\'yo\');"></a></p>'
					);
				});
			});

			// https://github.com/xdan/jodit/security/advisories/GHSA-j839-gqq4-gf9j
			describe('Obfuscated javascript: href (GHSA-j839-gqq4-gf9j)', () => {
				const ctrl = String.fromCharCode(1); // leading C0 control byte

				[
					['uppercase scheme', 'JAVASCRIPT:alert(1)'],
					['mixed case scheme', 'jaVaScRiPt:alert(1)'],
					['leading control byte', ctrl + 'javascript:alert(1)'],
					['tab inside scheme', 'java\tscript:alert(1)'],
					['newline inside scheme', 'java\nscript:alert(1)']
				].forEach(row => {
					const name = row[0];
					const payload = row[1];

					it('Should neutralize an href with ' + name, () => {
						const editor = getJodit();

						editor.value =
							'<p><a href="' + payload + '">link</a></p>';

						const box = document.createElement('div');
						box.innerHTML = editor.value;
						const href =
							box.querySelector('a').getAttribute('href') || '';

						// Neutralized: prefixed with the page protocol, so the
						// browser no longer resolves it to an executable scheme.
						expect(href.indexOf('http://')).eq(0);
					});
				});
			});

			describe('Executable iframe / dangerous URL content', () => {
				it('Should drop iframe srcdoc', () => {
					const editor = getJodit();
					editor.value =
						'<iframe srcdoc="<script>alert(1)</script>"></iframe>';

					expect(sortAttributes(editor.value)).eq(
						'<iframe></iframe>'
					);
				});

				it('Should drop a data:text/html iframe src', () => {
					const editor = getJodit();
					editor.value =
						'<iframe src="data:text/html,<script>alert(1)</script>"></iframe>';

					expect(sortAttributes(editor.value)).eq(
						'<iframe></iframe>'
					);
				});

				it('Should drop javascript: in object/embed/form sources', () => {
					const editor = getJodit();
					editor.value =
						'<object data="javascript:alert(1)"></object>' +
						'<embed src="javascript:alert(1)">' +
						'<form action="javascript:alert(1)"></form>';

					expect(sortAttributes(editor.value)).eq(
						'<object></object><p><embed></p><form></form>'
					);
				});

				it('Should keep a safe data:image and an empty iframe', () => {
					const editor = getJodit();
					editor.value =
						'<iframe></iframe>' +
						'<img src="data:image/png;base64,iVBORw0KGgo=">';

					expect(sortAttributes(editor.value)).eq(
						'<iframe></iframe><p><img src="data:image/png;base64,iVBORw0KGgo="></p>'
					);
				});
			});
		});

		describe('Insert ready Node', () => {
			describe('Set HTML with onerror JS', () => {
				it('Should remove this unsafe attribute', () => {
					const editor = getJodit();
					editor.value = '<p>|</p>';
					setCursorToChar(editor);
					const img = document.createElement('img');
					img.setAttribute('onerror', 'alert(document.cookie);');
					img.setAttribute('src', '');

					editor.s.insertImage(img.cloneNode(true));
					editor.s.insertNode(img);

					expect(sortAttributes(editor.value)).eq(
						'<p><img src=""><img src=""></p>'
					);
				});
			});

			describe('Insert unsafe link', () => {
				it('Should change this unsafe attribute to safe', () => {
					const editor = getJodit();
					editor.value = '<p>|</p>';
					setCursorToChar(editor);

					const a = document.createElement('a');
					a.setAttribute('href', 'javascript:alert(1111);');
					a.innerText = 'Unsafe link';
					editor.s.insertNode(a);

					expect(sortAttributes(editor.value)).eq(
						'<p><a href="http://javascript:alert(1111);">Unsafe link</a></p>'
					);
				});
			});
		});

		describe('Insert HTML Snippet', () => {
			describe('Snippet HTML with onerror JS', () => {
				it('Should remove this unsafe attribute', () => {
					const editor = getJodit();
					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					editor.s.insertHTML(
						'<img src="" onerror=alert(document.cookie)/>'
					);

					expect(sortAttributes(editor.value)).eq(
						'<p>test<img src=""></p>'
					);
				});
			});

			describe('Insert unsafe link', () => {
				it('Should change this unsafe attribute to safe', () => {
					const editor = getJodit();
					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					editor.s.insertHTML(
						'<a href="javascript:alert(1111)">link</a>'
					);

					expect(sortAttributes(editor.value)).eq(
						'<p>test<a href="http://javascript:alert(1111)">link</a></p>'
					);
				});
			});
		});

		describe('Disable', () => {
			describe('Set HTML with onerror JS', () => {
				it('Should not remove this unsafe attribute', async () => {
					window._stealCookie = cookie => {};
					const editor = getJodit({
						cleanHTML: {
							removeOnError: false,
							removeEventAttributes: false,
							denyTags: 'script'
						}
					});
					await editor.waitForReady();
					editor.value =
						'<math><iframe></iframe></math><img src onerror="window._stealCookie(document.cookie);"/>';

					expect(sortAttributes(editor.value)).eq(
						'<p><math><iframe></iframe></math><img onerror="window._stealCookie(document.cookie);" src=""></p>'
					);
					await editor.async.requestIdlePromise();
					delete window._stealCookie;
				});
			});

			describe('Create JS link', () => {
				it('Should change this unsafe attribute to safe', () => {
					const editor = getJodit({
						cleanHTML: {
							safeJavaScriptLink: false
						}
					});

					editor.value =
						'<p><a href="javascript:console.log(\'yo\');">test</a></p>';

					expect(sortAttributes(editor.value)).eq(
						'<p><a href="javascript:console.log(\'yo\');">test</a></p>'
					);
				});
			});
		});
	});
});
