describe('Check Dom module', function() {
	describe('Method each', function() {
		it('Should pass through all child nodes', function() {
			const node = document.createElement('div');

			node.innerHTML = '<ul>' +
				'<li>1</li>' +
				'<li>2</li>' +
				'<li><img> text</li>' +
				'</ul>';

			const names = [];
			Jodit.modules.Dom.each(node, function(elm) {
				names.push(elm.nodeName);
			});
			expect('UL,LI,#text,LI,#text,LI,IMG,#text').equals(names.toString());
		});
	});
	describe('Method isBlock', function() {
		it('Should return true then it gets BLOCK element', function() {
			expect(true).equals(Jodit.modules.Dom.isBlock(document.documentElement, window));
			expect(true).equals(Jodit.modules.Dom.isBlock(document.createElement('div'), window));
			expect(true).equals(Jodit.modules.Dom.isBlock(document.createElement('table'), window));
			expect(true).equals(Jodit.modules.Dom.isBlock(document.createElement('dt'), window));
			expect(true).equals(Jodit.modules.Dom.isBlock(document.createElement('dd'), window));
		});
		it('Should return false then it gets not BLOCK element', function() {
			expect(false).equals(Jodit.modules.Dom.isBlock(document.createTextNode('test'), window));
			expect(false).equals(Jodit.modules.Dom.isBlock(document.createElement('span'), window));
		});
	});

	describe('Method isInlineBlock', function() {
		it('Should return true then it gets inline or inline-block element', function() {
			const box = document.createElement('div');
			box.innerHTML = '<p>' +
				'<span>test</span>' +
				'<strong>test</strong>' +
				'<span style="display: block">test</span>' +
				'</p>';
			document.body.appendChild(box);

			expect(true).equals(Jodit.modules.Dom.isInlineBlock(box.firstChild.childNodes[0]));
			expect(true).equals(Jodit.modules.Dom.isInlineBlock(box.firstChild.childNodes[1]));
			expect(false).equals(Jodit.modules.Dom.isInlineBlock(box.firstChild.childNodes[2]));
			expect(false).equals(Jodit.modules.Dom.isInlineBlock(box.firstChild));

			document.body.removeChild(box);
		});
	});

	describe('Method isEmpty', function() {
		it('Should return true then element is empty', function() {
			expect(true).equals(Jodit.modules.Dom.isEmpty(document.createElement('div')));
			expect(true).equals(Jodit.modules.Dom.isEmpty(document.createElement('table')));
			expect(true).equals(Jodit.modules.Dom.isEmpty(document.createTextNode('\uFEFF')));
			expect(true).equals(Jodit.modules.Dom.isEmpty(document.createTextNode(' ')));

			const node = document.createElement('div');
			node.innerHTML = '<ul>' +
				'<li></li>' +
				'<li></li>' +
				'<li></li>' +
				'</ul>';

			expect(true).equals(Jodit.modules.Dom.isEmpty(node));
		});
		it('Should return false then element is not empty', function() {
			expect(false).equals(Jodit.modules.Dom.isEmpty(document.documentElement));
			expect(false).equals(Jodit.modules.Dom.isEmpty(document.createTextNode('test')));

			const node = document.createElement('div');
			node.innerHTML = '<ul>' +
				'<li>1</li>' +
				'<li>2</li>' +
				'<li><img> text</li>' +
				'</ul>';

			expect(false).equals(Jodit.modules.Dom.isEmpty(node));
		});
	});

	afterEach(removeStuff);
});
