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
            describe('Click in the right side of editor', function () {
                it('Should open inline-popup with float by right editor side', function () {
                    box.style.width = 'auto'
                    var editor = new Jodit(appendTestArea(), {
                        disablePlugins: 'mobile'
                    });

                    editor.value = '<p>test <img style="width: 30px; float: right"/> test</p>'

                    simulateEvent('mousedown', 0, editor.editor.querySelector('img'))


                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                    expect(popup).to.be.not.null;

                    var positionPopup = offset(popup);
                    var positionContainer = offset(editor.container);

                    expect(Math.abs((positionPopup.left + positionPopup.width) - (positionContainer.left + positionContainer.width)) < 2).to.be.true;
                });
                describe('Click in the right side of editor in window with scroll', function () {
                    it('Should open inline-popup with float by right editor side', function () {
                        box.style.width = 'auto'
                        var i, br, brs = [];
                        for (i = 0; i < 100; i += 1) {
                            br = document.createElement('br');
                            document.body.appendChild(br);
                            brs.push(br);
                        }

                        var editor = new Jodit(appendTestArea(), {
                            disablePlugins: 'mobile'
                        });

                        editor.value = '<p>test <img style="width: 30px; float: right"/> test</p>'
                        simulateEvent('mousedown', 0, editor.editor.querySelector('img'))


                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                        expect(popup).to.be.not.null;

                        var positionPopup = offset(popup);
                        var positionContainer = offset(editor.container);

                        expect(Math.abs((positionPopup.left + positionPopup.width) - (positionContainer.left + positionContainer.width)) < 2).to.be.true;

                        brs.forEach(function (br) {
                            br.parentNode && br.parentNode.removeChild(br)
                        })
                    });
                });
            });
            describe('Recalk position after Scroll', function () {
                it('Should reacalc inline popup position', function () {
                    var editor = new Jodit(appendTestArea(), {
                        height: 500
                    });
                    editor.value = '<p>test' + ('<br>'.repeat(20)) + ' <img style="width:100px;height:100px;" src="tests/artio.jpg"/> ' + ('<br>'.repeat(20)) + 'test</p>'
                    var img = editor.editor.querySelector('img');
                    img.scrollIntoView();
                    simulateEvent('mousedown', 0, img);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.null;

                    var imgPosition = offset(img);
                    var popupPosition = offset(popup);

                    expect(Math.abs(popupPosition.top - (imgPosition.top + imgPosition.height) - 10) < 2).to.be.true;

                    editor.editor.scrollTop = editor.editor.scrollTop + 50;
                    simulateEvent('scroll', 0 , editor.editor);

                    imgPosition = offset(img);
                    popupPosition = offset(popup);

                    expect(Math.abs(popupPosition.top - (imgPosition.top + imgPosition.height) - 10) < 2).to.be.true;

                });
            });
            describe('Popup position ouside of editor', function () {
                it('Should hide inline popup', function () {
                    var editor = new Jodit(appendTestArea(), {
                        height: 500
                    });
                    editor.value = '<p>test' + ('<br>'.repeat(20)) + ' <img style="width:100px;height:100px;" src="tests/artio.jpg"/> ' + ('<br>'.repeat(120)) + 'test</p>'
                    var img = editor.editor.querySelector('img');
                    img.scrollIntoView();
                    simulateEvent('mousedown', 0, img);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.null;

                    var imgPosition = offset(img);
                    var popupPosition = offset(popup);

                    expect(Math.abs(popupPosition.top - (imgPosition.top + imgPosition.height) - 10) < 2).to.be.true;

                    editor.editor.scrollTop = editor.editor.scrollTop + 1000;
                    simulateEvent('scroll', 0 , editor.editor);

                    expect(popup.parentNode.classList.contains('jodit_toolbar_popup-inline-target-hidden')).to.be.true;

                    img.scrollIntoView();
                    simulateEvent('scroll', 0 , editor.editor);

                    expect(popup.parentNode.classList.contains('jodit_toolbar_popup-inline-target-hidden')).to.be.false;
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
                        editor.value = '<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="tests/artio.jpg">> test</p>'
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
                        editor.value = '<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="tests/artio.jpg">> test</p>'
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
            describe('After then selection was collapsed', function () {
                it('Should hide inline popup', function () {
                    var editor = new Jodit(appendTestDiv(), {
                        preset: 'inline'
                    });
                    editor.value = 'test<br>test';
                    editor.selection.select(editor.editor.firstChild);
                    simulateEvent('selectionchange', 0, editor.editor);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.null;
                    var range = editor.editorDocument.createRange();
                    range.setStart(editor.editor.firstChild, 0);
                    range.collapse(true);
                    editor.selection.selectRange(range);
                    simulateEvent('mousedown', 0, editor.editor)
                    expect(popup.parentNode).to.be.null;
                });
            });
            describe('Select some text in one editor and after this select focus in another', function () {
                it('Should hide inline popup in first', function () {
                    var editor = new Jodit(appendTestDiv(), {
                            preset: 'inline',
                            observer: {
                                timeout: 0
                            }
                        }),
                        editor2 = new Jodit(appendTestDiv(), {
                            preset: 'inline',
                            observer: {
                                timeout: 0
                            }
                        });
                    editor.value = 'test<br>test';
                    editor2.value = 'test<br>test';

                    editor.selection.select(editor.editor.firstChild);
                    simulateEvent('mousedown', 0, editor.editor);
                    simulateEvent('mouseup', 0, editor.editor);
                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');
                    expect(popup).to.be.not.null;
                    expect(popup.parentNode).to.be.not.null;

                    var range = editor2.editorDocument.createRange();
                    range.setStart(editor2.editor.firstChild, 0);
                    range.collapse(true);
                    editor2.selection.selectRange(range);
                    simulateEvent('mousedown', 0, editor2.ownerWindow)

                    expect(popup.parentNode).to.be.null;
                });
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
                            editor.value = '<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="tests/artio.jpg">> test</p>'
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
                            editor.value = '<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="tests/artio.jpg">> test</p>'
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