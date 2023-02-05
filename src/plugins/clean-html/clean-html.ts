/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/clean-html/README.md]]
 * @packageDocumentation
 * @module plugins/clean-html
 */

import type { IJodit, Nullable } from 'jodit/types';
import { safeHTML } from 'jodit/core/helpers/html/safe-html';
import { Plugin } from 'jodit/core/plugin/plugin';
import { watch, hook } from 'jodit/core/decorators';
import { LazyWalker } from 'jodit/core/dom/lazy-walker';
import { pluginSystem } from 'jodit/core/global';
import { Dom } from 'jodit/src/core/dom/dom';

import {
	getHash,
	removeFormatForCollapsedSelection,
	removeFormatForSelection,
	visitNodeWalker
} from './helpers';

import './config';

/**
 * Clean HTML after removeFormat and insertHorizontalRule command
 */
export class cleanHtml extends Plugin {
	/** @override */
	override buttons: Plugin['buttons'] = [
		{
			name: 'eraser',
			group: 'font-style'
		}
	];

	/** @override */
	protected override afterInit(jodit: IJodit): void {}

	private get isEditMode(): boolean {
		return !(
			this.j.isInDestruct ||
			!this.j.isEditorMode() ||
			this.j.getReadOnly()
		);
	}

	/**
	 * Clean HTML code on every change
	 */
	@watch([':change', ':afterSetMode', ':afterInit', ':mousedown', ':keydown'])
	protected onChangeCleanHTML(): void {
		if (!this.isEditMode) {
			return;
		}

		const editor = this.j;

		this.walker.setWork(editor.editor);
		this.currentSelectionNode = editor.s.current();
	}

	private currentSelectionNode: Nullable<Node> = null;

	private walker: LazyWalker = new LazyWalker(this.j.async, {
		timeout: this.j.o.cleanHTML.timeout
	});

	@hook('ready')
	protected startWalker(): void {
		const { jodit } = this;

		const allow = getHash(this.j.o.cleanHTML.allowTags);
		const deny = getHash(this.j.o.cleanHTML.denyTags);

		this.walker
			.on('visit', (node: Node) =>
				visitNodeWalker(
					jodit,
					node,
					allow,
					deny,
					this.currentSelectionNode
				)
			)
			.on('end', (affected: boolean): void => {
				this.j.e.fire(
					affected
						? 'internalChange finishedCleanHTMLWorker'
						: 'finishedCleanHTMLWorker'
				);
			});
	}

	@watch(':beforeCommand')
	protected beforeCommand(command: string): void | false {
		if (command.toLowerCase() === 'removeformat') {
			if (this.j.s.isCollapsed()) {
				removeFormatForCollapsedSelection(this.j);
			} else {
				removeFormatForSelection(this.j);
			}

			return false;
		}
	}

	/**
	 * Event handler when manually assigning a value to the HTML editor.
	 */
	@watch(':beforeSetNativeEditorValue')
	protected onBeforeSetNativeEditorValue(data: { value: string }): boolean {
		const sandBox = this.j.o.cleanHTML.useIframeSandbox
			? this.j.createInside.sandbox()
			: this.j.createInside.div();

		sandBox.innerHTML = data.value;
		this.onSafeHTML(sandBox);
		data.value = sandBox.innerHTML;
		safeHTML(sandBox, { safeJavaScriptLink: true, removeOnError: true });
		Dom.safeRemove(sandBox);
		return false;
	}

	@watch(':safeHTML')
	protected onSafeHTML(sandBox: HTMLElement): void {
		safeHTML(sandBox, this.j.o.cleanHTML);
	}

	/** @override */
	protected override beforeDestruct(): void {
		this.walker.destruct();
	}
}

pluginSystem.add('cleanHtml', cleanHtml);
