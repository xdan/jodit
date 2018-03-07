describe('Test Inline mode', function () {
    describe('init with inline option', function () {
        describe('For TEXTAREA', function () {
            it('Should hide textarea like standart mode', function () {
                var area = appendTestArea(),
                    editor = new Jodit(area, {
                        inline: true
                    });

                expect(editor.container).to.be.not.equal(area);
                expect(editor.container.nextSibling).to.be.equal(area);
                expect(area.style.display).to.be.equal('none');
                expect(area.value).to.be.equal(editor.value);
            });
        });
        describe('For DIV', function () {
            it('Should use this element like container', function () {
                var div = appendTestDiv(), value = '<p>HTML</p>';

                div.innerHTML = value;

                var editor = new Jodit(div, {
                    inline: true,
                    observer: {
                        timeout: 0
                    }
                });

                expect(editor.container).to.be.equal(div);
                expect(editor.container.querySelector('.jodit_workplace')).to.be.not.equal(null);
                expect(editor.container.querySelector('.jodit_wysiwyg')).to.be.not.equal(null);
                expect(editor.ownerWindow.getComputedStyle(div).display).to.be.equal('block');
                expect(value).to.be.equal(editor.value);
            });
        });
        describe('For H1', function () {
            it('Should use this element like container', function () {
                var div = document.createElement('h1'), value = 'HTML';

                div.innerHTML = value;

                box.appendChild(div)

                var editor = new Jodit(div, {
                    inline: true,
                    observer: {
                        timeout: 0
                    }
                });



                expect(editor.container).to.be.equal(div);
                expect(editor.container.querySelector('.jodit_workplace')).to.be.not.equal(null);
                expect(editor.container.querySelector('.jodit_wysiwyg')).to.be.not.equal(null);
                expect(editor.ownerWindow.getComputedStyle(div).display).to.be.equal('block');
                expect(value).to.be.equal(editor.value);

                div.parentNode.removeChild(div)
            });
        });
    });
    describe('Destruct Jodit', function () {
        describe('For TEXTAREA', function () {
            it('Should show textarea like standart mode', function () {
                var area = appendTestArea(),
                    editor = new Jodit(area, {
                        inline: true
                    });

                editor.destruct();
                expect(area.style.display).to.be.not.equal('none');
            });
        });
        describe('For DIV', function () {
            it('Should remove all extra classes and remove all extra elements', function () {
                var div = appendTestDiv(),
                    value = '<p>HTML</p>';

                div.style.display = 'block';
                div.innerHTML = value;

                var editor = new Jodit(div, {
                    inline: true,
                    observer: {
                        timeout: 0
                    }
                });

                editor.destruct();

                expect(editor.ownerWindow.getComputedStyle(div).display).to.be.equal('block');

                expect(div.innerHTML).to.be.equal(value);
                expect(div.className.toString()).to.be.equal('');
            });
        });
    });
    afterEach(function () {
        Object.keys(Jodit.instances).forEach(function (key) {
            Jodit.instances[key].destruct();
        });
        removeStuff();
    });
});