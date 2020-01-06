import { IJodit, ISourceEditor } from '../../../types';
import { SourceEditor } from '../SourceEditor';

export class CustomEditor extends SourceEditor<HTMLTextAreaElement>
	implements ISourceEditor {

	init(editor: IJodit): any {
		this.onReady();
	}

	destruct(): any {}

	getValue(): string {
		return '';
	}

	setValue(raw: string): void {}

	insertRaw(raw: string): void {}

	getSelectionStart(): number {
		return 0;
	}

	getSelectionEnd(): number {
		return 0;
	}

	setSelectionRange(start: number, end: number): void {}

	focus(): void {}

	setPlaceHolder(title: string): void {}

	setReadOnly(isReadOnly: boolean): void {}

	selectAll(): void {}
}
