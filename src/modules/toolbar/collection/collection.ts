/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/toolbar/collection/README.md]]
 * @packageDocumentation
 * @module modules/toolbar/collection
 */

import type {
	ButtonsGroups,
	CanUndef,
	IBound,
	IControlTypeStrong,
	IToolbarButton,
	IToolbarCollection,
	IUIButton,
	IViewBased,
	IViewWithToolbar,
	Nullable
} from 'jodit/types';
import { autobind, component, debounce, hook } from 'jodit/core/decorators';
import { error } from 'jodit/core/helpers/utils/error/error';
import { UIList, UITooltip } from 'jodit/core/ui';
import { makeButton, makeSelect } from 'jodit/modules/toolbar/factory';

import './collection.less';

@component
export class ToolbarCollection<T extends IViewWithToolbar = IViewWithToolbar>
	extends UIList<T>
	implements IToolbarCollection
{
	/** @override */
	override className(): string {
		return 'ToolbarCollection';
	}

	private readonly __listenEvents =
		'updatePlugins updateToolbar changeStack mousedown mouseup keydown change afterInit readonly afterResize ' +
		'selectionchange changeSelection focus afterSetMode touchstart focus blur';

	/**
	 * First button in a list
	 */
	get firstButton(): Nullable<IToolbarButton> {
		const [button] = this.buttons as IToolbarButton[];
		return button || null;
	}

	protected override makeButton(
		control: IControlTypeStrong,
		target: Nullable<HTMLElement> = null
	): IUIButton {
		return makeButton(this.j, control, target);
	}

	protected override makeSelect(
		control: IControlTypeStrong,
		target: Nullable<HTMLElement> = null
	): IUIButton {
		return makeSelect(this.j, control, target);
	}

	/**
	 * Button should be active
	 */
	shouldBeActive(button: IToolbarButton): boolean | undefined {
		return undefined;
	}

	/**
	 * The Button should be disabled
	 */
	shouldBeDisabled(button: IToolbarButton): boolean | undefined {
		return undefined;
	}

	/**
	 * Returns current target for button
	 */
	getTarget(button: IToolbarButton): Node | null {
		return button.target || null;
	}

	@autobind
	private __immediateUpdate(): void {
		if (this.isDestructed || this.j.isLocked) {
			return;
		}

		super.update();

		this.j.e.fire('afterUpdateToolbar', this);
	}

	@debounce(ctx => ctx.j.defaultTimeout, true)
	override update(): void {
		this.__immediateUpdate();
	}

	/**
	 * Set direction
	 */
	setDirection(direction: 'rtl' | 'ltr'): void {
		this.container.style.direction = direction;
		this.container.setAttribute('dir', direction);
	}

	private __tooltip: Nullable<UITooltip> = new UITooltip(this.jodit);

	constructor(jodit: IViewBased) {
		super(jodit as T);
	}

	@hook('ready')
	protected __initEvents(): void {
		this.j.e
			.on(this.__listenEvents, this.update)
			.on('afterSetMode focus', this.__immediateUpdate);
	}

	hide(): void {
		this.container.remove();
	}

	show(): void {
		this.appendTo(this.j.toolbarContainer);
	}

	showInline(bound?: IBound): void {
		throw error('The method is not implemented for this class.');
	}

	/** @override **/
	override build(
		items: ButtonsGroups,
		target: Nullable<HTMLElement> = null
	): this {
		const itemsWithGroupps = this.j.e.fire(
			'beforeToolbarBuild',
			items
		) as CanUndef<ButtonsGroups>;

		if (itemsWithGroupps) {
			items = itemsWithGroupps;
		}

		super.build(items, target);
		return this;
	}

	/** @override **/
	override destruct(): void {
		if (this.isDestructed) {
			return;
		}

		this.__tooltip?.destruct();
		this.__tooltip = null;

		this.j.e
			.off(this.__listenEvents, this.update)
			.off('afterSetMode focus', this.__immediateUpdate);

		super.destruct();
	}
}
