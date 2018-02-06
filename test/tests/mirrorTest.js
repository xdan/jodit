describe('CodeMirror editor source code', function() {
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
                };

            timeout = setTimeout(function () {
                expect(false).to.equal(true);
                __done.call(editor);
            }, 5000);

            editor = new Jodit(area, {
                defaultMode: Jodit.MODE_SOURCE,
                useAceEditor: true,
                events: {
                    beforeDestruct: function () {
                        return false;
                    },
                    aceInited: function (editor) {
                        expect(editor.container.querySelectorAll('.jodit_source_mirror-fake').length).to.equal(1);
                        __done.call(editor);
                    }
                }
            });
        }).timeout(6000);
    });
});