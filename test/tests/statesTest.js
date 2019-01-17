describe('Test states', function() {

    describe('ReadOnly', function () {
        describe('Set readonly mode in options', function () {
            describe('Readonly', function () {
                it('Should deny edit content in simple source editor', function () {
                    var editor = new Jodit(appendTestArea(), {
                        readonly: true,
                        useAceEditor: false
                    });
                    editor.setMode(Jodit.MODE_SOURCE);
                    expect(true).to.be.equal(editor.__plugins.source.mirror.hasAttribute('readonly'));
                });
            });
            describe('For iframe', function () {
                it('Should deny edit content in iframe\'s body', function (done) {
                    unmocPromise();

                    var editor = new Jodit(appendTestArea(), {
                        readonly: true,
                        iframe: true,
                        events: {
                            afterConstructor: function () {
                                expect(false).to.equal(editor.editor.hasAttribute('contenteditable'));
                                expect('BODY').to.equal(editor.editor.nodeName);
                                done();
                            }
                        }
                    });

                });
            });
            it('Should deny edit content in wysiwyg', function () {
                var editor = new Jodit(appendTestArea(), {
                    readonly: true
                });
                expect(false).to.equal(editor.editor.hasAttribute('contenteditable'));
            });
            it('Should deny exec any commands', function () {
                var editor = new Jodit(appendTestArea(), {
                    readonly: true
                });

                editor.setEditorValue('test');

                editor.selection.select(editor.editor.firstChild);

                editor.execCommand('bold');

                expect('test').to.equal(editor.getEditorValue());
            });
            it('Should disable all toolbar buttons besides source, print, about, fullsize', function () {
                var editor = new Jodit(appendTestArea(), {
                    readonly: true,
                    toolbarAdaptive: false,
                    observer: {
                        timeout: 0
                    }
                });

                editor.setEditorValue('test');
                var buttons = [].slice.call(editor.container.querySelectorAll('.jodit_toolbar_btn'));
                buttons.forEach(function (btn) {
                    if (!/(source|print|about|fullsize|separator|selectall|break)/.test(btn.className)) {
                        expect(true).to.be.equal(btn.classList.contains('jodit_disabled'));
                        expect(true).to.be.equal(btn.hasAttribute('disabled'));
                    }
                });
            });
            describe('Readonly for ACE', function (done) {
                it('Should deny edit content in ace source editor', function(done) {
                    var editor = new Jodit(appendTestArea(), {
                        readonly: true,
                        useAceEditor: true,
                        events: {
                            'aceInited': function(editor) {
                                expect(null).to.be.not.equal(editor.__plugins.source.aceEditor);
                                expect(true).to.be.equal(editor.__plugins.source.aceEditor.getReadOnly());
                                done();
                            }
                        }
                    });
                    editor.setMode(Jodit.MODE_SOURCE);
                    expect(true).to.be.equal(editor.__plugins.source.mirror.hasAttribute('readonly'));

                }).timeout(6000);
            });
            it('Should hide placeholder', function () {
                var table_editor_interface = appendTestArea();
                table_editor_interface.value = '';
                var editor = new Jodit(table_editor_interface, {
                    readonly: true
                });
                expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'none').to.be.equal(true);
                editor.setEditorValue('test');
                expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'none').to.be.equal(true);
            });
            describe('Search plugin', function () {
                describe('CTRL + H', function () {
                    describe('In readonly editor', function () {
                        it('Should be deny', function () {
                            var editor = new Jodit(appendTestArea(), {
                                readonly: true,
                                observer: {
                                    timeout: 0
                                }
                            });

                            var search = editor.container.querySelector('.jodit_search');
                            expect(false).to.equal(search.classList.contains('jodit_search-active'));
                            simulateEvent('keydown', Jodit.KEY_H, editor.editor, function (options) {
                                options.ctrlKey = true
                            });
                            expect(false).to.equal(search.classList.contains('jodit_search-active'));
                            expect(false).to.equal(search.classList.contains('jodit_search-and-replace'));
                            expect(false).to.equal(editor.ownerDocument.activeElement === search.querySelector('.jodit_search-query'));
                        });
                    });
                });
            });
            describe('Method get read only', function () {
                it('Should return enable/disable readonly', function () {
                    var editor = new Jodit(appendTestArea(), {
                        readonly: true
                    });
                    expect(true).to.equal(editor.getReadOnly());
                    editor.setReadOnly(false)
                    expect(false).to.equal(editor.getReadOnly());
                    editor.destruct();

                    var editor = new Jodit(appendTestArea());
                    expect(false).to.equal(editor.getReadOnly());
                });
            });
        });

        describe('Set readonly mode by source element attribute', function () {
            it('Should work like by options', function () {
                var area = appendTestArea();

                area.setAttribute('readonly', 'true');

                var editor = new Jodit(area);

                expect(editor.editor.hasAttribute('contenteditable')).to.be.false;
                expect(editor.getReadOnly()).to.be.true;
            });

            describe('In short form', function () {
                it('Should work like by options', function () {
                    var area = appendTestArea();

                    area.setAttribute('readonly', '');

                    var editor = new Jodit(area);

                    expect(editor.editor.hasAttribute('contenteditable')).to.be.false;
                    expect(editor.getReadOnly()).to.be.true;
                });

            });
        });

        describe('Disable readonly mode', function () {
            it('Should allow edit content in wysiwyg', function () {
                var editor = new Jodit(appendTestArea(), {
                    readonly: true
                });
                expect(false).to.equal(editor.editor.hasAttribute('contenteditable'));
                editor.setReadOnly(false);
                expect(true).to.equal(editor.editor.hasAttribute('contenteditable'));
            });
            it('Should allow edit content in simple source editor', function () {
                var editor = new Jodit(appendTestArea(), {
                    readonly: true,
                    useAceEditor: false
                });
                editor.setMode(Jodit.MODE_SOURCE);
                expect(true).to.equal(editor.__plugins.source.mirror.hasAttribute('readonly'));

                editor.setReadOnly(false);

                expect(false).to.equal(editor.__plugins.source.mirror.hasAttribute('readonly'));
            });
            it('Should allow edit content in ace source editor', function (done) {
                var editor = new Jodit(appendTestArea(), {
                    readonly: true,
                    useAceEditor: true,
                    defaultMode: Jodit.MODE_SOURCE,
                    events: {
                        'aceInited': function (editor) {
                            expect(null).to.be.not.equal(editor.__plugins.source.aceEditor);
                            expect(true).to.be.equal(editor.__plugins.source.aceEditor.getReadOnly());

                            editor.setReadOnly(false);
                            expect(false).to.be.equal(editor.__plugins.source.mirror.hasAttribute('readonly'));
                            expect(false).to.be.equal(editor.__plugins.source.aceEditor.getReadOnly());

                            done();
                        }
                    }
                });
                editor.setMode(Jodit.MODE_SOURCE);
                expect(true).to.be.equal(editor.__plugins.source.mirror.hasAttribute('readonly'));

            }).timeout(6000);
        });
    });

    describe('Disabled', function () {
        describe('Set disabled mode in options', function () {
            it('Should enable readonly mode too and editor\'s container should have jodit_disabled class', function () {
                var area = appendTestArea();

                area.setAttribute('disabled', 'true');

                var editor = new Jodit(area);

                expect(editor.container.classList.contains('jodit_disabled')).to.be.true;
                expect(editor.editor.hasAttribute('contenteditable')).to.be.false;
                expect(editor.getReadOnly()).to.be.true;
                expect(editor.getDisabled()).to.be.true;
            });
        });
        describe('Switch disabled mode', function () {
            it('Should enable readonly if true but set default readonly mode in false', function () {
                var area = appendTestArea();

                area.setAttribute('disabled', 'true');
                area.setAttribute('readonly', 'true');

                var editor = new Jodit(area);

                expect(editor.getReadOnly()).to.be.true;
                expect(editor.getDisabled()).to.be.true;

                editor.setDisabled(false);


                expect(editor.getReadOnly()).to.be.true;
                expect(editor.getDisabled()).to.be.false;
            });
        });
    });
    afterEach(removeStuff);
});