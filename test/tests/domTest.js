describe('Check Dom module', function() {
    appendTestArea('tested__dom_area', true);
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

    after(function() {
        tested__dom_area.parentNode.removeChild(tested__dom_area);
    });
    afterEach(function () {
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});