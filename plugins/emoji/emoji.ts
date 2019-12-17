import { IJodit, IPlugin, IControlType } from '../../src/types';

declare var Jodit: any;

Jodit.defaultOptions.controls.emoji = {
	icon: 'plugins/emoji/icon.svg',
	tooltip: 'Insert Emoji'
} as IControlType;

/**
 * Support emoji
 */
class emoji implements IPlugin {
	init(jodit: IJodit) {
		// const buttons = editor.options.buttons;
		//
		// if (!buttons.includes('emoji')) {
		// 	buttons.push('emoji');
		// }
		//
		// editor.options.buttons = buttons;
	}

	destruct() {

	}
}

Jodit.plugins.emoji = emoji;
