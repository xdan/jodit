/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Drag and drop element inside Editor', function () {
	const { position } = Jodit.modules.Helpers;

	['mousedown|mousemove|mouseup']
		.map(function (item) {
			return item.split('|');
		})
		.forEach(function (events) {
			const defaultValue =
				'<p style="height: 24px;">1111</p>' +
				'<p style="height: 24px;">2222</p>' +
				'<p><img style="width: 100px;height: 100px;" src="tests/artio.jpg" alt=""/></p>' +
				'<p style="height: 24px;">3333</p>' +
				'<p style="height: 24px;">4444</p>';
			describe(
				events[0] + ' and move image inside the editor',
				function () {
					it('Should ' + events[1] + ' dom element', function () {
						const editor = getJodit({ disablePlugins: ['sticky'] });
						editor.value = defaultValue;

						simulateEvent(
							events[0],
							editor.editor.getElementsByTagName('img')[0]
						);

						editor.editor.scrollIntoView();

						const box = position(
							editor.editor.querySelectorAll('p')[1],
							editor
						);

						simulateEvent(events[1], editor.editor, options => {
							options.clientX = box.left + 15;
							options.clientY = box.top + 5;
						});

						simulateEvent(events[2], editor.editor, options => {
							options.clientX = box.left + 15;
							options.clientY = box.top + 5;
						});

						const result =
							'<p style="height:24px">1111</p>' +
							'<p style="height:24px">22<img alt="" src="tests/artio.jpg" style="height:100px;width:100px">22</p>' +
							'<p style="height:24px">3333</p>' +
							'<p style="height:24px">4444</p>';

						try {
							expect(sortAttributes(editor.value)).equals(result);
						} catch (e) {
							drawElement(editor.editor);
							throw e;
						}
					});
				}
			);

			describe(events[1] + ' image inside anchor', function () {
				it('Should ' + events[1] + ' anchor with image', function () {
					const editor = getJodit({ disablePlugins: ['sticky'] });

					editor.value = defaultValue.replace(
						/(<img[^>]+>)/,
						'<a href="#test">$1</a>'
					);

					simulateEvent(
						events[0],
						editor.editor.getElementsByTagName('img')[0]
					);

					editor.editor.scrollIntoView();

					const box = position(
						editor.editor.querySelectorAll('p')[1],
						editor
					);

					simulateEvent(events[1], editor.editor, function (options) {
						options.clientX = box.left + 15;
						options.clientY = box.top + 5;
					});

					simulateEvent(events[2], editor.editor, function (options) {
						options.clientX = box.left + 15;
						options.clientY = box.top + 5;
					});

					expect(sortAttributes(editor.value)).equals(
						'<p style="height:24px">1111</p>' +
							'<p style="height:24px">22<a href="#test"><img alt="" src="tests/artio.jpg" style="height:100px;width:100px"></a>22</p>' +
							'<p style="height:24px">3333</p>' +
							'<p style="height:24px">4444</p>'
					);
				});
			});

			describe(events[1] + ' image inside table cell', function () {
				it('Should move only image', function () {
					const editor = getJodit({ disablePlugins: ['sticky'] });

					editor.value = `<table>
								<tbody>
									<tr>
										<td class='first'><img style="width: 100px" src="https://xdsoft.net/jodit/files/artio.jpg" alt=""></td>
										<td class='second'><br/></td>
									</tr>
								</tbody>
						</table>`;

					simulateEvent(
						events[0],
						editor.editor.getElementsByTagName('img')[0]
					);

					editor.editor.scrollIntoView();

					const box = position(
						editor.editor.querySelectorAll('td')[1],
						editor
					);

					simulateEvent(events[1], editor.editor, function (options) {
						options.clientX = box.left + 15;
						options.clientY = box.top + 5;
					});

					simulateEvent(events[2], editor.editor, function (options) {
						options.clientX = box.left + 15;
						options.clientY = box.top + 5;
					});

					expect(
						sortAttributes(editor.value.replace(/\t/g, ''))
					).equals(
						'<table>\n<tbody>\n<tr>\n<td class="first"></td>\n<td class="second"><img alt="" src="https://xdsoft.net/jodit/files/artio.jpg" style="width:100px"><br></td>\n</tr>\n</tbody>\n</table>'
					);
				});
			});

			describe('Programmatic drag via "startDragElement" event', function () {
				it('Should drag an element that is NOT in draggableTags when started from a handle', function () {
					const editor = getJodit({ disablePlugins: ['sticky'] });

					editor.value =
						'<p style="height: 24px;">1111</p>' +
						'<p style="height: 24px;">2222</p>' +
						'<pre style="height: 24px;">code</pre>' +
						'<p style="height: 24px;">3333</p>';

					const pre = editor.editor.querySelector('pre');

					// A handle/anchor would fire this on mousedown
					editor.e.fire('startDragElement', pre, {
						clientX: 0,
						clientY: 0
					});

					editor.editor.scrollIntoView();

					// Drop it onto the very first paragraph (move it to the top)
					const box = position(
						editor.editor.querySelectorAll('p')[0],
						editor
					);

					simulateEvent(events[1], editor.editor, options => {
						options.clientX = box.left + 5;
						options.clientY = box.top + 2;
					});

					simulateEvent(events[2], editor.editor, options => {
						options.clientX = box.left + 5;
						options.clientY = box.top + 2;
					});

					const value = editor.value;

					// The pre survived (moved, not copied) ...
					expect(value).contains('code');
					expect(editor.editor.querySelectorAll('pre').length).equals(
						1
					);
					// ... and was moved up: originally it sat after "2222",
					// now it sits before it.
					expect(value.indexOf('code')).is.below(
						value.indexOf('2222')
					);
				});

				it('Should work even when draggableTags is empty (auto-drag disabled)', function () {
					const editor = getJodit({
						disablePlugins: ['sticky'],
						draggableTags: []
					});

					editor.value =
						'<p style="height: 24px;">1111</p>' +
						'<p style="height: 24px;">2222</p>' +
						'<pre style="height: 24px;">code</pre>' +
						'<p style="height: 24px;">3333</p>';

					const pre = editor.editor.querySelector('pre');

					editor.e.fire('startDragElement', pre, {
						clientX: 0,
						clientY: 0
					});

					editor.editor.scrollIntoView();

					const box = position(
						editor.editor.querySelectorAll('p')[0],
						editor
					);

					simulateEvent(events[1], editor.editor, options => {
						options.clientX = box.left + 5;
						options.clientY = box.top + 2;
					});

					simulateEvent(events[2], editor.editor, options => {
						options.clientX = box.left + 5;
						options.clientY = box.top + 2;
					});

					const value = editor.value;

					expect(value).contains('code');
					expect(editor.editor.querySelectorAll('pre').length).equals(
						1
					);
					expect(value.indexOf('code')).is.below(
						value.indexOf('2222')
					);
				});

				it('Should ignore a null element', function () {
					const editor = getJodit({ disablePlugins: ['sticky'] });

					editor.value = '<p>1111</p>';

					expect(() =>
						editor.e.fire('startDragElement', null, {
							clientX: 0,
							clientY: 0
						})
					).not.to.throw();

					expect(editor.value).equals('<p>1111</p>');
				});

				it('Should not leave an empty filler text node next to a dropped non-editable block', function () {
					const editor = getJodit({ disablePlugins: ['sticky'] });

					editor.value =
						'<p style="height: 24px;">1111</p>' +
						'<p style="height: 24px;">2222</p>' +
						'<pre contenteditable="false" style="height: 24px;">code</pre>' +
						'<p style="height: 24px;">3333</p>';

					const pre = editor.editor.querySelector('pre');

					editor.e.fire('startDragElement', pre, {
						clientX: 0,
						clientY: 0
					});

					editor.editor.scrollIntoView();

					const box = position(
						editor.editor.querySelectorAll('p')[0],
						editor
					);

					simulateEvent(events[1], editor.editor, options => {
						options.clientX = box.left + 5;
						options.clientY = box.top + 2;
					});

					simulateEvent(events[2], editor.editor, options => {
						options.clientX = box.left + 5;
						options.clientY = box.top + 2;
					});

					const moved = editor.editor.querySelector('pre');
					const hasFiller = [
						moved.previousSibling,
						moved.nextSibling
					].some(
						node =>
							node &&
							node.nodeType === 3 &&
							node.nodeValue.replace(/\uFEFF/g, '').trim() === ''
					);

					expect(hasFiller).is.false;
				});
			});

			describe('Disable dragging', function () {
				it('Should not move image', function () {
					const editor = getJodit({
						disablePlugins: ['sticky'],
						draggableTags: []
					});

					const defaultValue =
						'<p>1111</p>' +
						'<p>2222</p>' +
						'<p><a href="#test"><img style="width: 100px" src="https://xdsoft.net/jodit/files/artio.jpg" alt=""></a></p>' +
						'<p>3333</p>' +
						'<p>4444</p>';

					editor.value = defaultValue;

					simulateEvent(
						events[0],
						editor.editor.getElementsByTagName('img')[0]
					);

					const box = position(
						editor.editor.querySelectorAll('p')[1],
						editor
					);

					simulateEvent(events[1], editor.editor, function (options) {
						options.clientX = box.left + 15;
						options.clientY = box.top + 5;
					});

					simulateEvent(events[2], editor.editor, function (options) {
						options.clientX = box.left + 15;
						options.clientY = box.top + 5;
					});

					expect(editor.value).equals(defaultValue);
				});
			});
		});
});
