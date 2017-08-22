import Jodit from '../Jodit';

Jodit.plugins.imageInlineToolbar = function (editor: Jodit) {
    editor.events.on('click', (event: Event) => {
        if (event.target && event.target['tagName'] === 'IMG') {
            //alert(1);
        }
    });
};