/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('video plugin', () => {
	it('should have a video plugin', () => {
		expect(typeof Jodit.plugins.get('Video')).equals('function');
	});

	it('should have a video button', () => {
		const editor = getJodit();
		const button = getButton('video', editor);
		expect(button).to.be.not.null;
	});

	describe('Click on the video button', () => {
		let jodit, popup, button;

		beforeEach(() => {
			jodit = getJodit({
				video: {
					defaultWidth: 200,
					defaultHeight: 100
				}
			});
			button = getButton('video', jodit);
			simulateEvent('click', button);
			popup = getOpenedPopup(jodit);
			jodit.value = '<p>|<br></p>';
			setCursorToChar(jodit);
		});

		it('should open the video dialog', () => {
			expect(popup).to.be.not.null;
		});

		describe('Tabs', () => {
			it('should have 2 tabs', () => {
				expect(getButton('link', popup)).to.be.not.null;
				expect(getButton('source', popup)).to.be.not.null;
			});

			describe('Click on Link tab', () => {
				[
					[
						'bla://www.youtube.com/watch?v=9bZkp7q19f0&ab_channel=officialpsy',
						'<p><br></p>' // Because it is not valid url
					],
					[
						'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
						'<iframe allowfullscreen="" frameborder="0" height="100" src="https://www.youtube.com/embed/3JZ_D3ELwOQ" width="200"></iframe>'
					],
					[
						'https://www.vimeo.com/55302365',
						'<iframe allowfullscreen="" frameborder="0" height="100" src="https://player.vimeo.com/video/55302365" width="200"></iframe>'
					]
				].forEach(([url, result]) => {
					describe('Insert url:', () => {
						it('should add embed: ' + result, () => {
							simulateEvent('click', getButton('link', popup));
							const input = popup.querySelector('[ref="url"]');
							expect(input).to.be.not.null;
							input.value = url;

							clickButton('Insert', popup);
							expect(sortAttributes(jodit.value)).to.be.equal(
								result
							);
						});
					});
				});

				describe('Insert incorrect url', () => {
					it('should show validation error', () => {
						const input = popup.querySelector('[ref="url"]');
						expect(input).to.be.not.null;
						input.value =
							'bla://www.youtube.com/watch?v=9bZkp7q19f0&ab_channel=officialpsy';

						clickButton('Insert', popup);

						expect(popup.querySelector('.jodit-ui-input__error')).to
							.be.not.null;
						expect(
							input.parentElement.parentElement.classList.contains(
								'jodit-ui-input_has-error_true'
							)
						).is.true;
					});
				});
			});

			describe('Click on Embed tab', () => {
				[
					[
						'<iframe allowfullscreen="" frameborder="0" height="345" src="https://www.youtube.com/embed/3JZ_D3ELwOQ" width="400"></iframe>'
					],
					[
						'<iframe allowfullscreen="" frameborder="0" height="345" src="https://player.vimeo.com/video/55302365" width="400"></iframe>'
					]
				].forEach(([result]) => {
					describe('Insert embed:', () => {
						it('should add embed: ' + result, () => {
							simulateEvent('click', getButton('source', popup));
							const input = popup.querySelector('[ref="code"]');
							expect(input).to.be.not.null;
							input.value = result;
							clickButton(
								'Insert',
								popup.querySelector('.jodit-tab_active')
							);
							expect(sortAttributes(jodit.value)).to.be.equal(
								result
							);
						});
					});
				});
			});
		});
	});

	describe('Inserted embed survives clean-html (#1381)', () => {
		// `cleanHTML.denyTags` includes `iframe` by default, and its async
		// LazyWalker used to strip the freshly inserted YouTube/Vimeo player
		// ~300ms after insert ("briefly shown but then immediately removed").
		// A recognized video embed must now survive the walker and keep a
		// working (non-sandboxed) player.
		it('should keep the YouTube iframe after the clean-html walker runs', async () => {
			const jodit = getJodit({
				cleanHTML: { timeout: 0 },
				video: { defaultWidth: 200, defaultHeight: 100 }
			});
			jodit.value = '<p><br></p>';

			simulateEvent('click', getButton('video', jodit));
			const popup = getOpenedPopup(jodit);
			simulateEvent('click', getButton('link', popup));

			const input = popup.querySelector('[ref="url"]');
			input.value = 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ';
			clickButton('Insert', popup);

			// Wait for the async clean-html walker to sweep over the insert.
			await new Promise(resolve =>
				jodit.e.on('finishedCleanHTMLWorker', resolve)
			);

			const iframe = jodit.editor.querySelector('iframe');
			expect(iframe).is.not.null;
			expect(iframe.getAttribute('src')).equals(
				'https://www.youtube.com/embed/3JZ_D3ELwOQ'
			);
			// an empty sandbox="" would block scripts and stop playback
			expect(iframe.hasAttribute('sandbox')).is.false;
		});
	});

	describe('Upload tab (#1509)', () => {
		const url =
			'https://xdsoft.net/jodit/connector/index.php?action=fileUpload';

		function FileVideo() {
			return {
				name: 'movie.mp4',
				type: 'video/mp4'
			};
		}

		function openPopup(jodit) {
			simulateEvent('click', getButton('video', jodit));
			return getOpenedPopup(jodit);
		}

		function tabNames(popup) {
			return Array.from(
				popup.querySelectorAll('.jodit-tabs__button')
			).map(button => button.textContent.trim());
		}

		function dropVideo(jodit, popup) {
			// Choosing the file takes the selection out of the editor
			jodit.ow.getSelection().removeAllRanges();

			simulateEvent(
				'drop',
				popup.querySelector('.jodit-drag-and-drop__file-box'),
				data => {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [new FileVideo()]
						}
					});
				}
			);
		}

		it('should come first when the uploader has a url', () => {
			const popup = openPopup(getJodit({ uploader: { url } }));

			expect(tabNames(popup)).deep.equals(['Upload', 'Link', 'Code']);

			const input = popup.querySelector(
				'.jodit-drag-and-drop__file-box input[type=file]'
			);
			expect(input.getAttribute('accept')).equals('video/*');
		});

		it('should come first with a custom upload function', () => {
			const popup = openPopup(
				getJodit({
					uploader: { customUploadFunction: () => {} }
				})
			);

			expect(tabNames(popup)).deep.equals(['Upload', 'Link', 'Code']);
		});

		it('should not be shown without an uploader', () => {
			expect(tabNames(openPopup(getJodit()))).deep.equals([
				'Link',
				'Code'
			]);
		});

		it('should not be shown for base64 images alone', () => {
			const popup = openPopup(
				getJodit({ uploader: { insertImageAsBase64URI: true } })
			);

			expect(tabNames(popup)).deep.equals(['Link', 'Code']);
		});

		it('should not be shown when showTabInFileSelector is false', () => {
			const popup = openPopup(
				getJodit({ uploader: { url, showTabInFileSelector: false } })
			);

			expect(tabNames(popup)).deep.equals(['Link', 'Code']);
		});

		it('should insert an uploaded video with controls after the paragraph with the cursor', done => {
			const jodit = getJodit({
				uploader: { url },
				events: {
					afterInsertNode: () => {
						try {
							expect(sortAttributes(jodit.value)).equals(
								'<p>one</p><video controls="" src="https://xdsoft.net/jodit/files/movie.mp4"></video><p>two</p>'
							);
							done();
						} catch (e) {
							done(e);
						}
					}
				}
			});

			jodit.value = '<p>one|</p><p>two</p>';
			setCursorToChar(jodit);

			dropVideo(jodit, openPopup(jodit));
		});

		it('should let video.defaultHandlerSuccess insert it instead', done => {
			const jodit = getJodit({
				uploader: { url },
				video: {
					defaultHandlerSuccess(data) {
						try {
							expect(this).equals(jodit);
							expect(data.files).deep.equals(['movie.mp4']);

							this.s.insertHTML(
								`<video controls poster="poster.jpg" src="${data.baseurl}${data.files[0]}"></video>`
							);

							expect(sortAttributes(jodit.value)).equals(
								'<p>one</p><video controls="" poster="poster.jpg" src="https://xdsoft.net/jodit/files/movie.mp4"></video><p>two</p>'
							);
							done();
						} catch (e) {
							done(e);
						}
					}
				}
			});

			jodit.value = '<p>one|</p><p>two</p>';
			setCursorToChar(jodit);

			dropVideo(jodit, openPopup(jodit));
		});
	});

	describe('Own video url parser', () => {
		it('should parse url by own handler', () => {
			const jodit = getJodit({
				video: {
					defaultWidth: 210,
					defaultHeight: 110,
					parseUrlToVideoEmbed: (url, size) => {
						if (url.match(/sitename\.com/)) {
							return `<iframe allowfullscreen="" frameborder="0" height="${size.height}" src="${url}" width="${size.width}"></iframe>`;
						}
						return url;
					}
				}
			});
			const button = getButton('video', jodit);
			simulateEvent('click', button);
			const popup = getOpenedPopup(jodit);
			jodit.value = '<p>|<br></p>';
			setCursorToChar(jodit);

			const input = popup.querySelector('[ref="url"]');
			input.value = 'https://sitename.com/video.mp4';

			clickButton('Insert', popup);

			expect(sortAttributes(jodit.value)).to.be.equal(
				'<iframe allowfullscreen="" frameborder="0" height="110" src="https://sitename.com/video.mp4" width="210"></iframe>'
			);
		});
	});
});
