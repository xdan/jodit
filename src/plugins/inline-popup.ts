/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { Widget } from '../modules/Widget';
import ColorPickerWidget = Widget.ColorPickerWidget;
import TabsWidget = Widget.TabsWidget;
import { Dom } from '../modules/Dom';
import { clearCenterAlign, css, offset, splitArray } from '../modules/helpers/';
import { Plugin } from '../modules/Plugin';
import { Table } from '../modules/Table';
import { Popup } from '../modules/popup/popup';
import { IDictionary, IJodit, IPopup, IToolbarCollection } from '../types';
import { IControlType } from '../types/toolbar';
import { IBound } from '../types/types';
import { JoditToolbarCollection } from '../modules/toolbar/joditToolbarCollection';
import { ToolbarCollection } from '../modules';

declare module '../Config' {
	interface Config {
		popup: IDictionary<Array<IControlType | string>>;
		toolbarInline: boolean;
		toolbarInlineDisableFor: string | string[];
	}
}

Config.prototype.toolbarInline = true;
Config.prototype.toolbarInlineDisableFor = [];

Config.prototype.popup = {
	a: [
		{
			name: 'eye',
			tooltip: 'Open link',
			exec: (editor: IJodit, current: Node) => {
				const href:
					| string
					| null = (current as HTMLElement).getAttribute('href');

				if (current && href) {
					editor.ownerWindow.open(href);
				}
			}
		} as IControlType,
		{
			name: 'link',
			tooltip: 'Edit link',
			icon: 'pencil'
		},
		'unlink',
		'brush',
		'file'
	],
	jodit: [
		{
			name: 'bin',
			tooltip: 'Delete',
			exec: (editor: IJodit, image: Node) => {
				editor.selection.removeNode(image);
				editor.events.fire('hidePopup');
			}
		}
	],
	'jodit-media': [
		{
			name: 'bin',
			tooltip: 'Delete',
			exec: (editor: IJodit, image: Node) => {
				editor.selection.removeNode(image);
				editor.events.fire('hidePopup');
			}
		}
	],
	img: [
		{
			name: 'delete',
			icon: 'bin',
			tooltip: 'Delete',
			exec: (editor: IJodit, image: Node) => {
				editor.selection.removeNode(image);
				editor.events.fire('hidePopup');
			}
		},
		{
			name: 'pencil',
			exec(editor: IJodit, current: Node) {
				const tagName: string = (current as HTMLElement).tagName.toLowerCase();
				if (tagName === 'img') {
					editor.events.fire('openImageProperties', current);
				}
			},
			tooltip: 'Edit'
		},
		{
			name: 'valign',
			list: ['Top', 'Middle', 'Bottom'],
			tooltip: 'Vertical align',
			exec: (
				editor: IJodit,
				image: HTMLImageElement,
				control: IControlType
			) => {
				const tagName: string = (image as HTMLElement).tagName.toLowerCase();
				if (tagName !== 'img') {
					return;
				}

				const command: string =
					control.args && typeof control.args[1] === 'string'
						? control.args[1].toLowerCase()
						: '';

				css(image, 'vertical-align', command);

				editor.events.fire('recalcPositionPopup');
			}
		},
		{
			name: 'left',
			list: ['Left', 'Right', 'Center', 'Normal'],
			exec: (
				editor: IJodit,
				image: HTMLImageElement,
				control: IControlType
			) => {
				const tagName: string = (image as HTMLElement).tagName.toLowerCase();
				if (tagName !== 'img') {
					return;
				}

				const command: string =
					control.args && typeof control.args[1] === 'string'
						? control.args[1].toLowerCase()
						: '';

				if (command !== 'normal') {
					if (['right', 'left'].indexOf(command) !== -1) {
						css(image, 'float', command);
						clearCenterAlign(image);
					} else {
						css(image, 'float', '');
						css(image, {
							display: 'block',
							'margin-left': 'auto',
							'margin-right': 'auto'
						});
					}
				} else {
					if (
						css(image, 'float') &&
						['right', 'left'].indexOf(
							(css(image, 'float') as string).toLowerCase()
						) !== -1
					) {
						css(image, 'float', '');
					}

					clearCenterAlign(image);
				}

				editor.events.fire('recalcPositionPopup');
			},
			tooltip: 'Horizontal align'
		}
	],
	table: [
		{
			name: 'brush',
			popup: (editor: IJodit, elm: HTMLTableElement) => {
				const selected: HTMLTableCellElement[] = Table.getAllSelectedCells(
					elm
				);

				let $bg: HTMLElement,
					$cl: HTMLElement,
					$br: HTMLElement,
					$tab: HTMLElement,
					color: string,
					br_color: string,
					bg_color: string;

				if (!selected.length) {
					return false;
				}

				color = css(selected[0], 'color') as string;
				bg_color = css(selected[0], 'background-color') as string;
				br_color = css(selected[0], 'border-color') as string;

				$bg = ColorPickerWidget(
					editor,
					(value: string) => {
						selected.forEach((cell: HTMLTableCellElement) => {
							css(cell, 'background-color', value);
						});
						editor.setEditorValue();
						// close();
					},
					bg_color
				);

				$cl = ColorPickerWidget(
					editor,
					(value: string) => {
						selected.forEach((cell: HTMLTableCellElement) => {
							css(cell, 'color', value);
						});
						editor.setEditorValue();
						// close();
					},
					color
				);

				$br = ColorPickerWidget(
					editor,
					(value: string) => {
						selected.forEach((cell: HTMLTableCellElement) => {
							css(cell, 'border-color', value);
						});
						editor.setEditorValue();
						// close();
					},
					br_color
				);

				$tab = TabsWidget(editor, {
					Background: $bg,
					Text: $cl,
					Border: $br
				} as IDictionary<HTMLElement>);

				return $tab;
			},
			tooltip: 'Background'
		},
		{
			name: 'valign',
			list: ['Top', 'Middle', 'Bottom'],
			exec: (
				editor: IJodit,
				table: HTMLTableElement,
				control: IControlType
			) => {
				const command: string =
					control.args && typeof control.args[1] === 'string'
						? control.args[1].toLowerCase()
						: '';

				Table.getAllSelectedCells(table).forEach(
					(cell: HTMLTableCellElement) => {
						css(cell, 'vertical-align', command);
					}
				);
			},
			tooltip: 'Vertical align'
		},
		{
			name: 'splitv',
			list: {
				tablesplitv: 'Split vertical',
				tablesplitg: 'Split horizontal'
			},
			tooltip: 'Split'
		},
		{
			name: 'align',
			icon: 'left'
		},
		'\n',
		{
			name: 'merge',
			command: 'tablemerge',
			tooltip: 'Merge'
		},
		{
			name: 'addcolumn',
			list: {
				tableaddcolumnbefore: 'Insert column before',
				tableaddcolumnafter: 'Insert column after'
			},
			exec: (
				editor: IJodit,
				table: HTMLTableElement,
				control: IControlType
			) => {
				const command: string =
					control.args && typeof control.args[0] === 'string'
						? control.args[0].toLowerCase()
						: '';

				editor.execCommand(command, false, table);
			},
			tooltip: 'Add column'
		},
		{
			name: 'addrow',
			list: {
				tableaddrowbefore: 'Insert row above',
				tableaddrowafter: 'Insert row below'
			},
			exec: (
				editor: IJodit,
				table: HTMLTableElement,
				control: IControlType
			) => {
				const command: string =
					control.args && typeof control.args[0] === 'string'
						? control.args[0].toLowerCase()
						: '';

				editor.execCommand(command, false, table);
			},
			tooltip: 'Add row'
		},
		{
			name: 'delete',
			icon: 'bin',
			list: {
				tablebin: 'Delete table',
				tablebinrow: 'Delete row',
				tablebincolumn: 'Delete column',
				tableempty: 'Empty cell'
			},
			exec: (
				editor: IJodit,
				table: HTMLTableElement,
				control: IControlType
			) => {
				const command: string =
					control.args && typeof control.args[0] === 'string'
						? control.args[0].toLowerCase()
						: '';

				editor.execCommand(command, false, table);
				editor.events.fire('hidePopup');
			},
			tooltip: 'Delete'
		}
	]
} as IDictionary<Array<IControlType | string>>;

