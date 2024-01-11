/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Test mobile mode', function () {
	getBox().style.width = 'auto';

	describe('Toolbar', function () {
		it('Should have different count buttons for different container sizes', function () {
			getBox().style.width = '1400px';
			const editor = getJodit({
				disablePlugins: ['speech-recognize']
			});
			const count = () =>
				editor.container.querySelectorAll(
					'.jodit-toolbar__box .jodit-toolbar-button'
				).length;

			expect(count()).to.eq(window.toolbarButtonsCount);

			getBox().style.width = '790px';
			simulateEvent('resize', window);

			expect(count()).to.eq(window.toolbarButtonsCountMD);

			getBox().style.width = '690px';
			simulateEvent('resize', window);

			expect(count()).to.eq(window.toolbarButtonsCountSM);

			getBox().style.width = '390px';
			simulateEvent('resize', window);

			expect(count()).to.eq(window.toolbarButtonsCountXS);
		});

		describe('Disable plugins', () => {
			it('Should remove buttons from these plugins for all sizes', () => {
				getBox().style.width = '1000px';
				const editor = getJodit({
					disablePlugins: ['table']
				});

				expect(getButton('table', editor)).to.be.null;

				getBox().style.width = '790px';

				simulateEvent('resize', window);

				expect(getButton('table', editor)).to.be.null;

				getBox().style.width = '690px';
				simulateEvent('resize', window);

				expect(getButton('table', editor)).to.be.null;

				getBox().style.width = '390px';
				simulateEvent('resize', window);

				expect(getButton('table', editor)).to.be.null;
			});
		});

		describe('If buttons were set like string', function () {
			it('Should have different count buttons for different container sizes', function () {
				getBox().style.width = '1000px';
				const editor = getJodit({
					buttons: 'source,about,print,bold',
					buttonsMD: 'source,about,print',
					buttonsSM: 'source,about',
					buttonsXS: 'source'
				});

				const count = () =>
					editor.container.querySelectorAll(
						'.jodit-toolbar__box .jodit-toolbar-button'
					).length;

				expect(count()).equals(4);

				getBox().style.width = '790px';
				simulateEvent('resize', window);

				expect(count()).equals(3);

				getBox().style.width = '690px';
				simulateEvent('resize', window);

				expect(count()).equals(2);

				getBox().style.width = '390px';
				simulateEvent('resize', window);

				expect(count()).equals(1);
			});
		});

		describe('Custom media points', function () {
			it('Should works like as usual', function () {
				getBox().style.width = '500px';

				const editor = getJodit({
					buttons: 'source,about,print,bold',
					buttonsMD: 'source,about,print',
					buttonsSM: 'source,about',
					buttonsXS: 'source',
					minWidth: 100,
					sizeLG: 400,
					sizeMD: 300,
					sizeSM: 200
				});

				const count = () =>
					editor.container.querySelectorAll(
						'.jodit-toolbar__box .jodit-toolbar-button'
					).length;

				expect(count()).equals(4);

				getBox().style.width = '390px';
				simulateEvent('resize', window);

				expect(count()).equals(3);

				getBox().style.width = '290px';
				simulateEvent('resize', window);

				expect(count()).equals(2);

				getBox().style.width = '190px';
				simulateEvent('resize', window);

				expect(count()).equals(1);
			});
		});

		describe('With toolbarAdaptive false', function () {
			it('Should not change toolbar', function () {
				getBox().style.width = '500px';

				const editor = getJodit({
					buttons: 'source,about,print,bold',
					buttonsMD: 'source,about,print',
					buttonsSM: 'source,about',
					buttonsXS: 'source',
					sizeLG: 400,
					sizeMD: 300,
					sizeSM: 200,
					toolbarAdaptive: false
				});

				const count = () =>
					editor.container.querySelectorAll(
						'.jodit-toolbar__box .jodit-toolbar-button'
					).length;

				expect(count()).equals(4);

				getBox().style.width = '390px';
				simulateEvent('resize', window);

				expect(count()).equals(4);

				getBox().style.width = '290px';
				simulateEvent('resize', window);

				expect(count()).equals(4);

				getBox().style.width = '190px';
				simulateEvent('resize', window);

				expect(count()).equals(4);
			});
		});
	});
});
