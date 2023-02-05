/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
('i18n' in window.skipTest ? describe.skip : describe)(
	'Test i18n functionality',
	function () {
		describe('Helper 18n', function () {
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
				const [source, result, language] = [
					values[i],
					values[i + 1],
					values[i + 2]
				];

				describe(`Debug mode for ${language}`, function () {
					it(`Should show debug brackets for undefined keys for source ${source}`, function () {
						expect(result).equals(
							i18n(
								source,
								[],
								{
									language,
									debugLanguage: true
								},
								true
							)
						);
					});
				});
			}

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

		describe('Test has keys in all functionality', function () {
			const filter = [
				'customxxx',
				'customxxx',
				'lineHeight',
				'Ok',
				'Link',
				'Code',
				'Embed code',
				'Normal',
				'Text',
				'Split',
				'Jodit Editor',
				'License: %s',
				'Split vertical',
				'Src',
				'Edit',
				'Split horizontal',
				'Styles',
				'Classes',
				'Alternative',
				'Image',
				'spellcheck',
				'Border'
			];

			Object.keys(Jodit.lang)
				.filter(function (language) {
					return language !== 'en';
				})
				.forEach(function (language) {
					it(
						'Should have value for all key in ' +
							language +
							' language',
						function () {
							const editor = getJodit({
								language: language,
								debugLanguage: true
							});

							i18nkeys
								.filter(function (key) {
									return (
										filter.indexOf(key) === -1 &&
										!/^[0-9]+(\.[0-9]+)?(pt|px)?$/.test(key)
									);
								})
								.forEach(function (key) {
									expect('{' + key + '}').does.not.equal(
										editor.i18n(key)
									);
								});
						}
					);
				});
		});
		describe('Test i18n function', function () {
			it('Should show value in current language', function () {
				const editor = getJodit({
					language: 'ru',
					i18n: {
						ru: {
							'Test %s': 'Тест %s',
							'Test %d': 'Тест %d',
							'Test %s %d': 'Тест %s %d'
						}
					}
				});
				expect(editor.i18n('Type something')).equals(
					'Напишите что-либо'
				);
				expect(editor.i18n('Test %s', 'строка')).equals('Тест строка');
				expect(editor.i18n('Test %s %d', 'строка', 1)).equals(
					'Тест строка 1'
				);
			});
		});
	}
);
