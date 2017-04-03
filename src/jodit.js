import Selection from './modules/Selection';
import Events from './modules/Events';
import Nodes  from './modules/Nodes';
import Table  from './modules/Table';
import Component from './modules/Component';
import * as consts from './constants';
import {extend} from './modules/Helpers';

/** Class Jodit. Main class*/
export default class Jodit extends Component{
    static plugines =  {};
    static modules =  {};
    static instances = {};
    static lang = {};

    /**
     * @prop {string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    id;

    /**
     * @prop {HTMLElement} element It contains source element
     */
    element;

    /**
     * @prop {HTMLDivElement} editor It contains the root element editor
     */
    editor;

    /**
     * @prop {PlainObject} options All Jodit settings default + second arguments of constructor
     */
    options;

    /**
     * @property {Selection} selection
     */
    selection;

    /**
     * @property {Nodes} node
     */
    node;

    /**
     * Create instance of Jodit
     * @constructor
     * @param {string|HTMLElement} element Selector or HTMLElement
     */
    constructor(element, options) {
        super(window);

        let Options = function () {

        }
        Options.prototype = Jodit.defaultOptions;

        if (options !== undefined && typeof options === 'object') {
            this.options = extend(new Options(), options);
        } else {
            this.options = new Options();
        }


        if (typeof element === 'string') {
            this.element = document.querySelector(element);
        } else {
            this.element = element;
        }

        if (this.element === undefined || !(this.element instanceof HTMLElement)) {
            throw new Error('Element "' + element + '" should be string or HTMLElement');
        }

        this.createEditor();

        this.selection = new Selection(this);
        this.events = new Events(this);
        this.node = new Nodes(this);

        this.initPlugines();

        // proxy events
        ['keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'mousepress'].forEach((event_type) => {
            this.editor.addEventListener(event_type, (e) => {
                if (this.events.fire(event_type, [e]) === false) {
                    e.preventDefault();
                    return false;
                }
            });
        });

        this.id = this.element.getAttribute('id') || (new Date()).getTime();

        Jodit.instances[this.id] = this;

