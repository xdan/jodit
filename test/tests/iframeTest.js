describe('Iframe mode', function() {
    describe('Create editor with iframe node', function () {
        it('Should create editable area in another document', function() {
            var editor = new Jodit(appendTestArea(), {
                iframe: true,
            });

            expect(editor.ownerDocument).to.be.not.equal(editor.editorDocument);
            expect('true').to.be.equal(editor.editorDocument.body.getAttribute('contenteditable'));
        });
        it('Should have same direction and language', function() {
            var editor = new Jodit(appendTestArea(), {
                iframe: true,
                direction: 'rtl',
                language: 'de',
            });

            expect('rtl').to.be.equal(editor.editorDocument.documentElement.getAttribute('dir'));
            expect('de').to.be.equal(editor.editorDocument.documentElement.getAttribute('lang'));
        });
        describe('And exec command', function () {
            it('Should use body like editor area', function() {
                var editor = new Jodit(appendTestArea(), {
                    iframe: true,
                });
                editor.setEditorValue('test test stop')
                expect('test test stop').to.be.equal(editor.editorDocument.body.innerHTML);

                var range = editor.editorDocument.createRange();
                range.selectNodeContents(editor.editorDocument.body)
                editor.selection.selectRange(range);

                editor.execCommand('bold')

                expect('<strong>test test stop</strong>').to.be.equal(editor.editorDocument.body.innerHTML);
            });
        });
    });
    afterEach(removeStuff);
});