describe('Test Inline mode', function () {
    describe('init with inline option', function () {
        describe('For TEXTAREA', function () {
            it('Should hide textarea like standart mode', function () {
                var area = appendTestArea(),
                    editor = new Jodit(area, {
                        inline: true
                    });

                expect(editor.container).to.be.not.equal(area);
                expect(editor.container.classList.contains('jodit_inline')).to.be.true;
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
                expect(editor.container.classList.contains('jodit_inline')).to.be.true;
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
                expect(editor.container.classList.contains('jodit_inline')).to.be.true;
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
    describe('Inline popups', function () {
        describe('Click on Image', function () {
            it('Should show inline popup', function () {
                var editor = new Jodit(appendTestDiv());
                editor.value = '<p>test <img/> test</p>'
                var img = editor.editor.querySelector('img');
                simulateEvent('mousedown', 0, img);
                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                expect(popup).to.be.not.equal(null);
            });
            describe('Disable toolbarInline = false', function () {
                it('Should show inline popup', function () {
                    var editor = new Jodit(appendTestDiv(), {
                        toolbarInline: false
                    });
                    editor.value = '<p>test <img/> test</p>'
                    var img = editor.editor.querySelector('img');
                    simulateEvent('mousedown', 0, img);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.equal(null);
                });
            });
        });
        describe('Click on Image', function () {
            describe('On mobile', function () {
                it('Should show inline popup', function () {
                    var editor = new Jodit(appendTestDiv());
                    editor.value = '<p>test <img/> test</p>'
                    var img = editor.editor.querySelector('img');
                    simulateEvent('touchstart', 0, img);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.equal(null);
                });
            });
        });
        describe('Click on link', function () {
            it('Should show inline popup', function () {
                var editor = new Jodit(appendTestDiv());
                editor.value = '<p>test <a href="#test">test</a> test</p>'
                var a = editor.editor.querySelector('a');
                simulateEvent('mousedown', 0, a);
                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                expect(popup).to.be.not.equal(null);
            });
            describe('Disable with toolbarInlineDisableFor', function () {
                describe('Option like string', function () {
                    it('Should now show inline popup for link', function () {
                        var editor = new Jodit(appendTestDiv(), {
                            toolbarInline: true,
                            toolbarInlineDisableFor: 'a,IMG'
                        });
                        editor.value = '<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="https://xdsoft.net/jodit/images/artio.jpg">> test</p>'
                        var a = editor.editor.querySelector('a');
                        var img = editor.editor.querySelector('img');
                        var td = editor.editor.querySelector('td');
                        simulateEvent('mousedown', 0, a);
                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                        expect(popup).to.be.equal(null);

                        simulateEvent('mousedown', 0, img);
                        popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                        expect(popup).to.be.equal(null);

                        simulateEvent('mousedown', 0, td);
                        popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                        expect(popup).to.be.not.equal(null);
                    });
                });
                describe('Option like srray', function () {
                    it('Should now show inline popup for link', function () {
                        var editor = new Jodit(appendTestDiv(), {
                            toolbarInline: true,
                            toolbarInlineDisableFor: ['A','table']
                        });
                        editor.value = '<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="https://xdsoft.net/jodit/images/artio.jpg">> test</p>'
                        var a = editor.editor.querySelector('a');
                        var img = editor.editor.querySelector('img');
                        var td = editor.editor.querySelector('td');
                        simulateEvent('mousedown', 0, a);
                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                        expect(popup).to.be.equal(null);

                        simulateEvent('mousedown', 0, img);
                        popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                        expect(popup).to.be.not.equal(null);

                        simulateEvent('mousedown', 0, td);
                        popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                        expect(popup).to.be.equal(null);
                    });
                });
            });
        });
        describe('Click on table cell', function () {
            it('Should show inline popup', function () {
                var editor = new Jodit(appendTestDiv());
                editor.value = '<table><tr><td>test test</a> test</td></tr></table>'
                var td = editor.editor.querySelector('td');
                simulateEvent('mousedown', 0, td);
                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                expect(popup).to.be.not.equal(null);
            });
        });
        describe('Selection some text inside the editor', function () {
            it('Should show inline popup', function () {
                var editor = new Jodit(appendTestDiv(), {
                    preset: 'inline'
                });
                editor.value = 'test<br>test';
                editor.selection.select(editor.editor.firstChild);
                simulateEvent('selectionchange', 0, editor.editor);
                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                expect(popup).to.be.not.equal(null);
            });
        });
    });
    describe('In iframe mode', function () {
        describe('Inline popups', function () {
            describe('Click on Image', function () {
                it('Should show inline popup', function () {
                    var editor = new Jodit(appendTestDiv(), {
                        iframe: true
                    });
                    editor.value = '<p>test <img/> test</p>'
                    var img = editor.editor.querySelector('img');
                    simulateEvent('mousedown', 0, img);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.equal(null);
                });
                describe('Disable toolbarInline = false', function () {
                    it('Should show inline popup', function () {
                        var editor = new Jodit(appendTestDiv(), {
                            toolbarInline: false, iframe: true
                        });
                        editor.value = '<p>test <img/> test</p>'
                        var img = editor.editor.querySelector('img');
                        simulateEvent('mousedown', 0, img);
                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                        expect(popup).to.be.equal(null);
                    });
                });
            });
            describe('Click on Image', function () {
                describe('On mobile', function () {
                    it('Should show inline popup', function () {
                        var editor = new Jodit(appendTestDiv(), {
                            iframe: true
                        });
                        editor.value = '<p>test <img/> test</p>'
                        var img = editor.editor.querySelector('img');
                        simulateEvent('touchstart', 0, img);
                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                        expect(popup).to.be.not.equal(null);
                    });
                });
            });
            describe('Click on link', function () {
                it('Should show inline popup', function () {
                    var editor = new Jodit(appendTestDiv(), {
                        iframe: true
                    });
                    editor.value = '<p>test <a href="#test">test</a> test</p>'
                    var a = editor.editor.querySelector('a');
                    simulateEvent('mousedown', 0, a);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.equal(null);
                });
                describe('Disable with toolbarInlineDisableFor', function () {
                    describe('Option like string', function () {
                        it('Should now show inline popup for link', function () {
                            var editor = new Jodit(appendTestDiv(), {
                                iframe: true,
                                toolbarInline: true,
                                toolbarInlineDisableFor: 'a,IMG'
                            });
                            editor.value = '<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="https://xdsoft.net/jodit/images/artio.jpg">> test</p>'
                            var a = editor.editor.querySelector('a');
                            var img = editor.editor.querySelector('img');
                            var td = editor.editor.querySelector('td');
                            simulateEvent('mousedown', 0, a);
                            var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                            expect(popup).to.be.equal(null);

                            simulateEvent('mousedown', 0, img);
                            popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                            expect(popup).to.be.equal(null);

                            simulateEvent('mousedown', 0, td);
                            popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                            expect(popup).to.be.not.equal(null);
                        });
                    });
                    describe('Option like srray', function () {
                        it('Should now show inline popup for link', function () {
                            var editor = new Jodit(appendTestDiv(), {
                                iframe: true,
                                toolbarInline: true,
                                toolbarInlineDisableFor: ['A','table']
                            });
                            editor.value = '<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="https://xdsoft.net/jodit/images/artio.jpg">> test</p>'
                            var a = editor.editor.querySelector('a');
                            var img = editor.editor.querySelector('img');
                            var td = editor.editor.querySelector('td');
                            simulateEvent('mousedown', 0, a);
                            var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                            expect(popup).to.be.equal(null);

                            simulateEvent('mousedown', 0, img);
                            popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                            expect(popup).to.be.not.equal(null);

                            simulateEvent('mousedown', 0, td);
                            popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                            expect(popup).to.be.equal(null);
                        });
                    });
                });
            });
            describe('Click on table cell', function () {
                it('Should show inline popup', function () {
                    var editor = new Jodit(appendTestDiv(), {
                        iframe: true
                    });
                    editor.value = '<table><tr><td>test test</a> test</td></tr></table>'
                    var td = editor.editor.querySelector('td');
                    simulateEvent('mousedown', 0, td);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.equal(null);
                });
            });
            describe('Selection some text inside the editor', function () {
                it('Should show inline popup', function () {
                    var editor = new Jodit(appendTestDiv(), {
                        preset: 'inline',
                        iframe: true
                    });
                    editor.value = 'test<br>test';
                    editor.selection.select(editor.editor.firstChild);
                    simulateEvent('selectionchange', 0, editor.editor);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.equal(null);
                });
            });
        });
    });
    afterEach(removeStuff);
});