/**
 * Support inline toolbar
 *
 * @param {Jodit} editor
 */
export class inlinePopup extends Plugin {
	private toolbar!: IToolbarCollection;
	private popup!: IPopup;

	private target!: HTMLDivElement;
	private targetContainer!: HTMLDivElement;
	private container!: HTMLDivElement;

	private _hiddenClass = 'jodit_toolbar_popup-inline-target-hidden';

	private __getRect!: () => IBound;

	// was started selection
	private isSelectionStarted = false;

	private onSelectionEnd = this.jodit.async.debounce(() => {
		if (this.isDestructed || !this.jodit.isEditorMode()) {
			return;
		}

		if (this.isSelectionStarted) {
			if (!this.isTargetAction) {
				this.onChangeSelection();
			}
		}

		this.isSelectionStarted = false;
		this.isTargetAction = false;
	}, this.jodit.defaultTimeout);

	private isTargetAction: boolean = false;

	/**
	 * Popup was opened for some selection text (not for image or link)
	 * @type {boolean}
	 */
	private isSelectionPopup: boolean = false;

	private calcWindSizes = (): IBound => {
		const win: Window = this.jodit.ownerWindow;
		const docElement: HTMLElement | null = this.jodit.ownerDocument
			.documentElement;

		if (!docElement) {
			return {
				left: 0,
				top: 0,
				width: 0,
				height: 0
			};
		}

		const body: HTMLElement = this.jodit.ownerDocument.body;
		const scrollTop: number =
			win.pageYOffset || docElement.scrollTop || body.scrollTop;

		const clientTop: number = docElement.clientTop || body.clientTop || 0;

		const scrollLeft: number =
			win.pageXOffset || docElement.scrollLeft || body.scrollLeft;

		const clientLeft: number =
			docElement.clientLeft || body.clientLeft || 0;

		const windWidth: number =
			docElement.clientWidth + scrollLeft - clientLeft;

		const windHeight: number =
			docElement.clientHeight + scrollTop - clientTop;

		return {
			left: clientLeft,
			top: clientTop,
			width: windWidth,
			height: windHeight
		};
	};

