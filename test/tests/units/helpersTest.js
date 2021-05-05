/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Test helpers', function () {
	describe('Normalizers', function () {
		describe('normalizeKeyAliases', function () {
			it('Should convert some hotkeys to normal', function () {
				const hotkeys = {
					'cmd+ alt+s': 'alt+meta+s',
					'cmd++': '++meta',
					'ctrl+ alt+s': 'alt+control+s',
					' command+s': 'meta+s',
					'alt+s+ctrl': 'alt+control+s',
					'shift+ctrl+cmd+D': 'control+d+meta+shift',
					'meta+windows+win+ctrl+cmd': 'control+meta',
					'cmd+ alt+ shift ': 'alt+meta+shift',
					'return + esc ': 'enter+escape'
				};

				Object.keys(hotkeys).forEach(function (key) {
					expect(hotkeys[key]).equals(
						Jodit.modules.Helpers.normalizeKeyAliases(key)
					);
				});
			});
		});

		describe('normalizePath', function () {
			it('Should normalize slashes and join some parts', function () {
				const variants = {
					'/data/test/': ['/data/test/'],
					'data/test/': ['data/test/'],
					'data/test': ['data', 'test', ''],
					'test/test/': ['test//test//'],
					'https://xdsoft.net/jodit/connector/index.html': [
						'https://xdsoft.net',
						'jodit/connector/',
						'/index.html'
					],
					'https://xdsoft.net/jodit/connector/index2.html': [
						'https://xdsoft.net\\jodit/connector/',
						'/index2.html'
					]
				};

				Object.keys(variants).forEach(function (key) {
					expect(key).equals(
						Jodit.modules.Helpers.normalizePath.apply(
							null,
							variants[key]
						)
					);
				});
			});
		});
	});

	describe('Checkers', function () {
		describe('isVoid', function () {
			it('Should check value is undefned or null', function () {
				const values = [
					[1, false],
					[undefined, true],
					[null, true],
					['0', false],
					[false, false]
				];

				for (let i = 0; i < values.length; i += 1) {
					const value = values[i];
					expect(value[1]).equals(
						Jodit.modules.Helpers.isVoid(value[0])
					);
				}
			});
		});

		describe('isURL', function () {
			it('Should check value is URL', function () {
				const variants = {
					'12345678901234567890123': 0,
					'http://j.mp': 1,
					'http://xdan.ru': 1,
					' http://xdan.ru ': 0,
					'https://xdan.ru test': 0,
					'https://xdan.ru?query=1': 1,
					'https://xdan.ru?query': 1,
					'https://xdan.ru:2333?query': 1,
					'http://www.example.com/wpstyle/?p=364': 1,
					'http://userid:password@example.com/': 1,
					'http://userid@example.com:8080/': 1,
					'http://⌘.ws': 1,
					'https://томаты.рф': 1,
					'http://foo.com/blah_(wikipedia)#cite-1': 1,
					'http://foo.bar/?q=Test%20URL-encoded%20stuff': 1,
					'http://a.b-c.de': 1,
					'http://': 0,
					'http://..': 1,
					'http://../': 1,
					'http://##/': 0,
					'http:///a': 1,
					'//xdan.ru?query': 0,
					'//xdan.ru': 0,
					'ftp://xdan.ru': 1,
					'file://xdan.ru': 1,
					'http://142.42.1.1/': 1,
					'http://142.42.1.1:8080/': 1,
					'httpss://xdan.ru': 0,
					'http://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&docid=nIv5rk2GyP3hXM&tbnid=isiOkMe3nCtexM:&ved=0CAUQjRw&url=http%3A%2F%2Fanimalcrossing.wikia.com%2Fwiki%2FLion&ei=ygZXU_2fGKbMsQTf4YLgAQ&bvm=bv.65177938,d.aWc&psig=AFQjCNEpBfKnal9kU7Zu4n7RnEt2nerN4g&ust=1398298682009707': 1,
					'https://demosite.sharepoint.com/:v:/s/PCGKR005/ESMdCz-_rXtIrwSlDVW2mw0BQ8p9J1qtraaCe4VkVPsn_w?e=gEQORV': 1,
					'https://demo.sharepoint.com/:v:/s/PCGKR005/ESMdCz-_rXtIrwSlDVW2mw0BQ8p9J1qtraaCe4VkVPsn_w?e=gEQORV': 1,
					'/index.php': 0
				};

				const values = Object.keys(variants);

				for (let i = 0; i < values.length; i += 1) {
					const key = values[i],
						result = Boolean(variants[key]);

					expect(result).equals(
						Jodit.modules.Helpers.isURL(key),
						`Is domain "${key}"`
					);
				}
			});
		});

		describe('isInt', function () {
			it('Should check value is int or not', function () {
				const values = [
					'cmd+ alt+s',
					false,
					'+1',
					true,
					'-1',
					true,
					'-1dddd',
					false,
					'10',
					true,
					'10.1',
					false,
					'10e10',
					true,
					'10e10',
					true,
					10,
					true,
					11.33,
					false
				];

				for (let i = 0; i < values.length; i += 2) {
					expect(values[i + 1]).equals(
						Jodit.modules.Helpers.isInt(values[i])
					);
				}
			});
		});

		describe('isNumeric', function () {
			it('Should check value is int or not', function () {
				const values = [
					'cmd+ alt+s',
					false,
					'+1',
					true,
					'-1',
					true,
					'-1000.333',
					true,
					'-1dddd',
					false,
					's1999999',
					false,
					' -1 ',
					false,
					'10',
					true,
					'10.1',
					true,
					'12312310.1243234',
					true,
					'10e10',
					true,
					'10e10',
					true,
					10,
					true,
					11.33,
					true
				];

				for (let i = 0; i < values.length; i += 2) {
					expect(values[i + 1]).equals(
						Jodit.modules.Helpers.isNumeric(values[i])
					);
				}
			});
		});

		describe('isNumber', function () {
			it('Should check value is a number', function () {
				const values = [
					'cmd+ alt+s',
					false,
					false,
					false,
					10,
					true,
					11.33,
					true
				];

				for (let i = 0; i < values.length; i += 2) {
					expect(values[i + 1]).equals(
						Jodit.modules.Helpers.isNumber(values[i])
					);
				}
			});
		});
	});

	describe('String', function () {
		describe('18n', function () {
			const i18n = Jodit.modules.Helpers.i18n;

			describe('Put defined sentence', function () {
				it('Should replace it on defined language', function () {
					const values = [
						'Type something',
						'Напишите что-либо',
						'ru',

						'rename',
						'Переименовать',
						'ru',

						'Rename',
						'Переименовать',
						'ru',

						'About Jodit',
						'حول جوديت',
						'ar',

						'about Jodit',
						'حول جوديت',
						'ar',

						'British people',
						'British people',
						'ar'
					];

					for (let i = 0; i < values.length; i += 3) {
						expect(values[i + 1]).equals(
							i18n(
								values[i],
								[],
								{
									language: values[i + 2]
								},
								true
							)
						);
					}
				});

				describe('Put some information inside sentence', function () {
					it('Should put this information inside new sentence', function () {
						const values = [
							'Chars: %d',
							'Символов: 1',
							'ru',
							[1],
							'Select %s',
							'Выделить: Test',
							'ru',
							['Test'],
							'select %s',
							'Выделить: Test',
							'ru',
							['Test'],
							'Bla %d Bla %s',
							'Bla 1 Bla boo',
							'ru',
							[1, 'boo'],
							'Bla %d Bla %s',
							'Bla 1 Bla boo',
							'ru1',
							[1, 'boo']
						];

						for (let i = 0; i < values.length; i += 4) {
							expect(values[i + 1]).equals(
								i18n(
									values[i],
									values[i + 3],
									{
										language: values[i + 2]
									},
									true
								)
							);
						}
					});
				});
			});

			describe('Debug mode', function () {
				it('Should show debug brackets for undefined keys', function () {
					const values = [
						'Type something',
						'Напишите что-либо',
						'ru',

						'About Jodit',
						'حول جوديت',
						'ar',

						'About Jodit',
						'{About Jodit}',
						'ar1',

						'British people',
						'{British people}',
						'ar'
					];

					for (let i = 0; i < values.length; i += 3) {
						expect(values[i + 1]).equals(
							i18n(
								values[i],
								[],
								{
									language: values[i + 2],
									debugLanguage: true
								},
								true
							)
						);
					}
				});
			});

			describe('Define i18n property inside input options', function () {
				it('Should use it', function () {
					const values = [
						'Type something',
						'Привет',
						'ru',
						'About Jodit',
						'جوديت',
						'ar',
						'British people',
						'Bond',
						'ar'
					];

					const opt = {
						ru: {
							'Type something': 'Привет'
						},
						ar: {
							'About Jodit': 'جوديت',
							'British people': 'Bond'
						}
					};

					for (let i = 0; i < values.length; i += 3) {
						expect(values[i + 1]).equals(
							i18n(
								values[i],
								[],
								{
									language: values[i + 2],
									i18n: opt,
									debugLanguage: true
								},
								true
							)
						);
					}
				});
			});
		});
	});

	describe('HTML', function () {
		describe('stripTags', function () {
			describe('Put HTML text', function () {
				it('Should return only text', function () {
					const values = [
						['<p>Type something<p>', 'Type something'],
						[
							'<p>Type <strong>something</strong><p>',
							'Type something'
						],
						[
							'<p>Type <strong>some<br>thing</strong><p>',
							'Type some thing'
						],
						[
							'<p>Type <strong>something</strong></p><p>Type <strong>something</strong></p>',
							'Type something Type something'
						]
					];

					for (let i = 0; i < values.length; i += 1) {
						expect(values[i][1]).equals(
							Jodit.modules.Helpers.stripTags(
								values[i][0]
							).replace(/\n/g, '')
						);
					}
				});
			});
		});
	});

	describe('Object', function () {
		describe('get', function () {
			it('Should get value from keyChain else return null', function () {
				const obj = {
					a1: 2,
					a: {
						b1: [
							{
								key: 5
							}
						],
						b: {
							c: {
								d: {
									e: 1
								},
								e: false
							}
						}
					}
				};

				const values = [
					['', null],
					[undefined, null],
					[null, null],
					['a1', 2],
					['a', obj.a],
					['a2', null],
					['a.b.c.d.e', 1],
					['a.b.c.e', false],
					['a.b.r.d.e', null],
					['a.b1.0.key', 5],
					['a.b1.0.key1', null]
				];

				for (let i = 0; i < values.length; i += 1) {
					const value = values[i];
					expect(value[1]).equals(
						Jodit.modules.Helpers.get(value[0], obj)
					);
				}
			});
		});

		describe('set', function () {
			it('Should set value by keyChain', function () {
				let obj = {};

				const values = [
					['', null, {}],
					[undefined, null, {}],
					[null, null, {}],
					['a1', 2, { a1: 2 }],
					['a', 1, { a1: 2, a: 1 }],
					['a2', null, { a1: 2, a: 1, a2: null }],
					[
						'a.b.c.d.e',
						1,
						{
							a1: 2,
							a: {
								b: {
									c: {
										d: {
											e: 1
										}
									}
								}
							},
							a2: null
						}
					],
					[
						'a.b.c.d.e',
						1,
						{
							a1: 2,
							a: {
								b: {
									c: {
										d: {
											e: 1
										}
									}
								}
							},
							a2: null
						}
					],
					[
						'a.b.c.e',
						false,
						{
							a1: 2,
							a: {
								b: {
									c: {
										e: false,
										d: {
											e: 1
										}
									}
								}
							},
							a2: null
						}
					],
					[
						'a.b1.0.key',
						5,
						{
							a1: 2,
							a: {
								b1: [{ key: 5 }],
								b: {
									c: {
										e: false,
										d: {
											e: 1
										}
									}
								}
							},
							a2: null
						}
					]
				];

				for (let i = 0; i < values.length; i += 1) {
					const value = values[i];
					Jodit.modules.Helpers.set(value[0], value[1], obj);
					expect(obj).deep.eq(value[2]);
				}
			});
		});
	});

	describe('Utils', function () {
		describe('reset', function () {
			it('It should reset native browser method', function () {
				expect(typeof Jodit.modules.Helpers.reset('Array.from')).equals(
					'function'
				);

				expect(Jodit.modules.Helpers.reset('Array.from') !== Array.from)
					.is.true;

				expect(
					Jodit.modules.Helpers.reset('Array.from')(
						new Set([1, 2, 3])
					)
				).deep.equals([1, 2, 3]);

				expect(
					Jodit.modules.Helpers.reset('Array.from')('123')
				).deep.equals(['1', '2', '3']);
			});

			it('should be cached', function () {
				expect(Jodit.modules.Helpers.reset('Array.from') !== Array.from)
					.is.true;

				expect(
					Jodit.modules.Helpers.reset('Array.from') ===
						Jodit.modules.Helpers.reset('Array.from')
				).is.true;
			});
		});

		describe('getClassName', function () {
			const getClassName = Jodit.modules.Helpers.getClassName;

			it('Should return normal(not uglifyed) name for instance of class', function () {
				expect(getClassName(Jodit.modules.Popup.prototype)).equals(
					'Popup'
				);
				expect(getClassName(Jodit.modules.UIButton.prototype)).equals(
					'UIButton'
				);
				expect(
					getClassName(Jodit.modules.ToolbarButton.prototype)
				).equals('ToolbarButton');
			});
		});
	});

	describe('Config prototype', function () {
		const ConfigProto = Jodit.modules.Helpers.ConfigProto;

		it('Should use object B as prototype for A', function () {
			const A = {
				a: 1,

				e: {
					f: {
						g: 5
					}
				}
			};
			const B = {
				a: 2,
				b: 3,
				e: {
					f: {
						g: 6,
						h: 7
					}
				}
			};

			const C = ConfigProto(A, B);

			expect(C).does.not.eq(A);
			expect(C.a).eq(1);
			expect(C.b).eq(3);
			expect(C.e.f.g).eq(5);
			expect(C.e.f.h).eq(7);

			B.e.f.h = 9;
			expect(C.e.f.h).eq(9);
		});

		describe('Several prototypes', function () {
			it('Should use all objects as prototype for A', function () {
				const A = {
					a: 1,

					e: {
						f: {
							g: 5
						}
					}
				};

				const B = {
					a: 2,
					b: 3,
					e: {
						f: {
							g: 6,
							k: 90
						}
					}
				};

				const C = {
					e: {
						f: {
							h: 7
						}
					}
				};

				const D = ConfigProto(A, ConfigProto(B, C));

				expect(D).does.not.eq(A);
				expect(D.a).eq(1);
				expect(D.b).eq(3);
				expect(D.e.f.g).eq(5);
				expect(D.e.f.h).eq(7);
				expect(D.e.f.k).eq(90);

				C.e.f.h = 9;
				expect(D.e.f.h).eq(9);
			});
		});

		describe('Atom values', function () {
			it('Should not merge', function () {
				const A = {
					a: Jodit.atom({
						b: {
							c: 1
						}
					})
				};

				const B = {
					a: {
						b: {
							c: 1,
							e: 5
						}
					}
				};

				const res = ConfigProto(A, B);

				expect(res.a.b.c).eq(1);
				expect(res.a.b.e).eq(undefined);
			});
		});

		describe('Arrays', function () {
			it('Should merge - not concat', function () {
				const A = {
					a: {
						b: [1, 2, 3, 4]
					}
				};

				const B = {
					a: {
						b: [5, 6, 7, 8, 9]
					}
				};

				const res = ConfigProto(A, B);

				expect(res.a.b).deep.eq([1, 2, 3, 4, 9]);
			});

			describe('Atom array', function () {
				it('Should be not merged', function () {
					const A = {
						a: { b: Jodit.atom([1, 2, 3, 4]) }
					};

					const B = {
						a: { b: [5, 6, 7, 8, 9] }
					};

					const res = ConfigProto(A, B);

					expect(res.a.b).deep.eq([1, 2, 3, 4]);
				});

				describe('On first level all arrays', function () {
					it('Should work as atomic', function () {
						const A = {
							a: [1, 2, 3, 4]
						};

						const B = {
							a: [5, 6, 7, 8, 9]
						};

						const res = ConfigProto(A, B);

						expect(res.a).deep.eq([1, 2, 3, 4]);
					});
				});
			});
		});
	});
});
