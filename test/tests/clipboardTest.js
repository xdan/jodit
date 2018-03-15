describe('Clipboard text', function () {
    describe('Paste HTML', function () {
        it('Should show paste html dialog', function () {
            var editor = new Jodit(appendTestArea(), {
                defaultActionOnPaste: Jodit.INSERT_AS_HTML,
            });

            var pastedText = '<p>test</p>';

            var emulatePasteEvent = function (data) {
                data.clipboardData = {
                    types: ['text/html'],
                    getData: function (type) {
                        return pastedText;
                    }
                };
            };

            simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

            expect(editor.value).to.be.equal('');

            var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active.jodit_modal[data-editor_id='  + editor.id + ']')
            expect(dialog).to.be.not.equal(null);
        });
        describe('Prevent show dialog', function () {
            it('Should not show paste html dialog if beforeOpenPasteDialog returned false', function () {
                var editor = new Jodit(appendTestArea(), {
                    events: {
                        beforeOpenPasteDialog: function (msg, title, callback, clearButton, clear2Button) {
                            return false;
                        }
                    }
                });

                var pastedText = '<p>test</p>';

                var emulatePasteEvent = function (data) {
                    data.clipboardData = {
                        types: ['text/html'],
                        getData: function (type) {
                            return pastedText;
                        }
                    };
                };

                simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

                expect(editor.value).to.be.equal('');

                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active.jodit_modal[data-editor_id='  + editor.id + ']')
                expect(dialog).to.be.equal(null);
            });
            describe('Change dialog in afterOpenPasteDialog', function () {
                it('Should change dialog', function () {
                    var editor = new Jodit(appendTestArea(), {
                        events: {
                            afterOpenPasteDialog: function (dialog, msg, title, callback, clearButton, clear2Button) {
                                dialog.dialogbox.style.left = '10px';
                            }
                        }
                    });

                    var pastedText = '<p>test</p>';

                    var emulatePasteEvent = function (data) {
                        data.clipboardData = {
                            types: ['text/html'],
                            getData: function (type) {
                                return pastedText;
                            }
                        };
                    };

                    simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

                    expect(editor.value).to.be.equal('');

                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active.jodit_modal[data-editor_id='  + editor.id + ']')
                    expect(dialog).to.be.not.equal(null);
                    expect(parseInt(dialog.style.left, 10)).to.be.equal(10);
                });
            });
        });
    });
    describe('Paste simple text', function () {
        it('Should not show paste html dialog', function () {
            var editor = new Jodit(appendTestArea(), {
                defaultActionOnPaste: Jodit.INSERT_AS_HTML,
            });

            var pastedText = 'test';

            var emulatePasteEvent = function (data) {
                data.clipboardData = {
                    types: ['text/html'],
                    getData: function (type) {
                        return pastedText;
                    }
                };
            };

            simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

            expect(editor.value).to.be.equal('test');

            var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active.jodit_modal[data-editor_id='  + editor.id + ']')
            expect(dialog).to.be.equal(null);
        });
    });
    describe('Paste text', function () {
        describe('Insert only text', function () {
            it('Should insert only text from pasted html', function () {
                var editor = new Jodit(appendTestArea(), {
                    askBeforePasteHTML: false,
                    askBeforePasteFromWord: false,
                    defaultActionOnPaste: Jodit.INSERT_ONLY_TEXT,
                });
                var pastedText = '<p>test</p>';

                var emulatePasteEvent = function (data) {
                    data.clipboardData = {
                        types: ['text/html'],
                        getData: function (type) {
                            return pastedText;
                        }
                    };
                };

                simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
                expect(editor.value).to.be.equal('test');
            });
        });
        describe('Insert as text', function () {
            it('Should insert only text from pasted html', function () {
                var editor = new Jodit(appendTestArea(), {
                    askBeforePasteHTML: false,
                    askBeforePasteFromWord: false,
                    defaultActionOnPaste: Jodit.INSERT_AS_TEXT,
                });
                var pastedText = '<p>test</p>';

                var emulatePasteEvent = function (data) {
                    data.clipboardData = {
                        types: ['text/html'],
                        getData: function (type) {
                            return pastedText;
                        }
                    };
                };

                simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
                expect(editor.value).to.be.equal('&lt;p&gt;test&lt;/p&gt;');
            });
        });
        describe('Insert as html', function () {
            it('Should insert pasted html like html', function () {
                var editor = new Jodit(appendTestArea(), {
                    askBeforePasteHTML: false,
                    askBeforePasteFromWord: false,
                    defaultActionOnPaste: Jodit.INSERT_AS_HTML,
                });

                var pastedText = '<p>test</p>';

                var emulatePasteEvent = function (data) {
                    data.clipboardData = {
                        types: ['text/html'],
                        getData: function (type) {
                            return pastedText;
                        }
                    };
                };

                simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
                expect(editor.value).to.be.equal('<p>test</p><br>');
            });
        });
        describe('Insert clear html', function () {
            it('Should insert pasted and cleared html', function () {
                var editor = new Jodit(appendTestArea(), {
                    askBeforePasteHTML: false,
                    askBeforePasteFromWord: false,
                    defaultActionOnPaste: Jodit.INSERT_CLEAR_HTML,
                });

                var pastedText = '<p style="color:red;" data-text="1">test</p>';

                var emulatePasteEvent = function (data) {
                    data.clipboardData = {
                        types: ['text/html'],
                        getData: function (type) {
                            return pastedText;
                        }
                    };
                };

                simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
                expect(editor.value).to.be.equal('<p>test</p><br>');
            });
        });
    });
    afterEach(removeStuff);
});