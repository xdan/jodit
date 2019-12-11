
// Config.prototype.controls.emoji = {
// 	icon: 'plugins/emoji/icon.svg',
// 	tooltip: 'Insert Emoji'
// } as IControlType;

/**
 * Support emoji
 */
Jodit.plugins.emoji = class emoji {
	afterInit(editor: any) {
		// const buttons = editor.options.buttons;
		//
		// if (!buttons.includes('emoji')) {
		// 	buttons.push('emoji');
		// }
		//
		// editor.options.buttons = buttons;
	}

	beforeDestruct(editor: any) {

	}
};
