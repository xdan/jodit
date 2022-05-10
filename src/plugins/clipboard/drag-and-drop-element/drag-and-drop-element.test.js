/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Drag and drop element inside Editor', function () {
	const { position } = Jodit.modules.Helpers;

	['mousedown|mousemove|mouseup']
		.map(function (item) {
			return item.split('|');
		})
		.forEach(function (events) {
			describe(
				events[0] + ' and move image inside the editor',
				function () {
					it('Should ' + events[1] + ' dom element', function () {
						const editor = getJodit();
						editor.value =
							'<p>1111</p>' +
							'<p>2222</p>' +
							'<img style="width: 100px" src="https://xdsoft.net/jodit/files/artio.jpg" alt="">' +
							'<p>3333</p>' +
							'<p>4444</p>';

						simulateEvent(
							events[0],
							editor.editor.getElementsByTagName('img')[0]
						);

						window.scrollTo(0, 1000000);

						const box = position(
							editor.editor.querySelectorAll('p')[1],
							editor
						);

						simulateEvent(
							events[1],
							editor.editor,
							function (options) {
								options.clientX = box.left + 15;
								options.clientY = box.top + 5;
							}
						);

						simulateEvent(
							events[2],
							editor.editor,
							function (options) {
								options.clientX = box.left + 15;
								options.clientY = box.top + 5;
							}
						);

						const result =
							'<p>1111</p>' +
							'<p>22<img alt="" src="https://xdsoft.net/jodit/files/artio.jpg" style="width:100px">22</p>' +
							'<p>3333</p>' +
							'<p>4444</p>';

						expect(
							sortAttributes(editor.value).replace(/2+/g, '2')
						).equals(result.replace(/2+/g, '2'));
					});
				}
			);

			describe(events[1] + ' image inside anchor', function () {
				it('Should ' + events[1] + ' anchor with image', function () {
					const editor = getJodit();

					editor.value =
						'<p>1111</p>' +
						'<p>2222</p>' +
						'<a href="#test"><img style="width: 100px" src="https://xdsoft.net/jodit/files/artio.jpg" alt=""></a>' +
						'<p>3333</p>' +
						'<p>4444</p>';

					simulateEvent(
						events[0],
						editor.editor.getElementsByTagName('img')[0]
					);

					window.scrollTo(0, 1000000);

					const box = position(
						editor.editor.querySelectorAll('p')[1],
						editor
					);

					simulateEvent(events[1], editor.editor, function (options) {
						options.clientX = box.left + 15;
						options.clientY = box.top + 5;
					});

					simulateEvent(events[2], editor.editor, function (options) {
						options.clientX = box.left + 20;
						options.clientY = box.top + 5;
					});

					expect(editor.value.replace(/2+/g, '2')).equals(
						'<p>1111</p><p>22<a href="#test"><img style="width: 100px" src="https://xdsoft.net/jodit/files/artio.jpg" alt=""></a>22</p><p>3333</p><p>4444</p>'.replace(
							/2+/g,
							'2'
						)
					);
				});
			});

			describe(events[1] + ' image inside table cell', function () {
				it('Should move only image', function () {
					const editor = getJodit();

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

					window.scrollTo(0, 1000000);

					const box = position(
						editor.editor.querySelectorAll('td')[1],
						editor
					);

					simulateEvent(events[1], editor.editor, function (options) {
						options.clientX = box.left + 15;
						options.clientY = box.top + 5;
					});

					simulateEvent(events[2], editor.editor, function (options) {
						options.clientX = box.left + 20;
						options.clientY = box.top + 5;
					});

					expect(
						sortAttributes(editor.value.replace(/\t/g, ''))
					).equals(
						'<table>\n<tbody>\n<tr>\n<td class="first"></td>\n<td class="second"><img alt="" src="https://xdsoft.net/jodit/files/artio.jpg" style="width:100px"><br></td>\n</tr>\n</tbody>\n</table>'
					);
				});
			});

			describe('Disable dragging', function () {
				it('Should not move image', function () {
					const editor = getJodit({
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
						options.clientX = box.left + 20;
						options.clientY = box.top + 5;
					});

					expect(editor.value).equals(defaultValue);
				});
			});
		});
});
