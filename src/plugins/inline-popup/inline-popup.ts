/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './inline-popup.less';

import { Config } from '../../config';
import {
	Dom,
	Plugin,
	Table,
	PopupMenu,
	ToolbarCollection
} from '../../modules';

import {
	attr,
	clearCenterAlign,
	css,
	isString,
	offset,
	splitArray
} from '../../core/helpers';

import {
	Buttons,
	IDictionary,
	IJodit,
	IPopup,
	IToolbarCollection,
	IControlType,
	IBound
} from '../../types';

import { makeCollection } from '../../modules/toolbar/factory';
import { getContainer } from '../../core/global';
import { ColorPickerWidget, TabsWidget } from '../../modules/widget';

declare module '../../config' {
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
				const href = attr(current as HTMLElement, 'href');

				if (current && href) {
					editor.ow.open(href);
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
				editor.e.fire('hidePopup');
			}
		}
	],
	'jodit-media': [
		{
			name: 'bin',
			tooltip: 'Delete',
			exec: (editor: IJodit, image: Node) => {
				editor.selection.removeNode(image);
				editor.e.fire('hidePopup');
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
				editor.e.fire('hidePopup');
			}
		},
		{
			name: 'pencil',
			exec(editor: IJodit, current: Node) {
				const tagName: string = (current as HTMLElement).tagName.toLowerCase();
				if (tagName === 'img') {
					editor.e.fire('openImageProperties', current);
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
				const tagName = (image as HTMLElement).tagName.toLowerCase();
				if (tagName !== 'img') {
					return;
				}

				const command =
					control.args && isString(control.args[1])
						? control.args[1].toLowerCase()
						: '';

				css(image, 'vertical-align', command);

				editor.e.fire('recalcPositionPopup');
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

				editor.e.fire('recalcPositionPopup');
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
				editor.e.fire('hidePopup');
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

	private __getRect!: () => IBound;

	// was started selection
	private isSelectionStarted = false;

	private onSelectionEnd = this.j.async.debounce(() => {
		if (this.isDestructed || !this.j.isEditorMode()) {
			return;
		}

		if (this.isSelectionStarted) {
			if (!this.isTargetAction) {
				this.onChangeSelection();
			}
		}

		this.isSelectionStarted = false;
		this.isTargetAction = false;
	}, this.j.defaultTimeout);

	private isTargetAction: boolean = false;

	/**
	 * Popup was opened for some selection text (not for image or link)
	 * @type {boolean}
	 */
	private isSelectionPopup: boolean = false;

	private calcWindSizes = (): IBound => {
		const win: Window = this.j.ow;
		const docElement: HTMLElement | null = this.j.od.documentElement;

		if (!docElement) {
			return {
				left: 0,
				top: 0,
				width: 0,
				height: 0
			};
		}

		const body: HTMLElement = this.j.od.body;
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

		const selectionCenterLeft = rect.left + rect.width / 2;

		const workplacePosition = offset(
			this.j.workplace,
			this.j,
			this.j.od,
			true
		);

		let targetTop: number = rect.top + rect.height + 10;
		const diff = 50;

		this.target.style.left = selectionCenterLeft + 'px';
		this.target.style.top = targetTop + 'px';

		if (this.j.isFullSize()) {
			this.target.style.zIndex = css(
				this.j.container,
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
			this.popup.close();
		}
	};

	private isExcludedTarget(type: string): boolean {
		return (
			splitArray(this.j.o.toolbarInlineDisableFor)
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
		const data = this.j.o.popup[type.toLowerCase()];

		if (!this.j.o.toolbarInline || !data) {
			return false;
		}

		if (this.isExcludedTarget(type)) {
			return true;
		}

		this.isTargetAction = true;

		const size = this.calcWindSizes();

		this.targetContainer.parentNode ||
			getContainer(this.j, inlinePopup.name).appendChild(
				this.targetContainer
			);

		this.toolbar.build(data, elm).appendTo(this.container);

		this.popup.open(this.container, rect);

		this.__getRect = rect;

		this.calcPosition(rect(), size);

		return true;
	};

	private hidePopup = (root?: HTMLElement | PopupMenu) => {
		if (this.isDestructed) {
			return;
		}

		// TODO
		// if (
		// 	root &&
		// 	(Dom.isNode(root, this.j.editorWindow || window) ||
		// 		root instanceof PopupMenu) &&
		// 	Dom.isOrContains(
		// 		this.target,
		// 		root instanceof PopupMenu ? root.target : root
		// 	)
		// ) {
		// 	return;
		// }

		this.isTargetAction = false;
		this.popup.close();

		Dom.safeRemove(this.targetContainer);
	};

	private onSelectionStart = (event: MouseEvent) => {
		if (this.isDestructed || !this.j.isEditorMode()) {
			return;
		}

		this.isTargetAction = false;
		this.isSelectionPopup = false;

		if (!this.isSelectionStarted) {
			const elements: string = Object.keys(this.j.o.popup).join('|'),
				target: HTMLElement | false = Dom.isTag(
					event.target as Node,
					'img'
				)
					? (event.target as HTMLImageElement)
					: (Dom.closest(
							event.target as Node,
							elements,
							this.j.editor
					  ) as HTMLTableElement);

			if (
				!target ||
				!this.showPopup(
					() => offset(target, this.j, this.j.editorDocument),
					target.nodeName,
					target
				)
			) {
				this.isSelectionStarted = true;
			}
		}
	};

	private hideIfCollapsed(): boolean {
		if (this.j.selection.isCollapsed()) {
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

	private onChangeSelection = () => {
		if (!this.j.o.toolbarInline || !this.j.isEditorMode()) {
			return;
		}

		if (this.hideIfCollapsed()) {
			return;
		}

		if (this.j.o.popup.selection !== undefined) {
			const sel = this.j.selection.sel;

			if (sel && sel.rangeCount) {
				this.isSelectionPopup = true;
				const range = sel.getRangeAt(0);

				this.showPopup(
					() => offset(range, this.j, this.j.editorDocument),
					'selection'
				);
			}
		}
	};

	afterInit(jodit: IJodit): void {}

	init(editor: IJodit) {
		this.toolbar = makeCollection(editor);

		this.target = editor.c.div('jodit-popup-inline__target');
		this.targetContainer = editor.c.div(
			'jodit-popup-inline__container',
			this.target
		);

		this.container = editor.c.div();

		this.popup = new PopupMenu(editor);

		editor.e
			.on(
				this.target,
				'mousedown keydown touchstart',
				(e: MouseEvent) => {
					e.stopPropagation();
				}
			)
			.on('beforeOpenPopup hidePopup afterSetMode', this.hidePopup)
			.on('recalcPositionPopup', this.reCalcPosition)
			.on(
				'getDiffButtons.mobile',
				(_toolbar: ToolbarCollection): void | Buttons => {
					if (this.toolbar === _toolbar) {
						return splitArray(editor.o.buttons).filter(item => {
							const name = isString(item) ? item : item.name;

							return (
								name &&
								name !== '|' &&
								name !== '\n' &&
								this.toolbar.getButtonsList().indexOf(name) < 0
							);
						});
					}
				}
			)
			.on('selectionchange', this.onChangeSelection)
			.on('afterCommand afterExec', () => {
				if (this.popup.isOpened && this.isSelectionPopup) {
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

		editor.e.on('afterInit changePlace', () => {
			editor.e
				.off('.inlinePopup')
				.on(
					[editor.ow, editor.editor],
					'scroll.inlinePopup resize.inlinePopup',
					this.reCalcPosition
				)
				.on(
					[editor.ow],
					'mouseup.inlinePopup keyup.inlinePopup touchend.inlinePopup',
					this.onSelectionEnd
				)
				.on(
					[editor.ow],
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
			editor.e
				.off([editor.ow], 'scroll resize', this.reCalcPosition)
				.off([editor.ow], 'mouseup keyup touchend', this.onSelectionEnd)
				.off(
					[editor.ow],
					'mousedown keydown touchstart',
					this.checkIsTargetEvent
				);
	}
}
