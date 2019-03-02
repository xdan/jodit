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
        describe('And exec command', function () {
            it('Should use body like editor area', function(done) {
                unmocPromise();
                var editor = new Jodit(appendTestArea(), {
                    iframe: true,
                    events: {
                        afterConstructor: function (editor) {
                            mocPromise();
                            editor.value = 'test test stop';
                            expect('test test stop').to.be.equal(editor.editorDocument.body.innerHTML);

                            var range = editor.selection.createRange();
                            range.selectNodeContents(editor.editorDocument.body)
                            editor.selection.selectRange(range);

                            editor.execCommand('bold');

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
    describe('Define document for iframe from some site', function () {
        it('Should work perfect', function (done) {
            unmocPromise();
            var area = appendTestArea();

            area.value = "start value";

            var editor = new Jodit(area, {
                iframe: true,
                // preset: "inline",
                // fullsize: true,
                events: {
                    afterConstructor: function (jodit)  {
                        expect(jodit.editor.getAttribute('secret-attriute')).to.be.equal('435'); // loaded from index.html
                        expect(Jodit.modules.Helpers.trim(jodit.value)).to.be.equal('test 435'); // loaded from index.html
                        done();
                    },
                    ['beforeSetValueToEditor']: function () {
                        return false;
                    },
                    ['generateDocumentStructure.iframe']: function (doc, jodit) {
                        jodit.events.stopPropagation('generateDocumentStructure.iframe');
                        return new Promise((resolve) => {
                            jodit.iframe.onload = function () {
                                resolve();
                            };

                            setTimeout(function () {
                                resolve();
                            }, 4000);

                            jodit.iframe.src = 'test.index.html';
                        })
                    }
                }
            });
        }).timeout(5000);
    });
    afterEach(removeStuff);
});
