describe('Test Style module', function() {
	let editor;

	beforeEach(function() {
		editor = getJodit();
		editor.value = 'test';
		editor.execCommand('selectall');
	});

	describe('Apply style', function() {
		it('Should apply style to element', function() {
			const style = new Jodit.ns.Style({
				style: {
					color: 'red',
					background: 'yellow'
				}
			});

			style.apply(editor);

			expect(sortAttributes(editor.value)).equals(
				'<span style="background:yellow;color:red">test</span>'
			);
		});

		describe('For collapsed selection', function() {
			it('Should create SPAN element with this style', function() {
				editor.selection.setCursorAfter(editor.editor.firstChild);

				const style = new Jodit.ns.Style({
					style: {
						fontSize: 12
					}
				});

				style.apply(editor);

				editor.selection.insertHTML('stop');

				expect(sortAttributes(editor.value)).equals(
					'test<span style="font-size:12px">stop</span>'
				);
			});

			describe('Double times', function() {
				it('Should create new SPAN inside first', function() {
					editor.selection.setCursorAfter(editor.editor.firstChild);

					const style = new Jodit.ns.Style({
						style: {
							fontSize: 12
						}
					});

					style.apply(editor);

					editor.selection.insertHTML('stop');

					const style2 = new Jodit.ns.Style({
						style: {
							color: '#ff00ff'
						}
					});

					style2.apply(editor);

					editor.selection.insertHTML('elem');

					expect(sortAttributes(editor.value)).equals(
						'test<span style="font-size:12px">stop<span style="color:#FF00FF">elem</span></span>'
					);
				});

				describe('With same style', function() {
					it('Should break first SPAN', function() {
						editor.selection.setCursorAfter(
							editor.editor.firstChild
						);

						const style = new Jodit.ns.Style({
							style: {
								fontSize: 12
							}
						});

						style.apply(editor);

						editor.selection.insertHTML('stop');

						style.apply(editor);

						editor.selection.insertHTML('elem');

						expect(sortAttributes(editor.value)).equals(
							'test<span style="font-size:12px">stop</span>elem'
						);
					});
				});

				describe('Apply different styles', function() {
					it('Should combine all of it', function() {
						editor.selection.setCursorAfter(editor.editor.firstChild);

						const style = new Jodit.ns.Style({
							style: {
								background: 'yellow'
							}
						});

						style.apply(editor);

						const style2 = new Jodit.ns.Style({
							style: {
								fontSize: '12px'
							}
						});

						style2.apply(editor);

						editor.selection.insertHTML('stop');

						expect(sortAttributes(editor.value)).equals(
							'test<span style="background:yellow;font-size:12px">stop</span>'
						);
					});
				});
			});
		});

		describe('Apply different styles', function() {
			it('Should combine all of it', function() {
				const style = new Jodit.ns.Style({
					style: {
						background: 'yellow'
					}
				});

				style.apply(editor);

				const style2 = new Jodit.ns.Style({
					style: {
						fontSize: '12px'
					}
				});

				style2.apply(editor);

				expect(sortAttributes(editor.value)).equals(
					'<span style="background:yellow;font-size:12px">test</span>'
				);
			});
		});

		describe('For text inside some SPAN', function() {
			describe('Select SPAN', function() {
				it('Should apply style to this SPAN', function() {
					editor.value = '<span>test</span>';
					editor.selection.select(editor.editor.firstChild);

					const style = new Jodit.ns.Style({
						style: {
							fontSize: 11
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<span style="font-size:11px">test</span>'
					);
				});
			});

			describe('Select SPAN content', function() {
				it('Should apply style to this SPAN', function() {
					editor.value = '<span>test</span>';
					editor.selection.select(
						editor.editor.firstChild.firstChild
					);

					const style = new Jodit.ns.Style({
						style: {
							fontSize: 11
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<span style="font-size:11px">test</span>'
					);
				});
			});
		});
	});

	describe('Apply element', function() {
		it('Should wrap selection in element', function() {
			const style = new Jodit.ns.Style({
				element: 'h1'
			});

			style.apply(editor);

			expect(sortAttributes(editor.value)).equals('<h1>test</h1>');
		});

		describe('Block or inline element', function() {
			describe('Block element', function() {
				it('Should wrap whole text for selection part', function() {
					const range = editor.selection.createRange();
					range.setStart(editor.editor.firstChild, 2)
					range.setEndAfter(editor.editor.firstChild);
					editor.selection.selectRange(range);

					const style = new Jodit.ns.Style({
						element: 'h1'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals('<h1>test</h1>');
				});

				describe('Selected part inside inline element', function() {
					it('Should wrap whole text with this part', function() {
						editor.value = 'test<strong>stop</strong>left';
						const range = editor.selection.createRange();
						range.setStart(editor.editor.querySelector('strong').firstChild, 2);
						range.setEnd(editor.editor.querySelector('strong').firstChild, 3);
						editor.selection.selectRange(range);

						const style = new Jodit.ns.Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals('<h1>test<strong>stop</strong>left</h1>');
					});
				});
			});

			describe('inline element', function() {
				it('Should wrap only selection part', function() {
					const range = editor.selection.createRange();
					range.setStart(editor.editor.firstChild, 2)
					range.setEndAfter(editor.editor.firstChild);
					editor.selection.selectRange(range);

					const style = new Jodit.ns.Style({
						element: 'strong'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals('te<strong>st</strong>');
				});
			});
		});

		describe('For collapsed selection', function() {
			describe('Block element', function() {
				it('Should wrap whole text in element', function() {
					editor.selection.setCursorAfter(editor.editor.firstChild);

					const style = new Jodit.ns.Style({
						element: 'h1'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals('<h1>test</h1>');
				});

				describe('Selected Block element', function() {
					it('Should replace this element to new style', function() {
						editor.value = '<p>test</p>';
						editor.selection.setCursorAfter(editor.editor.firstChild.firstChild);

						const style = new Jodit.ns.Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals('<h1>test</h1>');
					});
				});
			});
		});

		describe('For suit element', function() {
			it('Should replace it to new element', function() {
				editor.value = '<h2>test</h2>';
				editor.execCommand('selectall');

				const style = new Jodit.ns.Style({
					element: 'h1'
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals('<h1>test</h1>');
			});

			describe('With style', function() {
				it('Should wrap contents again', function() {
					editor.value = '<strong>test</strong>';
					editor.execCommand('selectall');

					const style = new Jodit.ns.Style({
						element: 'em',
						style: {
							fontStyle: 'italic'
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<strong><em>test</em></strong>'
					);
				});

				describe('For collapsed selection', function() {
					it('Should add several tags', function() {
						editor.selection.setCursorAfter(
							editor.editor.firstChild
						);

						const strong = new Jodit.ns.Style({
							element: 'strong',
							style: {
								fontWeight: 700
							}
						});

						strong.apply(editor);

						editor.selection.insertHTML('stop');

						expect(sortAttributes(editor.value)).equals(
							'test<strong>stop</strong>'
						);

						const em = new Jodit.ns.Style({
							element: 'em',
							style: {
								fontStyle: 'italic'
							}
						});

						em.apply(editor);

						editor.selection.insertHTML('last');

						expect(sortAttributes(editor.value)).equals(
							'test<strong>stop<em>last</em></strong>'
						);
					});

					describe('Double times', function() {
						it('Should create new SPAN inside first', function() {
							editor.selection.setCursorAfter(
								editor.editor.firstChild
							);

							const style = new Jodit.ns.Style({
								style: {
									fontSize: 12
								}
							});

							style.apply(editor);

							editor.selection.insertHTML('stop');

							const style2 = new Jodit.ns.Style({
								style: {
									color: '#ff00ff'
								}
							});

							style2.apply(editor);

							editor.selection.insertHTML('elem');

							expect(sortAttributes(editor.value)).equals(
								'test<span style="font-size:12px;">stop<span style="color:#ff00ff">elem</span></span>'
							);
						});

						describe('With same style', function() {
							it('Should break first SPAN', function() {
								editor.selection.setCursorAfter(
									editor.editor.firstChild
								);

								const style = new Jodit.ns.Style({
									style: {
										fontSize: 12
									}
								});

								style.apply(editor);

								editor.selection.insertHTML('stop');

								style.apply(editor);

								editor.selection.insertHTML('elem');

								expect(sortAttributes(editor.value)).equals(
									'test<span style="font-size:12px">stop</span>elem'
								);
							});
						});
					});
				});
			});
		});

		describe('For same element', function() {
			it('Should unwrap selection', function() {
				editor.value = '<h1>test</h1>';
				editor.execCommand('selectall');

				const style = new Jodit.ns.Style({
					element: 'h1'
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals('test');
			});
		});

		describe('For part of same element', function() {
			it('Should unwrap selection', function() {
				editor.value = '<strong>test</strong> some';

				const range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.lastChild, 3);
				editor.selection.selectRange(range);

				const style = new Jodit.ns.Style({
					element: 'strong',
					style: {
						fontWeight: 700
					}
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals(
					'<strong>te</strong>st some'
				);
			});
		});
	});

	describe('Combine style or element', function() {
		it('Should combine all of it', function() {
			editor.value = '<span style="font-weight:700">test</span>';
			editor.execCommand('selectall');

			const style = new Jodit.ns.Style({
				element: 'strong',
				style: {
					fontWeight: 700
				}
			});

			style.apply(editor);

			expect(sortAttributes(editor.value)).equals('test');

			editor.value = 'test';
			editor.execCommand('selectall');
			style.apply(editor);

			expect(sortAttributes(editor.value)).equals(
				'<strong>test</strong>'
			);
		});
	});
});
