# Image properties dialog

After double-clicking on a photo in the editor, it opens the photo editing dialog.

## Known Issues

-   When opening an editor in a [mui](https://mui.com/material-ui/api/modal) dialog box and opening the image dialog box in it,
    the mui dialog does not allow focus to be passed out. As a result, no field inside image properties can be focused.
    Just enable the [disableEnforceFocus](https://mui.com/material-ui/api/modal/#props) option.
    [Image properties - Input fields are not clickable ( react + material ui ) #879](https://github.com/xdan/jodit/issues/879)