	private calcPosition = (rect: IBound, windowSize: IBound) => {
		if (this.isDestructed) {
			return;
		}

		this.popup.target.classList.remove(this._hiddenClass);

		const selectionCenterLeft = rect.left + rect.width / 2;

		const workplacePosition = offset(
			this.jodit.workplace,
			this.jodit,
			this.jodit.ownerDocument,
			true
		);

		let targetTop: number = rect.top + rect.height + 10;
		const diff = 50;

		this.target.style.left = selectionCenterLeft + 'px';
		this.target.style.top = targetTop + 'px';

		if (this.jodit.isFullSize()) {
			this.target.style.zIndex = css(
				this.jodit.container,
				'zIndex'
			).toString();
		}

		const halfWidthPopup: number = this.container.offsetWidth / 2;
		let marginLeft: number = -halfWidthPopup;
		this.popup.container.classList.remove('jodit_toolbar_popup-inline-top');

		if (targetTop + this.container.offsetHeight > windowSize.height) {
			targetTop = rect.top - this.container.offsetHeight - 10;
			this.target.style.top = targetTop + 'px';
			this.popup.container.classList.add(
				'jodit_toolbar_popup-inline-top'
			);
		}

		if (selectionCenterLeft - halfWidthPopup < 0) {
			marginLeft = -(rect.width / 2 + rect.left);
		}

		if (selectionCenterLeft + halfWidthPopup > windowSize.width) {
			marginLeft = -(
				this.container.offsetWidth -
				(windowSize.width - selectionCenterLeft)
			);
		}

		this.container.style.marginLeft = marginLeft + 'px';

		if (
			workplacePosition.top - targetTop > diff ||
			targetTop - (workplacePosition.top + workplacePosition.height) >
				diff
		) {
			this.popup.target.classList.add(this._hiddenClass);
		}
	};

	private isExcludedTarget(type: string): boolean {
		return (
			splitArray(this.jodit.options.toolbarInlineDisableFor)
				.map(a => a.toLowerCase())
				.indexOf(type.toLowerCase()) !== -1
		);
	}
	private reCalcPosition = () => {
		if (this.__getRect) {
			this.calcPosition(this.__getRect(), this.calcWindSizes());
		}
	};

	private showPopup = (
		rect: () => IBound,
		type: string,
		elm?: HTMLElement
	): boolean => {
		if (
			!this.jodit.options.toolbarInline ||
			!this.jodit.options.popup[type.toLowerCase()]
		) {
			return false;
		}

		if (this.isExcludedTarget(type)) {
			return true;
		}

		this.isOpened = true;
		this.isTargetAction = true;

		const windSize: IBound = this.calcWindSizes();

		this.targetContainer.parentNode ||
			this.jodit.ownerDocument.body.appendChild(this.targetContainer);

		this.toolbar.build(
			this.jodit.options.popup[type.toLowerCase()],
			this.container,
			elm
		);

		this.popup.open(this.container, false, true);

		this.__getRect = rect;

		this.calcPosition(rect(), windSize);

		return true;
	};

	private hidePopup = (root?: HTMLElement | Popup) => {
		if (this.isDestructed) {
			return;
		}

		if (
			root &&
			(Dom.isNode(root, this.jodit.editorWindow || window) ||
				root instanceof Popup) &&
			Dom.isOrContains(
				this.target,
				root instanceof Popup ? root.target : root
			)
		) {
			return;
		}

		this.isTargetAction = false;
		this.isOpened = false;
		this.popup.close();

		Dom.safeRemove(this.targetContainer);
	};

