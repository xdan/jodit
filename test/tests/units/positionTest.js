describe('Test position/offset helpers', function() {
	let box;

	function makeBox(doc) {
		doc = doc || document;
		const win = document.defaultView;

		box = doc.createElement('div');
		box.id = 'uniq';
		box.setAttribute(
			'style',
			'height: 2000px; width: 100%;border: 20px solid red; padding: 20px; margin: 20px;'
		);

		const style = doc.createElement('style');
		style.innerHTML =
			'html, body {height: 5000px; width: 5000px;} #uniq, #uniq strong, #uniq div {line-height:18px;font-family: Arial;box-sizing:content-box; } #uniq strong {height:18px;display:block}';
		box.appendChild(style);

		doc.body.appendChild(box);
		win.scrollTo(0, box.offsetTop);

		const div = doc.createElement('div');

		for (let i = 0; i < 30; i += 1) {
			const s = doc.createElement('strong');
			// s.textContent = i;
			div.appendChild(s);
		}

		box.appendChild(div);
		div.setAttribute(
			'style',
			'position: relative; height: 300px; width: 100%;border: 20px solid red; padding: 20px 0 0 20px; margin: 20px 0 0 20px; overflow: auto;'
		);

		const div2 = doc.createElement('div');
		div.appendChild(div2);
		div2.setAttribute(
			'style',
			'position: relative; min-height: 200px; width: 100%;border: 10px solid yellow; padding: 20px 0 0 20px; margin: 20px 0 0 20px;'
		);

		const div3 = doc.createElement('div');
		div2.appendChild(div3);
		div3.setAttribute(
			'style',
			'position: relative; min-height: 200px; width: 100%;border: 10px solid green; padding: 20px 0 0 20px; margin: 20px 0 0 20px;'
		);

		const span = doc.createElement('span');
		div3.appendChild(doc.createElement('strong'));
		div3.appendChild(doc.createElement('strong'));
		div3.appendChild(doc.createElement('strong'));
		div3.appendChild(span);
		span.setAttribute(
			'style',
			'width: 100%;border: 10px solid blue; padding: 20px 0 0 20px; margin: 20px 0 0 20px;'
		);
		span.innerHTML = 'hi';

		div.scrollTo(0, 100000);

		return span;
	}

	describe('Test position helper', function() {
		it('Should calculate correct screen position of element', function() {
			const jodit = Jodit.make(appendTestArea());

			const span = makeBox();

			const pos = Jodit.modules.Helpers.position(span, jodit);

			createPoint(pos.left, pos.top, '#cdf', true);

			expect(pos.top).equals(204);
			expect(pos.left).equals(240);
		});

		describe('In the out of the screen', function() {
			it('Should show negative screen coordinates', function() {
				const jodit = Jodit.make(appendTestArea());

				const span = makeBox();

				window.scrollTo(0, box.offsetTop + 1500);
				const pos = Jodit.modules.Helpers.position(span, jodit);

				expect(Math.abs(pos.top - -1294)).is.below(4);
				expect(pos.left).equals(240);
				createPoint(pos.left, pos.top, '#cdf', true);
			});
		});

		describe('In iframe', function() {
			it('Should calculate correct screen position of element', function() {
				fillBox(100);

				const jodit = Jodit.make(appendTestArea(), {
					iframe: true,
					height: 10000
				});

				const span = makeBox(jodit.editorDocument);
				window.scrollTo(0, jodit.container.offsetTop - 100);

				const pos = Jodit.modules.Helpers.position(span, jodit);
				createPoint(pos.left, pos.top, '#cdf', true);

				expect(Math.abs(pos.top - 403)).is.below(3);
				expect(pos.left).equals(251);
			});
		});
	});

	describe('Test offset helper', function() {
		it('Should calculate correct absolute position of element from top of document', function() {
			const span = makeBox(),
				jodit = Jodit.make(appendTestArea());

			jodit.editor.appendChild(box);
			box.firstChild.scrollTo(0, 100000);

			window.scrollTo(0, jodit.container.offsetTop);
			jodit.editor.scrollTo(0, span.offsetTop);

			const pos = Jodit.modules.Helpers.offset(
				span,
				jodit,
				jodit.editorDocument
			);

			createPoint(pos.left, pos.top, '#cdf');

			expect(pos.top - box.offsetTop - window.scrollY).equals(832);
			expect(pos.left).equals(251);
		});

		describe('In iframe', function() {
			it('Should calculate correct absolute position of element from top of document', function() {
				const jodit = Jodit.make(appendTestArea(), {
					iframe: true,
					height: 10000
				});

				span = makeBox(jodit.editorDocument);
				box.firstChild.scrollTo(0, 100000);

				window.scrollTo(0, jodit.container.offsetTop);
				jodit.editor.scrollTo(0, span.offsetTop);

				const pos = Jodit.modules.Helpers.offset(
					span,
					jodit,
					jodit.editorDocument
				);

				expect(
					Math.abs(pos.top -
						box.offsetTop -
						jodit.ownerWindow.scrollY -
						jodit.editorWindow.screenY - 250)
				).is.below(3);
				expect(pos.left).equals(251);

				createPoint(pos.left, pos.top, '#cdf');
			});
		});
	});

	afterEach(function() {
		Jodit.modules.Dom.safeRemove(box);
	});
});
