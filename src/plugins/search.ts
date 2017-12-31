import {Jodit} from "../Jodit";
import {Config} from "../Config";
import {ctrlKey, debounce, dom} from "../modules/Helpers";
import {Component, Dom, Toolbar} from "../modules";
import * as consts from "../constants";
import {markerInfo} from "../modules/Selection";

declare module "../Config" {
    interface Config {
        useSearch: boolean,
        searchByInput: boolean,
    }
}

Config.prototype.useSearch = true;
Config.prototype.searchByInput = true;

export class search extends Component {
    private template: string = '<div class="jodit_search">' +
        '<div class="jodit_search_box">' +
            '<div class="jodit_search_inputs">' +
                '<input class="jodit_search-query" type="text"/>' +
            '</div>' +
            '<div class="jodit_search_buttons">' +
                '<button type="button" class="jodit_search_buttons-next">' + Toolbar.getIcon('angle-down') + '</button>' +
                '<button type="button" class="jodit_search_buttons-prev">' + Toolbar.getIcon('angle-up') + '</button>' +
                '<button type="button" class="jodit_search_buttons-cancel">' + Toolbar.getIcon('cancel') + '</button>' +
            '</div>' +
        '</div>' +
    '</div>';

    searchBox: HTMLDivElement;
    query: HTMLInputElement;
    cancel: HTMLButtonElement;
    next: HTMLButtonElement;
    prev: HTMLButtonElement;
    private eachMap = (node: Node, callback, next: boolean) => {
        Dom.find(node, (child: Node): boolean => {
            child && callback(child);
            return false;
        }, this.jodit.editor, true, next ? 'nextSibling' : 'previousSibling', next ? 'firstChild' : 'lastChild')
    };
    search = (value: string, next: boolean) => {
         let start: Node|null = this.current || this.jodit.editor.firstChild;
         if (start) {
             let sentence: string = '';
             console.log('------------------------------------')
             this.eachMap(start, (elm: Node) => {
                 if (Dom.isBlock(elm) || elm.nodeName === 'BR') {
                     console.log(sentence);
                     sentence = '';
                 } else if (elm.nodeType === Node.TEXT_NODE && !Dom.isEmptyTextNode(elm)) {
                     sentence = next ? sentence + elm.nodeValue : elm.nodeValue + sentence;
                 }
             }, next);

             if (sentence) {
                 console.log(sentence);
             }
         }
    };
    private isOpened: boolean = false;

    open = () => {
        this.searchBox.classList.add('jodit_search-active');
        this.current = this.jodit.selection.current();
        this.selInfo = this.jodit.selection.save();
        let sel: string = this.jodit.ownerWindow.getSelection().toString();
        if (sel) {
            this.query.value = sel;
            this.query.select();
        } else {
            this.query.focus();
        }
        this.isOpened = true;
    };
    selInfo :markerInfo[]|null = null;
    current :Node|false = false;
    close = () => {
        if (this.selInfo) {
            this.jodit.selection.restore(this.selInfo);
            this.selInfo = null;
        }
        this.searchBox.classList.remove('jodit_search-active');
        this.isOpened = false;
    };
    constructor(editor: Jodit) {
        super(editor);
        if (editor.options.useSearch) {
            const self: search = this;
            self.searchBox = <HTMLDivElement>dom(self.template, editor.ownerDocument);
            self.query = <HTMLInputElement>self.searchBox.querySelector('input.jodit_search-query');
            self.cancel = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-cancel');
            self.next = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-next');
            self.prev = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-prev');

            editor
                .__on(self.cancel, 'click', this.close)
                .__on(self.query, 'mousedown', () => {
                    if (editor.selection.isFocused()) {
                        editor.selection.clear();
                        self.selInfo = editor.selection.save();
                    }
                })
                .__on([self.next, self.prev], 'mousedown', function (this: HTMLButtonElement, e: MouseEvent) {
                    self.search(self.query.value, self.next === this);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .__on(this.query, 'keydown', debounce((e: KeyboardEvent) => {
                    switch (e.which) {
                        case  consts.KEY_ESC:
                            this.close();
                            break;
                        case  consts.KEY_ENTER:
                            this.search(this.query.value, true);
                            break;
                        default:
                            this.jodit.options.searchByInput && this.search(this.query.value, true);
                            break;
                    }
                }, this.jodit.options.observer.timeout))
                .events
                .on('afterInit', () => {
                    editor.workplace.appendChild(this.searchBox);
                })
                .on('keydown mousedown', () => {
                    if (this.selInfo) {
                        editor.selection.clear();
                        this.selInfo = null;
                    }
                    if (this.isOpened) {
                        this.current = this.jodit.selection.current();
                    }
                })
                .on('keydown', (e: KeyboardEvent) => {
                    if (ctrlKey(e) && e.which === consts.KEY_F) {
                        this.open();
                        e.preventDefault();
                    }
                });
        }
    }
}