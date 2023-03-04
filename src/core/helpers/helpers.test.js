/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test helpers', function () {
	describe('Normalizers', function () {
		describe('normalizeKeyAliases', function () {
			it('Should convert some hotkeys to normal', function () {
				const hotkeys = {
					'cmd+ alt+s': 'meta+alt+s',
					'cmd++': 'meta++',
					'ctrl+ alt+s': 'control+alt+s',
					' command+s': 'meta+s',
					'alt+s+ctrl': 'control+alt+s',
					'shift+ctrl+cmd+D': 'meta+control+shift+d',
					'meta+windows+win+ctrl+cmd': 'meta+control',
					'cmd+ alt+ shift ': 'meta+alt+shift',
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
		describe('fuzzySearchIndex', () => {
			const fuzzySearchIndex = Jodit.modules.Helpers.fuzzySearchIndex;
			const I = Jodit.INVISIBLE_SPACE;

			[
				['needle', 'haystack', 0, -1, 0],
				['eel', 'needle', 0, 1, 4],
				['eel', 'needle', 3, -1, 0],
				['test', 'needle plus test stack', 3, 12, 4],
				['test', 'needle plus te st stack', 3, 12, 5],
				['test', 'needle plus te  st stack', 3, -1, 0],
				[
					'test',
					`invisible char te${I}${I}${I}${I}${I}s${I}t stack`,
					3,
					15,
					10
				]
			].forEach(([needle, haystack, offset, index, len]) => {
				describe(`search "${needle}" in "${haystack}" with offset ${offset}`, () => {
					it(`should return index ${index} and length ${len}`, () => {
						expect(
							fuzzySearchIndex(needle, haystack, offset)
						).deep.eq([index, len]);
					});
				});
			});

			it('should find all substrings', () => {
				const haystack = 'SPAs were a mistake spsa';
				const needle = 'spa';
				const res = fuzzySearchIndex(needle, haystack);

				expect(res).deep.eq([0, 3]);

				const res2 = fuzzySearchIndex(
					needle,
					haystack,
					res[0] + res[1],
					1
				);
				expect(res2).deep.eq([20, 4]);
			});

			it('should find all substrings 2', () => {
				const haystack = 'testtest test';
				const needle = 'te';
				const res = fuzzySearchIndex(needle, haystack);

				expect(res).deep.eq([0, 2]);

				const res2 = fuzzySearchIndex(
					needle,
					haystack,
					res[0] + res[1],
					0
				);
				expect(res2).deep.eq([4, 2]);

				const res3 = fuzzySearchIndex(
					needle,
					haystack,
					res2[0] + res2[1],
					0
				);
				expect(res3).deep.eq([9, 2]);
			});

			it('should find all substrings 2', () => {
				const haystack = '|t|est test test';
				const needle = 't';
				let res = [0, 0];

				[
					[1, 1],
					[5, 1],
					[7, 1],
					[10, 1],
					[12, 1],
					[15, 1]
				].forEach(s => {
					res = fuzzySearchIndex(needle, haystack, res[0] + res[1]);
					expect(res).deep.eq(s);
				});
			});
		});
	});

	describe('HTML', function () {
		describe('stripTags', function () {
			const values = [
				['<p>Type something<p>', 'Type something'],
				['<p>Type <strong>something</strong><p>', 'Type something'],
				[
					'<p>Type <strong>some<br>thing</strong><p>',
					'Type some thing'
				],
				[
					'<p>Type <strong>something</strong></p><p>Type <strong>something</strong></p>',
					'Type something Type something'
				],
				[
					'<p>Type <strong>something</strong></p><p>Type <strong>something</strong><style>* {color: red}</style><script>alert(1)</script> test</p>',
					'Type something Type something test'
				],
				[
					'<p>test <strong>po<br/>p</strong><br/>stop <em>lop</em><br/></p>',
					'<p>test po<br>p<br>stop lop<br></p>',
					new Set(['p', 'br'])
				]
			];

			for (const value of values) {
				describe('Put HTML text input: ' + value[0], function () {
					it('Should return only output: ' + value[1], function () {
						expect(value[1]).equals(
							Jodit.modules.Helpers.stripTags(
								value[0],
								document,
								value[2]
							).replace(/\n/g, '')
						);
					});
				});
			}
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
