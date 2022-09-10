# Link plugin

Adds a link editor to the toolbar. It can also process different types of links: videos, files.

```js
Jodit.make('#editor', {
	link: {
    /**
     * Template for the link dialog form
     */
    formTemplate: (editor: IJodit) => `<form><input ref="url_input"><button>Apply</button></form>`,
    formClassName: 'some-class',

    /**
     * Follow link address after dblclick
     */
    followOnDblClick: true,

    /**
     * Replace inserted youtube/vimeo link to `iframe`
     */
    processVideoLink: true,

    /**
     * Wrap inserted link
     */
    processPastedLink: true,

    /**
     * Show `no follow` checkbox in link dialog.
     */
    noFollowCheckbox: true,

    /**
     * Show `Open in new tab` checkbox in link dialog.
     */
    openInNewTabCheckbox: true,

    /**
     * Use an input text to ask the classname or a select or not ask
     */
    modeClassName: 'input', // 'select'

    /**
     * Allow multiple choises (to use with modeClassName="select")
     */
    selectMultipleClassName: true,

    /**
     * The size of the select (to use with modeClassName="select")
     */
    selectSizeClassName: 10

    /**
     * The list of the option for the select (to use with modeClassName="select")
     */
    selectOptionsClassName: [
      {value: 'https://xdsoft.net', text: 'xdsoft'}
    ],
  }
});
```

## Known Issues

-   When opening an editor in a [mui](https://mui.com/material-ui/api/modal) dialog box and opening the link popup in it,
    the mui dialog does not allow focus to be passed out. As a result, no field inside form can be focused.
    Just enable the [disableEnforceFocus](https://mui.com/material-ui/api/modal/#props) option.
    [Image properties - Input fields are not clickable ( react + material ui ) #879](https://github.com/xdan/jodit/issues/879)
