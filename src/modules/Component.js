export default class Component {
    /**
     * @prop {Jodit} parent
     */
    parent;
    /**
     * @prop {HTMLDocument} win
     */
    doc;
    /**
     * @prop {Window} win
     */
    win;

    constructor(parent) {
        this.parent = parent;
        this.doc = document;
        this.win = window;
    }

    init() {
    }
}