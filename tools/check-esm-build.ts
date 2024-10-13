import '../build/esm/plugins/add-new-line/add-new-line';
import '../build/esm/plugins/ai-assistant/ai-assistant';
import '../build/esm/plugins/clean-html/clean-html';

import { Jodit } from '../build/esm/index';

if (typeof Jodit === 'undefined') {
	throw new Error('Jodit not found');
}

if (typeof Jodit.plugins === 'undefined') {
	throw new Error('Jodit.plugins not found');
}
