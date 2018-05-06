describe('Test image', function() {
    describe('Image properties dialog', function () {
        describe('Double click on image', function () {
            it('should open image properties dialog', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<img src="tests/artio.jpg"/>')
                simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                expect(dialog).to.be.not.equal(null)
            });
            describe('Disable by image.openOnDblClick', function () {
                it('should not open image properties dialog', function () {
                    var editor = new Jodit(appendTestArea(), {
                        image: {
                            openOnDblClick: false,
                        }
                    });

                    editor.setEditorValue('<img src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    expect(dialog).to.be.equal(null)
                });
            });
        });

        describe('Change border radius', function () {
            it('should change image border radius', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<img style="width:100px; height: 100px; border-radius: 10px;" src="tests/artio.jpg"/>')
                simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                expect(dialog).to.be.not.equal(null);

                simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                var tab = dialog.querySelector('.jodit_tab.active');
                expect(tab).to.be.not.equal(null);
                expect(tab.querySelector('.border_radius')).to.be.not.equal(null);

                expect(tab.querySelector('.border_radius').value.toString()).to.be.equal('10');

                tab.querySelector('.border_radius').value = 100;
                simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="border-radius:100px;height:100px;width:100px">');

            });
        });
        describe('Change classes', function () {
            it('should change image classlist', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<img class="images123" style="width:100px; height: 100px;" src="tests/artio.jpg"/>')
                simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                expect(dialog).to.be.not.equal(null);

                simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                var tab = dialog.querySelector('.jodit_tab.active');
                expect(tab).to.be.not.equal(null);
                expect(tab.querySelector('.classes')).to.be.not.equal(null);

                expect(tab.querySelector('.classes').value.toString()).to.be.equal('images123');

                tab.querySelector('.classes').value = 'tavble ';
                simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                expect(sortAtrtibutes(editor.value)).to.be.equal('<img class="tavble " src="tests/artio.jpg" style="height:100px;width:100px">');

            });
        });
        describe('Change styles', function () {
            it('should change image styles', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<img style="padding:10px;width:100px; height: 100px;" src="tests/artio.jpg"/>')
                simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                expect(dialog).to.be.not.equal(null);

                simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                var tab = dialog.querySelector('.jodit_tab.active');
                expect(tab).to.be.not.equal(null);
                expect(tab.querySelector('.style')).to.be.not.equal(null);

                expect(sortStyles(tab.querySelector('.style').value.toString())).to.be.equal('height:100px;padding:10px;width:100px');

                tab.querySelector('.style').value = 'padding:20px;background-color: #ff0000;';
                simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="background-color:#FF0000;height:100px;padding:20px;width:100px">');

            });
        });
        describe('Change id', function () {
            it('should change image id', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<img id="stop123"  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>')
                simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                expect(dialog).to.be.not.equal(null);

                simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                var tab = dialog.querySelector('.jodit_tab.active');
                expect(tab).to.be.not.equal(null);
                expect(tab.querySelector('.id')).to.be.not.equal(null);

                expect(tab.querySelector('.id').value.toString()).to.be.equal('stop123');

                tab.querySelector('.id').value = 'fast12';
                simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                expect(sortAtrtibutes(editor.value)).to.be.equal('<img id="fast12" src="tests/artio.jpg" style="height:100px;width:100px">');

            });
        });
        describe('Change align', function () {
            describe('left', function () {
                it('should change image horizontal align', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                    var tab = dialog.querySelector('.jodit_tab.active');
                    expect(tab).to.be.not.equal(null);
                    expect(tab.querySelector('.align')).to.be.not.equal(null);

                    expect(tab.querySelector('.align').value.toString()).to.be.equal('');

                    tab.querySelector('.align').value = 'left';
                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="float:left;height:100px;width:100px">');

                });
            });
            describe('right', function () {
                it('should change image horizontal align', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                    var tab = dialog.querySelector('.jodit_tab.active');
                    expect(tab).to.be.not.equal(null);
                    expect(tab.querySelector('.align')).to.be.not.equal(null);

                    expect(tab.querySelector('.align').value.toString()).to.be.equal('');

                    tab.querySelector('.align').value = 'right';
                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="float:right;height:100px;width:100px">');

                });
            });
            describe('center', function () {
                it('should change image horizontal align', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img style="float:left;width:100px; height: 100px;" src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                    var tab = dialog.querySelector('.jodit_tab.active');
                    expect(tab).to.be.not.equal(null);
                    expect(tab.querySelector('.align')).to.be.not.equal(null);

                    expect(tab.querySelector('.align').value.toString()).to.be.equal('left');

                    tab.querySelector('.align').value = 'center';
                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="display:block;height:100px;margin-left:auto;margin-right:auto;width:100px">');

                });
            });
            describe('Clear align', function () {
                it('should clear some align', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img src="tests/artio.jpg" style="width:100px; height: 100px;display:block;margin-left:auto;margin-right:auto">')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                    var tab = dialog.querySelector('.jodit_tab.active');
                    expect(tab).to.be.not.equal(null);
                    expect(tab.querySelector('.align')).to.be.not.equal(null);

                    expect(tab.querySelector('.align').value.toString()).to.be.equal('center');

                    tab.querySelector('.align').value = '';
                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="height:100px;width:100px">');

                });
            });
        });
        describe('Change margins', function () {
            describe('Change marginTop with lock', function () {
                it('should change all margins', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img style="margin: 10px;width:100px; height: 100px;" src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                    var tab = dialog.querySelector('.jodit_tab.active');

                    expect(tab.querySelector('.marginTop')).to.be.not.equal(null);
                    expect(tab.querySelector('.marginBottom')).to.be.not.equal(null);

                    expect(tab.querySelector('.marginTop').value.toString()).to.be.equal('10');
                    expect(tab.querySelector('.marginBottom').hasAttribute('disabled')).to.be.true;

                    tab.querySelector('.marginTop').value = 100;
                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="height:100px;margin:100px;width:100px">');

                });
            });
            describe('Change marginTop with unlock', function () {
                it('should change only marginTop', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img style="margin: 10px;width:100px; height: 100px;" src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    simulateEvent('mousedown', 0, dialog.querySelectorAll('.jodit_tabs_buttons a')[1]);

                    var tab = dialog.querySelector('.jodit_tab.active');

                    var locker = tab.querySelector('.jodit_lock_helper.jodit_lock_margin');
                    expect(locker).to.be.not.equal(null);
                    var lockerimg = locker.innerHTML;
                    simulateEvent('click', 0, locker);
                    expect(locker.innerHTML).to.be.not.equal(lockerimg);

                    expect(tab.querySelector('.marginTop').value.toString()).to.be.equal('10');
                    expect(tab.querySelector('.marginBottom').value.toString()).to.be.equal('10');
                    expect(tab.querySelector('.marginLeft').value.toString()).to.be.equal('10');
                    expect(tab.querySelector('.marginRight').value.toString()).to.be.equal('10');
                    expect(tab.querySelector('.marginBottom').hasAttribute('disabled')).to.be.false;

                    tab.querySelector('.marginTop').value = 100;
                    tab.querySelector('.marginBottom').value = 10;
                    tab.querySelector('.marginRight').value = 20;
                    tab.querySelector('.marginLeft').value = 220;
                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="height:100px;margin:100px 20px 10px 220px;width:100px">');

                });
            });
        });
        describe('Change title', function () {
            it('should change image title', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<img title="sting" style="width:100px; height: 100px;" src="tests/artio.jpg"/>')
                simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                var tab = dialog.querySelector('.jodit_tab.active');

                expect(tab).to.be.not.equal(null);
                expect(tab.querySelector('.imageTitle')).to.be.not.equal(null);
                expect(tab.querySelector('.imageTitle').value).to.be.equal('sting');

                dialog.querySelector('.imageTitle').value = 'Stop';
                simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="height:100px;width:100px" title="Stop">');

            });
        });
        describe('Change alt', function () {
            it('should change image alt', function (done) {
                var editor = new Jodit(appendTestArea());
                var image = new Image();
                var doTest = function () {
                    editor.value = '<img alt="test" style="width:100px; height: 100px;" src="tests/artio.jpg"/>';
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                    var tab = dialog.querySelector('.jodit_tab.active');

                    expect(tab).to.be.not.equal(null);
                    expect(tab.querySelector('.imageAlt')).to.be.not.equal(null);
                    expect(tab.querySelector('.imageAlt').value).to.be.equal('test');

                    dialog.querySelector('.imageAlt').value = 'Stop';
                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img alt="Stop" src="tests/artio.jpg" style="height:100px;width:100px">');
                    done();
                };

                image.src = 'tests/artio.jpg';

                if (image.complete) {
                    doTest();
                } else {
                    image.onload = doTest;
                }
            });
        });
        describe('Change link', function () {
            it('should change image wrapper', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>')
                simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                var tab = dialog.querySelector('.jodit_tab.active');

                expect(tab).to.be.not.equal(null);
                expect(tab.querySelector('.imageLink')).to.be.not.equal(null);
                expect(tab.querySelector('.imageLink').value).to.be.equal('');

                dialog.querySelector('.imageLink').value = 'https://xdsoft.net/';
                simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                expect(sortAtrtibutes(editor.value)).to.be.equal('<a href="https://xdsoft.net/"><img src="tests/artio.jpg" style="height:100px;width:100px"></a>');

            });
            describe('open link in new tab', function () {
                it('should change image wrapper with target="_blank"', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img style="width:100px; height: 100px;" src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                    var tab = dialog.querySelector('.jodit_tab.active');

                    expect(tab).to.be.not.equal(null);
                    expect(tab.querySelector('.imageLink')).to.be.not.equal(null);
                    expect(tab.querySelector('.imageLink').value).to.be.equal('');

                    dialog.querySelector('.imageLink').value = 'https://xdsoft.net/';
                    dialog.querySelector('.imageLinkOpenInNewTab').checked = true;

                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<a href="https://xdsoft.net/" target="_blank"><img src="tests/artio.jpg" style="height:100px;width:100px"></a>');

                });
            });
            describe('Open dialog dor image wrapped in link', function () {
                it('should change image wrapper', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<a href="https://xdan.ru" target="_blank"><img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/></a>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                    var tab = dialog.querySelector('.jodit_tab.active');

                    expect(tab).to.be.not.equal(null);
                    expect(tab.querySelector('.imageLink')).to.be.not.equal(null);
                    expect(tab.querySelector('.imageLink').value).to.be.equal('https://xdan.ru');
                    expect(tab.querySelector('.imageLinkOpenInNewTab').checked).to.be.true;

                    dialog.querySelector('.imageLink').value = 'https://xdsoft.net/';
                    dialog.querySelector('.imageLinkOpenInNewTab').checked = false;

                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<a href="https://xdsoft.net/"><img src="tests/artio.jpg" style="height:100px;width:100px"></a>');

                });
            });
            describe('Unlink', function () {
                it('should remove image wrapper', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<a href="https://xdan.ru" target="_blank"><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></a>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                    var tab = dialog.querySelector('.jodit_tab.active');

                    expect(tab).to.be.not.equal(null);
                    expect(tab.querySelector('.imageLink')).to.be.not.equal(null);
                    expect(tab.querySelector('.imageLink').value).to.be.equal('https://xdan.ru');
                    expect(tab.querySelector('.imageLinkOpenInNewTab').checked).to.be.true;

                    dialog.querySelector('.imageLink').value = '';
                    dialog.querySelector('.imageLinkOpenInNewTab').checked = false;

                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="height:100px;width:100px">');

                });
            });
        });
        describe('Change size functionality', function () {
            it('should create connected inputs with width and height', function (done) {
                var editor = new Jodit(appendTestArea());

                editor.value = '<img src="tests/artio.jpg"/>';
                var img = editor.editor.querySelector('img');

                function doTest() {
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                    var imageWidth = dialog.querySelector('.imageWidth');
                    var imageHeight = dialog.querySelector('.imageHeight');

                    expect(imageWidth).to.be.not.equal(null);
                    expect(imageHeight).to.be.not.equal(null);

                    expect(imageWidth.value).to.be.equal(img.offsetWidth.toString());
                    expect(imageHeight.value).to.be.equal(img.offsetHeight.toString());


                    imageWidth.value = 100;
                    simulateEvent('change', 0, imageWidth);
                    expect(imageHeight.value).to.be.not.equal(img.offsetHeight.toString());

                    imageHeight.value = 200;
                    simulateEvent('change', 0, imageHeight);
                    expect(imageWidth.value).to.be.not.equal('100');

                    simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                    expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="height:200px;width:356px">');

                    done();
                }


                if (img.complete) {
                    doTest();
                } else {
                    img.onload = doTest;
                }
            });
            describe('unlock ratio', function (done) {
                it('should create connected inputs with width and height', function (done) {
                    var editor = new Jodit(appendTestArea());

                    editor.value = '<img src="tests/artio.jpg"/>';
                    var img= editor.editor.querySelector('img');

                    function doTest() {
                        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                        var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                        var imageWidth = dialog.querySelector('.imageWidth');
                        var imageHeight = dialog.querySelector('.imageHeight');
                        var locker = dialog.querySelector('.jodit_lock_helper.jodit_lock_size');

                        expect(locker).to.be.not.equal(null);
                        expect(imageWidth).to.be.not.equal(null);
                        expect(imageHeight).to.be.not.equal(null);

                        expect(imageWidth.value).to.be.equal(img.offsetWidth.toString());
                        expect(imageHeight.value).to.be.equal(img.offsetHeight.toString());

                        simulateEvent('click', 0, locker);

                        imageWidth.value = 100;
                        simulateEvent('change', 0, imageWidth);
                        expect(imageHeight.value).to.be.equal(img.offsetHeight.toString());

                        imageHeight.value = 200;
                        simulateEvent('change', 0, imageHeight);
                        expect(imageWidth.value).to.be.equal('100');

                        simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                        expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="height:200px;width:100px">');

                        done();
                    }


                    if (img.complete) {
                        doTest();
                    } else {
                        img.onload = doTest;
                    }
                });
                describe('Toggle ratio again', function (done) {
                    it('should create connected inputs with width and height', function (done) {
                        var editor = new Jodit(appendTestArea());

                        editor.value = '<img src="tests/artio.jpg"/>';
                        var img= editor.editor.querySelector('img');

                        function doTest() {
                            simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

                            var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                            var imageWidth = dialog.querySelector('.imageWidth');
                            var imageHeight = dialog.querySelector('.imageHeight');
                            var locker = dialog.querySelector('.jodit_lock_helper.jodit_lock_size');
                            var lockerimg = locker.innerHTML;

                            simulateEvent('click', 0, locker);
                            expect(locker.innerHTML).to.be.not.equal(lockerimg);
                            simulateEvent('click', 0, locker);
                            expect(locker.innerHTML).to.be.equal(lockerimg);

                            imageWidth.value = 100;
                            simulateEvent('change', 0, imageWidth);
                            expect(imageHeight.value).to.be.not.equal(img.offsetHeight.toString());

                            imageHeight.value = 200;
                            simulateEvent('change', 0, imageHeight);
                            expect(imageWidth.value).to.be.not.equal('100');

                            simulateEvent('click', 0, dialog.querySelectorAll('.jodit_dialog_footer a.jodit_button')[0]);

                            expect(sortAtrtibutes(editor.value)).to.be.equal('<img src="tests/artio.jpg" style="height:200px;width:356px">');

                            done();
                        }


                        if (img.complete) {
                            doTest();
                        } else {
                            img.onload = doTest;
                        }
                    });
                });
            });
        });
        describe('Show filebrowser buttons and edit image button', function () {
            describe('If uploader or filebrowser settings don\'t setted', function () {
                it('should not show buttons', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    expect(dialog).to.be.not.equal(null)
                    expect(dialog.querySelector('.jodit_button.jodit_rechange')).to.be.equal(null)
                    expect(dialog.querySelector('.jodit_button.jodit_use_image_editor')).to.be.equal(null)
                });
            });
            describe('Uploader and filebrowser settings set', function () {
                var settings = {
                    uploader: {
                        url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
                    },

                    filebrowser: {
                        // buttons: ['list', 'tiles', 'sort'],
                        ajax: {
                            url: 'https://xdsoft.net/jodit/connector/index.php'
                        }
                    },
                };

                it('should not show buttons', function () {
                    var editor = new Jodit(appendTestArea(), settings);

                    editor.setEditorValue('<img src="tests/artio.jpg"/>')
                    simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    expect(dialog.querySelector('.jodit_button.jodit_rechange')).to.be.not.equal(null)
                    expect(dialog.querySelector('.jodit_button.jodit_use_image_editor')).to.be.not.equal(null)
                });

                describe('Click on filebrowser button', function () {
                    it('should open popup', function () {
                        var editor = new Jodit(appendTestArea(), settings);

                        editor.setEditorValue('<img src="tests/artio.jpg"/>')
                        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                        var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                        var rechange = dialog.querySelector('.jodit_button.jodit_rechange');
                        expect(rechange).to.be.not.equal(null)
                        simulateEvent('mousedown', 0, rechange);
                        expect(dialog.querySelector('.jodit_toolbar_popup.jodit_toolbar_popup-open.jodit_right')).to.be.not.equal(null)
                    });
                });
                describe('Click on edit button', function () {
                    describe('When photo it is not my', function () {
                        it('should open image editor', function (done) {
                            var editor = new Jodit(appendTestArea(), settings);

                            editor.value = '<img src="https://xdsoft.net/jodit/build/images/artio.jpg"/>'
                            simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
                            var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');
                            expect(dialog).to.be.not.null;

                            var edi = dialog.querySelector('.jodit_button.jodit_use_image_editor');
                            expect(edi).to.be.not.null;

                            simulateEvent('mousedown', 0, edi);

                            var dialog2 = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active.jodit_modal');
                            expect(dialog2).to.be.not.equal(null);
                            expect(dialog2).to.be.not.equal(dialog);

                            simulateEvent('click', 0, dialog2.querySelector('a.jodit_button'));

                            var dialog3 = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active.jodit_modal');
                            expect(dialog3).to.be.not.equal(null);
                            expect(dialog3).to.be.not.equal(dialog2);

                            simulateEvent('click', 0, dialog3.querySelector('a.jodit_button'));

                            var dialog4 = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active.jodit_modal');
                            expect(dialog4).to.be.not.equal(null);
                            expect(dialog4).to.be.not.equal(dialog3);
                            simulateEvent('click', 0, dialog4.querySelector('a.jodit_button'));

                            expect(dialog.querySelector('.imageSrc').value).to.be.equal('https://xdsoft.net/jodit/files/artio.jpg')

                            done();
                        });
                    });
                });
            });
        });
    });
    it('Double click on image then openOnDblClick=false should select image', function () {
        var editor = new Jodit(appendTestArea(), {
            image: { openOnDblClick: false }
        });
        editor.setEditorValue('<img src="tests/artio.jpg"/>')
        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
        var dialogs = document.querySelectorAll('.jodit.jodit_dialog_box.active');

        expect(dialogs.length).to.equal(0);

        expect(editor.selection.current().tagName).to.equal('IMG');
    });
    describe('One click on image', function () {
        it('should show resizer', function () {

            var editor = new Jodit(appendTestArea());
            editor.setEditorValue('<img src="tests/artio.jpg"/>')

            var img = editor.editor.querySelector('img');

            simulateEvent('mousedown', 0, img);

            var resizer = document.querySelector('.jodit_resizer[data-editor_id=' + editor.id + ']');

            expect(resizer.style.display === 'block').to.equal(true);
        });
        describe('in full size mode', function () {
            it('should show resizer and set mmaximum zIndex', function () {

                var editor = new Jodit(appendTestArea(), {
                    fullsize: true
                });
                editor.value = '<img src="tests/artio.jpg"/>'


                var img = editor.editor.querySelector('img');

                simulateEvent('mousedown', 0, img);

                var resizer = document.querySelector('.jodit_resizer[data-editor_id=' + editor.id + ']');

                expect(resizer.style.display).to.be.equal('block');
                expect(resizer.style.zIndex).to.be.equal(window.getComputedStyle(editor.container).zIndex);
            });
        });
    });
    it('One click inside table cell should show resizer', function () {
        var editor = new Jodit(appendTestArea());
        editor.setEditorValue('<table><tr><td>1</td></tr></table>')

        var td = editor.editor.querySelector('td');

        simulateEvent('mousedown', 0, td);

        var resizer = document.querySelector('.jodit_resizer[data-editor_id=' + editor.id + ']');

        expect(resizer.style.display === 'block').to.equal(true);
    });

    describe('Popup box', function () {
        describe('In relative object', function () {
            it('should be under image', function () {
                var div = document.createElement('div');
                div.innerHTML = '<div style="width:800px; margin:auto; border:1px solid red;">\n' +
                    '        wrong image selection\n' +
                    '        <div style="position:relative;text-align: left">\n' +
                    '            <textarea id="text_area0"> <img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
                    '        </div>\n' +
                    '    </div>';

                document.body.appendChild(div);
                var editor = new Jodit('#text_area0', {
                    observer: {
                        timeout: 0
                    }
                });
                window.scrollTo(0, offset(div).top);
                simulateEvent('mousedown', 0, editor.editor.querySelector('img'));

                var popup = document.querySelector('.jodit_toolbar_popup-inline[data-editor_id=text_area0]');

                expect(popup.parentNode.parentNode !== null).to.equal(true);

                var positionPopup = offset(popup.parentNode);
                var positionImg = offset(editor.editor.querySelector('img'));


                expect(Math.abs(positionPopup.left - (positionImg.left + positionImg.width/2)) < 20).to.be.true;
                expect(Math.abs(positionPopup.top - (positionImg.top + positionImg.height)) < 20).to.be.true;


                editor.destruct();
                document.body.removeChild(div);
            });
        });
    });
    describe('Resize box', function () {
        describe('In relative object', function () {
            it('should be in front of image', function () {
                var div = document.createElement('div');
                div.innerHTML = '<div style="width:800px; margin:auto; border:1px solid red;">\n' +
                    '        wrong image selection\n' +
                    '        <div style="position:relative;text-align: left">\n' +
                    '            <textarea id="text_area0"> <img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
                    '        </div>\n' +
                    '    </div>';

                document.body.appendChild(div);
                var editor = new Jodit('#text_area0');
                simulateEvent('mousedown', 0, editor.editor.querySelector('img'));

                var resizer = document.querySelector('.jodit_resizer[data-editor_id=text_area0]');
                expect(resizer.style.display === 'block').to.equal(true);

                var positionResizer = offset(resizer);
                var positionImg = offset(editor.editor.querySelector('img'));

                expect(Math.abs(positionResizer.left - positionImg.left) < 2).to.be.true;
                expect(Math.abs(positionResizer.top - positionImg.top) < 2).to.be.true;

                editor.destruct();
                document.body.removeChild(div);
            });
        });
        describe('After resize - popup', function () {
            it('should be hidden and after this should be shown', function () {
                var div = document.createElement('div');
                div.innerHTML = '<div style="width:800px; margin:auto; border:1px solid red;">\n' +
                    '        wrong image selection\n' +
                    '        <div style="position:relative;text-align: left">\n' +
                    '            <textarea id="text_area1"> &lt;img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/&gt;</textarea>\n' +
                    '        </div>\n' +
                    '    </div>';

                document.body.appendChild(div);

                var editor = new Jodit(document.getElementById('text_area1'));
                simulateEvent('mousedown', 0, editor.editor.querySelector('img'));
                //
                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=text_area1]');
                //
                expect(popup.parentNode.parentNode !== null).to.equal(true);
                //
                var resizer = editor.ownerDocument.querySelector('.jodit_resizer[data-editor_id=text_area1]');
                expect(resizer.style.display === 'block').to.equal(true);
                //
                var positionResizer = offset(resizer);
                //
                simulateEvent('mousedown', 0, resizer.getElementsByTagName('i')[0]);
                simulateEvent('mousemove', 0, editor.ownerWindow, function (data) {
                    data.clientX = positionResizer.left - 10;
                    data.clientY = positionResizer.top - 10;
                });
                //
                expect(popup.parentNode).to.be.equal(null);

                simulateEvent('mouseup', 0, editor.ownerWindow, function (data) {
                    data.clientX = positionResizer.left - 10;
                    data.clientY = positionResizer.top - 10;
                });

                expect(popup.parentNode).to.be.equal(null);
                //
                editor.destruct();
                div.parentNode && div.parentNode.removeChild(div);
            });
        });
        describe('Resize image', function () {
            it('Should not allow to resize image more then width of editor', function (done) {
                box.style.width = '600px';
                var editor = new Jodit(appendTestArea());
                var image = new Image();
                image.src = 'tests/artio.jpg';

                var doit = function () {
                    var ratio = image.naturalWidth / image.naturalHeight;

                    editor.value = '<img src="tests/artio.jpg" style="width:500px;height: 281px;"/>';
                    var img = editor.editor.querySelector('img');
                    simulateEvent('mousedown', 0, editor.editor.querySelector('img'));
                    var resizer = document.querySelector('.jodit_resizer[data-editor_id=' + editor.id + ']');
                    expect(resizer).to.be.not.null;

                    var positionResizer = offset(resizer);
                    //

                    simulateEvent('mousedown', 0, resizer.getElementsByTagName('i')[1]);
                    simulateEvent('mousemove', 0, editor.ownerWindow, function (data) {
                        data.clientX = positionResizer.left + 1000;
                        data.clientY = positionResizer.top + 1000;
                    });


                    simulateEvent('mouseup', 0, editor.ownerWindow, function (data) {
                        data.clientX = positionResizer.left + 1000;
                        data.clientY = positionResizer.top + 1000;
                    });
                    var newratio = img.offsetWidth / img.offsetHeight;

                    expect(img.offsetWidth).to.be.equal(editor.editor.offsetWidth - 20);

                    expect(Math.abs(newratio - ratio) < 0.003).to.be.true
                    done();
                };

                if (image.complete) {
                    doit();
                } else {
                    image.onload = doit;
                }
                // expect(popup.parentNode).to.be.equal(null);
            });
        });
    });


    afterEach(removeStuff);
});