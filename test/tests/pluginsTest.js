describe('Test plugins', function () {
    appendTestArea('editor_plugins_test', true);
    getBox().style.width = 'auto';
    describe('Copy format plugin', function () {
        it('Should copy fontWeight from element and paste it in new selection', function () {
            getBox().style.width = 'auto';
            var editor = new Jodit('#editor_plugins_test');
            editor.setEditorValue('text <strong>test</strong> post');
            editor.selection.setCursorIn(editor.editor.querySelector('strong'));
            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat').length).to.equal(1);
            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(0);

            simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-copyformat'))

            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(1);

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.selectNode(editor.editor.lastChild);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('mouseup', 0, editor.editor);

            expect(editor.getEditorValue().replace('Jodit.KEY_F0', 'bold')).to.equal('text <strong>test</strong><span style="font-weight: bold;"> post</span>');
        });
        it('Should copy fontSize from element and paste it in new selection', function () {
            getBox().style.width = 'auto';
            var editor = new Jodit('#editor_plugins_test');
            editor.setEditorValue('text <span style="font-size: 11px;">test</span> post');
            editor.selection.setCursorIn(editor.editor.querySelector('span'));

            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat').length).to.equal(1);
            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(0);

            simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-copyformat'))

            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(1);

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.selectNode(editor.editor.lastChild);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('mouseup', 0, editor.editor);

            expect(editor.getEditorValue()).to.equal('text <span style="font-size: 11px;">test</span><span style="font-size: 11px;"> post</span>');
        });
        it('Should copy fontSize and color from element and paste it in new selection', function () {
            getBox().style.width = 'auto';
            var editor = new Jodit('#editor_plugins_test');
            editor.setEditorValue('text <span style="font-size: 11px;color: rgb(255, 0, 0);">test</span> post');
            editor.selection.setCursorIn(editor.editor.querySelector('span'));
            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat').length).to.equal(1);
            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(0);

            simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-copyformat'))

            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(1);

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.selectNode(editor.editor.lastChild);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('mouseup', 0, editor.editor);

            expect(sortAtrtibutes(editor.getEditorValue())).to.equal('text <span style="color:rgb(255, 0, 0);font-size:11px">test</span><span style="color:rgb(255, 0, 0);font-size:11px"> post</span>');
        });
        it('Should toggle active state after double click', function () {
            getBox().style.width = 'auto';
            var editor = new Jodit('#editor_plugins_test');
            editor.setEditorValue('text <span style="font-size: 11px;color: rgb(255, 0, 0);">test</span> post');
            editor.selection.setCursorIn(editor.editor.querySelector('span'));
            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat').length).to.equal(1);
            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(0);

            simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-copyformat'))

            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(1);

            simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-copyformat'))

            expect(editor.container.querySelectorAll('.jodit_toolbar_btn-copyformat.jodit_active').length).to.equal(0);

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.selectNode(editor.editor.lastChild);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('mouseup', 0, editor.editor);

            expect(sortAtrtibutes(editor.getEditorValue())).to.equal('text <span style="color:rgb(255, 0, 0);font-size:11px">test</span> post');
        });
    });
    describe('Add new Line plugin', function () {
        it('Should add new line element in container', function () {
            var editor = new Jodit('#editor_plugins_test');
            expect(editor.container.querySelectorAll('.jodit-add-new-line').length).to.equal(1);
        });
        it('Should show .jodit-add-new-line after user move mouse under Table,Ifrmae or IMG ', function () {
            var editor = new Jodit('#editor_plugins_test');
            editor.setEditorValue('<table>' +
                '<tr><td>1</td></tr>' +
                '<tr><td>2</td></tr>' +
                '<tr><td>3</td></tr>' +
                '<tr><td>4</td></tr>' +
                '</table>');

            window.scrollTo(0, 100000000) // elementFromPoint works only with visible part of view

            simulateEvent('mousemove', 0, editor.editor, function (e) {
                var pos = editor.helper.offset(editor.editor.firstChild, editor);
                e.pageX = pos.left + 5;
                e.pageY = pos.top + 5;
                // createPoint(e.pageX, e.pageY)
            });

            var newline = editor.container.querySelector('.jodit-add-new-line');

            expect(newline).not.to.equal(null);
            expect(newline.style.display).to.equal('block');
        });
        it('Should add new paragraph after user clicked on newline ', function () {
            var editor = new Jodit('#editor_plugins_test');
            editor.setEditorValue('<table><tbody>' +
                '<tr><td>2</td></tr>' +
                '<tr><td>2</td></tr>' +
                '<tr><td>3</td></tr>' +
                '<tr><td>4</td></tr>' +
                '</tbody></table>');

            window.scrollTo(0, 100000000) // elementFromPoint works only with visible part of view

            simulateEvent('mousemove', 0, editor.editor, function (data) {
                var pos = editor.helper.offset(editor.editor.firstChild, editor);
                data.pageX = pos.left + 5;
                data.pageY = pos.top + 5;
            });

            var newline = editor.container.querySelector('.jodit-add-new-line');

            expect(newline).not.to.equal(null);
            expect(newline.style.display).to.equal('block');


            simulateEvent('mousedown', 0, newline.querySelector('span'));
            expect(editor.getElementValue()).to.equal('<p></p><table><tbody>' +
                '<tr><td>2</td></tr>' +
                '<tr><td>2</td></tr>' +
                '<tr><td>3</td></tr>' +
                '<tr><td>4</td></tr>' +
                '</tbody></table>');
        });
        it('Should add new paragraph after user clicked on newline below table', function () {
            var editor = new Jodit('#editor_plugins_test');
            editor.setEditorValue('<table><tbody>' +
                '<tr><td>3</td></tr>' +
                '<tr><td>2</td></tr>' +
                '</tbody></table>');


            window.scrollTo(0, 100000000); // elementFromPoint works only with visible part of view

            simulateEvent('mousemove', 0, editor.editor, function (data) {
                var pos = editor.helper.offset(editor.editor.firstChild, editor);
                data.pageX = pos.left + 5;
                data.pageY = pos.top + (pos.height - 5);
            });

            var newline = editor.container.querySelector('.jodit-add-new-line');

            expect(newline).not.to.equal(null);
            expect(newline.style.display).to.equal('block');


            simulateEvent('mousedown', 0, newline.querySelector('span'));
            expect(editor.getElementValue()).to.equal('<table><tbody>' +
                '<tr><td>3</td></tr>' +
                '<tr><td>2</td></tr>' +
                '</tbody></table><p></p>');
        });
        it('Should add new paragraph after user clicked on newline below table in IFRAME mode', function () {
            var editor = new Jodit('#editor_plugins_test', {
                ifarme: true
            });
            editor.setEditorValue('<table><tbody>' +
                '<tr><td>3</td></tr>' +
                '<tr><td>2</td></tr>' +
                '</tbody></table>');


            window.scrollTo(0, 100000000); // elementFromPoint works only with visible part of view

            simulateEvent('mousemove', 0, editor.editor, function (data) {
                var pos = editor.helper.offset(editor.editor.firstChild, editor);
                data.pageX = pos.left + 5;
                data.pageY = pos.top + (pos.height - 5);
            });

            var newline = editor.container.querySelector('.jodit-add-new-line');

            expect(newline).not.to.equal(null);
            expect(newline.style.display).to.equal('block');


            simulateEvent('mousedown', 0, newline.querySelector('span'));
            expect(editor.getElementValue()).to.equal('<table><tbody>' +
                '<tr><td>3</td></tr>' +
                '<tr><td>2</td></tr>' +
                '</tbody></table><p></p>');
        });
    });

    describe('Edit image tests', function () {
        describe('Image editor', function () {
            describe('Crop mode', function () {
                describe('Enable ratio', function () {
                    it('Should deny crop image without ratio', function (done) {
                        var area = appendTestArea();
                        var editor = new Jodit(area, {
                            observer: {
                                timeout: 0
                            },
                            uploader: {
                                url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
                            },
                            filebrowser: {
                                ajax: {
                                    url: 'https://xdsoft.net/jodit/connector/index.php'
                                }
                            },
                        });
                        editor.setEditorValue('<img src="https://xdsoft.net/jodit/files/th.jpg">');

                        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                        var dialog = editor.ownerDocument.querySelector('[data-editor_id=' + area.id + '].jodit.jodit_dialog_box.active');

                        expect(dialog.style.display).to.be.not.equal('none');
                        expect(dialog.querySelectorAll('a.jodit_use_image_editor').length).to.equal(1);

                        editor.events.on('afterImageEditor', function () {
                            var imageEditor = editor.ownerDocument.querySelector('[data-editor_id=' + area.id + '].jodit.jodit_dialog_box.active .jodit_image_editor');
                            expect(imageEditor).to.be.not.equal(null);

                            expect(imageEditor.querySelectorAll('[data-area=crop]').length).to.equal(1);
                            expect(imageEditor.querySelectorAll('[data-area=crop].active').length).to.equal(0);

                            simulateEvent('click', 0, imageEditor.querySelector('[data-area=crop] > div'));

                            expect(imageEditor.querySelectorAll('[data-area=crop].active').length).to.equal(1);

                            var cropper = imageEditor.querySelector('.jodit_image_editor_croper');

                            expect(cropper).not.to.equal(null);

                            var oldRatio = cropper.offsetWidth / cropper.offsetHeight;
                            simulateEvent('mousedown', 0, cropper.querySelector('.jodit_bottomright'), function (e) {
                                var pos = editor.helper.offset(cropper, editor);
                                e.clientX = pos.left + pos.width;
                                e.clientY = pos.top + pos.height;
                            });

                            simulateEvent('mousemove', 0, editor.ownerWindow, function (e) {
                                var pos = editor.helper.offset(cropper, editor);
                                e.clientX = pos.left + pos.width - 50;
                                e.clientY = pos.top + pos.height - 150;
                            });

                            simulateEvent('mouseup', 0, editor.ownerWindow, function (e) {
                                var pos = editor.helper.offset(cropper, editor);
                                e.clientX = pos.left + pos.width - 50;
                                e.clientY = pos.top + pos.height - 150;
                            });

                            expect(Math.abs(cropper.offsetWidth / cropper.offsetHeight - oldRatio) < 0.005).to.be.equal(true);

                            done();
                        });

                        simulateEvent('mousedown', 0, dialog.querySelector('a.jodit_use_image_editor'));
                    }).timeout(Jodit.KEY_F00);
                });
                describe('Disable ratio', function () {
                    it('Should allow crop image without ratio', function (done) {
                        var area = appendTestArea();

                        var editor = new Jodit(area, {
                            observer: {
                                timeout: 0
                            },
                            uploader: {
                                url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
                            },
                            filebrowser: {
                                ajax: {
                                    url: 'https://xdsoft.net/jodit/connector/index.php'
                                }
                            },
                        });
                        editor.setEditorValue('<img src="https://xdsoft.net/jodit/files/th.jpg">');

                        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                        var dialog = editor.ownerDocument.querySelector('[data-editor_id=' + area.id + '].jodit.jodit_dialog_box.active');

                        expect(dialog.style.display).to.be.not.equal('none');
                        expect(dialog.querySelectorAll('a.jodit_use_image_editor').length).to.equal(1);

                        editor.events.on('afterImageEditor', function () {
                            var imageEditor = editor.ownerDocument.querySelector('[data-editor_id=' + area.id + '].jodit.jodit_dialog_box.active .jodit_image_editor');
                            expect(imageEditor).to.be.not.equal(null);

                            expect(imageEditor.querySelectorAll('[data-area=crop]').length).to.equal(1);
                            expect(imageEditor.querySelectorAll('[data-area=crop].active').length).to.equal(0);

                            simulateEvent('click', 0, imageEditor.querySelector('[data-area=crop] > div'));

                            expect(imageEditor.querySelectorAll('[data-area=crop].active').length).to.equal(1);

                            var cropper = imageEditor.querySelector('.jodit_image_editor_croper');

                            expect(cropper).not.to.equal(null);

                            var oldRatio = cropper.offsetWidth / cropper.offsetHeight;

                            var disableRatioBtn = imageEditor.querySelector('[data-area=crop].active').querySelector('.jodit_btn_radio_group button:last-child');

                            expect(disableRatioBtn).not.to.equal(null);
                            simulateEvent('click', 0, disableRatioBtn);

                            simulateEvent('mousedown', 0, cropper.querySelector('.jodit_bottomright'), function (e) {
                                var pos = editor.helper.offset(cropper, editor);
                                e.clientX = pos.left + pos.width;
                                e.clientY = pos.top + pos.height;
                            });
                            simulateEvent('mousemove', 0, editor.ownerWindow, function (e) {
                                var pos = editor.helper.offset(cropper, editor);
                                e.clientX = pos.left + pos.width - 50;
                                e.clientY = pos.top + pos.height - 150;
                            });

                            simulateEvent('mouseup', 0, editor.ownerWindow, function (e) {
                                var pos = editor.helper.offset(cropper, editor);
                                e.clientX = pos.left + pos.width - 50;
                                e.clientY = pos.top + pos.height - 150;
                            });

                            expect(Math.abs(cropper.offsetWidth / cropper.offsetHeight - oldRatio) > 1).to.be.equal(true);

                            done();
                        });

                        simulateEvent('mousedown', 0, dialog.querySelector('a.jodit_use_image_editor'));
                    }).timeout(Jodit.KEY_F00);
                });
            });
            describe('Resize mode', function () {
                describe('Enable ratio', function () {
                    it('Should deny resize image without ratio', function (done) {
                        var area = appendTestArea();
                        var editor = new Jodit(area, {
                            observer: {
                                timeout: 0
                            },
                            uploader: {
                                url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
                            },
                            filebrowser: {
                                ajax: {
                                    url: 'https://xdsoft.net/jodit/connector/index.php'
                                }
                            },
                        });
                        editor.setEditorValue('<img src="https://xdsoft.net/jodit/files/th.jpg">');

                        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                        var dialog = editor.ownerDocument.querySelector('[data-editor_id=' + area.id + '].jodit.jodit_dialog_box.active');

                        expect(dialog.style.display).to.be.not.equal('none');
                        expect(dialog.querySelectorAll('a.jodit_use_image_editor').length).to.equal(1);

                        editor.events.on('afterImageEditor', function () {
                            var imageEditor = editor.ownerDocument.querySelector('[data-editor_id=' + area.id + '].jodit.jodit_dialog_box.active .jodit_image_editor');
                            expect(imageEditor).to.be.not.equal(null);

                            expect(imageEditor.querySelectorAll('[data-area=resize]').length).to.equal(1);
                            expect(imageEditor.querySelectorAll('[data-area=resize].active').length).to.equal(1); // default mode

                            simulateEvent('click', 0, imageEditor.querySelector('[data-area=resize] > div'));

                            expect(imageEditor.querySelectorAll('[data-area=resize].active').length).to.equal(1);

                            var resizer = imageEditor.querySelector('.jodit_image_editor_resizer');

                            expect(resizer).not.to.equal(null);

                            var oldRatio = resizer.offsetWidth / resizer.offsetHeight;

                            simulateEvent('mousedown', 0, resizer.querySelector('.jodit_bottomright'), function (e) {
                                var pos = editor.helper.offset(resizer, editor);
                                e.clientX = pos.left + pos.width;
                                e.clientY = pos.top + pos.height;
                            });

                            simulateEvent('mousemove', 0, editor.ownerWindow, function (e) {
                                var pos = editor.helper.offset(resizer, editor);
                                e.clientX = pos.left + pos.width - 250;
                                e.clientY = pos.top + pos.height - 150;
                            });

                            simulateEvent('mouseup', 0, editor.ownerWindow, function (e) {
                                var pos = editor.helper.offset(resizer, editor);
                                e.clientX = pos.left + pos.width - 250;
                                e.clientY = pos.top + pos.height - 150;
                            });


                            expect(Math.abs(resizer.offsetWidth / resizer.offsetHeight - oldRatio) < 0.005).to.be.equal(true);

                            done();
                        });

                        simulateEvent('mousedown', 0, dialog.querySelector('a.jodit_use_image_editor'));
                    }).timeout(Jodit.KEY_F00);
                });
                describe('Disable ratio', function () {
                    it('Should allow resize image without ratio', function (done) {
                        var area = appendTestArea();
                        var editor = new Jodit(area, {
                            observer: {
                                timeout: 0
                            },
                            uploader: {
                                url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
                            },
                            filebrowser: {
                                ajax: {
                                    url: 'https://xdsoft.net/jodit/connector/index.php'
                                }
                            },
                        });
                        editor.setEditorValue('<img src="https://xdsoft.net/jodit/files/th.jpg">');

                        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                        var dialog = editor.ownerDocument.querySelector('[data-editor_id=' + area.id + '].jodit.jodit_dialog_box.active');

                        expect(dialog.style.display).to.be.not.equal('none');
                        expect(dialog.querySelectorAll('a.jodit_use_image_editor').length).to.equal(1);

                        editor.events.on('afterImageEditor', function () {
                            var imageEditor = editor.ownerDocument.querySelector('[data-editor_id=' + area.id + '].jodit.jodit_dialog_box.active .jodit_image_editor');
                            expect(imageEditor).to.be.not.equal(null);

                            expect(imageEditor.querySelectorAll('[data-area=resize]').length).to.equal(1);
                            expect(imageEditor.querySelectorAll('[data-area=resize].active').length).to.equal(1); // default mode

                            simulateEvent('click', 0, imageEditor.querySelector('[data-area=resize] > div'));

                            expect(imageEditor.querySelectorAll('[data-area=resize].active').length).to.equal(1);


                            var disableRatioBtn = imageEditor.querySelector('[data-area=resize].active').querySelector('.jodit_btn_radio_group button:last-child');

                            expect(disableRatioBtn).not.to.equal(null);
                            simulateEvent('click', 0, disableRatioBtn);


                            var resizer = imageEditor.querySelector('.jodit_image_editor_resizer');

                            expect(resizer).not.to.equal(null);

                            var oldRatio = resizer.offsetWidth / resizer.offsetHeight;

                            simulateEvent('mousedown', 0, resizer.querySelector('.jodit_bottomright'), function (e) {
                                var pos = editor.helper.offset(resizer, editor);
                                e.clientX = pos.left + pos.width;
                                e.clientY = pos.top + pos.height;
                            });

                            simulateEvent('mousemove', 0, editor.ownerWindow, function (e) {
                                var pos = editor.helper.offset(resizer, editor);
                                e.clientX = pos.left + pos.width - 50;
                                e.clientY = pos.top + pos.height - 150;
                            });

                            simulateEvent('mouseup', 0, editor.ownerWindow, function (e) {
                                var pos = editor.helper.offset(resizer, editor);
                                e.clientX = pos.left + pos.width - 50;
                                e.clientY = pos.top + pos.height - 150;
                            });

                            expect(Math.abs(resizer.offsetWidth / resizer.offsetHeight - oldRatio) > 1).to.be.equal(true);

                            done();
                        });

                        simulateEvent('mousedown', 0, dialog.querySelector('a.jodit_use_image_editor'));
                    }).timeout(Jodit.KEY_F00);
                });
            });
        });
    });
    describe('Search plugin', function () {
        describe('CTRL + F', function () {
            it('Should show search form and query field must have focus', function () {
                var editor = new Jodit('#editor_plugins_test', {
                    observer: {
                        timeout: 0
                    }
                });
                var search = editor.container.querySelector('.jodit_search');
                expect(false).to.equal(search.classList.contains('jodit_search-active'));
                simulateEvent('keydown', Jodit.KEY_F, editor.editor, function (options) {
                    options.ctrlKey = true
                });
                expect(true).to.equal(search.classList.contains('jodit_search-active'));
                expect(true).to.equal(editor.ownerDocument.activeElement === search.querySelector('.jodit_search-query'));
            });
        });
        describe('F3 after search', function () {
            it('Should find a next match', function () {

                var editor = new Jodit('#editor_plugins_test', {
                    observer: {
                        timeout: 0
                    }
                });

                editor.setEditorValue('test test test')
                var range = editor.editorDocument.createRange();
                range.setStart(editor.editor.firstChild, 0)
                range.setEnd(editor.editor.firstChild, 4)
                editor.selection.selectRange(range);

                var search = editor.container.querySelector('.jodit_search');
                expect(false).to.equal(search.classList.contains('jodit_search-active'));

                // press ctrl(cmd) + f
                simulateEvent('keydown', Jodit.KEY_F, editor.editor, function (options) {
                    options.ctrlKey = true
                });

                expect(true).to.equal(search.classList.contains('jodit_search-active'));
                expect(true).to.equal(editor.ownerDocument.activeElement === search.querySelector('.jodit_search-query'));

                editor.events.fire('searchNext');

                simulateEvent('keydown', Jodit.KEY_F3, editor.editor, function (options) {
                    options.shiftKey = false
                }); //

                editor.selection.removeMarkers();
                editor.editor.normalize(); // because Select module splits text node

                var sel = editor.editorWindow.getSelection();

                expect(1).to.equal(sel.rangeCount);
                range = sel.getRangeAt(0);

                expect(editor.editor.firstChild).to.equal(range.startContainer);
                expect(5).to.equal(range.startOffset);

                expect(editor.editor.firstChild).to.equal(range.endContainer);
                expect(9).to.equal(range.endOffset);
            });
        });
        describe('Esc in query field', function () {
            it('Should hide search form and restore selection', function () {
                var editor = new Jodit('#editor_plugins_test', {
                    observer: {
                        timeout: 0
                    }
                });
                editor.setEditorValue('<p>text</p>');
                var range = editor.editorDocument.createRange();
                range.setStart(editor.editor.firstChild.firstChild, 1)
                range.setEnd(editor.editor.firstChild.firstChild, 3);
                var sel = editor.editorWindow.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                var search = editor.container.querySelector('.jodit_search');
                expect(false).to.equal(search.classList.contains('jodit_search-active'));
                simulateEvent('keydown', Jodit.KEY_F, editor.editor, function (options) {
                    options.ctrlKey = true
                });
                expect(true).to.equal(search.classList.contains('jodit_search-active'));
                expect(true).to.equal(editor.ownerDocument.activeElement === search.querySelector('.jodit_search-query'));
                simulateEvent('keydown', 27, search.querySelector('.jodit_search-query'));
                expect(false).to.equal(search.classList.contains('jodit_search-active'));
                expect('ex').to.equal(sel.toString());
            });
        });
        describe('Unit test compare string', function () {
            describe('Get index of found string', function () {
                it('Should find needle in haystack', function () {
                    var str = 'Mr John Smith washed window';
                    expect(11).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', str));
                    expect(11).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('TH WAS', str));
                    expect(false).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('TH WASNT', str));
                });
                it('Should find needle in haystack steb by step', function () {
                    var str = 'Mr John Smith washed window';
                    expect(false).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'Mr'));
                    expect(false).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'Mr John'));

                    expect(11).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'Mr John Smith'));
                    expect(11).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'Mr John Smith wa'));
                    expect(false).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'Mr John Smith s'));

                    expect(11).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'Mr John Smith washed'));
                    expect(11).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'Mr John Smith washed window'));
                });
                it('Should find needle in haystack steb by step in back direction', function () {
                    var str = 'Mr John Smith washed window';
                    expect(false).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'window', false));
                    // debugger
                    expect(0).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'washed window', false));
                    expect(0).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'h washed window', false));
                    expect(3).to.be.equal(Jodit.plugins.search.getSomePartOfStringIndex('th was', 'Smith washed window', false));
                });
            });
            describe('Compare strings and return boolean', function () {
                it('Should find needle in haystack', function () {
                    var str = 'Mr John Smith washed window';
                    expect(true).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', str));
                    expect(true).to.be.equal(Jodit.plugins.search.findSomePartOfString('TH WAS', str));
                    expect(true).to.be.equal(Jodit.plugins.search.findSomePartOfString('TH  WAS', str));
                    expect(false).to.be.equal(Jodit.plugins.search.findSomePartOfString('TH WASNT', str));
                });
                it('Should find needle in haystack steb by step', function () {
                    var str = 'Mr John Smith washed window';
                    expect(false).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Mr'));
                    expect(false).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Mr John'));

                    expect('th').to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Mr John Smith'));
                    expect('th wa').to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Mr John Smith wa'));
                    expect('th wa').to.be.equal(Jodit.plugins.search.findSomePartOfString('th  was', 'Mr John Smith wa'));
                     // debugger
                    expect('th  wa').to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Mr John Smith  wa'));
                    expect(false).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Mr John Smith s'));

                    expect(true).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Mr John Smith washed'));
                    expect(true).to.be.equal(Jodit.plugins.search.findSomePartOfString('th  was', 'Mr John Smith washed'));
                    expect(true).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Mr John Smith washed window'));
                });
                it('Should find needle in haystack steb by step in back direction', function () {
                    var str = 'Mr John Smith washed window';
                    expect(false).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'window', false));
                    // debugger
                    expect('was').to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'washed window', false));
                    expect('h was').to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'h washed window', false));
                    expect(true).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', 'Smith washed window', false));
                });

            });
            describe('Haystack less needle', function () {
                it('Should return false', function () {
                    expect(false).to.be.equal(Jodit.plugins.search.findSomePartOfString('th was', ' ', true));
                    expect(false).to.be.equal(Jodit.plugins.search.findSomePartOfString('Smith washed window', 'washed', true));
                });
            });
        });
        describe('Fire search event', function () {
            it('Should select some elements which consists query string', function () {
                var editor = new Jodit('#editor_plugins_test', {
                    observer: {
                        timeout: 0
                    }
                });
                editor.setEditorValue('<p><span>Mr</span> <span>John</span> <span>Smith</span> <span>washed</span> <span>window</span></p>');
                var sel = editor.editorWindow.getSelection();
                sel.removeAllRanges();

                editor.events.fire('search', ['th was']);
                expect(1).to.be.equal(sel.rangeCount);
                var range = sel.getRangeAt(0);

                expect(editor.editor.firstChild.childNodes[4].firstChild).to.be.equal(range.startContainer);
                expect(3).to.be.equal(range.startOffset);

                expect(editor.editor.firstChild.childNodes[6].firstChild).to.be.equal(range.endContainer);
                expect(3).to.be.equal(range.startOffset);
            });
        });
    });
    after(function() {
        editor_plugins_test.parentNode.removeChild(editor_plugins_test);
    });
    afterEach(function () {
        removeStuff();
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});