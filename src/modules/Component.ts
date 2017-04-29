import Jodit from "../jodit"
export default class Component {
    handlers: {};
    /**
     * @prop {Jodit} parent
     */
    parent: Jodit;
    /**
     * @prop {HTMLDocument} win
     */
    doc: HTMLDocument;
    /**
     * @prop {Window} win
     */
    win: Window;

    constructor(parent?: Jodit) {
        this.parent = parent;
        this.doc = document;
        this.win = window;
        if (parent && parent.components) {
            parent.components.push(this);
        }
    }

    init() {
        console.warn('Method should be override')
    }

    __scope:any[] = [];
    __off() {
        this.__scope.forEach((data) => {
            data.element.removeEventListener(data.event, data.callback)
        })
    }
    __on(element, event, callback) {
        element.addEventListener(event, callback);
        this.__scope.push({
            element,
            event,
            callback
        });
    }
    destruct() {
        this.__off();
    }
}