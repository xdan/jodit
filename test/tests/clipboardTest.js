describe('Clipboard text', function () {
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
    afterEach(function () {
        Object.keys(Jodit.instances).forEach(function (key) {
            Jodit.instances[key].destruct();
        });
        removeStuff();
    });
});