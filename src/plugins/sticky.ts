import {Jodit} from "../Jodit";
import {css, offset} from "../modules/Helpers";
import {Component} from "../modules/Component";
import {Config} from "../Config";

declare module "../Config" {
    interface Config {
        /**
         * @type {boolean}
         * @example
         * ```javascript
         * var editor = new Jodit('#someid', {
         *  toolbarSticky: false
         * })
         * ```
         */
        toolbarSticky: boolean,
        /**
         * For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to move the toolbar Jodit by this amount [more](http://xdsoft.net/jodit/doc/#2.5.57)
         *
         * @example
         * ```javascript
         * var editor = new Jodit('#someid', {
         *  toolbarStickyOffset: 100
         * })
         * ```
         */
        toolbarStickyOffset: number,
    }
}

Config.prototype.toolbarSticky = true;
Config.prototype.toolbarStickyOffset = 0;

export class sticky extends Component{
    private isToolbarSticked: boolean = false;
    private dummyBox: HTMLElement;

    private createDummy = (toolbar: HTMLElement) => {
        if (!this.dummyBox) {
            this.dummyBox = this.jodit.ownerDocument.createElement('div');
            this.dummyBox.classList.add('jodit_sticky-dummy_toolbar');
            this.jodit.container.insertBefore(this.dummyBox, toolbar)
        }
    };

    public addSticky = (toolbar: HTMLElement) => {
        if (!this.isToolbarSticked) {
            this.createDummy(toolbar);
            this.jodit.container.classList.add('jodit_sticky');

            this.isToolbarSticked = true;
        }

        // on resize it should work always
        css(toolbar, {
            top: this.jodit.options.toolbarStickyOffset,
            width: this.jodit.container.offsetWidth
        });

        css(this.dummyBox, {
            height: toolbar.offsetHeight
        });
    };

    public removeSticky = (toolbar: HTMLElement) => {
        if (this.isToolbarSticked) {
            css(toolbar, {
                width: '',
                top: ''
            });
            this.jodit.container.classList.remove('jodit_sticky');
            this.isToolbarSticked = false;
        }
    };

    constructor(jodit: Jodit) {
        super(jodit);
        jodit.events
            .on('afterInit', () => {
                jodit.events.on(jodit.ownerWindow, 'scroll wheel mousewheel resize', () => {
                    const scrollTop: number = jodit.ownerWindow.pageYOffset || jodit.ownerDocument.documentElement.scrollTop,
                        offsetEditor: Bound = offset(jodit.container, jodit),
                        doSticky: boolean = (scrollTop + jodit.options.toolbarStickyOffset > offsetEditor.top && scrollTop + jodit.options.toolbarStickyOffset < offsetEditor.top + offsetEditor.height);

                    if (jodit.options.toolbarSticky) {
                        doSticky ? this.addSticky(jodit.toolbar.container) : this.removeSticky(jodit.toolbar.container);
                    }

                    jodit.events.fire('toggleSticky', doSticky);

                });
            });
    }





}