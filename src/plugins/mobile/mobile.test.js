/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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

		describe('When only a custom `buttons` list is set (no buttonsMD/SM/XS)', function () {
			// #1389: resizing narrower switched to the group-based buttonsMD/SM/XS
			// defaults, surfacing buttons the user never requested. Resizing must
			// only ever drop buttons, never add ones outside `buttons`.
			it('Should never show buttons that were not requested on resize', function () {
				getBox().style.width = '1000px';
				const editor = getJodit({
					disablePlugins: ['speech-recognize'],
					buttons: ['bold', 'italic', 'underline', 'strikethrough']
				});

				const count = () =>
					editor.container.querySelectorAll(
						'.jodit-toolbar__box .jodit-toolbar-button'
					).length;

				expect(count()).equals(4);
				expect(getButton('image', editor)).to.be.null;

				[790, 690, 390].forEach(width => {
					getBox().style.width = width + 'px';
					simulateEvent('resize', window);

					expect(count()).equals(4);
					expect(getButton('bold', editor)).to.be.not.null;
					expect(getButton('image', editor)).to.be.null;
					expect(getButton('ul', editor)).to.be.null;
				});
			});
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

		describe('When the toolbar is rendered into an external container', function () {
			let toolbarBox;

			beforeEach(() => {
				toolbarBox = document.createElement('div');
				document.body.appendChild(toolbarBox);
			});

			afterEach(() => {
				toolbarBox.remove();
			});

			it('Should choose the buttons by the width of that container', function () {
				getBox().style.width = '390px';
				toolbarBox.style.width = '1000px';

				const editor = getJodit({
					toolbar: toolbarBox,
					buttons: 'source,about,print,bold',
					buttonsMD: 'source,about,print',
					buttonsSM: 'source,about',
					buttonsXS: 'source'
				});

				const count = () =>
					toolbarBox.querySelectorAll('.jodit-toolbar-button').length;

				expect(editor.container.contains(toolbarBox)).is.false;
				expect(count()).equals(4);

				toolbarBox.style.width = '790px';
				simulateEvent('resize', window);

				expect(count()).equals(3);

				toolbarBox.style.width = '690px';
				simulateEvent('resize', window);

				expect(count()).equals(2);

				toolbarBox.style.width = '390px';
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
