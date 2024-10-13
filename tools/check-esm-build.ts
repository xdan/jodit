/**
 * Check that all plugins are included in the ESM build
 */

import '../build/esm/plugins/add-new-line/add-new-line';
import '../build/esm/plugins/ai-assistant/ai-assistant';
import '../build/esm/plugins/clean-html/clean-html';
import '../build/esm/plugins/hotkeys/hotkeys';
import '../build/esm/plugins/image-processor/image-processor';
import '../build/esm/plugins/image-properties/image-properties';
import '../build/esm/plugins/justify/justify';
import '../build/esm/plugins/limit/limit';
import '../build/esm/plugins/mobile/mobile';
import '../build/esm/plugins/print/print';
import '../build/esm/plugins/resizer/resizer';
import '../build/esm/plugins/search/search';
import '../build/esm/plugins/select-cells/select-cells';
import '../build/esm/plugins/source/source';
import '../build/esm/plugins/speech-recognize/speech-recognize';
import '../build/esm/plugins/spellcheck/spellcheck';
import '../build/esm/plugins/sticky/sticky';
import '../build/esm/plugins/symbols/symbols';
import '../build/esm/plugins/tab/tab';
import '../build/esm/plugins/table-keyboard-navigation/table-keyboard-navigation';
import '../build/esm/plugins/video/video';
import '../build/esm/plugins/xpath/xpath';
import '../build/esm/plugins/class-span/class-span';
import '../build/esm/plugins/clipboard/clipboard';
import '../build/esm/plugins/copy-format/copy-format';
import '../build/esm/plugins/drag-and-drop/drag-and-drop';
import '../build/esm/plugins/drag-and-drop-element/drag-and-drop-element';
import '../build/esm/plugins/file/file';
import '../build/esm/plugins/focus/focus';
import '../build/esm/plugins/fullsize/fullsize';
import '../build/esm/plugins/hr/hr';
import '../build/esm/plugins/indent/indent';
import '../build/esm/plugins/key-arrow-outside/key-arrow-outside';
import '../build/esm/plugins/line-height/line-height';
import '../build/esm/plugins/media/media';
import '../build/esm/plugins/paste/paste';
import '../build/esm/plugins/paste-from-word/paste-from-word';
import '../build/esm/plugins/paste-storage/paste-storage';
import '../build/esm/plugins/preview/preview';
import '../build/esm/plugins/resize-cells/resize-cells';
import '../build/esm/plugins/resize-handler/resize-handler';
import '../build/esm/plugins/select/select';

import { Jodit } from '../build/esm/index';

if (typeof Jodit === 'undefined') {
	throw new Error('Jodit not found');
}

if (typeof Jodit.plugins === 'undefined') {
	throw new Error('Jodit.plugins not found');
}

if (typeof Jodit.defaultOptions.controls.ol === 'undefined') {
	throw new Error('Jodit.defaultOptions.controls.ol not found');
}
