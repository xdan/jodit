describe('Jodit FileBrowser Tests', function() {
    describe('Constructor/Destructor', function () {
        describe('Without Jodit', function () {
            it('Should create dialog and load files', function () {
                var filebrowser = new Jodit.modules.FileBrowser(null, {
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                });
                filebrowser.open(function () {});
                expect(document.querySelectorAll('.jodit_dialog_box.active').length).to.be.equal(1);
                filebrowser.close();
                expect(document.querySelectorAll('.jodit_dialog_box.active').length).to.be.equal(0);
            })
        });
        it('Should create dialog and load files', function () {
            var editor = new Jodit(appendTestArea(), {
                filebrowser: {
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                }
            });
            (new Jodit.modules.FileBrowser(editor)).open(function () {});
            expect(editor.ownerDocument.querySelectorAll('.jodit_dialog_box.active[data-editor_id=' + editor.id + ']').length).to.be.equal(1);
        });
        it('Should add filebrowser icon in image buttons popup', function () {
            var editor = new Jodit(appendTestArea(), {
                filebrowser: {
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                }
            });
            simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image'))

            expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_tabs_buttons .active').innerText).to.equal('Browse');
        });
        it('Should add uploader icon in image buttons popup', function () {
            var editor = new Jodit(appendTestArea(), {
                uploader: {
                    url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
                },
                filebrowser: {
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                }
            });
            simulateEvent('mousedown', 0, editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image'))

            expect(editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_tabs_buttons .active').innerText).to.equal('Upload');
        });
    });
    describe('Toolbar', function () {
        describe('Without Jodit', function () {
            it('Should create filebrowser and show standart toolbar', function (done) {
                var filebrowser = new Jodit.modules.FileBrowser(null, {
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                });

                filebrowser
                    .open(function () {})
                    .then(function () {
                        expect(filebrowser.dialog.dialogbox_header.querySelectorAll('.jodit_toolbar_btn').length).to.be.equal(12);
                        filebrowser.close();
                        done();
                    })
                    .catch(function (e) {
                        throw e
                    })
            })
        });
        describe('Disable buttons', function () {
            describe('Edit button', function () {
                it('Should be disable while not selected some image', function (done) {
                    var filebrowser = new Jodit.modules.FileBrowser(null, {
                        ajax: {
                            url: 'https://xdsoft.net/jodit/connector/index.php'
                        }
                    });

                    filebrowser
                        .open(function () {})
                        .then(function () {
                            var edit = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-edit');
                            expect(edit).to.be.not.null;
                            expect(edit.classList.contains('jodit_disabled')).to.be.true;

                            simulateEvent('click', 0, filebrowser.browser.querySelector('.jodit_filebrowser_files_item[data-is-file="0"]'))

                            expect(edit.classList.contains('jodit_disabled')).to.be.false;
                            filebrowser.close();
                            done();
                        })
                        .catch(function (e) {
                            throw e
                        })
                })
                it('Should be disabled if selected more then 1 image or some file', function (done) {
                    var filebrowser = new Jodit.modules.FileBrowser(null, {
                        ajax: {
                            url: 'https://xdsoft.net/jodit/connector/index.php'
                        }
                    });

                    filebrowser
                        .open(function () {})
                        .then(function () {
                            var edit = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-edit');
                            expect(edit).to.be.not.null;
                            expect(edit.classList.contains('jodit_disabled')).to.be.true;

                            simulateEvent('click', 0, filebrowser.browser.querySelector('.jodit_filebrowser_files_item[data-is-file="1"]'))

                            expect(edit.classList.contains('jodit_disabled')).to.be.true;

                            simulateEvent('click', 0, filebrowser.browser.querySelectorAll('.jodit_filebrowser_files_item[data-is-file="0"]')[0])
                            expect(edit.classList.contains('jodit_disabled')).to.be.false;
                            simulateEvent('click', 0, filebrowser.browser.querySelectorAll('.jodit_filebrowser_files_item[data-is-file="0"]')[1], function (data) {
                                data.ctrlKey = true;
                            });
                            expect(edit.classList.contains('jodit_disabled')).to.be.true;
                            
                            filebrowser.close();
                            done();
                        })
                        .catch(function (e) {
                            throw e
                        })
                })
            });
        });
        describe('View', function () {
            it('Should show filebrowser in default view', function (done) {
                var filebrowser = new Jodit.modules.FileBrowser(null, {
                    view: 'tiles',
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                });

                filebrowser
                    .open(function () {})
                    .then(function () {
                        var tiles = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-tiles');
                        var list = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-list');
                        var files = filebrowser.browser.querySelector('.jodit_filebrowser_files');

                        expect(files).to.be.not.null;
                        expect(files.classList.contains('jodit_filebrowser_files_view-tiles')).to.be.true;
                        expect(tiles.classList.contains('jodit_active')).to.be.true;
                        expect(list.classList.contains('jodit_active')).to.be.false;

                        filebrowser.close();
                        done();
                    })
                    .catch(function (e) {
                        throw e
                    })
            });
            describe('Change view', function () {
                it('Should change filebrowser view', function (done) {
                    var filebrowser = new Jodit.modules.FileBrowser(null, {
                        view: 'tiles',
                        ajax: {
                            url: 'https://xdsoft.net/jodit/connector/index.php'
                        }
                    });

                    filebrowser
                        .open(function () {})
                        .then(function () {
                            var tiles = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-tiles');
                            var list = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-list');
                            var files = filebrowser.browser.querySelector('.jodit_filebrowser_files');
                            expect(files).to.be.not.equal(null);
                            expect(files.classList.contains('jodit_filebrowser_files_view-tiles')).to.be.true;
                            expect(tiles.classList.contains('jodit_active')).to.be.true;
                            expect(list.classList.contains('jodit_active')).to.be.false;

                            simulateEvent('mousedown', 0 , list)

                            expect(files.classList.contains('jodit_filebrowser_files_view-tiles')).to.be.false;
                            expect(files.classList.contains('jodit_filebrowser_files_view-list')).to.be.true;
                            expect(tiles.classList.contains('jodit_active')).to.be.false;
                            expect(list.classList.contains('jodit_active')).to.be.true;

                            filebrowser.close();
                            done();
                        })
                        .catch(function (e) {
                            throw e
                        })
                });
            });
        });
        describe('Filter', function () {
            it('Should show only filterd items', function (done) {
                var filebrowser = new Jodit.modules.FileBrowser(null, {
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                });

                filebrowser
                    .open(function () {})
                    .then(function () {
                        var filter = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-filter');
                        var input = filter.querySelector('input');
                        var files = filebrowser.browser.querySelector('.jodit_filebrowser_files');

                        expect(files).to.be.not.null;
                        expect(filter).to.be.not.null;
                        expect(input).to.be.not.null;


                        var count = files.querySelectorAll('.jodit_filebrowser_files_item').length;
                        input.value = 'i'
                        simulateEvent('keydown', 0 , input)

                        expect(files.querySelectorAll('.jodit_filebrowser_files_item').length).to.be.not.equal(count);

                        input.value = ''
                        simulateEvent('keydown', 0 , input)
                        expect(files.querySelectorAll('.jodit_filebrowser_files_item').length).to.be.equal(count);

                        filebrowser.close();
                        done();
                    })
                    .catch(function (e) {
                        throw e
                    })
            });
        });
        describe('Sort', function () {
            it('Should sort elements by filter select', function (done) {
                var filebrowser = new Jodit.modules.FileBrowser(null, {
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                });

                filebrowser
                    .open(function () {})
                    .then(function () {
                        var sort = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-sort');
                        var select = sort.querySelector('select');
                        var files = filebrowser.browser.querySelector('.jodit_filebrowser_files');

                        expect(files).to.be.not.null;
                        expect(sort).to.be.not.null;
                        expect(select).to.be.not.null;


                        var count = files.querySelectorAll('.jodit_filebrowser_files_item').length;
                        select.value = 'changed'
                        simulateEvent('change', 0 , select)

                        var items = files.querySelectorAll('.jodit_filebrowser_files_item');

                        expect([].map.call(items, function (item) {
                            return item.querySelector('.jodit_filebrowser_files_item-info-filename').innerText;
                        }).join(',')).to.be.equal('test.txt,ibanez-s520-443140.jpg,1966051_524428741092238_1051008806888563137_o.jpg,images.jpg');

                        select.value = 'name';

                        simulateEvent('change', 0 , select)

                        items = files.querySelectorAll('.jodit_filebrowser_files_item');
                        expect([].map.call(items, function (item) {
                            return item.querySelector('.jodit_filebrowser_files_item-info-filename').innerText;
                        }).join(',')).to.be.equal('1966051_524428741092238_1051008806888563137_o.jpg,ibanez-s520-443140.jpg,images.jpg,test.txt');

                        select.value = 'size'
                        simulateEvent('change', 0 , select)
                        items = files.querySelectorAll('.jodit_filebrowser_files_item');
                        expect([].map.call(items, function (item) {
                            return item.querySelector('.jodit_filebrowser_files_item-info-filename').innerText;
                        }).join(',')).to.be.equal('images.jpg,ibanez-s520-443140.jpg,test.txt,1966051_524428741092238_1051008806888563137_o.jpg');


                        filebrowser.close();
                        done();
                    })
                    .catch(function (e) {
                        throw e
                    })
            });
        });
        describe('Select button', function () {
            it('Should fire first callback in open method', function (done) {
                var filebrowser = new Jodit.modules.FileBrowser(null, {
                    ajax: {
                        url: 'https://xdsoft.net/jodit/connector/index.php'
                    }
                });

                filebrowser
                    .open(function (data) {
                        expect(data !== undefined).to.be.true;
                        expect(data.files !== undefined).to.be.true;
                        expect(data.files.length).to.be.equal(1);
                        expect(data.files[0]).to.be.equal('https://xdsoft.net/jodit/files/images.jpg');
                        filebrowser.close();
                        done();
                    })
                    .then(function () {
                        var select = filebrowser.dialog.dialogbox_header.querySelector('.jodit_toolbar_btn-select');
                        var files = filebrowser.browser.querySelector('.jodit_filebrowser_files');

                        expect(files).to.be.not.null;
                        expect(select).to.be.not.null;

                        expect(select.classList.contains('jodit_disabled')).to.be.true;

                        simulateEvent('click', 0, filebrowser.browser.querySelector('.jodit_filebrowser_files_item'))

                        expect(select.classList.contains('jodit_disabled')).to.be.false;

                        simulateEvent('mousedown', 0, select)
                    })
                    .catch(function (e) {
                        throw e
                    })
            });
        });
    });
    describe('Test drag and drop', function () {
        describe('Drag and drop image from filebrowser', function () {
            it('Should create IMG element in editor', function (done) {

                var editor = new Jodit(appendTestArea(), {
                    filebrowser: {
                        ajax: {
                            url: 'https://xdsoft.net/jodit/connector/index.php'
                        }
                    }
                });

                var filebrowser = editor.getInstance('FileBrowser');

                filebrowser.open(function () {})
                    .then(function () {
                        var files = filebrowser.browser.querySelector('.jodit_filebrowser_files');

                        expect(files).to.be.not.null;


                        simulateEvent('dragstart', 0, files.querySelector('.jodit_filebrowser_files_item img'))

                        simulateEvent('dragover', 0, window, function (data) {
                            data.clientX = 50;
                            data.clientY = 20 + offset(editor.editor).top;
                        });

                        var image = editor.ownerDocument.querySelector('img[data-src="https://xdsoft.net/jodit/files/images.jpg"][alt="images.jpg"][style*="fixed"]')
                        expect(image).to.be.not.null;
                        expect(image.style.position).to.be.equal('fixed');

                        simulateEvent('drop', 0, editor.editor, function (data) {
                            Object.defineProperty(data, 'dataTransfer',{
                                value: {
                                    files: [],
                                }
                            })
                        });

                        expect(editor.value).to.be.equal('<img src="https://xdsoft.net/jodit/files/images.jpg">')
                        expect(image.parentNode).to.be.not.null;
                        simulateEvent('drop', 0, window);
                        expect(image.parentNode).to.be.null;
                        done();
                    })
                    .catch(function (e) {
                        throw e
                    })
            });
        });
        describe('Drag and drop File from filebrowser', function () {
            it('Should create A element in editor', function (done) {

                var editor = new Jodit(appendTestArea(), {
                    filebrowser: {
                        ajax: {
                            url: 'https://xdsoft.net/jodit/connector/index.php'
                        }
                    }
                });

                var filebrowser = editor.getInstance('FileBrowser');

                filebrowser.open(function () {})
                    .then(function () {
                        var files = filebrowser.browser.querySelector('.jodit_filebrowser_files');

                        expect(files).to.be.not.null;


                        simulateEvent('dragstart', 0, files.querySelector('.jodit_filebrowser_files_item[data-is-file="1"] img'))

                        simulateEvent('dragover', 0, window, function (data) {
                            data.clientX = 50;
                            data.clientY = 20 + offset(editor.editor).top;
                        });

                        var image = editor.ownerDocument.querySelector('img[data-src="https://xdsoft.net/jodit/files/test.txt"][alt="test.txt"][style*="fixed"]')
                        expect(image).to.be.not.null;
                        expect(image.style.position).to.be.equal('fixed');

                        simulateEvent('drop', 0, editor.editor, function (data) {
                            Object.defineProperty(data, 'dataTransfer',{
                                value: {
                                    files: [],
                                }
                            })
                        });

                        expect(editor.value).to.be.equal('<a href="https://xdsoft.net/jodit/files/test.txt">https://xdsoft.net/jodit/files/test.txt</a>')
                        expect(image.parentNode).to.be.not.null;
                        simulateEvent('drop', 0, window);
                        expect(image.parentNode).to.be.null;
                        done();
                    })
                    .catch(function (e) {
                        throw e
                    })
            });
        });
    });
    describe('Uploader', function () {
        describe('Drag and drop', function () {
            describe('Image', function (done) {
                it('Should create IMG element', function (done) {
                    var editor = new Jodit(appendTestArea(), {
                        uploader: {
                            'url': 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
                        },
                        filebrowser: {
                            ajax: {
                                url: 'https://xdsoft.net/jodit/connector/index.php'
                            }
                        }
                    });

                    editor.value = '';

                    editor.events.on('filesWereUploaded', function () {
                        expect(editor.value).to.be.equal('<img src="https://xdsoft.net/jodit/files/test.png">');
                        done();
                    });

                    simulateEvent('drop', 0, editor.editor, function (data) {
                        Object.defineProperty(data, 'dataTransfer',{
                            value: {
                                files: [
                                    {name: 'test.png', type: 'image/png'}
                                ],
                            }
                        })
                    });

                });
            });
            describe('File', function (done) {
                it('Should create A element', function (done) {
                    var editor = new Jodit(appendTestArea(), {
                        uploader: {
                            'url': 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
                        },
                        filebrowser: {
                            ajax: {
                                url: 'https://xdsoft.net/jodit/connector/index.php'
                            }
                        }
                    });

                    editor.value = '';

                    editor.events.on('filesWereUploaded', function () {
                        expect(editor.value).to.be.equal('<a href="https://xdsoft.net/jodit/files/test.txt">https://xdsoft.net/jodit/files/test.txt</a>');
                        done();
                    });

                    simulateEvent('drop', 0, editor.editor, function (data) {
                        Object.defineProperty(data, 'dataTransfer',{
                            value: {
                                files: [
                                    {name: 'test.txt', type: 'plain/text'}
                                ],
                            }
                        })
                    });

                });
            });
        });
    });
    afterEach(removeStuff);
});