describe('Jodit Editor Tests', function() {
    describe('Constructor', function() {
        it('Constructor Jodit most be in global scope', function() {
            expect(window.Jodit).to.be.a('function');
        });
        it('First argument for Jodit should be valid selector or HTMLElement', function() {
            var area = appendTestArea('editor');

            var editor = new Jodit('#editor');
            expect(editor.element).to.equal(area);
            editor.destruct();

            var editor2 = new Jodit(area);
            expect(editor2.element).to.equal(area);
            editor2.destruct();
        });
        it('Editor should replace and hide source textarea', function() {
            var area = appendTestArea();
            var editor = new Jodit(area);
            expect(area.style.display).to.equal('none');
            expect(editor.editor).to.equal(document.querySelector('.jodit_wysiwyg'));
        })
        it('Options should be inherited from the default values', function() {
            var area = appendTestArea();
            var editor = new Jodit(area, {
                zIndex: 1986
            });
            expect(editor.options.zIndex).to.equal(1986);
            expect(editor.options.spellcheck).to.equal(true);
        })
    });
    describe('Editors stack', function() {
        it('Jodit.instances should contain all instances of Jodit', function() {
            var editor = new Jodit(appendTestArea('textarea_editor'));
            expect(Jodit.instances.textarea_editor).to.equal(editor);
        });
        it('Jodit.instances should not contain editor after destruct', function() {
            var editor = new Jodit(appendTestArea('textarea_editor'));
            editor.destruct();
            expect(Jodit.instances.textarea_editor).to.be.an('undefined')
        });
    });
    describe('Destructor', function() {
        it('After call "destruct" method, should return source textarea and remove Editor\'s stuf', function() {
            var area = appendTestArea();
            area.style.display = 'block';

            var editor = new Jodit(area);
            expect(area.style.display).to.equal('none');
            expect(editor.container.parentNode).to.equal(area.parentNode    );
            editor.destruct();

            expect(area.style.display).to.equal('block');
            expect(editor.editor).to.equal(undefined);

        });
        it('After call "destruct" method, should return source textarea and remove all Editor\'s stuf', function() {
            var box = document.createElement('div'),
                area = document.createElement('textarea');

            box.appendChild(area);
            document.body.appendChild(box);

            var editor = new Jodit(area);
            editor.destruct();

            expect(box.innerHTML).to.equal('<textarea></textarea>');
            box.parentNode.removeChild(box);
        });
    });
    describe('Set/Get', function () {
        it('Set element value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setElementValue('Test');
            expect(area.value).to.be.equal('Test');
        });
        it('Set wrong element value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            expect(function () {
                editor.setElementValue(document.createTextNode('Test'));
            }).to.throw(/value must be/);
        });
        it('Set editor value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setEditorValue('<div>Test</div>');
            expect(editor.editor.innerHTML).to.be.equal('<div>Test</div>');
        });
        it('Set no string editor value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            expect(function () {
                editor.setEditorValue(document.createElement('div'));
            }).to.throw(/value must be/);
        });
        it('Set wrong editor value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setEditorValue('<div>Test<div>');
            expect(editor.editor.innerHTML).to.be.equal('<div>Test<div></div></div>');
        });
        it('Hide placeholder', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setEditorValue('<div>Test<div>');
            expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'none').to.be.equal(true);
        });
        it('Show placeholder', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setEditorValue('');
            expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'block').to.be.equal(true);
            editor.selection.insertNode(Jodit.modules.Dom.create('text', 'test', editor.doc))
            expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'none').to.be.equal(true);
        });
        it("Placeholder's fontsize", function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.editor.style.fontSize = '12px';
            simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
            expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.fontSize === '12px').to.be.equal(true);
        });
        describe('Synchronization', function () {
            it('Check synchronization between element and editor', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                editor.setEditorValue('<div>Test<div>');
                expect(editor.getElementValue()).to.be.equal('<div>Test<div></div></div>');
            });
            it('Check synchronization between editor and element', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                area.value = '<div>Test</div>';
                editor.setElementValue();
                expect(editor.getEditorValue()).to.be.equal('<div>Test</div>');
            });
            it('Check synchronization between editor and element with wrong html', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                editor.setElementValue('<div>Test<div>');
                expect(editor.getEditorValue()).to.be.equal(editor.getElementValue());
            });
            it('Check synchronization between editor and element when was pressed button', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                editor.setElementValue('<div>Test<div>');
                expect(editor.getEditorValue()).to.be.equal(editor.getElementValue());
                simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
                expect(editor.getEditorValue()).to.be.equal(editor.getElementValue());
            });
        });

    });
    describe('Selection module', function () {
        it('Current selection element should be inside editor', function () {
            var editor = new Jodit(appendTestArea()),
                div = document.createElement('div');
            document.body.appendChild(div);
            div.innerHTML = 'jingl';

            var sel = window.getSelection(),
                range = document.createRange();

            range.selectNodeContents(div);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);

            expect(editor.selection.current()).to.be.equal(false);
            div.parentNode.removeChild(div)
        });
        it('Current selection element', function () {
            var editor = new Jodit(appendTestArea()),
                div = document.createElement('div'),
                text = document.createTextNode('jingl');

            div.appendChild(text);

            editor.selection.insertNode(div);
            editor.selection.setCursorIn(text);

            expect(editor.selection.current()).to.be.equal(text);
        });
        it('Insert simple text node in editor', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.selection.insertNode(document.createTextNode('Test'));
            expect(editor.getEditorValue()).to.be.equal('Test');
            editor.destruct();
        });
        it('Insert 3 divs', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            function insert(digit) {
                var div = document.createElement('div');
                div.innerHTML = digit;
                editor.selection.insertNode(div);
            }

            insert(1);
            insert(2);
            insert(3);

            expect(editor.getEditorValue()).to.be.equal('<div>1</div><div>2</div><div>3</div>');
            editor.destruct();
        });
        it('Insert wrong data', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            expect(function () {
                editor.selection.insertNode()
            }).to.throw(/node most be/);

            expect(function () {
                editor.selection.insertNode('Text')
            }).to.throw(/node most be/);

            expect(function () {
                editor.selection.insertNode(null)
            }).to.throw(/node most be/);

            editor.destruct();
        });
        it('Select all and delete. Check plugin "backspace"', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setEditorValue('<p>asdasd</p><p>asdasd</p><p>asd</p>');
            editor.execCommand('selectall');
            editor.execCommand('delete');
            expect(editor.getEditorValue()).to.be.equal('');
            editor.destruct();
        });
        describe('Cursor position', function () {
            it('Set cursor after node', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                var spans = [document.createElement('span'), document.createElement('span'), document.createElement('span')];

                editor.selection.insertNode(spans[0]);
                editor.selection.insertNode(spans[1]);
                editor.selection.insertNode(spans[2]);

                editor.selection.setCursorAfter(spans[1]);
                editor.selection.insertNode(document.createElement('i'));


                expect(editor.getEditorValue()).to.be.equal('<span></span><span></span><i></i><span></span>');
            });
            it('Set cursor in non placed element', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);

                expect(function () {
                    var div = document.createElement('div')
                    editor.selection.setCursorIn(div);
                }).to.Throw(/in editor/)
            });
        });
    });
    afterEach(function () {
        removeStuff();
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});