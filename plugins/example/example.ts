import { IJodit, IPlugin, IControlType } from '../../src/types';
declare var Jodit: any;

Jodit.defaultOptions.controls.example = {
	iconURL: '{basePath}plugins/example/icon.svg',
	tooltip: 'Example',
	popup: (): string => {
		return `<div class="jodit_example">Example plugin</div>`
	}
} as IControlType;

Jodit.defaultOptions.controls.example2 = {
	iconURL: '{basePath}plugins/example/icon.svg',
	tooltip: 'Example2',
	exec: (editor: IJodit) => {
		editor.selection.insertHTML('Hello world');
	}
} as IControlType;

/**
 * Support example
 * @example
 * var jodit = new Jodit('#editor', {
 *   buttons: Jodit.defaultOptions.buttons.concat(['example']),
 *   extraPlugins: ['example']
 * });
 */
class example implements IPlugin {
	hasStyle = true;

	init(jodit: IJodit) {
		alert('Example plugin')
	}

	destruct() {}
}

Jodit.plugins.add('example', example);

/**
 * Plugin use object
 */
Jodit.plugins.add('example2', {
	init() {
		alert('Example2 plugin')
	},
	destruct() {}
});
