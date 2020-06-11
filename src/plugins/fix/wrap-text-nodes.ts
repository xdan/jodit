import { Plugin } from '../../core/plugin';
import { IJodit, markerInfo, Nullable } from '../../types';
import { Dom } from '../../core/dom';
import { isString } from '../../core/helpers/checker';

export class WrapTextNodes extends Plugin {
	protected afterInit(jodit: IJodit) {
		if (jodit.o.enter.toLowerCase() === 'br') {
			return;
		}

		jodit.e.on('change.wraptextnodes', () => {
			if (!jodit.isEditorMode()) {
				return;
			}

			let child: Nullable<Node> = jodit.editor.firstChild,
				isChanged: boolean = false;

			const isNormalFirst = (n: Nullable<Node>) =>
				(Dom.isText(n) &&
					isString(n.nodeValue) &&
					/[^\s]/.test(n.nodeValue)) ||
				Dom.isInlineBlock(n);

			const isNormal = (n: Nullable<Node>) =>
				Dom.isText(n) || Dom.isInlineBlock(n);

			let selInfo: Nullable<markerInfo[]> = null;

			while (child) {
				if (isNormalFirst(child)) {
					if (!isChanged) {
						selInfo = jodit.s.save();
					}

					isChanged = true;
					const box = jodit.createInside.element(jodit.o.enter);

					Dom.before(child, box);

					while (child && isNormal(child)) {
						const next: Nullable<Node> = child.nextSibling;
						box.appendChild(child);
						child = next;
					}

					box.normalize();
				}

				child = child && child.nextSibling;
			}

			if (isChanged) {
				jodit.setEditorValue();
				jodit.s.restore(selInfo);
			}
		});
	}

	protected beforeDestruct(jodit: IJodit) {
		jodit.e.off('change.wraptextnodes');
	}
}
