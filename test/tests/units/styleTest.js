/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Test Style module', function () {
	let editor;

	const Style = Jodit.ns.Style;

	beforeEach(function () {
		editor = getJodit();
		editor.value = '<p>test</p>';
		editor.execCommand('selectall');
	});

	describe('Apply style', function () {
		it('Should apply style to element', function () {
			const style = new Style({
				style: {
					color: 'red',
					backgroundColor: 'yellow'
				}
			});

			style.apply(editor);

			expect(sortAttributes(editor.value)).equals(
				'<p><span style="background-color:yellow;color:red">test</span></p>'
			);
		});

		describe('For STYLE element', function () {
			it('Should not apply styles to STYLE element', function () {
				editor.value =
					'<p>test</p><style>.a {color: red}</style><p>stop</p>';
				editor.execCommand('selectall');

				const style = new Style({
					style: {
						fontFamily: 'Helvetica,sans-serif'
					}
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals(
					'<p><span style="font-family:Helvetica,sans-serif">test</span></p>' +
						'<style>.a {color: red}</style>' +
						'<p><span style="font-family:Helvetica,sans-serif">stop</span></p>'
				);
			});
		});

		describe('For all content', function () {
			it('Should apply style to all elements', function () {
				editor.value = '<p><br></p><p>test</p>';
				editor.execCommand('selectall');

				const style = new Style({
					style: {
						color: 'yellow'
					}
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals(
					'<p><span style="color:yellow"><br></span></p>' +
						'<p><span style="color:yellow">test</span></p>'
				);
			});

			describe('Select all content by edges', function () {
				it('Should apply style to all elements', function () {
					editor.value = '<p><br></p><p>test</p>';
					const range = editor.s.createRange(true);

					range.setStart(editor.editor.firstChild, 0);
					range.setEnd(editor.editor.lastChild.firstChild, 4);
					editor.s.selectRange(range);

					const style = new Style({
						style: {
							color: 'yellow'
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="color:yellow"><br></span></p>' +
							'<p><span style="color:yellow">test</span></p>'
					);
				});
			});
		});

		describe('Two times', function () {
			it('Should do nothing', function () {
				const style = function () {
					return new Style({
						style: {
							color: '#FF0000'
						}
					});
				};

				style().apply(editor);

				expect(sortAttributes(editor.value)).equals(
					'<p><span style="color:#FF0000">test</span></p>'
				);

				style().apply(editor);

				expect(sortAttributes(editor.value)).equals('<p>test</p>');
			});
		});

		describe('For collapsed selection', function () {
			it('Should create SPAN element with this style', function () {
				editor.s.setCursorAfter(editor.editor.firstChild.firstChild);

				const style = new Style({
					style: {
						fontSize: 12
					}
				});

				style.apply(editor);

				editor.s.insertHTML('stop');

				expect(sortAttributes(editor.value)).equals(
					'<p>test<span style="font-size:12px">stop</span></p>'
				);
			});

			describe('Double times', function () {
				it('Should create new SPAN inside first', function () {
					editor.s.setCursorAfter(
						editor.editor.firstChild.firstChild
					);

					const style = new Style({
						style: {
							fontSize: 12
						}
					});

					style.apply(editor);

					editor.s.insertHTML('stop');

					const style2 = new Style({
						style: {
							color: '#ff00ff'
						}
					});

					style2.apply(editor);

					editor.s.insertHTML('elem');

					expect(sortAttributes(editor.value)).equals(
						'<p>test<span style="font-size:12px">stop<span style="color:#FF00FF">elem</span></span></p>'
					);
				});

				describe('With same style', function () {
					it('Should break first SPAN', function () {
						editor.s.setCursorAfter(
							editor.editor.firstChild.firstChild
						);

						const style = new Style({
							style: {
								fontSize: 12
							}
						});

						style.apply(editor);

						editor.s.insertHTML('stop');

						style.apply(editor);

						editor.s.insertHTML('elem');

						expect(sortAttributes(editor.value)).equals(
							'<p>test<span style="font-size:12px">stop</span>elem</p>'
						);
					});

					describe('Without editing', function () {
						it('Should unwap empty SPAN', function () {
							editor.s.setCursorAfter(
								editor.editor.firstChild.firstChild
							);

							const style = new Style({
								style: {
									fontSize: 12
								}
							});

							style.apply(editor);
							style.apply(editor);

							editor.s.insertHTML('elem');

							expect(sortAttributes(editor.value)).equals(
								'<p>testelem</p>'
							);
						});
					});
				});

				describe('Apply different styles', function () {
					it('Should combine all of it', function () {
						editor.s.setCursorAfter(
							editor.editor.firstChild.firstChild
						);

						const style = new Style({
							style: {
								backgroundColor: 'yellow'
							}
						});

						style.apply(editor);

						const style2 = new Style({
							style: {
								fontSize: '12px'
							}
						});

						style2.apply(editor);

						editor.s.insertHTML('stop');

						expect(sortAttributes(editor.value)).equals(
							'<p>test<span style="background-color:yellow;font-size:12px">stop</span></p>'
						);
					});
				});
			});
		});

		describe('Apply different styles', function () {
			it('Should combine all of it', function () {
				const style = new Style({
					style: {
						backgroundColor: 'yellow'
					}
				});

				style.apply(editor);

				const style2 = new Style({
					style: {
						fontSize: '12px'
					}
				});

				style2.apply(editor);

				expect(sortAttributes(editor.value)).equals(
					'<p><span style="background-color:yellow;font-size:12px">test</span></p>'
				);
			});
		});

		describe('For text inside some SPAN', function () {
			describe('Select SPAN', function () {
				it('Should apply style to this SPAN', function () {
					editor.value = '<span>test</span>';
					editor.s.select(editor.editor.firstChild.firstChild);

					const style = new Style({
						style: {
							fontSize: 11
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="font-size:11px">test</span></p>'
					);
				});
			});

			describe('Select SPAN content', function () {
				it('Should apply style to this SPAN', function () {
					editor.value = '<span>test</span>';
					editor.s.select(editor.editor.firstChild.firstChild);

					const style = new Style({
						style: {
							fontSize: 11
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="font-size:11px">test</span></p>'
					);
				});
			});
		});
	});

	describe('Apply element', function () {
		it('Should wrap selection in element', function () {
			const style = new Style({
				element: 'h1'
			});

			style.apply(editor);

			expect(sortAttributes(editor.value)).equals('<h1>test</h1>');
		});

		describe('Block or inline element', function () {
			describe('Block element', function () {
				it('Should wrap whole text for selection part', function () {
					const range = editor.s.createRange();
					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.setEndAfter(editor.editor.firstChild.firstChild);
					editor.s.selectRange(range);

					const style = new Style({
						element: 'h1'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<h1>test</h1>'
					);
				});

				describe('Selected part inside inline element', function () {
					it('Should wrap whole text with this part', function () {
						editor.value = 'test<strong>stop</strong>left';
						const range = editor.s.createRange();
						range.setStart(
							editor.editor.querySelector('strong').firstChild,
							2
						);
						range.setEnd(
							editor.editor.querySelector('strong').firstChild,
							3
						);
						editor.s.selectRange(range);

						const style = new Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<h1>test<strong>stop</strong>left</h1>'
						);
					});
				});

				describe('In empty editor', function () {
					it('Should insert this new block element with BR', function () {
						editor.value = '';

						const style = new Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<h1><br></h1>'
						);

						editor.s.insertHTML('test');

						expect(sortAttributes(editor.value)).equals(
							'<h1>test<br></h1>'
						);
					});
				});
			});

			describe('inline element', function () {
				it('Should wrap only selection part', function () {
					const range = editor.s.createRange();
					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.setEndAfter(editor.editor.firstChild.firstChild);
					editor.s.selectRange(range);

					const style = new Style({
						element: 'strong'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p>te<strong>st</strong></p>'
					);
				});
			});
		});

		describe('For collapsed selection', function () {
			describe('Block element', function () {
				it('Should wrap whole text in element', function () {
					editor.s.setCursorAfter(
						editor.editor.firstChild.firstChild
					);

					const style = new Style({
						element: 'h1'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<h1>test</h1>'
					);
				});

				describe('Double time', function () {
					it('Should unwrap element', function () {
						editor.value = '<h1>test</h1>';

						editor.s.setCursorAfter(
							editor.editor.firstChild.firstChild
						);

						const style = new Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals('test');
					});
				});

				describe('Selected Block element', function () {
					it('Should replace this element to new style', function () {
						editor.value = '<p>test</p>';

						editor.s.setCursorAfter(
							editor.editor.firstChild.firstChild
						);

						const style = new Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<h1>test</h1>'
						);
					});
				});
			});
		});

		describe('For suitable element', function () {
			it('Should replace it to new element', function () {
				editor.value = '<h2>test</h2>';
				editor.execCommand('selectall');

				const style = new Style({
					element: 'h1'
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals('<h1>test</h1>');
			});

			describe('With style', function () {
				it('Should wrap contents again', function () {
					editor.value = '<strong>test</strong>';
					const range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.setEnd(
						editor.editor.firstChild.firstChild.firstChild,
						4
					);
					editor.s.selectRange(range);

					const style = new Style({
						element: 'em',
						style: {
							fontStyle: 'italic'
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><strong><em>test</em></strong></p>'
					);
				});

				describe('For collapsed selection', function () {
					it('Should add several tags', function () {
						editor.s.setCursorAfter(
							editor.editor.firstChild.firstChild
						);

						const strong = new Style({
							element: 'strong',
							style: {
								fontWeight: 700
							}
						});

						strong.apply(editor);

						editor.s.insertHTML('stop');

						expect(sortAttributes(editor.value)).equals(
							'<p>test<strong>stop</strong></p>'
						);

						const em = new Style({
							element: 'em',
							style: {
								fontStyle: 'italic'
							}
						});

						em.apply(editor);

						editor.s.insertHTML('last');

						expect(sortAttributes(editor.value)).equals(
							'<p>test<strong>stop<em>last</em></strong></p>'
						);
					});

					describe('Double times', function () {
						it('Should create new SPAN inside first', function () {
							editor.s.setCursorAfter(
								editor.editor.firstChild.firstChild
							);

							const style = new Style({
								style: {
									fontSize: 12
								}
							});

							style.apply(editor);

							editor.s.insertHTML('stop');

							const style2 = new Style({
								style: {
									color: '#ff00ff'
								}
							});

							style2.apply(editor);

							editor.s.insertHTML('elem');

							expect(sortAttributes(editor.value)).equals(
								'<p>test<span style="font-size:12px">stop<span style="color:#FF00FF">elem</span></span></p>'
							);
						});

						describe('With same style', function () {
							it('Should break first SPAN', function () {
								editor.s.setCursorAfter(
									editor.editor.firstChild.firstChild
								);

								const style = new Style({
									style: {
										fontSize: 12
									}
								});

								style.apply(editor);

								editor.s.insertHTML('stop');

								style.apply(editor);

								editor.s.insertHTML('elem');

								expect(sortAttributes(editor.value)).equals(
									'<p>test<span style="font-size:12px">stop</span>elem</p>'
								);
							});
						});
					});
				});
			});

			describe('For several block elements', function () {
				it('Should replace all these element to new', function () {
					editor.value = '<p>test</p>\n<p>test2</p>';

					const range = editor.s.createRange();
					range.setStartBefore(editor.editor.firstChild);
					range.setEndAfter(editor.editor.lastChild);
					editor.s.selectRange(range);

					const style = new Style({
						element: 'h5'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<h5>test</h5>\n<h5>test2</h5>'
					);
				});
			});
		});

		describe('For same element', function () {
			it('Should unwrap selection', function () {
				editor.value = '<h1>test</h1>';
				editor.execCommand('selectall');

				const style = new Style({
					element: 'h1'
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals('test');
			});
		});

		describe('For part of same element', function () {
			it('Should unwrap selection', function () {
				editor.value = '<strong>test</strong> some';

				const range = editor.s.createRange();
				range.setStart(
					editor.editor.firstChild.firstChild.firstChild,
					2
				);
				range.setEnd(editor.editor.firstChild.lastChild, 3);
				editor.s.selectRange(range);

				const style = new Style({
					element: 'strong',
					style: {
						fontWeight: 700
					}
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals(
					'<p><strong>te</strong>st some</p>'
				);
			});
		});

		describe('Apply UL/OL', function () {
			describe('UL', function () {
				it('Should create LI inside new element', function () {
					const style = new Style({
						element: 'ul'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<ul><li>test</li></ul>'
					);
				});
			});

			describe('OL', function () {
				it('Should create LI inside new element', function () {
					const style = new Style({
						element: 'ol'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<ol><li>test</li></ol>'
					);
				});
			});
		});

		describe('Apply H1 inside LI', function () {
			it('Should create H1 inside LI', function () {
				editor.value =
					'<ul>' +
					'<li>1</li>' +
					'<li>2</li>' +
					'<li>3</li>' +
					'</ul> test';

				const range = editor.s.createRange();
				range.setStart(
					editor.editor.firstChild.firstChild.firstChild,
					0
				);
				range.setEnd(editor.editor.firstChild.lastChild.firstChild, 1);
				editor.s.selectRange(range);

				const style = new Style({
					element: 'h1'
				});

				style.apply(editor);

				expect(editor.value).equals(
					'<ul>' +
						'<li><h1>1</h1></li>' +
						'<li><h1>2</h1></li>' +
						'<li><h1>3</h1></li>' +
						'</ul><p> test</p>'
				);
			});

			describe('Apply H1 for whole UL', function () {
				it('Should create H1 inside every LI inside UL', function () {
					editor.value =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li>3</li>' +
						'</ul>';

					const range = editor.s.createRange();
					range.selectNodeContents(editor.editor);
					editor.s.selectRange(range);

					const style = new Style({
						element: 'h1'
					});

					style.apply(editor);

					expect(editor.value).equals(
						'<ul>' +
							'<li><h1>1</h1></li>' +
							'<li><h1>2</h1></li>' +
							'<li><h1>3</h1></li>' +
							'</ul>'
					);
				});

				describe('Apply H1 for whole UL with text', function () {
					it('Should create H1 inside every LI inside UL and wrap text', function () {
						editor.value =
							'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li>3</li>' +
							'</ul> test';

						const range = editor.s.createRange();
						range.selectNodeContents(editor.editor);
						editor.s.selectRange(range);

						const style = new Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(editor.value).equals(
							'<ul>' +
								'<li><h1>1</h1></li>' +
								'<li><h1>2</h1></li>' +
								'<li><h1>3</h1></li>' +
								'</ul><h1> test</h1>'
						);
					});
				});
			});
		});
	});

	describe('Combine style or element', function () {
		describe('For Styled element with style equaled STRONG', function () {
			describe('Apply STRONG', function () {
				it('Should unwrap this element', function () {
					editor.value = '<span style="font-weight:700">test</span>';
					editor.execCommand('selectall');

					const style = new Style({
						element: 'strong',
						style: {
							fontWeight: 700
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals('<p>test</p>');
				});
			});
		});

		describe('For Styled element with style contains STRONG', function () {
			describe('Apply STRONG', function () {
				it('Should remove STRONG from element', function () {
					editor.value =
						'<span style="font-weight:700;font-size:24px;">test</span>';
					editor.execCommand('selectall');

					const style = new Style({
						element: 'strong',
						style: {
							fontWeight: 700
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="font-size:24px">test</span></p>'
					);
				});
			});
		});
	});
});

describe('Test Selection.applyStyle method', function () {
	describe('Bold command', function () {
		describe('For box with style="font-weight:bold"', function () {
			it('should wrap selected text in STRONG element without questions', function () {
				const editor = getJodit(),
					style = document.createElement('style');

				editor.value = '<p>test</p>';
				style.innerHTML = 'p {font-weight: bold !important};';
				document.body.appendChild(style);

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.firstChild.firstChild, 4);
				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');

				style.parentNode.removeChild(style);
				expect(editor.value).equals('<p><strong>test</strong></p>');
			});
		});

		it('Should insert a few chars and again exec bold. Bold mode should be switch off', function () {
			const editor = getJodit();
			editor.value = 'test';

			const range = editor.s.createRange(true);

			range.selectNodeContents(editor.editor.firstChild);
			range.collapse(false);

			editor.execCommand('bold');

			editor.s.insertNode(editor.createInside.text('abc'));

			editor.execCommand('bold');

			editor.s.insertNode(editor.createInside.text('def'));

			expect(editor.value).equals('<p>test<strong>abc</strong>def</p>');
		});

		describe('for some text', function () {
			it('should wrap this text in STRONG element', function () {
				const editor = getJodit();
				editor.value = 'test';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.selectNodeContents(editor.editor.firstChild);
				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');

				expect(editor.value).equals('<p><strong>test</strong></p>');
			});

			describe('inside STRONG element ', function () {
				it('from start of this element, should unwrap this text', function () {
					const editor = getJodit();
					editor.value = '<strong>test</strong>';

					const range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.setEnd(
						editor.editor.firstChild.firstChild.firstChild,
						2
					);

					editor.s.selectRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals('<p>te<strong>st</strong></p>');
				});

				it('near end of this element, should unwrap this text', function () {
					const editor = getJodit();
					editor.value = '<strong>test</strong>';

					const range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						2
					);
					range.setEnd(
						editor.editor.firstChild.firstChild.firstChild,
						4
					);

					editor.s.selectRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals('<p><strong>te</strong>st</p>');
				});

				it('in the middle of this element, should unwrap this text', function () {
					const editor = getJodit();
					editor.value = '<strong>test</strong>';

					const range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						1
					);
					range.setEnd(
						editor.editor.firstChild.firstChild.firstChild,
						3
					);
					editor.s.selectRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals(
						'<p><strong>t</strong>es<strong>t</strong></p>'
					);
				});

				it('should unwrap this part and after exec "bold" again it should create 3 STRONG elements', function () {
					const editor = getJodit();
					editor.value = '<strong>1 2 3</strong>';

					const range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						1
					);
					range.setEnd(
						editor.editor.firstChild.firstChild.firstChild,
						4
					);
					editor.s.selectRange(range);

					editor.execCommand('bold');
					editor.execCommand('bold');

					expect(editor.value).equals(
						'<p><strong>1</strong><strong> 2 </strong><strong>3</strong></p>'
					);
				});

				describe('For collapsed selection', function () {
					it('should split this element and set cursor between two parts', function () {
						const editor = getJodit();
						editor.value = '<strong>test</strong>';

						const range = editor.s.createRange();

						range.setStart(
							editor.editor.firstChild.firstChild.firstChild,
							2
						);
						range.collapse(true);
						editor.s.selectRange(range);

						editor.execCommand('bold');
						editor.s.insertHTML('stop');

						expect(editor.value).equals(
							'<p><strong>te</strong>stop<strong>st</strong></p>'
						);
					});
				});
			});

			it('that contains a few STRONG elements, should unwrap all of these', function () {
				const editor = getJodit();
				editor.value =
					'<strong>test</strong> test <strong>test</strong>';

				const range = editor.s.createRange();

				range.setStart(
					editor.editor.firstChild.firstChild.firstChild,
					0
				);
				range.setEnd(editor.editor.firstChild.lastChild.firstChild, 4);
				editor.s.selectRange(range);

				editor.execCommand('bold');

				expect(editor.value).equals('<p>test test test</p>');
			});
		});

		describe('Try exec the command "bold"', function () {
			it('Should wrap selected text in STRONG element', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.selectNodeContents(editor.editor.firstChild);
				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('bold');

				expect(editor.value).equals('<p><strong>test</strong></p>');
			});
			describe('Try exec the command "bold" twice', function () {
				it('Should unwrap strong elements', function () {
					const editor = getJodit();
					editor.value = '<p>test</p>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.selectNodeContents(editor.editor.firstChild);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');
					editor.execCommand('bold');

					expect(editor.value).equals('<p>test</p>');
				});
			});
		});

		describe('Try exec the command "bold" for font-weight: 700 Element', function () {
			it('should ubnwrap selected srtong element', function () {
				const editor = getJodit();
				editor.value = '<span style="font-weight: 700">test</span>';

				const range = editor.s.createRange();

				range.selectNodeContents(editor.editor.firstChild);
				editor.s.selectRange(range);

				editor.execCommand('bold');

				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Exec bold for collapsed range and move cursor in another place', function () {
			it('Should remove STRONG element', function () {
				const editor = getJodit({
					cleanHTML: {
						timeout: 0
					}
				});

				editor.value = 'testtest';

				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				editor.execCommand('bold');
				expect(editor.value).equals('<p>test<strong></strong>test</p>');

				range.setStart(editor.editor.firstChild.lastChild, 2);
				range.collapse(true);
				editor.s.selectRange(range);
				simulateEvent('mousedown', 0, editor.editor);

				expect(editor.value).equals('<p>testtest</p>');
			});
		});

		describe('Exec bold command for SPAN with font-size', function () {
			it('Should leave both font-size and font-weight rules', function () {
				const editor = getJodit();
				editor.value = '<span style="font-size: 36px;">asdasd</span>';

				const range = editor.s.createRange();

				range.setStart(
					editor.editor.firstChild.firstChild.firstChild,
					0
				);
				range.setEnd(editor.editor.firstChild.firstChild.firstChild, 6);

				editor.s.selectRange(range);

				editor.execCommand('bold');

				expect(sortAttributes(editor.value)).equals(
					sortAttributes(
						'<p><span style="font-size: 36px;"><strong>asdasd</strong></span></p>'
					)
				);
			});
		});
	});

	describe('Fonts', function () {
		describe('Set font size', function () {
			it('should create attribute style="font-size:value"', function () {
				const editor = getJodit();
				editor.value = '<p> testy oprst <span>lets go</span></p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.selectNode(editor.editor.querySelector('span'));

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('fontSize', false, 12);

				expect(editor.value).equals(
					'<p> testy oprst <span style="font-size: 12px;">lets go</span></p>'
				);

				editor.execCommand('fontSize', false, '12%');
				expect(editor.value).equals(
					'<p> testy oprst <span style="font-size: 12%;">lets go</span></p>'
				);
			});

			describe('For box with style="font-size:12px"', function () {
				it('should wrap selected text in SPAN with style="font-size:12px" element without questions', function () {
					const editor = getJodit();
					editor.value = 'test';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.selectNodeContents(
						editor.editor.firstChild.firstChild
					);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.editor.style.fontSize = '12px';

					editor.execCommand('fontSize', false, 12);

					expect(editor.value).equals(
						'<p><span style="font-size: 12px;">test</span></p>'
					);
				});
			});
		});

		describe('Set font family', function () {
			describe('For box with style="font-name:Arial"', function () {
				it('should wrap selected text in SPAN with style="font-family:Arial" element without questions', function () {
					const editor = getJodit();
					editor.value = '<p>test</p>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.setEnd(editor.editor.firstChild.firstChild, 4);

					sel.removeAllRanges();
					sel.addRange(range);

					editor.editor.style.fontFamily = 'Arial';

					editor.execCommand('fontName', false, 'Arial');

					expect(editor.value).equals(
						'<p>te<span style="font-family: Arial;">st</span></p>'
					);
				});
			});
			it('should create attribute style="font-family:value"', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('fontName', false, 'Arial');

				expect(editor.value).equals(
					'<p>te<span style="font-family: Arial;">st</span></p>'
				);
			});
		});

		describe('Set font size and family', function () {
			it('should create attribute style="font-family:value;font-size:value"', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);

				sel.removeAllRanges();
				sel.addRange(range);

				editor.execCommand('fontName', false, 'Arial');
				editor.execCommand('fontSize', false, 12);

				expect(sortAttributes(editor.value)).equals(
					'<p>te<span style="font-family:Arial;font-size:12px">st</span></p>'
				);
			});
		});
	});
});
