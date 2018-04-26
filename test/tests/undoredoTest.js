describe('Undo/Redo behaviors', function() {
    describe('Do some changes', function () {
        it('Should change redo/undo stack', function() {
            var editor = new Jodit(appendTestArea(), {
                observer: {
                    timeout: 0
                }
            });

            editor.setEditorValue('test');

            var range = editor.editorDocument.createRange();
            range.setEnd(editor.editor.firstChild, 4);
            range.collapse(false);
            editor.selection.selectRange(range)


            simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-paragraph'))

            var list = editor.container.querySelector('.jodit_toolbar_list');

            simulateEvent('mousedown', 0, list.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-h1'))

            expect(editor.value).to.be.equal('<h1>test</h1>');

            editor.execCommand('undo');

            expect(editor.value).to.be.equal('test');

            editor.execCommand('redo');

            expect(editor.value).to.be.equal('<h1>test</h1>');
        });
        describe('Several oprations', function () {
            it('Should work perfect', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<p>test</p>' +
                    '<ul>' +
                        '<li>test2</li>' +
                        '<li>test3</li>' +
                        '<li><a>test4</a></li>' +
                    '</ul>';

                var range = editor.editorDocument.createRange();
                range.setStart(editor.editor.firstChild.firstChild, 1);
                range.setEnd(editor.editor.lastChild.firstChild, 1);
                editor.selection.selectRange(range);

                simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

                expect(editor.value).to.be.equal('<p>t</p><ul><li>test3</li><li><a>test4</a></li></ul>');

                editor.execCommand('undo');

                expect(editor.value).to.be.equal('<p>test</p><ul><li>test2</li><li>test3</li><li><a>test4</a></li></ul>');

                range.setStart(editor.editor.firstChild.firstChild, 0);
                range.setEnd(editor.editor.firstChild.firstChild, 3);
                editor.selection.selectRange(range);

                simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

                expect(editor.value).to.be.equal('<p>t</p><ul><li>test2</li><li>test3</li><li><a>test4</a></li></ul>');

                editor.execCommand('undo');

                expect(editor.value).to.be.equal('<p>test</p><ul><li>test2</li><li>test3</li><li><a>test4</a></li></ul>');
            });
        });
    });
    describe('Commands', function () {
        it('Undo. Enter text wait and again enter text. After execute "undo" command. First text should be returned', function() {
            var editor = new Jodit(appendTestArea(), {
                observer: {
                    timeout: 0 // disable delay
                }
            });


            editor.setEditorValue('test');
            editor.setEditorValue('test2');
            editor.execCommand('undo');
            expect(editor.getEditorValue()).to.equal('test');
        });
        it('Redo. Enter text wait and again enter text. After execute "undo" + "redo" command in editor should be second text', function() {
            var editor = new Jodit(appendTestArea(), {
                observer: {
                    timeout: 0
                }
            });

            editor.setEditorValue('test');
            editor.setEditorValue('test2');
            editor.execCommand('undo');
            expect(editor.getEditorValue()).to.equal('test');
            editor.execCommand('redo');
            expect(editor.getEditorValue()).to.equal('test2');
        });
        it('Check react UndoRedo to another changes', function() {
            var editor = new Jodit(appendTestArea(), {
                observer: {
                    timeout: 0
                }
            });


            editor.setEditorValue('test');

            var range = editor.editorDocument.createRange();
            range.setEnd(editor.editor.firstChild, 4);
            range.collapse(false);
            editor.editorWindow.getSelection().removeAllRanges();
            editor.editorWindow.getSelection().addRange(range);

            editor.selection.insertNode(editor.editorDocument.createTextNode('test2'));
            editor.execCommand('undo');
            expect(editor.getEditorValue()).to.equal('test');

            editor.execCommand('redo');
            expect(editor.getEditorValue()).to.equal('testtest2');
        });
    });
    describe('Clear stack', function () {
        it('Should disable both buttons in toolbar and all calls redo and undo must do nothing', function () {
            var editor = new Jodit(appendTestArea(), {
                toolbarAdaptive: false,
                observer: {
                    timeout: 0
                }
            });

            var undo = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-undo');
            expect(undo).to.be.not.equal(null);
            var redo = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-redo');
            expect(redo).to.be.not.equal(null);

            expect(undo.classList.contains('jodit_disabled')).to.be.true;
            expect(redo.classList.contains('jodit_disabled')).to.be.true;

            editor.value = 'test';
            editor.value = 'stop';

            expect(undo.classList.contains('jodit_disabled')).to.be.false;
            expect(redo.classList.contains('jodit_disabled')).to.be.true;

            simulateEvent('mousedown', 0 , undo);
            expect(editor.value).to.be.equal('test');
            expect(undo.classList.contains('jodit_disabled')).to.be.false;
            expect(redo.classList.contains('jodit_disabled')).to.be.false;

            simulateEvent('mousedown', 0 , redo);
            expect(editor.value).to.be.equal('stop');
            expect(undo.classList.contains('jodit_disabled')).to.be.false;
            expect(redo.classList.contains('jodit_disabled')).to.be.true;

            editor.observer.clear();

            expect(undo.classList.contains('jodit_disabled')).to.be.true;
            expect(redo.classList.contains('jodit_disabled')).to.be.true;
            expect(editor.value).to.be.equal('stop');

            editor.execCommand('undo');
            expect(undo.classList.contains('jodit_disabled')).to.be.true;
            expect(redo.classList.contains('jodit_disabled')).to.be.true;
            expect(editor.value).to.be.equal('stop');
        });
    });
    afterEach(removeStuff);
});