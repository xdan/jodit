describe('Jodit Events system Tests', function() {
    describe('Native Events', function () {
        it('Create simple event handler on some DOM element', function () {
            var editor = new Jodit(appendTestArea()),
                work = false,
                div = document.createElement('button');

            editor.__on(div, 'click', function () {
                work = true;
            })

            simulateEvent('click', 0, div);

            expect(work).to.be.equal(true);
        });
        it('Create simple event handler on some DOM element on few events', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            editor.__on(div, 'click dblclick keydown', function () {
                work++;
            })

            simulateEvent('click', 0, div);
            simulateEvent('dblclick', 0, div);
            simulateEvent('keydown', 0, div);

            expect(work).to.be.equal(3);
        });
        it('Create simple event handler on all DOM elements which will be inside some starting DOm element', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button'),
                a = document.createElement('a');

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

        });
        it('Add and remove event handler', () => {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            editor.__on(div, 'click', function () {
                work++;
            })

            simulateEvent('click', 0, div);
            expect(work).to.be.equal(1);

            editor.__off(div, 'click')

            simulateEvent('click', 0, div);
            expect(work).to.be.equal(1);
        })
        it('Add event handler for several elements', () => {
            var editor = new Jodit(appendTestArea()),
                work = '',
                div1 = document.createElement('button'),
                div2 = document.createElement('button');

            div1.innerText = 'test1';
            div2.innerText = 'test2';

            editor.__on([div1, div2], 'click', function () {
                work += this.innerText;
            })

            editor.__fire(div1, 'click');
            editor.__fire(div2, 'click');

            expect(work).to.be.equal('test1test2');
        })
        it('Fire trigger', () => {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            editor.__on(div, 'click', function () {
                work++;
            })

            editor.__fire(div, 'click');
            expect(work).to.be.equal(1);
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
