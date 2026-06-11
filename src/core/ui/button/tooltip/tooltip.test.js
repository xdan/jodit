/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

('tooltip' in window.skipTest ? describe.skip : describe)(
	'Tooltip plugin tests',
	function () {
		const OPTIONS = {
			toolbarAdaptive: false,
			useNativeTooltip: false,
			buttons: ['bold', 'italic', 'underline', 'align'],
			showTooltipDelay: 50,
			language: 'en'
		};

		let timers;

		beforeEach(() => {
			timers = mockTimers();
			box.style.minHeight = '300px';
			box.style.padding = '50px';
		});

		afterEach(() => {
			timers.cleanup();
			box.style.minHeight = '';
			box.style.padding = '';
		});

		describe('Native tooltip', () => {
			it('Should have different tooltip for each language', () => {
				const editor = getJodit({
					...OPTIONS,
					useNativeTooltip: true
				});

				const title = getButton(
					'bold',
					editor
				).parentElement.getAttribute('title');
				expect(title).is.not.null;

				editor.destruct();

				const editor2 = getJodit({
					...OPTIONS,
					useNativeTooltip: true,
					language: 'de'
				});

				const title2 = getButton(
					'bold',
					editor2
				).parentElement.getAttribute('title');
				expect(title2).is.not.null;

				expect(title).does.not.equal(title2);
				expect(title).equals('Bold');
				expect(title2).equals('Fett');
			});
		});

		describe('Inline popup tooltips (#1141)', () => {
			it('Should show a tooltip for buttons inside the table cell inline popup', () => {
				const editor = getJodit({
					...OPTIONS,
					toolbarInline: true
				});

				editor.value =
					'<table><tbody><tr><td>cell</td></tr></tbody></table>';

				const td = editor.editor.querySelector('td');
				const pos = Jodit.modules.Helpers.position(td);

				simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
					Object.assign(e, {
						clientX: pos.left,
						clientY: pos.top
					});
				});

				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;

				const button = getButton('brushCell', popup);
				expect(button).is.not.null;

				simulateEvent('mouseenter', button.parentElement);
				timers.delay(100);

				const tooltip =
					editor.ownerDocument.querySelector('.jodit-ui-tooltip');
				expect(tooltip).is.not.null;
				expect(tooltip.textContent).equals('Background');
			});
		});

		describe('Jodit tooltip', () => {
			let editor, button1, button2, button3, button4;

			function getTooltipElm() {
				return editor.ownerDocument.querySelector('.jodit-ui-tooltip');
			}

			beforeEach(async () => {
				editor = getJodit(OPTIONS);

				button1 = getButton('bold', editor);
				button2 = getButton('italic', editor);
				button3 = getButton('underline', editor);
				button4 = getButton('justify', editor);

				await editor.async.requestIdlePromise();
			});

			describe('On enter button', () => {
				it('Should show tooltip', () => {
					simulateEvent('mouseenter', button1.parentElement);
					timers.delay(100);
					const tooltip = getTooltipElm();
					expect(tooltip).is.not.null;
					expect(tooltip.textContent).equals('Bold');
				});

				describe('On leave button', () => {
					it('Should hide tooltip', () => {
						simulateEvent('mouseenter', button1.parentElement);
						timers.delay(100);
						expect(getTooltipElm().textContent).equals('Bold');
						simulateEvent('mouseleave', button1.parentElement);
						timers.delay(100);
						const tooltip = getTooltipElm();
						expect(tooltip.textContent).equals('');
					});

					describe('Inside popup', () => {
						it('Should hide tooltip', async () => {
							clickTrigger('left', editor);
							const popup = getOpenedPopup(editor);
							simulateEvent(
								'mouseenter',
								getButton('center', popup).parentElement
							);
							timers.delay(100);
							expect(getTooltipElm().textContent).equals(
								'Align Center'
							);

							simulateEvent('mouseleave', popup.parentElement);
							timers.delay(100);

							const tooltip = getTooltipElm();
							expect(tooltip.textContent).equals('');
						});
					});
				});

				describe('On leave editor', () => {
					it('Should hide tooltip', () => {
						simulateEvent('mouseenter', button1.parentElement);
						timers.delay(100);
						expect(getTooltipElm().textContent).equals('Bold');
						simulateEvent('mouseleave', editor.container);
						timers.delay(100);
						expect(getTooltipElm().textContent).equals('');
					});
				});

				describe('On scroll page', () => {
					it('Should hide tooltip', () => {
						simulateEvent('mouseenter', button1.parentElement);
						timers.delay(100);
						expect(getTooltipElm().textContent).equals('Bold');

						simulateEvent('scroll', editor.ownerWindow);

						timers.delay(100);
						expect(getTooltipElm().textContent).equals('');
					});
				});

				describe('Inside popup', () => {
					it('Should show tooltip', () => {
						editor.value = '<p><a href="index.html">test</a></p>';
						simulateEvent(
							'click',
							editor.editor.querySelector('a')
						);

						const popup = getOpenedPopup(editor);
						expect(popup).is.not.null;
						const editLink = getButton('link', popup);
						expect(editLink).is.not.null;
						simulateEvent('mouseenter', editLink.parentElement);
						timers.delay(100);
						const tooltip = getTooltipElm();
						expect(tooltip).is.not.null;
						expect(tooltip.textContent).equals('Edit link');
					});
				});
			});

			it('Should have different tooltip for each language', () => {
				simulateEvent('mouseenter', button1.parentElement);
				timers.delay(100);
				let tooltip = getTooltipElm();
				expect(tooltip).is.not.null;

				const title = tooltip.textContent;

				editor.destruct();

				editor = getJodit({
					...OPTIONS,
					language: 'de'
				});

				Jodit.modules.Helpers.scrollIntoViewIfNeeded(
					editor.editor,
					editor.ed.body,
					editor.ed
				);

				button1 = getButton('bold', editor);
				expect(button1).is.not.null;
				simulateEvent('mouseenter', button1.parentElement); // toolbar-button
				timers.delay(100);
				tooltip = getTooltipElm();

				expect(tooltip).is.not.null;
				expect(tooltip.textContent).equals('Fett');
				simulateEvent('mouseleave', button1.parentElement);
				expect(tooltip.parentNode).is.not.null;

				expect(parseInt(tooltip.style.left, 10)).equals(-5000);

				expect(title).does.not.equal(tooltip.textContent);
				expect(title).equals('Bold');
				expect(tooltip.textContent).equals('');
			});

			describe('Show one tooltip button', () => {
				let tooltip, title;

				beforeEach(() => {
					simulateEvent('mouseenter', button1.parentElement);

					timers.delay(100);
					tooltip = getTooltipElm();

					expect(tooltip).is.not.null;

					title = tooltip.textContent;
					simulateEvent('mouseleave', button1.parentElement);
					expect(title).equals('Bold');
				});

				describe('Fast enter other button', () => {
					it('Should show different tooltip', () => {
						timers.delay(10);
						simulateEvent('mouseenter', button2.parentElement);
						timers.delay(100);
						tooltip = getTooltipElm();
						expect(tooltip).is.not.null;
						expect(tooltip.textContent).equals('Italic');
						expect(title).equals('Bold');
					});

					describe('Through other buttons', () => {
						it('Should show last tooltip', () => {
							timers.delay(10);
							simulateEvent('mouseleave', button1.parentElement);
							timers.delay(10);
							simulateEvent('mouseenter', button2.parentElement);
							timers.delay(10);
							simulateEvent('mouseleave', button2.parentElement);
							timers.delay(10);
							simulateEvent('mouseenter', button3.parentElement);
							timers.delay(100);
							tooltip = getTooltipElm();
							expect(tooltip.textContent).equals('Underline');
						});
					});

					describe('Fast leave', () => {
						it('Should not show any tooltip', () => {
							timers.delay(10);
							simulateEvent('mouseenter', button2.parentElement);
							timers.delay(10);
							simulateEvent('mouseleave', button2.parentElement);
							timers.delay(100);
							tooltip = getTooltipElm();
							expect(tooltip.textContent).equals('');
						});
					});
				});
			});

			describe('Viewport overflow', () => {
				it('Should show tooltip above button when near viewport bottom', () => {
					const container = editor.container;
					const savedCssText = container.style.cssText;

					// Push toolbar to the bottom of viewport
					container.style.cssText +=
						';position:fixed!important;bottom:0!important;left:0;right:0;min-height:0!important;max-height:50px!important;overflow:hidden';

					const btnPos =
						button1.parentElement.getBoundingClientRect();

					simulateEvent('mouseenter', button1.parentElement);
					timers.delay(100);

					const tooltip = getTooltipElm();
					expect(tooltip).is.not.null;
					expect(tooltip.textContent).equals('Bold');

					const tooltipRect = tooltip.getBoundingClientRect();

					// Tooltip should be above the button
					expect(tooltipRect.bottom).is.below(btnPos.top + 1);

					simulateEvent('mouseleave', button1.parentElement);
					timers.delay(100);

					container.style.cssText = savedCssText;
				});
			});

			describe('Transformed parent (#1350)', () => {
				it('Should center the tooltip on the button despite a transform on the parent', async () => {
					const wrapper = document.createElement('div');
					wrapper.style.cssText =
						'position: fixed; top: 0; left: 0; transform: translate(150px, 90px);';
					document.body.appendChild(wrapper);

					const area = document.createElement('textarea');
					wrapper.appendChild(area);

					const local = Jodit.make(area, OPTIONS);
					await local.async.requestIdlePromise();

					const btn = getButton('bold', local);
					expect(btn).is.not.null;

					simulateEvent('mouseenter', btn.parentElement);
					timers.delay(100);

					const tooltip = wrapper.querySelector('.jodit-ui-tooltip');
					expect(tooltip).is.not.null;
					expect(tooltip.textContent).equals('Bold');

					const btnRect = btn.parentElement.getBoundingClientRect();
					const tipRect = tooltip.getBoundingClientRect();

					const btnCenterX = btnRect.left + btnRect.width / 2;
					const tipCenterX = tipRect.left + tipRect.width / 2;

					// Without the fix the tooltip is shifted by the parent's
					// 150x90 transform; with it the tooltip stays centered just
					// below the button.
					expect(Math.abs(tipCenterX - btnCenterX)).is.below(3);
					expect(Math.abs(tipRect.top - btnRect.bottom)).is.below(14);

					simulateEvent('mouseleave', btn.parentElement);
					timers.delay(100);

					local.destruct();
					wrapper.remove();
				});
			});

			describe('Inside popup', () => {
				describe('Hiding popup', () => {
					it('should hide it tooltip', () => {
						editor.value = '<p><a href="index.html">test</a></p>';
						simulateEvent(
							'click',
							editor.editor.querySelector('a')
						);

						const popup = getOpenedPopup(editor);
						expect(popup).is.not.null;
						const editLink = getButton('link', popup);
						expect(editLink).is.not.null;
						simulateEvent('mouseenter', editLink.parentElement);

						timers.delay(100);
						const tooltip = getTooltipElm();
						expect(tooltip).is.not.null;
						expect(tooltip.textContent).equals('Edit link');

						simulateEvent('click', editor.editor);
						timers.delay(100);
						expect(getOpenedPopup(editor)).is.null;
						expect(getTooltipElm().textContent.trim()).equals('');
					});
				});
			});
		});
	}
);