        // fix for native resizing
        try {
            this.doc.execCommand('enableObjectResizing', false, false);
            this.doc.execCommand('enableInlineTableEditing', false, false);
        } catch (ignore) {
            // continue regardless of error
        }
    }
    __plugins = [];
    initPlugines() {
        let keys = Object.keys(Jodit.plugines), i;
        for (i = 0; i < keys.length; i += 1) {
            this.__plugins.push(new Jodit.plugines[keys[i]](this));
        }
    }

    /**
     * Create main DIV element and replace source textarea
     */
    createEditor() {
        this.container = document.createElement('div');
        this.editor = document.createElement('div');

        this.editor.setAttribute('class', 'jodit_editor');
        this.container.setAttribute('class', 'jodit_container');

        this.editor.setAttribute('contenteditable', true);
        this.editor.setAttribute('aria-disabled', false);
        this.editor.setAttribute('spellcheck', this.options.spellcheck);

        this.container.appendChild(document.createTextNode("\n"));
        this.container.appendChild(this.editor);
        this.container.appendChild(document.createTextNode("\n"));

        this.element.parentNode.insertBefore(this.container, this.element);

        // hide source element
        this.element.__defaultStyleDisplay = this.element.style.display
        this.element.style.display = 'none';
    }

    /**
     * Jodit's Destructor. Remove editor, and return source input
     */
    destruct() {
        if (!this.editor) {
            return;
        }

        this.container.parentNode.removeChild(this.container);
        delete this['container'];
        delete this['editor'];

        this.element.style.display = this.element.__defaultStyleDisplay;
        delete this.element.__defaultStyleDisplay;

        if (this.element.hasAttribute('style') && !this.element.getAttribute('style')) {
            this.element.removeAttribute('style');
        }

        delete this['selection'];

        this.events.off();
        delete this['events'];

        this.__plugins.forEach((plugin) => {
            if (plugin.destruct !== undefined && typeof plugin.destruct === 'function') {
                plugin.destruct();
            }
        });
        this.__plugins.length = 0;

        delete Jodit.instances[this.id];
    }

    /**
     * Return source element value
     */
    getElementValue() {
        return this.element.value;
    }

    /**
     * Return editor value
     */
    getEditorValue() {
        let value = this.editor.innerHTML
            .replace(consts.INVISIBLE_SPACE_REG_EXP, '');

        if (value === '<br>') {
            return '';
        }

        return value;
    }

    /**
     * Set source element value and if set sync fill editor value
     * When method was called without arguments - it is simple way to synchronize element to editor
     *
     * @param {string} [value]
     */
    setElementValue(value) {
        if (typeof value !== 'string' && value !== undefined) {
            throw new Error('value must be string');
        }

        if (value !== undefined) {
            this.element.value = value;
        }
        if (this.getElementValue() !== this.getEditorValue()) {
            this.setEditorValue(this.getElementValue());
        }
    }

    /**
     * Set editor html value and if set sync fill source element value
     * When method was called without arguments - it is simple way to synchronize editor to element
     *
     * @param {string} [value]
     */
    setEditorValue(value) {
        if (typeof value !== 'string' && value !== undefined) {
            throw new Error('value must be string');
        }

        if (value !== undefined) {
            this.editor.innerHTML = value;
        }
        let old_value = this.getElementValue();
        if (old_value !== this.getEditorValue()) {
            this.setElementValue(this.getEditorValue());
            this.events.fire('change', [old_value, this.getEditorValue()]);
        }
    }

    /**
     * Execute command editor
     *
     * @method execCommand
     * @param  {string} command command. It supports all the {@link https://developer.mozilla.org/ru/docs/Web/API/Document/execCommand#commands} and a number of its own
     * for example applyCSSProperty. Comand fontSize receives the second parameter px, formatBlock and can take several options
     * @param  {boolean|string|int} b
     * @param  {boolean|string|int} c
     * @fires beforeCommand
     * @fires afterCommand
     * @example
     * this.execCommand('applyCSSProperty', 'color', '#fff'); // sets the color of the text for the current selection in white
     * this.execCommand('fontSize', 12); // sets the size of 12 px
     * this.execCommand('underline');
     * this.execCommand('formatBlock', 'p'); // will be inserted paragraph
     */
    execCommand(command, second = false, third = null) {
        let result;
        command = command.toLowerCase();
        /**
         * Called before any command
         * @event beforeCommand
         * @param {string} command Command name in lowercase
         * @param {string} second The second parameter for the command
         * @param {string} third The third option is for the team
         * @example
         * parent.events.on('beforeCommand', function (command) {
         *  if (command === 'justifyCenter') {
         *      var p = parent.getDocument().createElement('p')
         *      parent.selection.insertNode(p)
         *      parent.selection.moveCursorTo(p);
         *      p.style.textAlign = 'justyfy';
         *      return false; // break execute commande
         *  }
         * })
         */
        if (this.events.fire('beforeCommand', [command, second, third]) === false) {
            return false;
        }

        this.selection.focus();

        switch(command) {
            case 'selectall':
                this.selection.select(this.editor, true);
                break;
            default:
                result = this.doc.execCommand(command, second, third);
        }

        /**
         * It called after any command
         * @event afterCommand
         * @param {string} command name command
         * @param {*} second The second parameter for the command
         * @param {*} third The third option is for the team
         */
        this.events.fire('afterCommand', [command, second, third]);
        return result;
    }

    /**
     * Disable selecting
     */
    startDrag() {
        this.editor.classList.add('jodit_disabled');
    }

    /**
     * Enable selecting
     */
    endDrag() {
        this.editor.classList.remove('jodit_disabled');
    }
}

Jodit.modules.Selection = Selection;
Jodit.modules.Events = Events;
Jodit.modules.Nodes = Nodes;
Jodit.modules.Table = Table;
