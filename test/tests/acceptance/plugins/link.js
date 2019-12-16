describe('Link plugin', function () {
	describe('Insert link', function () {
		describe('Insert simple link', function () {
			it('Should insert as simple link', function() {
				const editor = new Jodit(appendTestArea());
				simulatePaste(editor.editor, 'https://www.youtube.com');
				expect(editor.value).equal('<a href="https://www.youtube.com">https://www.youtube.com</a><br>');
			});

			describe('Disable', function () {
				describe('Disable any convert', function () {
					it('Should not change source link', function() {
						const editor = new Jodit(appendTestArea(), {
							link: {
								processPastedLink: false
							}
						});

						simulatePaste(editor.editor, 'https://www.youtube.com');
						expect(editor.value).equal('https://www.youtube.com');
					});
				});
			});
		});

		describe('Insert youtube link', function () {
			it('Should insert iframe with video', function() {
				const editor = new Jodit(appendTestArea());
				simulatePaste(editor.editor, 'https://www.youtube.com/watch?v=8Qn_spdM5Zg');
				expect(sortAttributes(editor.value)).equal(sortAttributes('<iframe width="400" height="345" src="https://www.youtube.com/embed/8Qn_spdM5Zg" frameborder="0" allowfullscreen=""></iframe>'));
			});

			describe('Disable', function () {
				describe('Disable any convert', function () {
					it('Should not change source link', function() {
						const editor = new Jodit(appendTestArea(), {
							link: {
								processPastedLink: false,
								processVideoLink: false
							}
						});

						simulatePaste(editor.editor, 'https://www.youtube.com/watch?v=8Qn_spdM5Zg');
						expect(editor.value).equal('https://www.youtube.com/watch?v=8Qn_spdM5Zg');
					});
				});

				describe('Disable video convert', function () {
					it('Should insert video link as simple link', function() {
						const editor = new Jodit(appendTestArea(), {
							link: {
								processVideoLink: false
							}
						});

						simulatePaste(editor.editor, 'https://www.youtube.com/watch?v=8Qn_spdM5Zg');
						expect(editor.value).equal('<a href="https://www.youtube.com/watch?v=8Qn_spdM5Zg">https://www.youtube.com/watch?v=8Qn_spdM5Zg</a><br>');
					});
				});
			});
		});
	});
});
