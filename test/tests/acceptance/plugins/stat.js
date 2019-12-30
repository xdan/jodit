describe('Stat plugin', function() {
	describe('After init and change', function() {
		it('Should show chars count and words count', function() {
			const editor = new Jodit(appendTestArea(), {
				language: 'en',
				showCharsCounter: true,
				showWordsCounter: true,
				observer: {
					timeout: 0
				}
			});

			editor.value = '<p>Simple text</p><p>Simple text</p>';
			const statusbar = editor.container.querySelector(
				'.jodit_statusbar'
			);

			expect(statusbar).to.be.not.equal(null);

			expect(
				statusbar.textContent.match(/Chars: 20/)
			).to.be.not.equal(null);

			expect(statusbar.textContent.match(/Words: 4/)).to.be.not.equal(
				null
			);
		});
		describe('Hide chars count', function() {
			it('Should show only words count', function() {
				const editor = new Jodit(appendTestArea(), {
					language: 'en',
					showCharsCounter: false,
					showWordsCounter: true,
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p>';
				const statusbar = editor.container.querySelector(
					'.jodit_statusbar'
				);

				expect(statusbar).to.be.not.equal(null);

				expect(
					statusbar.textContent.match(/Chars: 10/)
				).to.be.equal(null);
				expect(
					statusbar.textContent.match(/Words: 2/)
				).to.be.not.equal(null);
			});
		});

		describe('Hide words count', function() {
			it('Should show only chars count', function() {
				const editor = new Jodit(appendTestArea(), {
					language: 'en',
					showCharsCounter: true,
					showWordsCounter: false,
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p>';
				const statusbar = editor.container.querySelector(
					'.jodit_statusbar'
				);

				expect(statusbar).to.be.not.equal(null);

				expect(
					statusbar.textContent.match(/Chars: 10/)
				).to.be.not.equal(null);
				expect(statusbar.textContent.match(/Words: 2/)).to.be.equal(
					null
				);
			});
		});

		describe('Hide words and chars count', function() {
			it('Should hide status bar', function() {
				const editor = new Jodit(appendTestArea(), {
					language: 'en',
					showCharsCounter: false,
					showWordsCounter: false,
					showXPathInStatusbar: false,
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p>';
				const statusbar = editor.container.querySelector(
					'.jodit_statusbar'
				);

				expect(statusbar).to.be.not.equal(null);

				expect(
					statusbar.textContent.match(/Chars: 10/)
				).to.be.equal(null);
				expect(statusbar.textContent.match(/Words: 2/)).to.be.equal(
					null
				);
				expect(statusbar.offsetHeight).to.be.equal(0);
			});
		});
	});
});
