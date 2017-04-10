describe('CodeMirror editor source code', function() {
    appendTestArea('codemirror', true);
    describe('Init', function() {
        it('After init container must has codeeditor container', function(done) {
            var timeout,
                area = appendTestArea(false, true),
                __done = function () {
                    clearTimeout(timeout);
                    this.events.off('beforeDestruct');
                    this.destruct();
                    area.parentNode.removeChild(area);
                    done();
                },
                editor = new Jodit(area, {
                    defaultMode: Jodit.MODE_SOURCE,
                    events: {
                        beforeDestruct: function () {
                            return false;
                        },
                        aceInited: function () {
                            expect(this.container.querySelectorAll('.jodit_source_mirror-fake').length).to.equal(1);
                            __done.call(this);
                        }
                    }
                });
            timeout = setTimeout(function () {
                expect(false).to.equal(true);
                __done.call(editor);
            }, 500);
        });
        it('Check lazy load', function() {
            var editor = new Jodit('#codemirror', {
                defaultMode: Jodit.MODE_WYSIWYG
            });

            expect(editor.container.querySelectorAll('.jodit_source_mirror-fake').length).to.equal(0);
            editor.destruct();
        });
    });
    after(function() {
        codemirror.parentNode.removeChild(codemirror);
    });
});