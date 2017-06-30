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

    __scope: any[] = [];
    __scopeNamespace: any = {};

    __off(element: false|HTMLElement = false) {
        this.__scope.forEach((data) => {
            if (element === false || element === data.element) {
                data.element.removeEventListener(data.event, data.callback)
            }
        })
        return this;
    }

    __on(element: HTMLElement|Window, event: string, callback: (eventObject) => any) {
        let namespace = '';
        if (/\./.test(event)) {
            [event, namespace] = event.split('.');
        }
        element.addEventListener(event, callback);

        let eventData = {
            element,
            event,
            callback
        }

        if (this.__scopeNamespace[namespace] === undefined) {
            this.__scopeNamespace[namespace] = [];
        }

        this.__scopeNamespace[namespace].push(eventData)
        this.__scope.push(eventData);

        return this;
    }

    destruct() {
        this.__off();
    }
}