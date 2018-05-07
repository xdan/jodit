describe('Test interface', function() {
    describe('Toolbar', function () {
        describe('Set toolbar options to false', function () {
            it('Should hide toolbar', function () {
                var editor = new Jodit(appendTestArea(), {
                    toolbar: false
                });
                expect(null).to.be.equal(editor.container.querySelector('jodit_toolbar'));
            });
        });
        describe('Popups', function () {
            describe('Click on dots buttons in mobile size', function () {
                it('Should open popup with several buttons', function () {
                    getBox().style.width = '300px';
                    var editor = new Jodit(appendTestArea());
                    var dots = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-dots');
                    expect(dots).to.be.not.equal(null);
                    simulateEvent('mousedown', 0, dots);
                    var popup = dots.querySelector('.jodit_toolbar_popup.jodit_toolbar_popup-open');

                    expect(popup).to.be.not.equal(null);

                    var video = popup.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-video');
                    expect(video).to.be.not.equal(null);

                    simulateEvent('mousedown', 0, video);

                    var popup2 = video.querySelector('.jodit_toolbar_popup.jodit_toolbar_popup-open');
                    expect(popup2).to.be.not.equal(null);
                    getBox().style.width = 'auto';
                });
                describe('Some with touchend', function () {
                    it('Should open popup with several buttons', function () {
                        getBox().style.width = '300px';
                        var editor = new Jodit(appendTestArea());
                        var dots = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-dots');
                        expect(dots).to.be.not.equal(null);
                        simulateEvent('touchend', 0, dots);
                        var popup = dots.querySelector('.jodit_toolbar_popup.jodit_toolbar_popup-open');

                        expect(popup).to.be.not.equal(null);

                        var video = popup.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-video');
                        expect(video).to.be.not.equal(null);

                        simulateEvent('touchend', 0, video);

                        var popup2 = video.querySelector('.jodit_toolbar_popup.jodit_toolbar_popup-open');
                        expect(popup2).to.be.not.equal(null);
                        getBox().style.width = 'auto';
                    });
                });
            });
            describe('Click on some link', function () {
                describe('in the left side of editor', function () {
                    it('Should open inline popup with float by left editor side', function () {
                        var editor = new Jodit(appendTestArea(), {
                        });

                        editor.setEditorValue('asas <a href="#">test</a>')

                        simulateEvent('mousedown', 0, editor.editor.querySelector('a'))

                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline.jodit_toolbar_popup-inline-open');

                        expect(popup && popup.style.display !== 'none').to.be.equal(true);

                        var positionPopup = offset(popup);
                        var positionContainer = offset(editor.container);

                        expect(true).to.be.equal(positionPopup.left >= positionContainer.left);
                    });
                });
            });
            describe('Click on some button with defined popup field', function () {
                it('Should open popup in toolbar', function () {
                    var editor = new Jodit(appendTestArea(), {
                        disablePlugins: 'mobile'
                    });
                    simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-video'))

                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup');

                    expect(popup && popup.style.display === 'block').to.equal(true);
                });
                describe('in the left side', function () {
                    it('Should open popup in toolbar with float by left editor side', function () {
                        var editor = new Jodit(appendTestArea(), {
                            buttons: ['video'],
                            disablePlugins: 'mobile'
                        });

                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-video'))

                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup[data-editor_id=' + editor.id + ']');

                        expect(popup).to.be.not.equal(null);

                        var positionPopup = offset(popup);
                        var positionContainer = offset(editor.container);

                        expect(true).to.be.equal(positionPopup.left >= positionContainer.left);
                    });
                });
                describe('in the right side', function () {
                    it('Should open popup in toolbar with float by left editor side', function () {
                        var editor = new Jodit(appendTestArea(), {
                            width: 300,
                            buttons: [
                                'video',
                                'video',
                                'video',
                                'video',
                                'video',
                                'video',
                                'video',
                                'video',
                                'video',
                            ],
                            disablePlugins: 'mobile'
                        });

                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-video:last-child'))

                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup[data-editor_id=' + editor.id + ']');

                        expect(popup).to.be.not.equal(null);

                        var positionPopup = offset(popup);
                        var positionContainer = offset(editor.container);

                        expect(Math.abs((positionPopup.left + positionPopup.width) - (positionContainer.left + positionContainer.width)) < 2).to.be.true;
                    });
                });
            });
            getBox().style.width = 'auto';
            it('Open and close popap after clicking in another place', function() {
                var editor = new Jodit(appendTestArea(), {
                    disablePlugins: 'mobile'
                });

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-video'))

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup');

                expect(popup && popup.style.display === 'block').to.equal(true);

                simulateEvent('mousedown', 0, window)

                expect(popup && popup.parentNode === null).to.equal(true);
            });
            describe('Open list', function() {
                it('Should Open list in toolbar', function() {
                    var editor = new Jodit(appendTestArea(), {
                        toolbarAdaptive: false
                    });

                    simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-font'))

                    var list = editor.container.querySelector('.jodit_toolbar_list');

                    expect(list && window.getComputedStyle(list).display === 'block' && list.parentNode !== null).to.equal(true);
                });
                describe('Change defaiult list', function () {
                    it('Should change default FONT list in toolbar', function() {
                        var editor = new Jodit(appendTestArea(), {
                            toolbarAdaptive: false,
                            controls: {
                                font: {
                                    list: {
                                        "font-family: -apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,HelveticaNeue-Light,Ubuntu,Droid Sans,sans-serif;": "Custom",
                                        "Helvetica,sans-serif": "Helvetica",
                                        "Arial,Helvetica,sans-serif": "Arial",
                                        "Georgia,serif": "Georgia",
                                        "Impact,Charcoal,sans-serif": "Impact",
                                        "Tahoma,Geneva,sans-serif": "Tahoma",
                                        "'Times New Roman',Times,serif": "Times New Roman",
                                        "Verdana,Geneva,sans-serif": "Verdana"
                                    }
                                }
                            }
                        });

                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-font'))

                        var list = editor.container.querySelector('.jodit_toolbar_list');

                        expect(list && window.getComputedStyle(list).display === 'block' && list.parentNode !== null).to.equal(true);

                        expect(list.innerText.match('Custom')).to.be.not.equal(null);

                    });
                    it('Should change default FONT size list in toolbar', function() {
                        var editor = new Jodit(appendTestArea(), {
                            toolbarAdaptive: false,
                            controls: {
                                fontsize: {
                                    list: "8,9,10",
                                }
                            }
                        });

                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-fontsize'))

                        var list = editor.container.querySelector('.jodit_toolbar_list');

                        expect(list.getElementsByTagName('li').length).to.be.equal(3);

                    });
                });
            });
            it('Open and close list after clicking in another place', function() {
                var editor = new Jodit(appendTestArea());

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_with_dropdownlist'))

                var list = editor.container.querySelector('.jodit_toolbar_list');

                expect(list && window.getComputedStyle(list).display === 'block').to.equal(true);

                simulateEvent('mousedown', 0, window);

                expect(list && list.parentNode === null).to.equal(true);
            });
            it('Open colorpicker set background and color. After this click in another any place. White when popap will be closed. Open again and remove all styles.', function() {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('text2text')

                var sel = editor.editorWindow.getSelection(), range = editor.editorDocument.createRange();

                range.setStart(editor.editor.firstChild, 3)
                range.setEnd(editor.editor.firstChild, 6)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-brush'))

                var list = editor.container.querySelector('.jodit_toolbar_popup');

                expect(window.getComputedStyle(list).display).to.equal('block');

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-brush [data-color="#F9CB9C"]'))

                expect(editor.getEditorValue()).to.equal('tex<span style="background-color: rgb(249, 203, 156);">t2t</span>ext');

                // simulateEvent('mousedown', 0, editor.editor)
                expect(list.parentNode).to.equal(null);

                range.selectNodeContents(editor.editor.querySelector('span'))
                // range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-brush'))
                list = editor.container.querySelector('.jodit_toolbar_popup.jodit_toolbar_popup-open');
                expect(window.getComputedStyle(list).display).to.equal('block');

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-brush .jodit_colorpicker > a > svg'))
                expect(editor.getEditorValue()).to.equal('text2text');
            });
            it('Open format list set H1 for current cursor position. Restore selection after that', function() {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('text2text')

                var sel = editor.editorWindow.getSelection(), range = editor.editorDocument.createRange();

                range.setStart(editor.editor.firstChild, 3)
                range.setEnd(editor.editor.firstChild, 6)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-paragraph'))

                var list = editor.container.querySelector('.jodit_toolbar_list');

                expect(window.getComputedStyle(list).display).to.equal('block');

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-paragraph .jodit_toolbar_btn.jodit_toolbar_btn-h1'))

                expect(editor.getEditorValue()).to.equal('<h1>text2text</h1>');

                simulateEvent('mousedown', 0, editor.editor)

                expect(list.parentNode).to.equal(null);

                editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

                expect(editor.getEditorValue()).to.equal('<h1>tex a ext</h1>');
            });
            describe('FontName', function () {
                describe('Open fontname list and select some element', function () {
                    it('Should apply this font to current selection elements', function() {
                        var editor = new Jodit(appendTestArea(), {
                            toolbarAdaptive: false
                        });

                        editor.value = '<p>test</p>';
                        editor.selection.select(editor.editor.firstChild.firstChild);

                        var fontname = editor.container.querySelector('.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-font')
                        expect(fontname).to.be.not.equal(null);

                        function openFontnameList() {
                           simulateEvent('mousedown', 0, fontname);

                           return fontname.querySelector('.jodit_toolbar_list.jodit_toolbar_list-open > ul')
                        }

                        expect(openFontnameList()).to.be.not.equal(null);

                        [].slice.call(openFontnameList().childNodes).forEach(function (font, index) {
                            font = openFontnameList().childNodes[index];
                            simulateEvent('mousedown', 0, font);
                            var fontFamily = font.querySelector('span[style]').getAttribute('style').replace(/"/g, "'");

                            expect(sortAtrtibutes(editor.value)).to.be.equal(sortAtrtibutes('<p><span style="' + fontFamily + '">test</span></p>'));
                        });
                    });
                    describe('Extends standart font list', function () {
                        it('Should standart font list elements', function() {
                            var editor = new Jodit(appendTestArea(), {
                                toolbarAdaptive: false,
                                controls: {
                                    font: {
                                        list: {
                                            "-apple-system,BlinkMacSystemFont,\'Segoe WPC\',\'Segoe UI\',HelveticaNeue-Light,Ubuntu,\'Droid Sans\',sans-serif": "OS System Font",
                                        }
                                    }
                                }
                            });

                            editor.value = '<p>test</p>';
                            editor.selection.select(editor.editor.firstChild.firstChild);

                            var fontname = editor.container.querySelector('.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-font')
                            expect(fontname).to.be.not.equal(null);


                            simulateEvent('mousedown', 0, fontname);

                            var list = fontname.querySelector('.jodit_toolbar_list.jodit_toolbar_list-open > ul')


                            expect(list).to.be.not.equal(null);

                            var font = list.childNodes[list.childNodes.length - 1];
                            simulateEvent('mousedown', 0, font);

                            expect(sortAtrtibutes(editor.value)).to.be.equal(sortAtrtibutes('<p><span style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe WPC\',\'Segoe UI\',HelveticaNeue-Light,Ubuntu,\'Droid Sans\',sans-serif">test</span></p>'));

                        });
                    });
                });
            });
            it('Open image dialog and insert image by url.', function() {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue(Jodit.INVISIBLE_SPACE); // IE in iframe mode can loose focus and we can not check where it paste image in start or in finish. It is only in IE

                var sel = editor.editorWindow.getSelection(), range = editor.editorDocument.createRange();

                range.selectNodeContents(editor.editor)
                range.collapse(false)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image'));

                var list = editor.container.querySelector('.jodit_toolbar_popup');

                expect(window.getComputedStyle(list).display).to.equal('block');

                editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=url]').value = '' // try wrong url
                editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=text]').value = '123'
                simulateEvent('submit', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_form'))

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=url].jodit_error').length).to.equal(1);

                editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=url]').value = 'http://xdsoft.net/jodit/images/artio.jpg'
                simulateEvent('submit', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_form'))

                expect(sortAtrtibutes(editor.getEditorValue())).to.equal('<img alt="123" src="http://xdsoft.net/jodit/images/artio.jpg">');

                simulateEvent('mousedown', 0, editor.editor)

                expect(list.parentNode).to.equal(null);
            });
            it('Open video dialog and insert video by url from youtube.', function() {
                var editor = new Jodit(appendTestArea(), {
                    disablePlugins: 'mobile'
                });

                editor.setEditorValue('')


                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-video'))

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup');

                expect(popup.style.display).to.equal('block');

                popup.querySelector('input[name=code]').value = 'sddhttps://www.youtube.com/watch?v=7CcEYRfxUOQ' // try wrong url
                simulateEvent('submit', 0, popup.querySelector('.jodit_form'))

                expect(popup.querySelectorAll('input[name=code].jodit_error').length).to.equal(1);

                popup.querySelector('input[name=code]').value = 'https://www.youtube.com/watch?v=7CcEYRfxUOQ'
                simulateEvent('submit', 0, popup.querySelector('.jodit_form'))

                expect(sortAtrtibutes(editor.getEditorValue())).to.equal('<iframe allowfullscreen="" frameborder="0" height="345" src="//www.youtube.com/embed/7CcEYRfxUOQ" width="400"></iframe>');

                simulateEvent('mousedown', 0, editor.editor)

                expect(popup.parentNode).to.equal(null);
            });
            it('Open align list and choose Right align.', function() {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('Test')


                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-left'))

                var list = editor.container.querySelector('.jodit_toolbar_list');

                expect(window.getComputedStyle(list).display).to.equal('block');

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-left .jodit_toolbar_btn.jodit_toolbar_btn-right'))


                expect(sortAtrtibutes(editor.getEditorValue())).to.equal('<p style="text-align:right">Test</p>');

                simulateEvent('mousedown', 0, editor.editor)

                expect(list.parentNode).to.equal(null);
            });

            describe('Click inside the link', function() {
                it('Should open link popup', function() {
                    var editor = new Jodit(appendTestArea(), {
                        observer: {
                            timeout: 0
                        }
                    });

                    editor.setEditorValue('test test <a href="#">test</a>')


                    simulateEvent('mousedown', 0, editor.editor.querySelector('a'))

                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline.jodit_toolbar_popup-inline-open[data-editor_id=' + editor.id + ']');

                    expect(popup).to.be.not.equal(null);
                });
                describe('Click on pencil', function() {
                    it('Should open edit link popup', function() {
                        var editor = new Jodit(appendTestArea(), {
                            observer: {
                                timeout: 0
                            }
                        });

                        editor.setEditorValue('test test <a href="#">test</a>')


                        simulateEvent('mousedown', 0, editor.editor.querySelector('a'))
                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline[data-editor_id=' + editor.id + ']');

                        expect(popup).to.be.not.equal(null);
                        expect(popup.classList.contains('jodit_toolbar_popup-inline-open')).to.be.equal(true);

                        var pencil = popup.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link a');
                        expect(pencil).to.be.not.equal(null);

                        simulateEvent('mousedown', 0, pencil);
                        var subpopup = popup.querySelector('.jodit_toolbar_popup');

                        expect(subpopup).to.be.not.equal(null);
                        expect(subpopup.style.display).to.be.equal('block');
                        expect(popup.classList.contains('jodit_toolbar_popup-inline-open')).to.be.equal(true);
                        expect(popup.parentNode.parentNode.parentNode).to.be.not.equal(null);
                    });
                });
            });
            describe('Open LINK insert dialog and insert new link', function() {
                it('Should insert new link', function() {
                    var popup_opened = 0;
                    var editor = new Jodit(appendTestArea(), {
                        events: {
                            /**
                             * @param {Node} target
                             * @param {ControlType} control
                             * @param {ToolbarPopup} popup
                             * @return false | undefined - if return false - popup will not be shown
                             */
                            beforeLinkOpenPopup: function (target, control, popup) {
                                popup_opened+=1;
                            },
                            /**
                             *
                             * @param {HTMLElement} popup_container
                             */
                            afterLinkOpenPopup: function (popup_container) {
                                popup_opened+=1;
                            },
                        },
                        observer: {
                            timeout: 0
                        }
                    });

                    editor.value = '';


                    simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link'))

                    var list = editor.container.querySelector('.jodit_toolbar_popup');

                    expect(popup_opened).to.be.equal(2);
                    expect(editor.ownerWindow.getComputedStyle(list).display).to.equal('block');
                    expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button').style.display).to.equal('none');

                    var url = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=url]');
                    expect(url).to.be.not.equal(null);

                    url.focus();
                    url.value = '' // try wrong url
                    editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=text]').value = '123'
                    simulateEvent('submit', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'))

                    expect(url.classList.contains('jodit_error')).to.be.true;

                    url.focus();
                    url.value = 'tests/artio.jpg'
                    simulateEvent('submit', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'))

                    expect(sortAtrtibutes(editor.value)).to.equal('<a href="tests/artio.jpg">123</a>');

                    simulateEvent('mousedown', 0, editor.editor);


                    expect(list.parentNode).to.equal(null);
                });
                describe('On selected text', function () {
                    it('Should wrap selected text in link', function() {
                        var editor = new Jodit(appendTestArea(), {
                            toolbarAdaptive: false,
                            observer: {
                                timeout: 0
                            }
                        });

                        editor.value = 'test <span>select</span> stop';
                        var range = editor.editorDocument.createRange();
                        range.selectNodeContents(editor.editor.querySelector('span'));
                        editor.selection.selectRange(range);

                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link'))

                        var popup = editor.container.querySelector('.jodit_toolbar_popup');
                        expect(popup).to.be.not.equal(null);
                        expect(editor.ownerWindow.getComputedStyle(popup).display).to.equal('block');
                        expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button').style.display).to.equal('none');

                        var url = popup.querySelector('input[name=url]');
                        expect(url).to.be.not.equal(null);
                        var text = popup.querySelector('input[name=text]');
                        expect(text).to.be.not.equal(null);

                        expect(text.value).to.be.equal('select');

                        url.focus();
                        url.value = 'tests/artio.jpg'
                        simulateEvent('submit', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'))

                        expect(sortAtrtibutes(editor.value)).to.equal('test <a href="tests/artio.jpg">select</a> stop');

                        simulateEvent('mousedown', 0, editor.editor);


                        expect(popup.parentNode).to.equal(null);
                    });
                });
                it('Should restore source text after user clicked on Unlink button', function() {
                    var editor = new Jodit(appendTestArea(), {
                        observer: {
                            timeout: 0
                        }
                    });

                    editor.setEditorValue('<a target="_blank" rel="nofollow" href="#test">test</a>')

                    var sel = editor.editorWindow.getSelection(),
                        range = editor.editorDocument.createRange();

                    range.selectNode(editor.editor.firstChild);
                    sel.removeAllRanges();
                    sel.addRange(range);


                    simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link'))

                    expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=url]').value).to.equal('#test');
                    expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=target]').checked).to.equal(true);
                    expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=nofollow]').checked).to.equal(true);
                    expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button').style.display).to.be.not.equal('none');
                    expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_link_insert_button').innerHTML).to.equal(editor.i18n('Update'));

                    simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button'))

                    expect(sortAtrtibutes(editor.getEditorValue())).to.equal('test')
                });
            });
            describe('Create table', function () {
                describe('Mouse move', function () {
                    it('Should highlight cells in table-creator', function() {
                        var editor = new Jodit(appendTestArea(), {
                            observer: {
                                timeout: 0
                            }
                        });
                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-table'))

                        var list = editor.container.querySelector('.jodit_toolbar_popup');

                        expect(window.getComputedStyle(list).display).to.equal('block');

                        simulateEvent('mousemove', 0, list.querySelectorAll('.jodit_form-container div')[14])
                        expect(list.querySelectorAll('.jodit_form-container div.hovered').length).to.equal(10);
                    });
                });
            });
        });
        describe('Buttons', function () {
            describe('Text mode', function () {
                it('Should work i18n', function () {
                    var editor = new Jodit(appendTestArea(), {
                        textIcons: true,
                        "language": "ru"
                    });
                    var editor2 = new Jodit(appendTestArea(), {
                        textIcons: true,
                        "language": "en"
                    });

                    var label1 = editor.container.querySelector('.jodit_toolbar_btn-source').innerText;
                    var label2 = editor2.container.querySelector('.jodit_toolbar_btn-source').innerText;
                    expect(label1).to.be.not.equal(label2);
                });
                it('Should create buttons with text', function () {
                    var editor = new Jodit(appendTestArea(), {
                        textIcons: true
                    });
                    expect(editor.container.querySelectorAll('.jodit_toolbar_btn-source').length).to.be.equal(1);
                    expect(editor.container.querySelectorAll('.jodit_toolbar_btn-source svg').length).to.be.equal(0);
                });
                it('Should add jodit_text_icons class to editor\'s container', function () {
                    var editor = new Jodit(appendTestArea(), {
                        textIcons: true
                    });
                    expect(editor.container.classList.contains('jodit_text_icons')).to.be.true;
                });
                it('Should set font-size more them 0', function () {
                    var editor = new Jodit(appendTestArea(), {
                        textIcons: true
                    });
                    expect(parseInt(editor.ownerWindow.getComputedStyle(editor.container.querySelector('.jodit_toolbar_btn-source .jodit_icon')).fontSize, 10)).to.be.above(10);
                });
                describe('In tabs', function () {
                    it('Should be also only text', function () {
                        var editor = new Jodit(appendTestArea(), {
                            textIcons: true
                        });

                        expect(editor.container.querySelector('.jodit_toolbar_btn-image')).to.be.not.equal(null)

                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-image'));

                        var popup = editor.container.querySelector('.jodit_toolbar_btn-image .jodit_toolbar_popup.jodit_toolbar_popup-open');

                        expect(popup).to.be.not.equal(null)

                        expect(popup.querySelectorAll('svg, img').length).to.be.equal(0);
                    });
                });
                describe('In brush popup', function () {
                    it('Should be also only text', function () {
                        var editor = new Jodit(appendTestArea(), {
                            textIcons: true
                        });

                        expect(editor.container.querySelector('.jodit_toolbar_btn-brush')).to.be.not.equal(null)

                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-brush'));

                        var popup = editor.container.querySelector('.jodit_toolbar_btn-brush .jodit_toolbar_popup.jodit_toolbar_popup-open');

                        expect(popup).to.be.not.equal(null)

                        expect(popup.querySelectorAll('svg, img').length).to.be.equal(0);
                    });
                });
                describe('In video popup', function () {
                    it('Should be also only text', function () {
                        var editor = new Jodit(appendTestArea(), {
                            textIcons: true,
                            toolbarAdaptive: false,
                        });

                        expect(editor.container.querySelector('.jodit_toolbar_btn-video')).to.be.not.equal(null)

                        simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-video'));

                        var popup = editor.container.querySelector('.jodit_toolbar_btn-video .jodit_toolbar_popup.jodit_toolbar_popup-open');

                        expect(popup).to.be.not.equal(null)

                        expect(popup.querySelectorAll('svg, img').length).to.be.equal(0);
                    });
                });
            });
            it('Remove default buttons functionality', function() {
                var editor = new Jodit(appendTestArea());
                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-source').length).to.equal(1);
                editor.destruct();
                editor = new Jodit(appendTestArea(), {
                    removeButtons: ['source']
                });
                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-source').length).to.equal(0);
            });
            it('Add own button', function() {
                var editor = new Jodit(appendTestArea(), {
                    disablePlugins: ['mobile'],
                    buttons: Jodit.defaultOptions.buttons.concat([
                        {
                            name: 'insertDate',
                            iconURL: 'http://xdsoft.net/jodit/images/logo.png',
                            exec: function (editor) {
                                editor.selection.insertHTML((new Date('2016/03/16')).toDateString());
                            }
                        }
                    ])
                });
                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-insertDate').length).to.equal(1);

                editor.setEditorValue('');

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-insertDate'))
                expect(editor.getEditorValue()).to.equal('Wed Mar 16 2016');
            });
            it('When cursor inside STRONG tag, Bold button should be selected', function() {
                var editor = new Jodit(appendTestArea(), {
                    observer: {
                        timeout: 0 // disable delay
                    }
                });

                editor.setEditorValue('<strong>test</strong><em>test2</em><i>test3</i><b>test3</b>');

                var sel = editor.editorWindow.getSelection(), range = editor.editorDocument.createRange();

                range.setStart(editor.editor.firstChild.firstChild, 2)
                range.collapse(true)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.editor)

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-bold.jodit_active').length).to.equal(1);


                range.setStart(editor.editor.firstChild.nextSibling.firstChild, 2)
                range.collapse(true)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.editor)

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-bold.jodit_active').length).to.equal(0);
                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-italic.jodit_active').length).to.equal(1);

                range.setStart(editor.editor.firstChild.nextSibling.nextSibling.firstChild, 2)
                range.collapse(true)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.editor)

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-bold.jodit_active').length).to.equal(0);
                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-italic.jodit_active').length).to.equal(1);


                range.setStart(editor.editor.firstChild.nextSibling.nextSibling.nextSibling.firstChild, 2)
                range.collapse(true)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.editor)

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-bold.jodit_active').length).to.equal(1);
                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-italic.jodit_active').length).to.equal(0);
            });
            it('Disable buttons which can not be used in that mode', function() {
                var editor = new Jodit(appendTestArea(), {
                    observer: {
                        timeout: 0 // disable delay
                    }
                });

                editor.setEditorValue('<strong>test</strong><em>test2</em><i>test3</i><b>test3</b>');

                editor.setMode(Jodit.MODE_SOURCE);

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-bold.jodit_disabled').length).to.equal(1);
                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-source.jodit_disabled').length).to.equal(0);

                editor.setMode(Jodit.MODE_WYSIWYG);

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-bold.jodit_disabled').length).to.equal(0);
                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-source.jodit_disabled').length).to.equal(0);

            });

            it('When cursor inside SPAN tag with style="font-weight: bold" or style="font-weight: 700", Bold button should be selected', function() {
                var editor = new Jodit(appendTestArea(), {
                    observer: {
                        timeout: 0 // disable delay
                    }
                });

                editor.setEditorValue('<span style="font-weight: bold">test</span>');

                var sel = editor.editorWindow.getSelection(), range = editor.editorDocument.createRange();
                range.setStart(editor.editor.firstChild.firstChild, 2)
                range.collapse(true)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.editor)

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-bold.jodit_active').length).to.equal(1);
            });
            describe('Check Redo Undo functionality', function() {
                it('Should change disable in icon then then can not be executed', function() {
                    var area = appendTestArea();
                    area.value = 'top';
                    var editor = new Jodit(area, {
                        observer: {
                            timeout: 0 // disable delay
                        }
                    });
                    editor.selection.focus();

                    editor.value = 'Test';

                    expect(editor.container.querySelectorAll('.jodit_toolbar_btn-undo.jodit_disabled').length).to.equal(0);
                    expect(editor.container.querySelectorAll('.jodit_toolbar_btn-redo.jodit_disabled').length).to.equal(1);

                    simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-undo'))

                    expect(editor.container.querySelectorAll('.jodit_toolbar_btn-undo.jodit_disabled').length).to.equal(1);
                    expect(editor.container.querySelectorAll('.jodit_toolbar_btn-redo.jodit_disabled').length).to.equal(0);

                    expect(editor.value).to.equal('top');
                });
            });
            it('Full size button', function() {
                var editor = new Jodit(appendTestArea(), {
                    observer: {
                        timeout: 0 // disable delay
                    }
                });

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-fullsize'));

                var node = editor.container.parentNode;
                while (node && !(node instanceof Document)) {
                    expect(node.classList.contains('jodit_fullsize_box')).to.equal(true);
                    node = node.parentNode;
                }
            });
            it('Should add extra buttons', function() {
                var editor = new Jodit(appendTestArea(), {
                    extraButtons: [
                        {
                            name: 'adddate',
                            exec: function (editor) {
                                var a = editor.editorDocument.createTextNode('111');
                                editor.selection.insertNode(a);
                            }
                        }
                    ]
                });

                editor.setEditorValue('')

                expect(editor.container.querySelectorAll('.jodit_toolbar_btn-adddate').length).to.equal(1);

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-adddate'));

                expect(editor.getEditorValue()).to.equal('111');
            });
            describe('Add button', function () {
                it('Should create buttons in toolbar', function () {
                    var editor = new Jodit(appendTestArea(), {
                        buttons: ['indent', 'outdent', 'bold', 'customxxx'],
                        disablePlugins: 'mobile'
                    });

                    expect(null).to.be.not.equal(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-indent'));
                    expect(null).to.be.not.equal(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-outdent'));
                    expect(null).to.be.not.equal(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-bold'));
                    expect(null).to.be.not.equal(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-customxxx'));
                    expect(null).to.be.equal(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-source'));
                });
            });
            describe('Button Bold', function () {
                it('Should reactivate Bold button after second click and move cursor out of Strong element', function () {
                    var editor = new Jodit(appendTestArea(), {
                        buttons: ['bold']
                    });

                    editor.setEditorValue('<p>test</p>')
                    editor.selection.setCursorAfter(editor.editor.firstChild.firstChild);

                    simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-bold'));
                    editor.selection.insertHTML('text');
                    simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-bold'));
                    editor.selection.insertHTML('text');

                    expect(editor.getEditorValue()).to.equal('<p>test<strong>text</strong>text</p>');
                });
            });
            describe('Active button', function () {
                it('Should not be activated then element has default style', function () {
                    var editor = new Jodit(appendTestArea(), {
                        observer: {
                            timeout: 0
                        }
                    });
                    editor.setEditorValue('<p>test<strong>bold</strong></p>')
                    var p = editor.editor.firstChild;
                    editor.selection.setCursorAfter(p.firstChild);

                    simulateEvent('mousedown', 0, p);

                    var bold = editor.container.querySelector('.jodit_toolbar_btn-bold');
                    var align = editor.container.querySelector('.jodit_toolbar_btn-left');

                    expect(false).to.equal(align.classList.contains('jodit_active'));
                    expect(false).to.equal(bold.classList.contains('jodit_active'));

                    editor.selection.setCursorIn(p.querySelector('strong').firstChild);
                    simulateEvent('mousedown', 0, p);
                    // editor.selection.insertHTML('ddd');
                    expect(false).to.equal(align.classList.contains('jodit_active'));
                    expect(true).to.equal(bold.classList.contains('jodit_active'));

                    p.style.textAlign = 'right';
                    simulateEvent('mousedown', 0, p);
                    expect(true).to.equal(align.classList.contains('jodit_active'));
                    expect(true).to.equal(bold.classList.contains('jodit_active'));
                })
                describe('Fontsize button', function () {
                    it('Should be activated then element has no default font-size', function () {
                        var editor = new Jodit(appendTestArea(), {
                            observer: {
                                timeout: 0
                            }
                        });
                        editor.setEditorValue('<p>test<span style="font-size: 12px">bold</span></p>')

                        var p = editor.editor.firstChild;
                        var fontsize = editor.container.querySelector('.jodit_toolbar_btn-fontsize');

                        editor.selection.setCursorAfter(p.firstChild);
                        simulateEvent('mousedown', 0, p);
                        expect(false).to.equal(fontsize.classList.contains('jodit_active'));

                        editor.selection.setCursorIn(p.lastChild);
                        simulateEvent('mousedown', 0, p);
                        expect(true).to.equal(fontsize.classList.contains('jodit_active'));
                    });
                });
                describe('Color button', function () {
                    it('Should be activated then element has some color', function () {
                        var editor = new Jodit(appendTestArea(), {
                            observer: {
                                timeout: 0
                            }
                        });
                        editor.setEditorValue('<p>test<span style="color: #ccc">bold</span></p>')

                        var p = editor.editor.firstChild;
                        var brush = editor.container.querySelector('.jodit_toolbar_btn-brush');
                        var brushIcon = editor.container.querySelector('.jodit_toolbar_btn-brush svg');

                        editor.selection.setCursorAfter(p.firstChild);
                        simulateEvent('mousedown', 0, p);
                        expect(false).to.equal(brush.classList.contains('jodit_active'));
                        expect('').to.equal(brushIcon.style.fill);

                        editor.selection.setCursorIn(p.lastChild);
                        simulateEvent('mousedown', 0, p);
                        expect(true).to.equal(brush.classList.contains('jodit_active'));
                        expect('rgb(204, 204, 204)').to.equal(brushIcon.style.fill);
                    });
                });
                describe('In list', function () {
                    describe('Fontsize button', function () {
                        it('Should be activated then element has some style value', function () {
                            var editor = new Jodit(appendTestArea(), {
                                observer: {
                                    timeout: 0
                                }
                            });
                            editor.setEditorValue('<p>test<span style="font-size: 16px">bold</span></p>')

                            var p = editor.editor.firstChild;
                            var font = editor.container.querySelector('.jodit_toolbar_btn-fontsize');

                            expect(null).to.be.not.equal(font);

                            editor.selection.setCursorAfter(p.firstChild);
                            simulateEvent('mousedown', 0, p);
                            expect(false).to.equal(font.classList.contains('jodit_active'));

                            editor.selection.setCursorIn(p.lastChild);

                            simulateEvent('mousedown', 0, p);
                            expect(true).to.equal(font.classList.contains('jodit_active'));

                            simulateEvent('mousedown', 0, font);

                            var font16 = font.querySelector('.jodit_toolbar_btn-6');
                            expect(true).to.equal(font16.classList.contains('jodit_active'));
                        });
                    });
                    describe('Font family button', function () {
                        it('Should be activated then element has some style value', function () {
                            var editor = new Jodit(appendTestArea(), {
                                toolbarAdaptive: false,
                                observer: {
                                    timeout: 0
                                }
                            });

                            editor.setEditorValue('<p>test<span style="font-family: Georgia, serif;">bold</span></p>')

                            var p = editor.editor.firstChild;
                            var font = editor.container.querySelector('.jodit_toolbar_btn-font');

                            expect(null).to.be.not.equal(font);

                            editor.selection.setCursorAfter(p.firstChild);
                            simulateEvent('mousedown', 0, p);
                            expect(false).to.equal(font.classList.contains('jodit_active'));

                            editor.selection.setCursorIn(p.lastChild);

                            simulateEvent('mousedown', 0, p);
                            expect(true).to.equal(font.classList.contains('jodit_active'));

                            simulateEvent('mousedown', 0, font);

                            var fontGeorgia = font.querySelector('.jodit_toolbar_btn-Georgia_serif');
                            expect(fontGeorgia).to.be.not.equal(font);
                            expect(true).to.equal(fontGeorgia.classList.contains('jodit_active'));
                        });
                    });
                    describe('Format block button', function () {
                        it('Should be activated then element has some tagname', function () {
                            var editor = new Jodit(appendTestArea(), {
                                observer: {
                                    timeout: 0
                                }
                            });
                            editor.setEditorValue('<p>test</p>' +
                                '<h1>test</h1>' +
                                '<code>test</code>')

                            var p = editor.editor.firstChild;
                            var paragraph = editor.container.querySelector('.jodit_toolbar_btn-paragraph');

                            expect(null).to.be.not.equal(paragraph);

                            editor.selection.setCursorAfter(p.firstChild);
                            simulateEvent('mousedown', 0, p);
                            expect(false).to.equal(paragraph.classList.contains('jodit_active'));

                            editor.selection.setCursorIn(editor.editor.childNodes[1]);

                            simulateEvent('mousedown', 0, p);
                            expect(true).to.equal(paragraph.classList.contains('jodit_active'));

                            simulateEvent('mousedown', 0, paragraph);

                            var header = paragraph.querySelector('.jodit_toolbar_btn-h1');
                            expect(true).to.equal(header.classList.contains('jodit_active'));
                        });
                    });
                });
            });
            describe('Disable button', function () {
                describe('Cut', function () {
                    it('Should be activated editor has some selected text', function () {
                        var editor = new Jodit(appendTestArea(), {
                            toolbarAdaptive: false,
                            observer: {
                                timeout: 0
                            }
                        });

                        var cut = editor.container.querySelector('.jodit_toolbar_btn-cut');

                        editor.setEditorValue('<p>test<strong>bold</strong></p>')
                        expect(true).to.equal(cut.classList.contains('jodit_disabled'));

                        var p = editor.editor.firstChild;

                        editor.selection.select(p.firstChild);

                        expect(false).to.equal(cut.classList.contains('jodit_disabled'));

                    });
                });
            });
        });
        describe('Commands', function () {
            it('Click on Source button should change current mode', function() {
                var editor = new Jodit(appendTestArea());

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-source'))

                expect(editor.getMode()).to.equal(Jodit.MODE_SOURCE);
            });
            it('Click on Bold button should wrap current selection in <strong>', function() {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('Text to text')

                var sel = editor.editorWindow.getSelection(), range = editor.editorDocument.createRange();
                range.setStart(editor.editor.firstChild, 3)
                range.setEnd(editor.editor.firstChild, 10)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-bold'))

                expect(editor.getEditorValue()).to.equal('Tex<strong>t to te</strong>xt');
            });
            it('Click on Italic button when selection is collapsed should create new <em> element and set cursor into it', function() {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('Text to text')

                var sel = editor.editorWindow.getSelection(), range = editor.editorDocument.createRange();
                range.setStart(editor.editor.firstChild, 0)
                range.collapse(true)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-italic'))

                editor.selection.insertHTML('test');

                expect(editor.getEditorValue()).to.equal('<em>test</em>Text to text');
            });
            it('Click on unordered list button when selection is collapsed should wrap current box in  new <ul><li> element', function() {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<p>Text to text</p>')

                var sel = editor.editorWindow.getSelection(), range = editor.editorDocument.createRange();

                range.setStart(editor.editor.firstChild.firstChild, 5)
                range.collapse(true)
                sel.removeAllRanges();
                sel.addRange(range)

                simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn-ul'))

                editor.selection.insertHTML('test ');

                expect(editor.getEditorValue()).to.equal('<ul><li>Text test to text</li></ul>');
            });
        });
        describe('Inline', function () {
            describe('Сlick on the image', function () {
                it('Should Open inline popup', function () {
                    var editor = new Jodit(appendTestArea());

                    editor.setEditorValue('<img src="/tests/artio.jpg"/>');

                    simulateEvent('mousedown', 0, editor.editor.querySelector('img'))

                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                    expect(popup && popup.parentNode.parentNode !== null).to.equal(true);
                });
                describe('and click in opened popup on pencil button', function () {
                    it('Should Open edit image dialog', function () {
                        var editor = new Jodit(appendTestArea());

                        editor.setEditorValue('<img src="/tests/artio.jpg"/>');

                        simulateEvent('mousedown', 0, editor.editor.querySelector('img'))

                        var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                        expect(popup && popup.parentNode.parentNode !== null).to.equal(true);

                        simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-pencil'))

                        var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                        expect(dialog).to.be.not.equal(null);
                    });
                });
            });
            it('Open inline popup after click inside the cell', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table>' +
                        '<tr><td>1</td></tr>' +
                    '</table>');

                simulateEvent('mousedown', 0, editor.editor.querySelector('td'))

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                expect(popup && popup.parentNode.parentNode !== null).to.equal(true);
            });
            describe('Table button', function () {
                describe('Select table cell', function () {
                    it('Should Select table cell', function () {
                        var editor = new Jodit(appendTestArea());

                        editor.setEditorValue('<table>' +
                            '<tr><td>2</td></tr>' +
                            '</table>');

                        var td = editor.editor.querySelector('td');

                        simulateEvent('mousedown', 0, td)

                        expect(td.hasAttribute(Jodit.JODIT_SELECTED_CELL_MARKER)).to.equal(true);

                    });
                    describe('and press brushh button', function () {
                        it('Should Select table cell and fill it in yellow', function () {
                            var editor = new Jodit(appendTestArea());

                            editor.setEditorValue('<table>' +
                                '<tr><td>3</td></tr>' +
                                '</table>');

                            var td = editor.editor.querySelector('td');

                            simulateEvent('mousedown', 0, td)
                            simulateEvent('mousemove', 0, td)

                            var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                            expect(popup && popup.parentNode.parentNode !== null).to.equal(true);

                            simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-brush>a'))

                            var popupColor = popup.querySelector('.jodit_toolbar_popup');
                            expect(popupColor && window.getComputedStyle(popupColor).display).to.equal('block');

                            simulateEvent('mousedown', 0, popupColor.querySelector('.jodit_colorpicker_group>a'));


                            expect(editor.helper.normalizeColor(td.style.backgroundColor)).to.equal('#000000');

                        });
                    });
                });
            });
            it('Select table cell and change it vertical align', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table>' +
                    '<tr><td style="vertical-align: middle">3</td></tr>' +
                    '</table>');

                var td = editor.editor.querySelector('td');

                simulateEvent('mousedown', 0, td)


                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                expect(popup && popup.parentNode.parentNode !== null).to.equal(true);

                simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-valign>a'))

                var popupColor = popup.querySelector('.jodit_toolbar_list');
                expect(popupColor && window.getComputedStyle(popupColor).display).to.equal('block');

                simulateEvent('mousedown', 0, popupColor.querySelector('li>a'));


                expect(td.style.verticalAlign).to.equal('top');

            });
            it('Select table cell and split it by vertical', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table style="width: 300px;">' +
                    '<tr><td>3</td></tr>' +
                    '</table>');

                var td = editor.editor.querySelector('td');

                simulateEvent('mousedown', 0, td)

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-splitv>a'))

                var list = popup.querySelector('.jodit_toolbar_list.jodit_toolbar_list-open');
                expect(list).to.be.not.equal(null);
                simulateEvent('mousedown', 0, list.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-tablesplitv a'))

                expect(sortAtrtibutes(editor.getEditorValue())).to.equal('<table style="width:300px"><tbody><tr><td style="width:49.83%">3</td><td style="width:49.83%"><br></td></tr></tbody></table>');

            });
            it('Select table cell and split it by horizontal', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table style="width: 300px;">' +
                    '<tr><td>5</td></tr>' +
                    '</table>');

                var td = editor.editor.querySelector('td');

                simulateEvent('mousedown', 0, td)

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-splitv>a'))
                var list = popup.querySelector('.jodit_toolbar_list.jodit_toolbar_list-open');
                expect(list).to.be.not.equal(null);
                simulateEvent('mousedown', 0, list.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-tablesplitg a'))

                expect(sortAtrtibutes(editor.getEditorValue())).to.equal('<table style="width:300px"><tbody><tr><td>5</td></tr><tr><td><br></td></tr></tbody></table>');

            });
            it('Select two table cells and merge then in one', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table style="width: 300px;">' +
                    '<tr><td>5</td><td>6</td></tr>' +
                    '</table>');

                var td = editor.editor.querySelector('td');

                simulateEvent('mousedown', 0, td)
                simulateEvent('mousemove', 0, editor.editor.querySelectorAll('td')[1])

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-merge>a'))

                expect(editor.getEditorValue()).to.equal('<table style="width: 300px;"><tbody><tr><td >5<br>6</td></tr></tbody></table>');
            });
            it('Select table cell add column before this', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table>' +
                    '<tr><td>3</td></tr>' +
                    '</table>');

                var td = editor.editor.querySelector('td');

                simulateEvent('mousedown', 0, td)

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                expect(popup && popup.parentNode.parentNode !== null).to.equal(true);

                simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-addcolumn>a'))

                var popupColor = popup.querySelector('.jodit_toolbar_list');
                expect(popupColor && window.getComputedStyle(popupColor).display).to.equal('block');

                simulateEvent('mousedown', 0, popupColor.querySelector('li>a'));


                expect(editor.getEditorValue()).to.equal('<table><tbody><tr><td></td><td >3</td></tr></tbody></table>');

            });
            it('Select table cell and add row above this', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table>' +
                    '<tr><td>3</td></tr>' +
                    '</table>');

                var td = editor.editor.querySelector('td');

                simulateEvent('mousedown', 0, td)

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                expect(popup && popup.parentNode.parentNode !== null).to.equal(true);

                simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-addrow>a'))

                var popupColor = popup.querySelector('.jodit_toolbar_list');
                expect(popupColor && window.getComputedStyle(popupColor).display).to.equal('block');

                simulateEvent('mousedown', 0, popupColor.querySelector('li>a'));


                expect(editor.getEditorValue()).to.equal('<table><tbody><tr><td></td></tr><tr><td >3</td></tr></tbody></table>');

            });
            it('Select table cell and remove it row', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table>' +
                    '<tr><td>1</td></tr>' +
                    '<tr><td>2</td></tr>' +
                    '<tr><td>3</td></tr>' +
                    '</table>');

                var td = editor.editor.querySelectorAll('td')[1];

                simulateEvent('mousedown', 0, td)

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                expect(popup && popup.parentNode.parentNode !== null).to.equal(true);

                simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-bin>a'))

                var popupColor = popup.querySelector('.jodit_toolbar_list');
                expect(popupColor && window.getComputedStyle(popupColor).display).to.equal('block');

                simulateEvent('mousedown', 0, popupColor.querySelectorAll('li>a')[1]);


                expect(editor.getEditorValue()).to.equal('<table><tbody><tr><td>1</td></tr><tr><td>3</td></tr></tbody></table>');

            });
            it('Select table cell and remove whole table should hide inline popup', function () {
                var editor = new Jodit(appendTestArea());

                editor.setEditorValue('<table>' +
                    '<tr><td>1</td></tr>' +
                    '<tr><td>2</td></tr>' +
                    '<tr><td>3</td></tr>' +
                    '</table>');

                var td = editor.editor.querySelectorAll('td')[1];

                simulateEvent('mousedown', 0, td)

                var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup-inline');

                expect(popup && popup.parentNode.parentNode !== null).to.equal(true);

                simulateEvent('mousedown', 0, popup.querySelector('.jodit_toolbar_btn-bin>a'))

                var popupColor = popup.querySelector('.jodit_toolbar_list');
                expect(popupColor && window.getComputedStyle(popupColor).display).to.equal('block');

                simulateEvent('mousedown', 0, popupColor.querySelectorAll('li>a')[0]);


                expect(editor.getEditorValue()).to.equal('');

                expect(popup && popup.parentNode.parentNode !== null).to.equal(true);

            });
        });
        describe('In fileBrowser', function () {
            describe('Hide buttons ', function () {
                it('should hide toolbar buttons', function() {
                    var editor = new Jodit(appendTestArea(), {
                        filebrowser: {
                            buttons: Jodit.Array(['filebrowser.list', 'filebrowser.tiles', 'filebrowser.sort']),
                            ajax: {
                                url: 'https://xdsoft.net/jodit/connector/index.php'
                            }
                        },
                    });

                    simulateEvent('mousedown', 0, editor.ownerDocument.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image'))

                    var popup = editor.ownerDocument.querySelector('.jodit_toolbar_popup');

                    expect(popup && popup.style.display !== 'none').to.equal(true);
                    simulateEvent('mousedown', 0, popup.querySelectorAll('.jodit_tabs_buttons > a')[0]);


                    var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + editor.id + ']');

                    expect(dialog).to.be.not.equal(null);

                    expect(3).to.equal(dialog.querySelectorAll('.jodit_dialog_header .jodit_toolbar_btn').length);

                });
            });
        });
    });
    describe('ReadOnly', function () {
        describe('Set readonly mode in options', function () {

            describe('For iframe', function () {
                it('Should deny edit content in iframe\'s body', function () {
                    var editor = new Jodit(appendTestArea(), {
                        readonly: true,
                        iframe: true
                    });
                    expect(false).to.equal(editor.editor.hasAttribute('contenteditable'));
                    expect('BODY').to.equal(editor.editor.nodeName);
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
            it('Should deny edit content in simple source editor', function () {
                var editor = new Jodit(appendTestArea(), {
                    readonly: true,
                    useAceEditor: false
                });
                editor.setMode(Jodit.MODE_SOURCE);
                expect(true).to.equal(editor.__plugins.source.mirror.hasAttribute('readonly'));
            });
            it('Should deny edit content in ace source editor', function (done) {
                var editor = new Jodit(appendTestArea(), {
                    readonly: true,
                    useAceEditor: true,
                    events: {
                        'aceInited': function (editor) {
                            expect(null).to.be.not.equal(editor.__plugins.source.aceEditor);
                            expect(true).to.be.equal(editor.__plugins.source.aceEditor.getReadOnly());
                            done();
                        }
                    }
                });
                editor.setMode(Jodit.MODE_SOURCE);
                expect(true).to.be.equal(editor.__plugins.source.mirror.hasAttribute('readonly'));

            }).timeout(6000);
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
    describe('About dialog', function () {
        it('Should conteins License element', function () {
            var area = appendTestArea(),
                editor = new Jodit(area, {
                    license: '111',
                    toolbarAdaptive: false
                });
            var aboutButton = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-about');

            expect(aboutButton).to.be.not.equal(null);
            simulateEvent('mousedown', 0 , aboutButton);

            var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + area.id + ']');
            expect(dialog).to.be.not.equal(null);

            expect(dialog.innerText.match(/License:.*(GPL|GNU)/)).to.be.not.equal(null);
        });
        describe('Set license', function () {
            it('Should show License in about dialog', function () {
                var area = appendTestArea(),
                    editor = new Jodit(area, {
                        license: '12345678901234567890123456789022', // don't use this key - it is wrong
                        toolbarAdaptive: false
                    });
                var aboutButton = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-about');

                expect(aboutButton).to.be.not.equal(null);
                simulateEvent('mousedown', 0 , aboutButton);

                var dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active[data-editor_id=' + area.id + ']');
                expect(dialog).to.be.not.equal(null);

                expect(dialog.innerText.match(/License:.*(GPL|GNU)/)).to.be.equal(null);

                expect(dialog.innerText.match(/License: 12345678-\*\*\*\*\*\*\*\*-\*\*\*\*\*\*\*\*-56789022/)).to.be.not.equal(null);
            });
        });
    });
    afterEach(removeStuff);
});