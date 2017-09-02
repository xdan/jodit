import Jodit from '../Jodit';

export default function (editor: Jodit) {
    editor.events.on('click', (event: Event) => {
        if (event.target && event.target['tagName'] === 'IMG') {
            //alert(1);
        }
    });
};