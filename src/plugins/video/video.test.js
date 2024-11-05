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
