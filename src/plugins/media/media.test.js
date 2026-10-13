/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Media plugin', () => {
	// https://github.com/xdan/jodit/issues/1530
	describe('mediaWrappers', () => {
		const frVideo = { tag: 'span', className: 'fr-video' };
		const mediaWrappers = {
			video: frVideo,
			audio: frVideo,
			iframe: frVideo
		};
		const wrapped = (inner, className = 'fr-video') =>
			`<span class="${className}" contenteditable="false" draggable="true">${inner}</span>`;
		const youtube =
			'<iframe allowfullscreen="" frameborder="0" height="100" src="https://www.youtube.com/embed/3JZ_D3ELwOQ" width="200"></iframe>';

		it('should keep a video in its wrapper instead of jodit-media', async () => {
			const editor = getJodit({ mediaWrappers });

			editor.value = '<p><video controls src="movie.mp4"></video></p>';
			await delay(100);

			expect(editor.editor.querySelector('jodit-media')).is.null;
			expect(sortAttributes(editor.value)).equals(
				`<p>${wrapped('<video controls="" src="movie.mp4"></video>')}</p>`
			);
		});

		it('should wrap each type in its own wrapper, and leave a type it has no wrapper for', async () => {
			const editor = getJodit({
				mediaWrappers: {
					video: frVideo,
					audio: { tag: 'span', className: 'fr-audio' }
				},
				mediaBlocks: ['video', 'audio', 'iframe']
			});

			editor.value =
				'<p><video controls src="movie.mp4"></video><audio controls src="song.mp3"></audio></p>' +
				`<p>${youtube}</p>`;
			await delay(100);

			expect(sortAttributes(editor.value)).equals(
				'<p>' +
					wrapped('<video controls="" src="movie.mp4"></video>') +
					wrapped(
						'<audio controls="" src="song.mp3"></audio>',
						'fr-audio'
					) +
					`</p><p>${youtube}</p>`
			);
		});

		it('should recognise a wrapper already in the content', async () => {
			const editor = getJodit({ mediaWrappers });
			const value =
				'<p><span class="fr-video fr-dvb" contenteditable="false" draggable="true"><video controls="" src="movie.mp4"></video></span></p>';

			editor.value = value;
			await delay(100);

			expect(editor.editor.querySelector('jodit-media')).is.null;
			expect(sortAttributes(editor.value)).equals(value);
		});

		it('should leave video in jodit-media without it', async () => {
			const editor = getJodit();

			editor.value = '<p><video controls src="movie.mp4"></video></p>';
			await delay(100);

			expect(editor.editor.querySelector('jodit-media video')).is.not
				.null;
			expect(sortAttributes(editor.value)).equals(
				'<p><video controls="" src="movie.mp4"></video></p>'
			);
		});

		describe('Media popup', () => {
			function clickAlign(editor, popup, label) {
				clickTrigger('left', popup);
				clickButton(label, getOpenedPopup(editor));
			}

			it('should align and delete the wrapper of a clicked video', async () => {
				const editor = getJodit({ mediaWrappers });

				editor.value =
					'<p>text</p><p><span class="fr-video"><video controls="" src="movie.mp4"></video></span></p>';
				await delay(100);

				const span = editor.editor.querySelector('span.fr-video');
				simulateEvent('click', span.querySelector('video'));
				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;

				clickAlign(editor, popup, 'Left');

				expect(span.style.float).equals('left');
				expect(span.querySelector('video').getAttribute('style')).is
					.null;

				clickButton('bin', popup);

				expect(editor.value).equals('<p>text</p><p></p>');
			});

			it('should act on the wrapper of a clicked iframe embed', async () => {
				const editor = getJodit({ mediaWrappers });

				editor.value =
					'<p><span class="fr-video"><iframe src="https://www.youtube.com/embed/3JZ_D3ELwOQ" width="560" height="315"></iframe></span></p>';
				await delay(100);

				const span = editor.editor.querySelector('span.fr-video');
				simulateEvent(
					'click',
					span.querySelector('[data-jodit_iframe_wrapper]')
				);

				clickAlign(editor, getOpenedPopup(editor), 'Right');

				expect(span.style.float).equals('right');
				expect(span.querySelector('iframe').getAttribute('style')).is
					.null;
			});
		});

		describe('Video popup', () => {
			function openVideoPopup(editor) {
				simulateEvent('click', getButton('video', editor));
				return getOpenedPopup(editor);
			}

			function insertLink(options) {
				const editor = getJodit({
					...options,
					video: { defaultWidth: 200, defaultHeight: 100 }
				});

				editor.value = '<p>|<br></p>';
				setCursorToChar(editor);

				const popup = openVideoPopup(editor);
				popup.querySelector('[ref="url"]').value =
					'https://www.youtube.com/watch?v=3JZ_D3ELwOQ';
				clickButton('Insert', popup);

				return sortAttributes(editor.value);
			}

			function insertCode(code) {
				const editor = getJodit({ mediaWrappers });

				editor.value = '<p>|<br></p>';
				setCursorToChar(editor);

				const popup = openVideoPopup(editor);
				simulateEvent('click', getButton('source', popup));
				popup.querySelector('[ref="code"]').value = code;
				clickButton('Insert', popup.querySelector('.jodit-tab_active'));

				return sortAttributes(editor.value);
			}

			it('should wrap an embed from the Link tab', () => {
				// An inline wrapper goes in the paragraph, as Froala's did
				expect(insertLink({ mediaWrappers })).equals(
					`<p>${wrapped(youtube)}</p>`
				);
			});

			it('should leave an embed unwrapped without a wrapper for iframes', () => {
				expect(
					insertLink({ mediaWrappers: { video: frVideo } })
				).equals(youtube);
			});

			it('should wrap embed code that is one media element', () => {
				expect(insertCode(youtube)).equals(
					`<p>${wrapped(youtube)}</p>`
				);
			});

			it('should leave other embed code unwrapped', () => {
				expect(insertCode(`<div>${youtube}</div>`)).equals(
					`<div>${youtube}</div>`
				);
			});

			it('should wrap an uploaded video', done => {
				const editor = getJodit({
					mediaWrappers,
					uploader: {
						url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
					},
					events: {
						afterInsertNode: () => {
							try {
								expect(sortAttributes(editor.value)).equals(
									'<p>one' +
										wrapped(
											'<video controls="" src="https://xdsoft.net/jodit/files/movie.mp4"></video>'
										) +
										'</p><p>two</p>'
								);
								done();
							} catch (e) {
								done(e);
							}
						}
					}
				});

				editor.value = '<p>one|</p><p>two</p>';
				setCursorToChar(editor);

				simulateEvent(
					'drop',
					openVideoPopup(editor).querySelector(
						'.jodit-drag-and-drop__file-box'
					),
					data => {
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [
									{ name: 'movie.mp4', type: 'video/mp4' }
								]
							}
						});
					}
				);
			});
		});
	});
});
