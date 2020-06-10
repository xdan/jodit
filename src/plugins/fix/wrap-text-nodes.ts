import { Plugin } from '../../core/plugin';
import { IJodit, Nullable } from '../../types';
import { Dom } from '../../core/dom';
import { isString } from '../../core/helpers/checker';

export class WrapTextNodes extends Plugin {
	protected afterInit(jodit: IJodit) {
		if (jodit.o.enter === 'br') {
			return;
		}

		jodit.e.on('change.wraptextnodes', () => {
			let child: Nullable<Node> = jodit.editor.firstChild;

			while (child) {
				if (
					Dom.isText(child) &&
					isString(child.nodeValue) &&
					/[^\s]/.test(child.nodeValue)
				) {
					const box = jodit.createInside.element(jodit.o.enter);

					Dom.before(child, box);

					while (child && Dom.isText(child)) {
						const next: Nullable<Node> = child.nextSibling;
						box.appendChild(child);
						child = next;
					}
				}

				child = child && child.nextSibling;
			}
		});
	}

	protected beforeDestruct(jodit: IJodit) {
		jodit.e.off('change.wraptextnodes');
	}
}
