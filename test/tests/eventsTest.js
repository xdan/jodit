describe('Jodit Events system Tests', function() {
    describe('Native Events', function () {
        it('Create simple event handler on some DOM element', function () {
            var editor = new Jodit(appendTestArea()),
                work = false,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.__on(div, 'click', function () {
                work = true;
            })

            simulateEvent('click', 0, div);

            expect(work).to.be.equal(true);

            div.parentNode.removeChild(div)
        });
        it('Create simple event handler on some DOM element on few events', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.__on(div, 'click dblclick keydown', function () {
                work++;
            })

            simulateEvent('click', 0, div);
            simulateEvent('dblclick', 0, div);
            simulateEvent('keydown', 0, div);

            expect(work).to.be.equal(3);
            div.parentNode.removeChild(div)
        });
        it('Create simple event handler on all DOM elements which will be inside some starting DOm element', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button'),
                a = document.createElement('a');

            document.body.appendChild(div)

            editor.__on(div, 'click', 'a.active', function () {
                work++;
            })

            simulateEvent('click', 0, div);
            expect(work).to.be.equal(0);

            div.appendChild(a);

            simulateEvent('click', 0, a);
            expect(work).to.be.equal(0);

            a.classList.add('active');
            simulateEvent('click', 0, a);
            expect(work).to.be.equal(1);

            div.parentNode.removeChild(div)

        });
        it('Add and remove event handler', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.__on(div, 'click', function () {
                work++;
            })

            simulateEvent('click', 0, div);
            expect(work).to.be.equal(1);

            editor.__off(div, 'click')

            simulateEvent('click', 0, div);
            expect(work).to.be.equal(1);

            div.parentNode.removeChild(div)
        })
        it('Add a few handlers for several evens and remove all handlers', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.__on(div, 'click', function () {
                work++;
            })
            editor.__on(div, 'dblclick', function () {
                work++;
            })
            editor.__on(div, 'mousedown', function () {
                work++;
            })

            simulateEvent('click', 0, div);
            simulateEvent('dblclick', 0, div);
            simulateEvent('mousedown', 0, div);

            expect(work).to.be.equal(3);

            editor.__off(div)

            simulateEvent('click', 0, div);
            simulateEvent('dblclick', 0, div);
            simulateEvent('mousedown', 0, div);

            expect(work).to.be.equal(3);

            div.parentNode.removeChild(div)
        })
        it('Add event handler for several elements', function () {
            var editor = new Jodit(appendTestArea()),
                work = '',
                div1 = editor.doc.createElement('button'),
                div2 = editor.doc.createElement('button');

            editor.doc.body.appendChild(div1)
            editor.doc.body.appendChild(div2)

            div1.innerText = 'test1';
            div2.innerText = 'test2';

            editor.__on([div1, div2], 'click', function () {
                work += this.innerText;
            })

            editor.__fire(div1, 'click', editor.doc);
            editor.__fire(div2, 'click', editor.doc);

            expect(work).to.be.equal('test1test2');

            div1.parentNode.removeChild(div1)
            div2.parentNode.removeChild(div2)
        })
        it('Fire trigger', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.__on(div, 'click', function () {
                work++;
            })

            editor.__fire(div, 'click', document);
            expect(work).to.be.equal(1);

            div.parentNode.removeChild(div)
        })
        it('Remove handler should remove full handler with selector options', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                a = document.createElement('a'),
                div = document.createElement('button');

            a.innerText = 'test';
            div.appendChild(a)
            document.body.appendChild(div)

            editor.__on(div, 'click', 'a', function () {
                work++;
            })

            editor.__fire(div, 'click', document);
            expect(work).to.be.equal(0);


            editor.__fire(a, 'click', document);
            expect(work).to.be.equal(1);

            editor.__off(div, 'click')
            editor.__fire(a, 'click', document);
            expect(work).to.be.equal(1);

            editor.__on(div, 'click', 'a', function () {
                work++;
            })
            editor.__fire(a, 'click', document);
            expect(work).to.be.equal(2);

            div.parentNode.removeChild(div)
        })
        it('Remove all handlers using event namespace', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.__on(div, 'click.test', function () {
                work++;
            })
            editor.__on(div, 'mousedown.test', function () {
                work++;
            })

            editor.__fire(div, 'click', document);
            editor.__fire(div, 'mousedown', document);
            expect(work).to.be.equal(2);

            editor.__off(div, '.test')
            editor.__fire(div, 'click', document);
            editor.__fire(div, 'mousedown', document);
            expect(work).to.be.equal(2);

            div.parentNode.removeChild(div)
        })
        it('Proxy event from iframe.window to main.window', function () {
            var editor = new Jodit(appendTestArea(), {
                    iframe: true
                }),
                work = 0,
                mousedown = function () {
                    work++;
                };

            window.addEventListener('mousedown', mousedown);

            editor.__fire(editor.win, 'mousedown', editor.doc);

            expect(work).to.be.equal(1);

            window.removeEventListener('mousedown', mousedown);
        })
    })
    describe('Jodit Events', function () {
        it('Event handler', function () {
            var enable = false;
            var editor = new Jodit(appendTestArea());
            editor.events.on('keydown', function (event) {
                enable = true;
            });
            simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
            expect(enable).to.be.equal(true);
        });
        it('Delete event handler', function () {
            var enable = false, callback = function (event) {
                enable = true;
            };
            var editor = new Jodit(appendTestArea());

            editor.events.on('keydown', callback);
            editor.events.off('keydown', callback);

            simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

            expect(enable).to.be.equal(false);
        });
        it('Proxy events', function () {
            var editor = new Jodit(appendTestArea()), work = false;
            editor.events.on('keydown', function (event) {
                work = true
            });
            simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

            expect(work).to.be.equal(true);
        });
    });
    afterEach(function () {
        removeStuff();
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});