	private onSelectionStart = (event: MouseEvent) => {
		if (this.isDestructed || !this.jodit.isEditorMode()) {
			return;
		}

		this.isTargetAction = false;
		this.isSelectionPopup = false;

		if (!this.isSelectionStarted) {
			const elements: string = Object.keys(this.jodit.options.popup).join(
					'|'
				),
				target: HTMLElement | false = Dom.isTag(
					event.target as Node,
					'img'
				)
					? (event.target as HTMLImageElement)
					: (Dom.closest(
							event.target as Node,
							elements,
							this.jodit.editor
					  ) as HTMLTableElement);

			if (
				!target ||
				!this.showPopup(
					() => offset(target, this.jodit, this.jodit.editorDocument),
					target.nodeName,
					target
				)
			) {
				this.isSelectionStarted = true;
			}
		}
	};

	private hideIfCollapsed(): boolean {
		if (this.jodit.selection.isCollapsed()) {
			this.hidePopup();
			return true;
		}

		return false;
	}

	private checkIsTargetEvent = () => {
		if (!this.isTargetAction) {
			this.hidePopup();
		} else {
			this.isTargetAction = false;
		}
	};

	isOpened: boolean = false;

	private onChangeSelection = () => {
		if (!this.jodit.options.toolbarInline || !this.jodit.isEditorMode()) {
			return;
		}

		if (this.hideIfCollapsed()) {
			return;
		}

		if (this.jodit.options.popup.selection !== undefined) {
			const sel = this.jodit.selection.sel;

			if (sel && sel.rangeCount) {
				this.isSelectionPopup = true;
				const range = sel.getRangeAt(0);

				this.showPopup(
					() => offset(range, this.jodit, this.jodit.editorDocument),
					'selection'
				);
			}
		}
	};

	afterInit(jodit: IJodit): void {}

	init(editor: IJodit) {
		this.toolbar = JoditToolbarCollection.makeCollection(editor);

		this.target = editor.create.div('jodit_toolbar_popup-inline-target');
		this.targetContainer = editor.create.div(
			'jodit_toolbar_popup-inline-container',
			this.target
		);

		this.container = editor.create.div();

		this.popup = new Popup(
			editor,
			this.target,
			undefined,
			'jodit_toolbar_popup-inline'
		);

		editor.events
			.on(
				this.target,
				'mousedown keydown touchstart',
				(e: MouseEvent) => {
					e.stopPropagation();
				}
			)
			.on('beforeOpenPopup hidePopup afterSetMode', this.hidePopup)
			.on('recalcPositionPopup', this.reCalcPosition)
			.on('getDiffButtons.mobile', (_toolbar: ToolbarCollection):
				| void
				| string[] => {
				if (this.toolbar === _toolbar) {
					return splitArray(editor.options.buttons)
						.filter(name => name !== '|' && name !== '\n')
						.filter((name: string) => {
							return (
								this.toolbar.getButtonsList().indexOf(name) < 0
							);
						});
				}
			})
			.on('selectionchange', this.onChangeSelection)
			.on('afterCommand afterExec', () => {
				if (this.isOpened && this.isSelectionPopup) {
					this.onChangeSelection();
				}
			})
			.on(
				'showPopup',
				(elm: HTMLElement | string, rect: () => IBound) => {
					const elementName: string = (typeof elm === 'string'
						? elm
						: elm.nodeName
					).toLowerCase();

					this.isSelectionPopup = false;

					this.showPopup(
						rect,
						elementName,
						typeof elm === 'string' ? undefined : elm
					);
				}
			)

			.on('mousedown keydown touchstart', this.onSelectionStart);

		editor.events.on('afterInit changePlace', () => {
			editor.events
				.off('.inlinePopup')
				.on(
					[editor.ownerWindow, editor.editor],
					'scroll.inlinePopup resize.inlinePopup',
					this.reCalcPosition
				)
				.on(
					[editor.ownerWindow],
					'mouseup.inlinePopup keyup.inlinePopup touchend.inlinePopup',
					this.onSelectionEnd
				)
				.on(
					[editor.ownerWindow],
					'mousedown.inlinePopup keydown.inlinePopup touchstart.inlinePopup',
					this.checkIsTargetEvent
				);
		});
	}

	beforeDestruct(editor: IJodit) {
		this.popup && this.popup.destruct();
		delete this.popup;
		this.toolbar && this.toolbar.destruct();
		delete this.toolbar;

		Dom.safeRemove(this.target);
		Dom.safeRemove(this.container);
		Dom.safeRemove(this.targetContainer);

		editor.events &&
			editor.events
				.off([editor.ownerWindow], 'scroll resize', this.reCalcPosition)
				.off(
					[editor.ownerWindow],
					'mouseup keyup touchend',
					this.onSelectionEnd
				)
				.off(
					[editor.ownerWindow],
					'mousedown keydown touchstart',
					this.checkIsTargetEvent
				);
	}
}
