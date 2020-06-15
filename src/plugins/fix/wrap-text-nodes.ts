/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Plugin } from '../../core/plugin';
import { IJodit, markerInfo, Nullable } from '../../types';
import { Dom } from '../../core/dom';
import { isString } from '../../core/helpers/checker';

export class WrapTextNodes extends Plugin {
	protected afterInit(jodit: IJodit) {
		if (jodit.o.enter.toLowerCase() === 'br') {
			return;
		}

		jodit.e.on('afterInit.wtn postProcessSetEditorValue.wtn', () => {
			if (!jodit.isEditorMode()) {
				return;
			}

			let child: Nullable<Node> = jodit.editor.firstChild,
				isChanged: boolean = false;

			const isNotClosed = (n: Nullable<Node>) =>
					Dom.isElement(n) &&
					!(Dom.isBlock(n, jodit.ew) || Dom.isTag(n, ['hr'])),
				isSuitableStart = (n: Nullable<Node>) =>
					(Dom.isText(n) &&
						isString(n.nodeValue) &&
						/[^\s]/.test(n.nodeValue)) ||
					isNotClosed(n);

			const isSuitable = (n: Nullable<Node>) =>
				Dom.isText(n) || isNotClosed(n);

			let selInfo: Nullable<markerInfo[]> = null;

			while (child) {
				if (isSuitableStart(child)) {
					if (!isChanged) {
						selInfo = jodit.s.save();
					}

					isChanged = true;
					const box = jodit.createInside.element(jodit.o.enter);

					Dom.before(child, box);

					while (child && isSuitable(child)) {
						const next: Nullable<Node> = child.nextSibling;
						box.appendChild(child);
						child = next;
					}

					box.normalize();
				}

				child = child && child.nextSibling;
			}

			if (isChanged) {
				jodit.s.restore(selInfo);

				if (jodit.e.current === 'afterInit') {
					jodit.e.fire('internalChange');
				}
			}
		});
	}

	protected beforeDestruct(jodit: IJodit) {
		jodit.e.off('.wtn');
	}
}
