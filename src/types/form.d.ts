export interface IFocusable {
	isFocused(): boolean;
	focus(): void;
}

export interface IButton extends IFocusable {
	isDisabled(): boolean;
	isActive(): boolean;

	setActive(state: boolean): void;
	setDisabled(state: boolean): void;
}
