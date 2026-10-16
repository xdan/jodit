/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// https://github.com/xdan/jodit/issues/1530
describe('Video properties plugin', () => {
	beforeEach(() => {
		unmockPromise();
	});

	// One 32x18 frame
	const clip =
		'data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHWEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEiTbuMU6uEHFO7a1OsggHA7AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiECPQAAAAAAAFlSua9euAQAAAAAAAE7XgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA4g4EBI+ODhDuaygDgkLCBILqBEpqBAlWwhFW5gQFV7oEA7AEAAAAAAAACAAASVMNn0HNzzWPAi2PFiAAAAAAAAAABZ8iYRaOHRU5DT0RFUkSHi0xhdmMgbGlidnB4Z8ihRaOIRFVSQVRJT05Eh5MwMDowMDowMS4wMDAwMDAwMDAAH0O2dcTngQCjv4EAAIAQAwCdASogABIAAkcIhYWImYSIDIICdbokgH8AQWxuICwA/vEKj/+QTYEPAH/8ZU8ZU8ZU/4vsPupnMBxTu2uRu4+zgQC3iveBAfGCAXfwgQM=';
	const frVideo = { tag: 'span', className: 'fr-video' };
	const mediaWrappers = { video: frVideo, audio: frVideo, iframe: frVideo };
	const span = inner =>
		`<p><span class="fr-video" contenteditable="false" draggable="true">${inner}</span></p>`;
	const youtube = 'https://www.youtube.com/embed/3JZ_D3ELwOQ';
	const uploaderUrl =
		'https://xdsoft.net/jodit/connector/index.php?action=fileUpload';

	async function openDialog(value, options = {}) {
		const editor = getJodit({
			history: { timeout: 0 },
			mediaWrappers,
			...options
		});

		editor.value = value;

		const media = editor.editor.querySelector('video, audio, iframe');

		if (media.tagName === 'VIDEO' && media.readyState < 1) {
			await new Promise(resolve =>
				media.addEventListener('loadedmetadata', resolve, {
					once: true
				})
			);
		}

		// The media plugin wraps it after a delay
		await delay(100);

		simulateEvent(
			'click',
			media.closest('[data-jodit_iframe_wrapper]') ?? media
		);

		const popup = getOpenedPopup(editor);
		expect(popup).is.not.null;
		clickButton('pencil', popup);

		const dialog = getOpenedDialog(editor);
		expect(dialog).is.not.null;

		const form = dialog.querySelector(
			'.jodit-ui-video-properties-form'
		).component;

		return {
			editor,
			media,
			dialog,
			form,
			elm: name => form.getElm(name),
			value: () => sortAttributes(editor.value)
		};
	}

	function shown(element) {
		return Boolean(element.offsetParent);
	}

	function type(input, value) {
		input.value = value;
		simulateEvent('change', input);
	}

	function check(input, checked) {
		input.checked = checked;
		simulateEvent('change', input);
	}

	describe('Media popup', () => {
		it('should have Replace, Delete, Edit and Align buttons', async () => {
			const editor = getJodit({ mediaWrappers });

			editor.value = span(`<video controls="" src="${clip}"></video>`);
			await delay(100);

			simulateEvent('click', editor.editor.querySelector('video'));

			const popup = getOpenedPopup(editor);

			expect(getButton('replace', popup)).is.not.null;
			expect(getButton('bin', popup)).is.not.null;
			expect(getButton('pencil', popup)).is.not.null;
			expect(getButton('left', popup)).is.not.null;
		});

		it('should open the dialog for a video in jodit-media', async () => {
			const { dialog, elm } = await openDialog(
				`<p><video controls="" src="${clip}" style="width:320px"></video></p>`,
				{ mediaWrappers: {} }
			);

			expect(
				dialog.querySelector('.jodit-dialog__header').textContent
			).contains('Video properties');
			expect(elm('width').value).equals('320');
		});
	});

	describe('Video', () => {
		it('should read its size, poster and settings', async () => {
			const { elm } = await openDialog(
				span(
					`<video controls="" loop="" poster="tests/artio.jpg" src="${clip}" style="width:320px"></video>`
				)
			);

			expect(elm('width').value).equals('320');
			expect(elm('height').value).equals('180');
			expect(elm('poster').value).equals('tests/artio.jpg');
			expect(shown(elm('preview'))).is.true;
			expect(elm('preview').getAttribute('src')).equals(
				'tests/artio.jpg'
			);
			expect(elm('autoplay').checked).is.false;
			expect(elm('loop').checked).is.true;
			expect(elm('muted').checked).is.false;
			expect(elm('controls').checked).is.true;
		});

		it('should give it a CSS width alone when it has no height, keeping its ratio', async () => {
			const { dialog, elm, value } = await openDialog(
				span(
					`<video controls="" src="${clip}" style="width:320px"></video>`
				)
			);

			type(elm('width'), '400');
			expect(elm('height').value).equals('225');

			clickButton('Apply', dialog);

			expect(value()).equals(
				span(
					`<video controls="" src="${clip}" style="width:400px"></video>`
				)
			);
		});

		it('should keep the height of a video that has one in step with its width', async () => {
			const { dialog, elm, value } = await openDialog(
				span(
					`<video controls="" src="${clip}" style="height:180px;width:320px"></video>`
				)
			);

			type(elm('height'), '225');
			expect(elm('width').value).equals('400');

			clickButton('Apply', dialog);

			expect(value()).equals(
				span(
					`<video controls="" src="${clip}" style="height:225px;width:400px"></video>`
				)
			);
		});

		it('should give it both sizes when the ratio is unlocked', async () => {
			const { dialog, elm, value } = await openDialog(
				span(
					`<video controls="" src="${clip}" style="width:320px"></video>`
				)
			);

			simulateEvent('click', elm('lockSize'));
			type(elm('height'), '100');
			expect(elm('width').value).equals('320');

			clickButton('Apply', dialog);

			expect(value()).equals(
				span(
					`<video controls="" src="${clip}" style="height:100px;width:320px"></video>`
				)
			);
		});

		it('should leave the size alone when it is not changed', async () => {
			const { dialog, elm, value } = await openDialog(
				span(`<video controls="" src="${clip}"></video>`)
			);

			expect(elm('width').value).equals('32');
			check(elm('loop'), true);
			clickButton('Apply', dialog);

			expect(value()).equals(
				span(`<video controls="" loop="" src="${clip}"></video>`)
			);
		});

		it('should fit jodit-media to the new size', async () => {
			const { dialog, elm, media, value } = await openDialog(
				`<p><video controls="" src="${clip}" style="width:320px"></video></p>`,
				{ mediaWrappers: {} }
			);

			type(elm('width'), '400');
			clickButton('Apply', dialog);

			expect(value()).equals(
				`<p><video controls="" src="${clip}" style="width:400px"></video></p>`
			);
			expect(media.parentElement.tagName).equals('JODIT-MEDIA');
			expect(media.parentElement.offsetWidth).equals(400);
		});

		describe('Autoplay', () => {
			it('should mute it and let it play inline too', async () => {
				const { dialog, elm, value } = await openDialog(
					span(`<video controls="" src="${clip}"></video>`)
				);

				check(elm('autoplay'), true);

				expect(elm('muted').checked).is.true;
				expect(elm('muted').disabled).is.true;

				clickButton('Apply', dialog);

				expect(value()).equals(
					span(
						`<video autoplay="" controls="" muted="" playsinline="" src="${clip}"></video>`
					)
				);
			});

			it('should mute an autoplaying video that is not muted', async () => {
				// As Froala's Autoplay left it
				const { dialog, elm, value } = await openDialog(
					span(
						`<video autoplay="" controls="" playsinline="" src="${clip}"></video>`
					)
				);

				expect(elm('autoplay').checked).is.true;
				expect(elm('muted').checked).is.true;

				clickButton('Apply', dialog);

				expect(value()).equals(
					span(
						`<video autoplay="" controls="" muted="" playsinline="" src="${clip}"></video>`
					)
				);
			});

			it('should give back the Muted setting when it is turned off', async () => {
				const { dialog, elm, value } = await openDialog(
					span(
						`<video autoplay="" controls="" muted="" playsinline="" src="${clip}"></video>`
					)
				);

				check(elm('autoplay'), false);

				expect(elm('muted').disabled).is.false;
				expect(elm('muted').checked).is.false;

				clickButton('Apply', dialog);

				expect(value()).equals(
					span(
						`<video controls="" playsinline="" src="${clip}"></video>`
					)
				);
			});
		});

		describe('Controls', () => {
			it('should only be turned off while Autoplay is on', async () => {
				const { dialog, elm, value } = await openDialog(
					span(`<video controls="" src="${clip}"></video>`)
				);

				expect(elm('controls').checked).is.true;
				expect(elm('controls').disabled).is.true;

				check(elm('autoplay'), true);
				expect(elm('controls').disabled).is.false;

				check(elm('controls'), false);
				clickButton('Apply', dialog);

				expect(value()).equals(
					span(
						`<video autoplay="" muted="" playsinline="" src="${clip}"></video>`
					)
				);
			});

			it('should be given to a video that could not be played', async () => {
				const { dialog, elm, value } = await openDialog(
					span(`<video src="${clip}"></video>`)
				);

				expect(elm('controls').checked).is.true;

				clickButton('Apply', dialog);

				expect(value()).equals(
					span(`<video controls="" src="${clip}"></video>`)
				);
			});
		});

		it('should set Loop and Muted', async () => {
			const { dialog, elm, value } = await openDialog(
				span(`<video controls="" src="${clip}"></video>`)
			);

			check(elm('loop'), true);
			check(elm('muted'), true);
			clickButton('Apply', dialog);

			expect(value()).equals(
				span(
					`<video controls="" loop="" muted="" src="${clip}"></video>`
				)
			);
		});

		describe('Poster', () => {
			it('should show a new one, and no preview without one', async () => {
				const { dialog, elm, value } = await openDialog(
					span(`<video controls="" src="${clip}"></video>`)
				);

				expect(shown(elm('preview'))).is.false;

				type(elm('poster'), 'tests/artio.jpg');

				expect(shown(elm('preview'))).is.true;
				expect(elm('preview').getAttribute('src')).equals(
					'tests/artio.jpg'
				);

				clickButton('Apply', dialog);

				expect(value()).equals(
					span(
						`<video controls="" poster="tests/artio.jpg" src="${clip}"></video>`
					)
				);
			});

			it('should remove it', async () => {
				const { dialog, elm, value } = await openDialog(
					span(
						`<video controls="" poster="tests/artio.jpg" src="${clip}"></video>`
					)
				);

				simulateEvent('click', elm('removePoster'));

				expect(elm('poster').value).equals('');
				expect(shown(elm('preview'))).is.false;
				expect(shown(elm('removePoster'))).is.false;

				clickButton('Apply', dialog);

				expect(value()).equals(
					span(`<video controls="" src="${clip}"></video>`)
				);
			});

			it('should have no upload button without an uploader or file browser', async () => {
				const { elm } = await openDialog(
					span(`<video controls="" src="${clip}"></video>`)
				);

				expect(shown(elm('changePoster'))).is.false;
			});

			it('should upload a new one', async () => {
				const { dialog, elm } = await openDialog(
					span(`<video controls="" src="${clip}"></video>`),
					{ uploader: { url: uploaderUrl } }
				);

				expect(shown(elm('changePoster'))).is.true;
				simulateEvent('click', elm('changePoster'));

				const popup = getOpenedPopup(dialog.component);
				const box = popup.querySelector(
					'.jodit-drag-and-drop__file-box'
				);

				expect(
					box.querySelector('input').getAttribute('accept')
				).equals('image/*');

				simulateEvent('drop', box, data => {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [{ name: 'poster.jpg', type: 'image/jpeg' }]
						}
					});
				});

				await waitForCondition(() => elm('poster').value !== '');

				expect(elm('poster').value).equals(
					'https://xdsoft.net/jodit/files/poster.jpg'
				);
			});
		});

		it('should leave the video as it was on Cancel', async () => {
			const value = span(`<video controls="" src="${clip}"></video>`);
			const refs = await openDialog(value);

			check(refs.elm('autoplay'), true);
			type(refs.elm('width'), '400');
			clickButton('Cancel', refs.dialog);

			expect(refs.value()).equals(value);
		});

		it('should delete the video with its wrapper', async () => {
			const { dialog, value } = await openDialog(
				`<p>text</p>${span(`<video controls="" src="${clip}"></video>`)}`
			);

			clickButton('Delete', dialog);

			expect(value()).equals('<p>text</p><p></p>');
		});
	});

	describe('Embed', () => {
		const embed = (width, height) =>
			span(
				`<iframe height="${height}" src="${youtube}" width="${width}"></iframe>`
			);

		it('should have only its size', async () => {
			const { dialog, elm } = await openDialog(embed(560, 315));

			expect(
				dialog.querySelector('.jodit-dialog__header').textContent
			).contains('Video properties');
			expect(shown(elm('sizes'))).is.true;
			expect(shown(elm('preview'))).is.false;
			expect(shown(elm('editPoster'))).is.false;
			expect(shown(elm('playback'))).is.false;
			expect(elm('width').value).equals('560');
			expect(elm('height').value).equals('315');
		});

		it('should resize it keeping its ratio', async () => {
			const { dialog, elm, media, value } = await openDialog(
				embed(560, 315)
			);

			type(elm('width'), '400');
			expect(elm('height').value).equals('225');

			clickButton('Apply', dialog);

			expect(value()).equals(embed(400, 225));

			const wrapper = media.closest('[data-jodit_iframe_wrapper]');
			expect(wrapper.offsetWidth).equals(400);
			expect(wrapper.offsetHeight).equals(225);
		});
	});

	describe('Audio', () => {
		const sound = attributes =>
			span(`<audio ${attributes}src="${clip}"></audio>`);

		it('should have only its playback settings', async () => {
			const { dialog, elm } = await openDialog(sound('controls="" '));

			expect(
				dialog.querySelector('.jodit-dialog__header').textContent
			).contains('Audio properties');
			expect(shown(elm('playback'))).is.true;
			expect(shown(elm('sizes'))).is.false;
			expect(shown(elm('preview'))).is.false;
			expect(shown(elm('editPoster'))).is.false;
		});

		it('should mute it for Autoplay', async () => {
			const { dialog, elm, value } = await openDialog(
				sound('controls="" ')
			);

			check(elm('autoplay'), true);
			check(elm('loop'), true);
			clickButton('Apply', dialog);

			expect(value()).equals(
				sound('autoplay="" controls="" loop="" muted="" ')
			);
		});
	});

	describe('Replace', () => {
		const embed = (width, height, src = youtube) =>
			`<iframe allowfullscreen="" frameborder="0" height="${height}" src="${src}" width="${width}"></iframe>`;

		async function openReplace(value, options = {}) {
			const editor = getJodit({
				history: { timeout: 0 },
				mediaWrappers,
				...options
			});

			editor.value = value;
			await delay(100);

			const media = editor.editor.querySelector('video, audio, iframe');

			simulateEvent(
				'click',
				media.closest('[data-jodit_iframe_wrapper]') ?? media
			);
			clickButton('replace', getOpenedPopup(editor));

			return { editor, popup: getOpenedPopup(editor) };
		}

		function tabNames(popup) {
			return Array.from(
				popup.querySelectorAll('.jodit-tabs__button')
			).map(button => button.textContent.trim());
		}

		function insertLink(popup, url = youtube) {
			popup.querySelector('[ref="url"]').value = url;
			clickButton('Insert', popup);
		}

		function insertCode(popup, code) {
			simulateEvent('click', getButton('source', popup));
			popup.querySelector('[ref="code"]').value = code;
			clickButton('Insert', popup.querySelector('.jodit-tab_active'));
		}

		function dropVideo(popup) {
			simulateEvent(
				'drop',
				popup.querySelector('.jodit-drag-and-drop__file-box'),
				data => {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [{ name: 'movie.mp4', type: 'video/mp4' }]
						}
					});
				}
			);
		}

		it('should open the video popup tabs', async () => {
			const { popup } = await openReplace(
				span(`<video controls="" src="${clip}"></video>`),
				{ uploader: { url: uploaderUrl } }
			);

			expect(tabNames(popup)).deep.equals(['Upload', 'Link', 'Code']);
		});

		it('should put an embed in place of a video, keeping its classes and size', async () => {
			const { editor, popup } = await openReplace(
				`<p>one</p><p><span class="fr-video fr-dvi fr-fvl" contenteditable="false" draggable="true"><video controls="" src="${clip}" style="width:320px"></video></span>two</p>`
			);

			insertLink(popup);

			expect(sortAttributes(editor.value)).equals(
				`<p>one</p><p><span class="fr-video fr-dvi fr-fvl" contenteditable="false" draggable="true">${embed(320, 180)}</span>two</p>`
			);
		});

		it('should keep the size of an embed it replaces', async () => {
			const { editor, popup } = await openReplace(span(embed(560, 315)));

			insertCode(
				popup,
				embed(640, 360, 'https://player.vimeo.com/video/76979871')
			);

			expect(sortAttributes(editor.value)).equals(
				span(embed(560, 315, 'https://player.vimeo.com/video/76979871'))
			);
		});

		it('should give an uploaded video the settings of the one it replaces, with its own source and poster', async () => {
			const { editor, popup } = await openReplace(
				`<p><span class="fr-video fr-dvb fr-fvc" contenteditable="false" draggable="true"><video autoplay="" loop="" muted="" playsinline="" poster="old.jpg" src="${clip}" style="width:320px"></video></span></p>`,
				{
					uploader: { url: uploaderUrl },
					video: {
						defaultHandlerSuccess(data) {
							const { wrapMedia } = Jodit.modules.Helpers;

							this.s.insertNode(
								wrapMedia(
									this,
									this.createInside.element('video', {
										controls: '',
										poster: 'new.jpg',
										src: data.baseurl + data.files[0]
									})
								)
							);
						}
					}
				}
			);

			dropVideo(popup);
			await waitForCondition(() => editor.value.includes('movie.mp4'));

			expect(sortAttributes(editor.value)).equals(
				'<p><span class="fr-video fr-dvb fr-fvc" contenteditable="false" draggable="true"><video autoplay="" loop="" muted="" playsinline="" poster="new.jpg" src="https://xdsoft.net/jodit/files/movie.mp4" style="width:320px"></video></span></p>'
			);
		});

		it('should replace a video in jodit-media', async () => {
			const { editor, popup } = await openReplace(
				`<p>one</p><p><video controls="" src="${clip}" style="width:320px"></video></p>`,
				{ mediaWrappers: {} }
			);

			insertLink(popup);

			expect(sortAttributes(editor.value)).equals(
				`<p>one</p><p>${embed(320, 180)}</p>`
			);
		});

		it('should be undone in one step', async () => {
			const value = span(
				`<video controls="" src="${clip}" style="width:320px"></video>`
			);
			const { editor, popup } = await openReplace(value);

			insertLink(popup);
			expect(sortAttributes(editor.value)).does.not.equal(value);

			editor.execCommand('undo');

			expect(sortAttributes(editor.value)).equals(value);
		});
	});
});
