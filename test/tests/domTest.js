describe('Check Dom module', function() {
    describe('Method each', function () {
        it('Should pass through all child nodes', function () {
            var node = document.createElement('div');

            node.innerHTML = '<ul>' +
                    '<li>1</li>' +
                    '<li>2</li>' +
                    '<li><img> text</li>' +
                '</ul>';

            var names = [];
            Jodit.modules.Dom.each(node, function (elm) {
                names.push(elm.nodeName);
            });
            expect('UL,LI,#text,LI,#text,LI,IMG,#text').to.equal(names.toString());
        });
    });
    describe('Method isBlock', function () {
        it('Should return true then it gets BLOCK element', function () {
            expect(true).to.equal(Jodit.modules.Dom.isBlock(document.documentElement));
            expect(true).to.equal(Jodit.modules.Dom.isBlock(document.createElement('div')));
            expect(true).to.equal(Jodit.modules.Dom.isBlock(document.createElement('table')));
        });
        it('Should return false then it gets not BLOCK element', function () {
            expect(false).to.equal(Jodit.modules.Dom.isBlock(document.createTextNode('test')));
            expect(false).to.equal(Jodit.modules.Dom.isBlock(document.createElement('span')));
        });
    });

    describe('Method isInlineBlock', function () {
        it('Should return true then it gets inline or inline-block element', function () {
            var box = document.createElement('div');
            box.innerHTML = '<p>' +
                    '<span>test</span>' +
                    '<strong>test</strong>' +
                    '<span style="display: block">test</span>' +
                '</p>'
            document.body.appendChild(box);

            expect(true).to.equal(Jodit.modules.Dom.isInlineBlock(box.firstChild.childNodes[0]));
            expect(true).to.equal(Jodit.modules.Dom.isInlineBlock(box.firstChild.childNodes[1]));
            expect(false).to.equal(Jodit.modules.Dom.isInlineBlock(box.firstChild.childNodes[2]));
            expect(false).to.equal(Jodit.modules.Dom.isInlineBlock(box.firstChild));

            document.body.removeChild(box);
        });
    });

    describe('Method isEmpty', function () {
        it('Should return true then element is empty', function () {
            expect(true).to.equal(Jodit.modules.Dom.isEmpty(document.createElement('div')));
            expect(true).to.equal(Jodit.modules.Dom.isEmpty(document.createElement('table')));
            expect(true).to.equal(Jodit.modules.Dom.isEmpty(document.createTextNode('\uFEFF')));
            expect(true).to.equal(Jodit.modules.Dom.isEmpty(document.createTextNode(' ')));

            var node = document.createElement('div');
            node.innerHTML = '<ul>' +
                '<li></li>' +
                '<li></li>' +
                '<li></li>' +
                '</ul>';

            expect(true).to.equal(Jodit.modules.Dom.isEmpty(node));
        });
        it('Should return false then element is not empty', function () {
            expect(false).to.equal(Jodit.modules.Dom.isEmpty(document.documentElement));
            expect(false).to.equal(Jodit.modules.Dom.isEmpty(document.createTextNode('test')));

            var node = document.createElement('div');
            node.innerHTML = '<ul>' +
                '<li>1</li>' +
                '<li>2</li>' +
                '<li><img> text</li>' +
                '</ul>';

            expect(false).to.equal(Jodit.modules.Dom.isEmpty(node));
        });
    });

    afterEach(removeStuff);
});