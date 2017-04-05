import Component from './Component'

export class Stack {
    commands = [];
    stackPosition = -1;
    savePosition = -1;
    execute(command) {
        this.__clearRedo();
        command.execute();
        this.commands.push(command);
        this.stackPosition += 1;
        this.changed();
    }
    undo() {
        if (this.commands[this.stackPosition]) {
            this.commands[this.stackPosition].undo();
        }
        this.stackPosition -= 1;
        this.changed();
    }
    canUndo () {
        return this.stackPosition >= 0;
    }
    redo () {
        this.stackPosition += 1;
        if (this.commands[this.stackPosition]) {
            this.commands[this.stackPosition].redo();
        }
        this.changed();
    }
    canRedo () {
        return this.stackPosition < this.commands.length - 1;
    }
    save () {
        this.savePosition = this.stackPosition;
        this.changed();
    }
    dirty () {
        return this.stackPosition != this.savePosition;
    }
    __clearRedo() {
        this.commands.length = this.stackPosition + 1;
    }
    changed() {
        // do nothing, override
    }
}

export default class Undo extends Component{}
