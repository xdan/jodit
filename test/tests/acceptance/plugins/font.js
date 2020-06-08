describe('Font test', function() {
	describe('FontName', function() {
		describe('Open fontname list and select some element', function() {
			it('Should apply this font to current selection elements', function() {
				const editor = getJodit({
					toolbarAdaptive: false
				});

				editor.value = '<p>test</p>';
				editor.s.select(
					editor.editor.firstChild.firstChild
				);

				const openFontNameList = function() {
					clickTrigger('font', editor);

					const list = getOpenedPopup(editor);

					return Array.from(list.querySelectorAll('button')).slice(1);
				};

				expect(openFontNameList()).is.not.null;

				Array.from(openFontNameList()).map(function(font, index) {
					simulateEvent('click', 0, font);

					const fontFamily = font
						.querySelector('span[style]')
						.getAttribute('style')
						.replace(/"/g, "'");

					expect(sortAttributes(editor.value)).equals(
						sortAttributes(
							'<p><span style="' +
							fontFamily.replace('!important','') +
							'">test</span></p>'
						)
					);
				});
			});

			describe('Extends standart font list', function() {
				it('Should standart font list elements', function() {
					const editor = getJodit({
						toolbarAdaptive: false,
						controls: {
							font: {
								list: {
									"-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,Ubuntu,'Droid Sans',sans-serif":
										'OS System Font'
								}
							}
						}
					});

					editor.value = '<p>test</p>';
					editor.s.select(
						editor.editor.firstChild.firstChild
					);

					clickTrigger('font', editor);

					const list = getOpenedPopup(editor);

					expect(list).is.not.null;

					const buttons = list.querySelectorAll('button'),
						font = buttons[buttons.length - 1];
					simulateEvent('click', 0, font);

					expect(sortAttributes(editor.value)).equals(
						sortAttributes(
							"<p><span style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,Ubuntu,'Droid Sans',sans-serif\">test</span></p>"
						)
					);
				});
			});
		});
	});

	describe('Change font-family and fomt-size in same time', function () {
		it('should save font-size after font-family', function () {
			const editor = getJodit();

			clickTrigger('fontsize', editor);
			const list = getOpenedPopup(editor);

			clickButton('10', list);
			editor.s.insertHTML('test');

			expect(editor.value).equals('<span style="font-size: 10px;">test</span>');

			clickTrigger('font', editor);
			const list2 = getOpenedPopup(editor);

			clickButton('Impact_Charcoal_sans_serif', list2);
			editor.s.insertHTML('stop');

			expect(sortAttributes(editor.value)).equals('<span style="font-size:10px">test' +
				'<span style="font-family:Impact,Charcoal,sans-serif">stop</span></span>');
		});
	});
});
