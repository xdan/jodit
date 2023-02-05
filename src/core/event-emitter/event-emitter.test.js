/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Jodit Events system Tests', function () {
	describe('Native Events', function () {
		describe('Create simple event handler', function () {
			it('should handle it events', function () {
				const editor = getJodit(),
					div = document.createElement('button');

				let work = false;

				document.body.appendChild(div);

				editor.events.on(div, 'click', function () {
					work = true;
				});

				simulateEvent('click', 0, div);

				expect(work).is.true;

				div.remove();
			});
		});

		describe('Create simple event handler on some DOM element on few events', function () {
			it('Should handle all events on that element', function () {
				const editor = getJodit(),
					div = document.createElement('button');

				let work = 0;

				document.body.appendChild(div);

				editor.events.on(div, 'click dblclick keydown', function () {
					work++;
				});

				simulateEvent('click', 0, div);
				simulateEvent('dblclick', 0, div);
				simulateEvent('keydown', 0, div);

				expect(work).equals(3);
				div.remove();
			});
		});

		it('Add and remove event handler', function () {
			const editor = getJodit(),
				div = document.createElement('button');

			let work = 0;

			document.body.appendChild(div);

			editor.events.on(div, 'click', function () {
				work++;
			});

			simulateEvent('click', 0, div);
			expect(work).equals(1);

			editor.events.off(div, 'click');

			simulateEvent('click', 0, div);
			expect(work).equals(1);

			div.parentNode.removeChild(div);
		});

		describe('Add a few handlers for several evens and remove all handlers', function () {
			it('Should stop listening events', function () {
				const editor = getJodit(),
					div = document.createElement('button');

				let work = 0;

				document.body.appendChild(div);

				editor.events.on(div, 'click', function () {
					work++;
				});

				editor.events.on(div, 'dblclick', function () {
					work++;
				});

				editor.events.on(div, 'mousedown', function () {
					work++;
				});

				simulateEvent('click', 0, div);
				simulateEvent('dblclick', 0, div);
				simulateEvent('mousedown', 0, div);

				expect(work).equals(3);

				editor.events.off(div);

				simulateEvent('click', 0, div);
				simulateEvent('dblclick', 0, div);
				simulateEvent('mousedown', 0, div);

				expect(work).equals(3);

				div.parentNode.removeChild(div);
			});
		});

		it('Add event handler for several elements', function () {
			const editor = getJodit(),
				div1 = editor.ed.createElement('button'),
				div2 = editor.ed.createElement('button');

			let work = '';

			editor.ed.body.appendChild(div1);
			editor.ed.body.appendChild(div2);

			div1.textContent = 'test1';
			div2.textContent = 'test2';

			editor.events
				.on([div1, div2], 'click', function () {
					work += this.textContent;
				})

				.fire(div1, 'click');

			editor.events.fire(div2, 'click');

			expect(work).equals('test1test2');

			div1.parentNode.removeChild(div1);
			div2.parentNode.removeChild(div2);
		});

		it('Fire trigger', function () {
			const editor = getJodit(),
				div = document.createElement('button');

			let work = 0;

			document.body.appendChild(div);

			editor.events
				.on(div, 'click', function () {
					work++;
				})
				.fire(div, 'click');

			expect(work).equals(1);

			div.parentNode.removeChild(div);
		});

		describe('Remove all handlers using event namespace', function () {
			it('Should Remove all handlers', function () {
				let work = 0;

				const editor = getJodit(),
					div = document.createElement('button'),
					inc = function () {
						work++;
					};

				document.body.appendChild(div);

				editor.events.on(div, 'click', inc);
				editor.events.on(div, 'mousedown', inc);

				editor.events.on(div, 'click.test', inc);
				editor.events.on(div, 'mousedown.test', inc);

				editor.events.fire(div, 'click');
				editor.events.fire(div, 'mousedown');
				expect(work).equals(4); // 4 handlers

				editor.events.fire(div, 'click.test');
				editor.events.fire(div, 'mousedown.test');
				expect(work).equals(8); // 4 handlers - because for DOM elements will fire all listeners

				editor.events.off(div, '.test');
				editor.events.fire(div, 'click');
				editor.events.fire(div, 'mousedown');
				expect(work).equals(10); // only 2 default handlers

				div.parentNode.removeChild(div);
			});
		});

		it('Proxy event from iframe.window to main.window', function () {
			let work = 0;

			const editor = getJodit({
					iframe: true
				}),
				mousedown = function () {
					work++;
				};

			window.addEventListener('mousedown', mousedown);

			editor.events.fire(editor.ew, 'mousedown');

			expect(work).equals(1);

			window.removeEventListener('mousedown', mousedown);
		});
	});

	describe('Jodit Events', function () {
		it('Event handler', function () {
			let enable = false;
			const editor = getJodit();

			editor.events.on('keydown', function () {
				enable = true;
			});

			simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
			expect(enable).is.true;
		});

		describe('one', function () {
			it('should call handler only one time', function () {
				let count = 0;
				const editor = getJodit();

				editor.events.one('keydown', function () {
					count++;
				});

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				expect(count).equals(1);
			});
		});

		it('Delete event handler', function () {
			let enable = false;
			const editor = getJodit(),
				callback = function () {
					enable = true;
				};

			editor.events.on('keydown', callback);
			editor.events.off('keydown', callback);

			simulateEvent('keydown', 'y', editor.editor);

			expect(enable).is.false;
		});

		it('Proxy events', function () {
			const editor = getJodit();

			let work = false;

			editor.events.on('keydown', function () {
				work = true;
			});

			simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

			expect(work).is.true;
		});
	});

	describe('Combine events', function () {
		describe('Pass arguments in handler', function () {
			it('Should pass all Fire arguments in handler', function () {
				const eventEmitter = new Jodit.modules.EventEmitter(),
					simpleObject = {};

				let clicked = 0;

				eventEmitter.on(simpleObject, 'click', function (count) {
					clicked += count;
				});

				eventEmitter.fire(simpleObject, 'click', 1);
				eventEmitter.fire(simpleObject, 'click', 2);
				eventEmitter.fire(simpleObject, 'click', 3);

				expect(6).equals(clicked);
			});
		});

		describe('Queue operations', function () {
			it('Should call handlers in order how the were added but handler with onTop option should be called first', function () {
				const eventEmitter = new Jodit.modules.EventEmitter(),
					simpleObject = {},
					clicked = [];

				eventEmitter.on(simpleObject, 'click', function () {
					clicked.push(1);
				});
				eventEmitter.on(simpleObject, 'click', function () {
					clicked.push(2);
				});
				eventEmitter.on(simpleObject, 'click', function () {
					clicked.push(3);
				});
				eventEmitter.on(
					simpleObject,
					'click',
					function () {
						clicked.push(4);
					},
					{ top: true }
				);

				eventEmitter.fire(simpleObject, 'click');

				expect('4,1,2,3').equals(clicked.toString());
			});

			describe('Stop propagation', function () {
				it('Should stop all calls for this event but another events should be called', function () {
					const eventEmitter = new Jodit.modules.EventEmitter(),
						simpleObject = {},
						clicked = [];

					eventEmitter.on(simpleObject, 'lope', function () {
						clicked.push(15);
					});

					eventEmitter.on(simpleObject, 'pop', function () {
						clicked.push(16);
					});

					eventEmitter.on(simpleObject, 'click', function () {
						clicked.push(1);
					});

					eventEmitter.on(simpleObject, 'click', function () {
						clicked.push(2);
						eventEmitter.fire(simpleObject, 'pop');
						eventEmitter.stopPropagation(simpleObject, 'click');
						eventEmitter.fire(simpleObject, 'lope');
					});

					// this handler will not be called
					eventEmitter.on(simpleObject, 'click', function () {
						clicked.push(3);
					});

					eventEmitter.on(
						simpleObject,
						'click',
						function () {
							clicked.push(4);
						},
						{ top: true }
					);

					eventEmitter.fire(simpleObject, 'click');
					eventEmitter.fire(simpleObject, 'click');

					expect('4,1,2,16,15,4,1,2,16,15').equals(
						clicked.toString()
					);
				});

				describe('Default object', function () {
					it('Should stop all calls for this event but another events should be called', function () {
						const eventEmitter = new Jodit.modules.EventEmitter(),
							clicked = [];

						eventEmitter.on('lope', function () {
							clicked.push(15);
						});
						eventEmitter.on('pop', function () {
							clicked.push(16);
						});

						eventEmitter.on('click', function () {
							clicked.push(1);
						});

						eventEmitter.on('click', function () {
							clicked.push(2);
							eventEmitter.fire('pop');
							eventEmitter.stopPropagation('click');
							eventEmitter.fire('lope');
						});

						// this handler will not be called
						eventEmitter.on('click', function () {
							clicked.push(3);
						});

						eventEmitter.on(
							'click',
							function () {
								clicked.push(4);
							},
							{ top: true }
						);

						eventEmitter.fire('click');
						eventEmitter.fire('click');

						expect('4,1,2,16,15,4,1,2,16,15').equals(
							clicked.toString()
						);
					});
				});
			});
		});

		describe('Short form', function () {
			describe('Add event to simple object', function () {
				it('Should work with on handler', function () {
					const eventEmitter = new Jodit.modules.EventEmitter();
					let clicked = false;

					eventEmitter.on('click', function () {
						clicked = true;
					});

					eventEmitter.fire('click');

					expect(true).equals(clicked);
				});
				describe('Namespaces', function () {
					describe('Add handler with namespace', function () {
						describe('Remove event listener without namespace', function () {
							it('Should remove handler with namespace', function () {
								let clicked = 0;
								const eventEmitter =
										new Jodit.modules.EventEmitter(),
									callback = function () {
										clicked += 1;
									};

								eventEmitter.on('click.jodit', callback);
								eventEmitter.fire('click');
								eventEmitter.fire('click.jodit');

								expect(2).equals(clicked);

								eventEmitter.off('click');

								eventEmitter.fire('click.jodit');
								eventEmitter.fire('click');

								expect(2).equals(clicked);
							});
						});

						describe('Remove event listener with namespace', function () {
							it('Should remove handler with namespace', function () {
								const eventEmitter =
									new Jodit.modules.EventEmitter();

								let clicked = 0,
									callback = function () {
										clicked += 1;
									};

								eventEmitter.on('click.jodit', callback);
								eventEmitter.fire('click');
								eventEmitter.fire('click.jodit');

								expect(2).equals(clicked);

								eventEmitter.off('click.jodit');

								eventEmitter.fire('click.jodit');
								eventEmitter.fire('click');

								expect(2).equals(clicked);
							});
						});
					});

					describe('Add handlers with and without namespace', function () {
						describe('And fire without namespace', function () {
							it('Should fire both handlers', function () {
								const eventEmitter =
									new Jodit.modules.EventEmitter();
								let clicked = 0;
								const callback = function () {
									clicked += 1;
								};

								eventEmitter.on('click', callback);
								eventEmitter.on('click.jodit', callback);

								eventEmitter.fire('click');

								expect(2).equals(clicked);
							});
						});

						describe('And fire with namespace', function () {
							it('Should fire only one handler with namespace', function () {
								let clicked = 0;

								const eventEmitter =
										new Jodit.modules.EventEmitter(),
									callback = function () {
										clicked += 1;
									};

								eventEmitter.on('click', callback);
								eventEmitter.on('click.jodit', callback);

								eventEmitter.fire('click.jodit');

								expect(1).equals(clicked);
							});
						});

						describe('Remove event listeners', function () {
							describe('Remove event listener with namespace', function () {
								it('Should remove handler only with namespace', function () {
									let clicked = 0;

									const eventEmitter =
											new Jodit.modules.EventEmitter(),
										callback = function () {
											clicked += 1;
										};

									eventEmitter.on('click', callback);
									eventEmitter.on('click.jodit', callback);

									eventEmitter.fire('click');
									expect(2).equals(clicked);

									eventEmitter.off('click.jodit');

									eventEmitter.fire('click.jodit');
									eventEmitter.fire('click');

									expect(3).equals(clicked);
								});
							});

							describe('Remove event listener without namespace', function () {
								it('Should remove all handlers', function () {
									let clicked = 0;

									const eventEmitter =
											new Jodit.modules.EventEmitter(),
										callback = function () {
											clicked += 1;
										};

									eventEmitter.on('click', callback);
									eventEmitter.on('click.jodit', callback);

									eventEmitter.fire('click');

									expect(2).equals(clicked);

									eventEmitter.off('click');

									eventEmitter.fire('click.jodit');
									eventEmitter.fire('click');

									expect(2).equals(clicked);
								});
							});
						});
					});
				});
			});
		});

		describe('Return value', function () {
			it('Should return last not undefined value from fire', function () {
				const eventEmitter = new Jodit.modules.EventEmitter(),
					simpleObject = {};

				let clicked = 0;

				eventEmitter.on(simpleObject, 'click', function () {
					return 50;
				});

				eventEmitter.on(simpleObject, 'click', function () {
					return 60;
				});

				eventEmitter.on(simpleObject, 'click', function () {});

				clicked = eventEmitter.fire(simpleObject, 'click');

				expect(60).equals(clicked);
			});
		});

		describe('Add event to simple object', function () {
			it('Should work with on handler', function () {
				const eventEmitter = new Jodit.modules.EventEmitter(),
					simpleObject = {};

				let clicked = false;

				eventEmitter.on(simpleObject, 'click', function () {
					clicked = true;
				});

				eventEmitter.fire(simpleObject, 'click');

				expect(true).equals(clicked);
			});

			it('Should work with several handlers', function () {
				const eventEmitter = new Jodit.modules.EventEmitter(),
					simpleObject = {},
					clicked = [];

				eventEmitter.on(simpleObject, 'click', function () {
					clicked.push(1);
				});
				eventEmitter.on(simpleObject, 'click', function () {
					clicked.push(2);
				});

				eventEmitter.fire(simpleObject, 'click');

				expect('1,2').equals(clicked.toString());
			});

			describe('Add event to simple object with namespace', function () {
				describe('Fire event', function () {
					it('Should work with namespace and without namespace', function () {
						const eventEmitter = new Jodit.modules.EventEmitter(),
							simpleObject = {};

						let clicked = 0;

						eventEmitter.on(
							simpleObject,
							'click.jodit',
							function () {
								clicked += 1;
							}
						);

						eventEmitter.fire(simpleObject, 'click.jodit');
						eventEmitter.fire(simpleObject, 'click');

						eventEmitter.fire(simpleObject, 'click.test'); // should not work

						expect(2).equals(clicked);
					});

					it('Should work only for current object', function () {
						const eventEmitter = new Jodit.modules.EventEmitter(),
							simpleObject = {},
							simpleObject2 = {};

						let clicked = 0;

						eventEmitter.on(
							simpleObject,
							'click.jodit',
							function () {
								clicked += 1;
							}
						);

						eventEmitter.fire(simpleObject, 'click.jodit');
						eventEmitter.fire(simpleObject2, 'click');

						expect(1).equals(clicked);
					});
				});

				describe('Remove event listener', function () {
					it('Should remove handler without namespace', function () {
						let clicked = 0;
						const eventEmitter = new Jodit.modules.EventEmitter(),
							simpleObject = {},
							callback = function () {
								clicked += 1;
							};

						eventEmitter.on(simpleObject, 'click.jodit', callback);
						eventEmitter.fire(simpleObject, 'click');

						expect(1).equals(clicked);

						eventEmitter.off(simpleObject, 'click.jodit');

						eventEmitter.fire(simpleObject, 'click.jodit');
						eventEmitter.fire(simpleObject, 'click');

						expect(1).equals(clicked);
					});

					it('Should remove handler  with namespace', function () {
						let clicked = 0;
						const eventEmitter = new Jodit.modules.EventEmitter(),
							simpleObject = {},
							callback = function () {
								clicked += 1;
							};

						eventEmitter.on(simpleObject, 'click', callback);
						eventEmitter.fire(simpleObject, 'click');

						expect(1).equals(clicked);

						eventEmitter.off(simpleObject, 'click.jodit');

						eventEmitter.fire(simpleObject, 'click.jodit'); // should not work
						eventEmitter.fire(simpleObject, 'click');

						expect(2).equals(clicked);
					});

					describe('with namespace', function () {
						it('Should remove handler with namespace only for one event', function () {
							const eventEmitter =
									new Jodit.modules.EventEmitter(),
								simpleObject = {},
								clicked = [],
								callback = function () {
									clicked.push(1);
								};

							eventEmitter.on(
								simpleObject,
								'click.jodit mousedown.jodit',
								callback
							);

							eventEmitter.on(
								simpleObject,
								'mousedown',
								function () {
									clicked.push(2);
								}
							);

							eventEmitter.fire(simpleObject, 'click');

							expect('1').equals(clicked.toString());

							eventEmitter.off(simpleObject, 'click.jodit');

							eventEmitter.fire(simpleObject, 'click.jodit');
							eventEmitter.fire(simpleObject, 'click');

							expect('1').equals(clicked.toString());

							eventEmitter.fire(simpleObject, 'mousedown');

							expect('1,2,1').equals(clicked.toString());

							eventEmitter.off(simpleObject, 'mousedown');

							eventEmitter.fire(simpleObject, 'mousedown');

							expect('1,2,1').equals(clicked.toString());
						});
					});

					describe('Remove event listener for specific handler', function () {
						it('Should remove only specific handler', function () {
							const eventEmitter =
									new Jodit.modules.EventEmitter(),
								simpleObject = {},
								clicked = [],
								callback2 = function () {
									clicked.push(2);
								},
								callback = function () {
									clicked.push(1);
								};

							eventEmitter.on(
								simpleObject,
								'click.jodit',
								callback
							);
							eventEmitter.on(simpleObject, 'click', callback2);

							eventEmitter.fire(simpleObject, 'click');

							expect('2,1').equals(clicked.toString());

							eventEmitter.off(
								simpleObject,
								'click.jodit',
								callback
							);
							eventEmitter.off(
								simpleObject,
								'click.jodit',
								callback2
							);

							eventEmitter.fire(simpleObject, 'click.jodit');
							eventEmitter.fire(simpleObject, 'click');
							expect('2,1,2').equals(clicked.toString());

							eventEmitter.off(simpleObject, 'click', callback2);

							eventEmitter.fire(simpleObject, 'click.jodit');
							eventEmitter.fire(simpleObject, 'click');
							expect('2,1,2').equals(clicked.toString());
						});
					});

					describe('Remove event listener for whole namespace', function () {
						it('Should remove all handlers from namespace', function () {
							let clicked = 0;
							const eventEmitter =
									new Jodit.modules.EventEmitter(),
								simpleObject = {},
								callback = function () {
									clicked += 1;
								};

							eventEmitter.on(
								simpleObject,
								'click.jodit',
								callback
							);
							eventEmitter.on(
								simpleObject,
								'mousedown.jodit',
								callback
							);
							eventEmitter.fire(simpleObject, 'click mousedown');

							expect(2).equals(clicked);

							eventEmitter.off(simpleObject, '.jodit');

							eventEmitter.fire(simpleObject, 'click');
							eventEmitter.fire(simpleObject, 'mousedown');

							expect(2).equals(clicked);
						});
					});
				});
			});
		});

		describe('Native Events', function () {
			it('Create simple event handler on some DOM element', function () {
				let work = false;
				const eventEmitter = new Jodit.modules.EventEmitter(),
					div = document.createElement('button');

				document.body.appendChild(div);

				eventEmitter.on(div, 'click', function () {
					work = true;
				});

				simulateEvent('click', 0, div);

				expect(work).is.true;

				div.parentNode.removeChild(div);
			});

			it('Create simple event handler on some DOM element on few events', function () {
				let work = 0;
				const eventEmitter = new Jodit.modules.EventEmitter(),
					div = document.createElement('button');

				document.body.appendChild(div);

				eventEmitter.on(div, 'click dblclick keydown', function () {
					work++;
				});

				simulateEvent('click', 0, div);
				simulateEvent('dblclick', 0, div);
				simulateEvent('keydown', 0, div);

				expect(work).equals(3);
				div.parentNode.removeChild(div);
			});

			it('Add and remove event handler', function () {
				let work = 0;
				const eventEmitter = new Jodit.modules.EventEmitter(),
					div = document.createElement('button');

				document.body.appendChild(div);

				eventEmitter.on(div, 'click', function () {
					work++;
				});

				simulateEvent('click', 0, div);
				expect(work).equals(1);

				eventEmitter.off(div, 'click');

				simulateEvent('click', 0, div);
				expect(work).equals(1);

				div.parentNode.removeChild(div);
			});

			it('Add a few handlers for several evens and remove all handlers', function () {
				let work = 0;
				const eventEmitter = new Jodit.modules.EventEmitter(),
					div = document.createElement('button');

				document.body.appendChild(div);

				eventEmitter.on(div, 'click', function () {
					work++;
				});

				eventEmitter.on(div, 'dblclick', function () {
					work++;
				});

				eventEmitter.on(div, 'mousedown', function () {
					work++;
				});

				simulateEvent('click', 0, div);
				simulateEvent('dblclick', 0, div);
				simulateEvent('mousedown', 0, div);

				expect(work).equals(3);

				eventEmitter.off(div);

				simulateEvent('click', 0, div);
				simulateEvent('dblclick', 0, div);
				simulateEvent('mousedown', 0, div);

				expect(work).equals(3);

				div.parentNode.removeChild(div);
			});

			it('Add event handler for several elements', function () {
				let work = '';

				const editor = getJodit(),
					eventEmitter = new Jodit.modules.EventEmitter(),
					div1 = editor.ed.createElement('button'),
					div2 = editor.ed.createElement('button');

				editor.ed.body.appendChild(div1);
				editor.ed.body.appendChild(div2);

				div1.textContent = 'test1';
				div2.textContent = 'test2';

				eventEmitter.on([div1, div2], 'click', function () {
					work += this.textContent;
				});

				eventEmitter.fire(div1, 'click');
				eventEmitter.fire(div2, 'click');

				expect(work).equals('test1test2');

				div1.parentNode.removeChild(div1);
				div2.parentNode.removeChild(div2);
			});

			it('Fire trigger', function () {
				let work = 0;
				const eventEmitter = new Jodit.modules.EventEmitter(),
					div = document.createElement('button');

				document.body.appendChild(div);

				eventEmitter.on(div, 'click', function () {
					work++;
				});

				eventEmitter.fire(div, 'click');
				expect(work).equals(1);

				div.parentNode.removeChild(div);
			});

			describe('Remove all handlers using event namespace', function () {
				it('Should remove all handlers in this namespace', function () {
					let work = 0;
					const eventEmitter = new Jodit.modules.EventEmitter(),
						div = document.createElement('button');

					document.body.appendChild(div);

					eventEmitter.on(div, 'click.test', function () {
						work++;
					});

					eventEmitter.on(div, 'mousedown.test', function () {
						work++;
					});

					eventEmitter.fire(div, 'click');
					eventEmitter.fire(div, 'mousedown');
					eventEmitter.fire(div, 'click.test');
					eventEmitter.fire(div, 'mousedown.test');

					expect(work).equals(4);

					eventEmitter.off(div, '.test');

					eventEmitter.fire(div, 'click');
					eventEmitter.fire(div, 'mousedown');
					eventEmitter.fire(div, 'click.test');
					eventEmitter.fire(div, 'mousedown.test');

					expect(work).equals(4);

					div.parentNode.removeChild(div);
				});
			});

			it('Proxy event from iframe.window to main.window', function () {
				let work = 0;

				const eventEmitter = new Jodit.modules.EventEmitter(),
					mousedown = function () {
						work++;
					};

				window.addEventListener('mousedown', mousedown);

				eventEmitter.fire(window, 'mousedown');

				expect(work).equals(1);

				window.removeEventListener('mousedown', mousedown);
			});
		});

		describe('Check destruct', function () {
			describe('For window', function () {
				it('Should remove all handlers', function () {
					const editor = getJodit();
					let checker = 0;

					editor.events.on(window, 'updateSome1', function () {
						checker += 1;
					});

					editor.events.fire(window, 'updateSome1');

					expect(1).equals(checker);

					simulateEvent('updateSome1', 0, window);

					expect(2).equals(checker);

					editor.destruct();

					simulateEvent('updateSome1', 0, window);
					simulateEvent('updateSome1', 0, window);
					simulateEvent('updateSome1', 0, window);

					expect(2).equals(checker);
				});
			});

			describe('For document', function () {
				it('Should remove all handlers', function () {
					const editor = getJodit();
					let checker = 0;

					editor.events.on(document, 'updateSome1', function () {
						checker += 1;
					});

					editor.events.fire(document, 'updateSome1');

					expect(1).equals(checker);

					simulateEvent('updateSome1', 0, document);

					expect(2).equals(checker);

					editor.destruct();

					simulateEvent('updateSome1', 0, document);
					simulateEvent('updateSome1', 0, document);
					simulateEvent('updateSome1', 0, document);

					expect(2).equals(checker);
				});
			});

			describe('For body', function () {
				it('Should remove all handlers', function () {
					const editor = getJodit();
					let checker = 0;

					editor.events.on(document.body, 'updateSome1', function () {
						checker += 1;
					});

					editor.events.fire(document.body, 'updateSome1');

					expect(1).equals(checker);

					simulateEvent('updateSome1', 0, document.body);

					expect(2).equals(checker);

					editor.destruct();

					simulateEvent('updateSome1', 0, document.body);
					simulateEvent('updateSome1', 0, document.body);
					simulateEvent('updateSome1', 0, document.body);

					expect(2).equals(checker);
				});
			});
		});
	});

	describe('Helpers', function () {
		describe('dataBind', function () {
			it('Should save value in object', function () {
				const obj = {
					stop: 2
				};
				Jodit.modules.Helpers.dataBind(obj, 'test', 1);
				expect(Object.keys(obj).toString()).equals('stop');
				expect(Jodit.modules.Helpers.dataBind(obj, 'test')).equals(1);
			});

			describe('remove value', function () {
				it('Should save value in object', function () {
					const obj = {
						stop: 2
					};

					Jodit.modules.Helpers.dataBind(obj, 'test', 1);
					expect(Object.keys(obj).toString()).equals('stop');

					expect(Jodit.modules.Helpers.dataBind(obj, 'test')).equals(
						1
					);

					Jodit.modules.Helpers.dataBind(obj, 'test', 2);

					expect(Jodit.modules.Helpers.dataBind(obj, 'test')).equals(
						2
					);

					Jodit.modules.Helpers.dataBind(obj, 'test', null);

					expect(
						Jodit.modules.Helpers.dataBind(obj, 'test')
					).does.not.equal(2);
				});
			});
		});
	});

	describe('Check case sensitive', function () {
		it('Should call event listener only when match case', function () {
			const eventEmitter = new Jodit.modules.EventEmitter(),
				simpleObject = {};
			let clicked = '';

			eventEmitter.on(simpleObject, 'click', function (count) {
				clicked += count;
			});

			eventEmitter.on(simpleObject, 'CLICK', function (count) {
				clicked += count;
			});

			eventEmitter.fire(simpleObject, 'Click', '1');
			eventEmitter.fire(simpleObject, 'CLICK', '2');
			eventEmitter.fire(simpleObject, 'click', '3');

			expect('23').equals(clicked);
		});
	});

	describe('Option events', function () {
		describe('Set events options', function () {
			it('Should set these in jodit.events', function () {
				let counter = [];
				const editor = getJodit({
					events: {
						afterInit: function () {
							counter.push('afterInit');
						},
						onSome: function () {
							counter.push('onSome');
						}
					}
				});

				editor.e.fire('onSome');

				expect(counter.join('|')).equals('afterInit|onSome');
			});

			describe('For several places', function () {
				it('Should set these in jodit.events', function () {
					let counter = [];
					const editor = getJodit({
						events: {
							afterInit: function () {
								counter.push('afterInit');
							},
							onSome: function () {
								counter.push('onSome');
							}
						}
					});

					editor.addPlace(appendTestArea(), {
						events: {
							afterAddPlace: function () {
								counter.push('afterAddPlace');
							},
							onSome: function () {
								counter.push('onSome.place');
							}
						}
					});

					editor.e.fire('onSome');

					expect(counter.join('|')).equals(
						'afterInit|afterAddPlace|onSome|onSome.place'
					);
				});
			});
		});
	});

	describe('Mute/Unmute', () => {
		describe('Custom event', () => {
			it('Should mute events handlers', () => {
				const editor = getJodit();
				let counter = 0;
				editor.events.on('some', () => {
					counter++;
				});

				editor.events.fire('some');
				editor.events.mute('some');
				editor.events.fire('some');
				editor.events.fire('some');
				editor.events.fire('some');

				expect(editor.events.isMuted('some')).is.true;
				expect(counter).eq(1);

				editor.events.unmute('some');
				editor.events.fire('some');
				editor.events.fire('some');

				expect(counter).eq(3);
			});
		});

		describe('Native event', () => {
			it('Should mute events handlers', () => {
				const editor = getJodit();
				let counter = 0;
				editor.events.on('keydown', () => {
					counter++;
				});

				simulateEvent('keydown', editor);
				editor.events.mute('keydown');
				simulateEvent('keydown', editor);
				simulateEvent('keydown', editor);
				simulateEvent('keydown', editor);
				editor.events.fire('keydown');

				expect(editor.events.isMuted('keydown')).is.true;
				expect(counter).eq(1);

				editor.events.unmute('keydown');
				simulateEvent('keydown', editor);
				simulateEvent('keydown', editor);
				editor.events.fire('keydown', 0);

				expect(counter).eq(4);
			});
		});

		describe('Mute all events', () => {
			it('Should mute all events handlers', () => {
				const editor = getJodit();
				const counter = [];

				editor.events
					.on('keydown', () => {
						counter.push('keydown');
					})
					.on('some', () => {
						counter.push('some');
					});

				simulateEvent('keydown', editor);
				editor.events.fire('some');

				editor.events.mute('*');
				simulateEvent('keydown', editor);
				editor.events.fire('keydown');
				editor.events.fire('some');

				expect(editor.events.isMuted('keydown')).is.true;
				expect(editor.events.isMuted('some')).is.true;
				expect(counter).deep.eq(['keydown', 'some']);

				editor.events.unmute('*');
				expect(editor.events.isMuted('keydown')).is.false;
				expect(editor.events.isMuted('some')).is.false;

				simulateEvent('keydown', editor);
				simulateEvent('keydown', editor);
				editor.events.fire('keydown', 0);
				editor.events.fire('some');

				expect(counter).deep.eq([
					'keydown',
					'some',
					'keydown',
					'keydown',
					'keydown',
					'some'
				]);
			});
		});
	});
});
