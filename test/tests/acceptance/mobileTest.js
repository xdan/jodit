describe('Test mobile mode', function() {
	getBox().style.width = 'auto';

	describe('Toolbar', function() {
		it('Should have different count buttons for different container sizes', function() {
			getBox().style.width = '1000px';
			const editor = new Jodit(appendTestArea(), {
				buttons: [
					'source',
					'|',
					'bold',
					'strikethrough',
					'underline',
					'italic',
					'|',
					'ul',
					'ol',
					'|',
					'outdent',
					'indent',
					'|',
					'font',
					'fontsize',
					'brush',
					'paragraph',
					'|',
					'image',
					'video',
					'table',
					'link',
					'|',
					'align',
					'undo',
					'redo',
					'|',
					'hr',
					'eraser',
					'copyformat',
					'|',
					'symbol',
					'fullsize',
					'print',
					'about'
				]
			});

			expect(27).to.be.below(
				editor.container.querySelectorAll('.jodit_toolbar > li').length
			);

			getBox().style.width = '790px';
			simulateEvent('resize', 0, window);

			expect(28).to.be.above(
				editor.container.querySelectorAll('.jodit_toolbar > li').length
			);

			getBox().style.width = '690px';
			simulateEvent('resize', 0, window);

			expect(26).to.be.above(
				editor.container.querySelectorAll('.jodit_toolbar > li').length
			);

			getBox().style.width = '390px';
			simulateEvent('resize', 0, window);

			expect(15).to.be.above(
				editor.container.querySelectorAll('.jodit_toolbar > li').length
			);
		});
		describe('If buttons were set like string', function() {
			it('Should have different count buttons for different container sizes', function() {
				getBox().style.width = '1000px';
				const editor = new Jodit(appendTestArea(), {
					buttons: 'source,about,print,bold',
					buttonsMD: 'source,about,print',
					buttonsSM: 'source,about',
					buttonsXS: 'source'
				});

				expect(4).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '790px';
				simulateEvent('resize', 0, window);

				expect(3).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '690px';
				simulateEvent('resize', 0, window);

				expect(2).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '390px';
				simulateEvent('resize', 0, window);

				expect(1).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);
			});
		});
		describe('Custom media points', function() {
			it('Should works like as usual', function() {
				getBox().style.width = '500px';

				const editor = new Jodit(appendTestArea(), {
					buttons: 'source,about,print,bold',
					buttonsMD: 'source,about,print',
					buttonsSM: 'source,about',
					buttonsXS: 'source',
					minWidth: 100,
					sizeLG: 400,
					sizeMD: 300,
					sizeSM: 200
				});

				expect(4).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '390px';
				simulateEvent('resize', 0, window);

				expect(3).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '290px';
				simulateEvent('resize', 0, window);

				expect(2).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '190px';
				simulateEvent('resize', 0, window);

				expect(1).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);
			});
		});
		describe('With toolbarAdaptive false', function() {
			it('Should not change toolbar', function() {
				getBox().style.width = '500px';

				const editor = new Jodit(appendTestArea(), {
					buttons: 'source,about,print,bold',
					buttonsMD: 'source,about,print',
					buttonsSM: 'source,about',
					buttonsXS: 'source',
					sizeLG: 400,
					sizeMD: 300,
					sizeSM: 200,
					toolbarAdaptive: false
				});

				expect(4).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '390px';
				simulateEvent('resize', 0, window);

				expect(4).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '290px';
				simulateEvent('resize', 0, window);

				expect(4).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);

				getBox().style.width = '190px';
				simulateEvent('resize', 0, window);

				expect(4).equals(
					editor.container.querySelectorAll('.jodit_toolbar > li')
						.length
				);
			});
		});
	});

	afterEach(removeStuff);
});
