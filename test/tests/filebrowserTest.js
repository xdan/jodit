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
            expect(document.querySelectorAll('.jodit_dialog_box.active').length).to.be.equal(1);
        })
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
        })
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
        })
    })
    afterEach(function () {
        removeStuff();
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});