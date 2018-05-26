describe('Iframe mode', function() {
    describe('Create editor with iframe node', function () {
        it('Should create editable area in another document', function(done) {
            unmocPromise();
            var editor = new Jodit(appendTestArea(), {
                iframe: true,
                events: {
                    afterConstructor: function (editor) {
                        expect(editor.ownerDocument).to.be.not.equal(editor.editorDocument);
                        expect('true').to.be.equal(editor.editorDocument.body.getAttribute('contenteditable'));
                        done();
                    }
                }
            });
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
            it('Should use body like editor area', function(done) {
                unmocPromise();
                var editor = new Jodit(appendTestArea(), {
                    iframe: true,
                    events: {
                        afterConstructor: function (editor) {
                            editor.setEditorValue('test test stop')
                            expect('test test stop').to.be.equal(editor.editorDocument.body.innerHTML);

                            var range = editor.editorDocument.createRange();
                            range.selectNodeContents(editor.editorDocument.body)
                            editor.selection.selectRange(range);

                            editor.execCommand('bold')

                            expect('<strong>test test stop</strong>').to.be.equal(editor.editorDocument.body.innerHTML);
                            done();
                        }
                    }
                });
            });
        });
        describe('Set value right after construct', function (done) {
            it('Should set/get value without some trouble', function (done) {
                unmocPromise();
                var area = appendTestArea();
                area.value = 'stop';

                var editor = new Jodit(area, {
                    iframe: true,
                    events: {
                        afterConstructor: function (editor) {
                            expect(editor.value).to.be.equal('test');
                            done();
                        }
                    }
                });

                expect(editor.value).to.be.equal('stop');
                editor.value = 'test';
                expect(editor.value).to.be.equal('test');
            });
        });
    });
    afterEach(removeStuff);
});