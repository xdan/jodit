import { IJodit, IPlugin, IControlType } from '../../src/types';
declare var Jodit: any;

Jodit.defaultOptions.controls.emoji = {
	iconURL: '{basePath}plugins/emoji/icon.svg',
	tooltip: 'Insert Emoji'
} as IControlType;

/**
 * Support emoji
 */
class emoji implements IPlugin {
	hasStyle = true;
	init(jodit: IJodit) {
		// const buttons = editor.options.buttons;
		//
		// if (!buttons.includes('emoji')) {
		// 	buttons.push('emoji');
		// }
		//
		// editor.options.buttons = buttons;
		// alert('emoji Inited')
	}

	destruct() {

	}
}

Jodit.plugins.add('emoji', emoji);

Jodit.plugins.add('emoji2', {
	init() {
		// alert('emoji Inited2')
	},
	destruct() {}
});
