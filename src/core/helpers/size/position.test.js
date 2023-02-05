/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

('position' in window.skipTest ? describe.skip : describe)(
	'Test position/offset helpers',
	function () {
		let box,
			mainBox = getBox(),
			iframe = document.createElement('iframe');

		iframe.setAttribute(
			'style',
			'position: absolute; left: 0; top: 0; border: 0; width: 2000px; height: 3000px; background: purple; z-index: 1000000;'
		);

		let mainDoc;

		beforeEach(function () {
			mainBox.appendChild(iframe);
			mainDoc = iframe.contentWindow.document;

			const lines = [];

			Jodit.modules.Helpers.$$('style, link', document).forEach(function (
				elm
			) {
				const t = elm.tagName.toLowerCase();

				let content;

				try {
					if (t === 'link' && elm.sheet) {
						content = Array.from(elm.sheet.cssRules)
							.map(function (f) {
								return f.cssText;
							})
							.join('\n');
					} else {
						content = elm.innerHTML;
					}

					lines.push('<style>' + content + '</style>');
				} catch (e) {}
			});

			mainDoc.open();
			mainDoc.write(
				'<html><head>' +
					lines.join('') +
					'<style>textarea {display: none}strong {height:18px;display:block}</style></head><body><div></div><textarea></textarea></body></html>'
			);
			mainDoc.close();
		});

		function makeBox(doc) {
			doc = doc || mainDoc;
			const win = doc.defaultView;

			box = doc.createElement('div');
			box.id = 'uniq';
			box.setAttribute(
				'style',
				'height: 2000px; width: 100%;border: 20px solid red; padding: 20px; margin: 20px;'
			);

			const style = doc.createElement('style');
			style.innerHTML =
				'html, body {height: 5000px; width: 5000px;} #uniq, #uniq strong, #uniq div {line-height:18px;font-family: Arial;box-sizing:content-box; } #uniq strong {height:18px;display:block}';
			box.appendChild(style);

			doc.body.appendChild(box);
			win.scrollTo(0, box.offsetTop);

			const div = doc.createElement('div');

			for (let i = 0; i < 30; i += 1) {
				const s = doc.createElement('strong');
				// s.textContent = i;
				div.appendChild(s);
			}

			box.appendChild(div);
			div.setAttribute(
				'style',
				'position: relative; height: 300px; width: 100%;border: 20px solid red; padding: 20px 0 0 20px; margin: 20px 0 0 20px; overflow: hidden;'
			);

			const div2 = doc.createElement('div');
			div.appendChild(div2);
			div2.setAttribute(
				'style',
				'position: relative; min-height: 200px; width: 100%;border: 10px solid yellow; padding: 20px 0 0 20px; margin: 20px 0 0 20px;'
			);

			const div3 = doc.createElement('div');
			div2.appendChild(div3);
			div3.setAttribute(
				'style',
				'position: relative; min-height: 200px; width: 100%;border: 10px solid green; padding: 20px 0 0 20px; margin: 20px 0 0 20px;'
			);

			const div6 = doc.createElement('div');
			div3.appendChild(doc.createElement('strong'));
			div3.appendChild(doc.createElement('strong'));
			div3.appendChild(doc.createElement('strong'));
			div3.appendChild(div6);
			div6.setAttribute(
				'style',
				'width: 100%;border: 10px solid blue; padding: 20px 0 0 20px; margin: 20px 0 0 20px;'
			);
			div6.innerHTML = 'hi';

			div.scrollTo(0, 100000);

			return div6;
		}

		function fillBox(count, box) {
			for (let i = 0; i < count; i += 1) {
				const br = mainDoc.createElement('strong');
				box.appendChild(br);
			}
		}

		describe('Test position helper', function () {
			it('Should calculate correct screen position of element', function () {
				const span = makeBox();

				const pos = Jodit.modules.Helpers.position(span);

				createPoint(pos.left, pos.top, '#cdf', true);

				expect(Math.abs(pos.top - 254)).below(2);
				expect(Math.abs(pos.left - 240)).below(2);
			});

			describe('In the out of the screen', function () {
				it('Should show negative screen coordinates', function () {
					const span = makeBox();

					iframe.contentWindow.scrollTo(0, box.offsetTop + 1500);
					const pos = Jodit.modules.Helpers.position(span);

					createPoint(pos.left, pos.top, '#cdf', true);

					expect(pos.top).equals(-1246);
					expect(Math.abs(pos.left - 240)).below(2);
				});
			});

			describe('In iframe', function () {
				it('Should calculate correct screen position of element', function () {
					fillBox(100, mainDoc.querySelector('div'));

					const jodit = Jodit.make('textarea', {
						ownerWindow: iframe.contentWindow,
						ownerDocument: mainDoc,
						iframe: true,
						height: 10000
					});

					const span = makeBox(jodit.ed);

					jodit.ownerWindow.scrollTo(
						0,
						jodit.container.offsetTop - 100
					);

					const pos = Jodit.modules.Helpers.position(span, jodit);

					createPoint(pos.left, pos.top, '#cdf', true);

					expect(
						Math.abs(
							pos.top - jodit.toolbar.container.offsetHeight - 386
						)
					).below(2);
					expect(Math.abs(pos.left - 251)).below(2);
				});
			});
		});

		describe('Test offset helper', function () {
			it('Should calculate correct absolute position of element from top of document', function () {
				const span = makeBox(),
					jodit = Jodit.make('textarea', {
						ownerWindow: iframe.contentWindow,
						ownerDocument: mainDoc
					});

				jodit.editor.appendChild(box);
				box.firstChild.scrollTo(0, 100000);

				iframe.contentWindow.scrollTo(0, jodit.container.offsetTop);
				jodit.editor.scrollTo(0, span.offsetTop);

				const pos = Jodit.modules.Helpers.offset(span, jodit, jodit.ed);

				createPoint(pos.left, pos.top, '#cdf');

				expect(
					Math.abs(
						pos.top -
							box.offsetTop -
							iframe.contentWindow.scrollY -
							jodit.toolbar.container.offsetHeight -
							816
					)
				).below(3);
				expect(Math.abs(pos.left - 249)).below(3);
			});

			describe('In iframe', function () {
				it('Should calculate correct absolute position of element from top of document', function () {
					const jodit = Jodit.make('textarea', {
						ownerWindow: iframe.contentWindow,
						ownerDocument: mainDoc,
						iframe: true,
						height: 10000
					});

					const span = makeBox(jodit.ed);
					box.firstChild.scrollTo(0, 100000);

					iframe.contentWindow.scrollTo(0, jodit.container.offsetTop);
					jodit.editor.scrollTo(0, span.offsetTop);

					const pos = Jodit.modules.Helpers.offset(
						span,
						jodit,
						jodit.ed
					);

					expect(
						Math.abs(
							pos.top -
								box.offsetTop -
								jodit.ownerWindow.scrollY -
								jodit.ew.scrollY -
								jodit.toolbar.container.offsetHeight -
								256
						)
					).below(2);
					expect(Math.abs(pos.left - 251)).below(2);

					createPoint(pos.left, pos.top, '#cdf');
				});
			});
		});

		afterEach(function () {
			Jodit.modules.Dom.safeRemove(box);
			Jodit.modules.Dom.safeRemove(iframe);
		});
	}
);
