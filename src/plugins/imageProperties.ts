/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config'
import {$$, css, dom, trim, val} from "../modules/Helpers";
import {Alert, Confirm, Dialog} from "../modules/Dialog";
import {ToolbarIcon, ToolbarPopup} from "../modules/ToolbarCollection";

import {FileBrowser,FileBrowserCallBackData} from "../modules/FileBrowser";
import {Dom} from "../modules/Dom";
import {UploaderData} from "../modules/Uploader";
import {Widget} from "../modules/Widget";
import TabsWidget = Widget.TabsWidget;
import FileSelectorWidget = Widget.FileSelectorWidget;
/**
 * Plug-in for image editing window
 *
 */
/**
 * @property{object} image Plugin {@link Image|Image}'s options
 * @property{boolean} image.openOnDblClick=true Open editing dialog after double click on image
 * @property{boolean} image.editSrc=true Show edit 'src' input
 * @property{boolean} image.useImageEditor=true Show crop/resize btn
 * @property{boolean} image.editTitle=true Show edit 'title' input
 * @property{boolean} image.editAlt=true Show edit 'alt' input
 * @property{boolean} image.editLink=true Show edit image link's options
 * @property{boolean} image.editSize=true Show edit image size's inputs
 * @property{boolean} image.editMargins=true Show edit margin inputs
 * @property{boolean} image.editStyle=true Show style edit input
 * @property{boolean} image.editClass=true Show edit classNames input
 * @property{boolean} image.editId=true Show edit ID input
 * @property{boolean} image.editAlign=true Show Alignment selector
 * @property{boolean} image.showPreview=true Show preview image
 * @property{boolean} image.selectImageAfterClose=true Select image after close dialog
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *     image: {
 *         editSrc: false,
 *         editLink: false
 *     }
 * });
 * ```
 */

declare module "../Config" {
    interface Config {
        image: {
            openOnDblClick: boolean,
            editSrc: boolean,
            useImageEditor: boolean,
            editTitle: boolean,
            editAlt: boolean,
            editLink: boolean,
            editSize: boolean,
            editMargins: boolean,
            editBorderRadius: boolean,
            editClass: boolean,
            editStyle: boolean,
            editId: boolean,
            editAlign: boolean,
            showPreview: boolean,
            selectImageAfterClose: boolean,
        }
    }
}


Config.prototype.image =  {
     openOnDblClick: true,
     editSrc: true,
     useImageEditor: true,
     editTitle: true,
     editAlt: true,
     editLink: true,
     editSize: true,
     editBorderRadius: true,
     editMargins: true,
     editClass: true,
     editStyle: true,
     editId: true,
     editAlign: true,
     showPreview: true,
     selectImageAfterClose: true,
};

/**
 * Show dialog with image's options
 *
 * @param {Jodit} editor
 */
export function imageProperties(editor: Jodit) {
    /**
     * Open dialog editing image properties
     *
     * @example
     * ```javascript
     * var editor = new Jodit('#editor');
     *     img = editor.editorDocument.createElement('img');
     *
     * img.setAttribute('src', 'images/someimage.png');
     * editor.{@link Selection~select|select}(img);
     * // open the properties of the editing window
     * editor.plugins.image.open.call(img); // `this` must be HTMLImageElement
     * ```
     */
    const open = function (this: HTMLImageElement, e ?: MouseEvent) {
        if (editor.options.readonly) {
            return;
        }

        e && e.stopImmediatePropagation();

        const image = <HTMLImageElement>this,
            dialog: Dialog = new Dialog(editor),
            cancel: HTMLElement = dom('<a href="javascript:void(0)" style="float:right;" class="jodit_button">' + ToolbarIcon.getIcon('cancel') + '<span>' + editor.i18n('Cancel') + '</span></a>', editor.ownerDocument),
            check: HTMLElement  = dom('<a href="javascript:void(0)" style="float:left;" class="jodit_button">' + ToolbarIcon.getIcon('check') + '<span>' +  editor.i18n('Ok') + '</span></a>', editor.ownerDocument),

            buttons = {
                remove: dom('<a href="javascript:void(0)" class="jodit_button">' + ToolbarIcon.getIcon('bin') + ' ' + editor.i18n('Delete') + '</a>', editor.ownerDocument)
            },

            prop: HTMLDivElement = <HTMLDivElement>dom('<form class="jodit_properties">' +
                    '<div class="jodit_grid">' +
                        '<div class="jodit_col-lg-2-5">' +
                            '<div class="jodit_properties_view_box">' +
                                '<div style="' + (!editor.options.image.showPreview ? 'display:none' : '') + '" class="jodit_properties_image_view">' +
                                    '<img class="imageViewSrc" src="" alt=""/>' +
                                '</div>' +
                                '<div style="' + (!editor.options.image.editSize ? 'display:none' : '') + '" class="jodit_form_group jodit_properties_image_sizes">' +
                                    '<input type="number" class="imageWidth"/>' +
                                    '<a class="jodit_lock_helper jodit_lock_size" href="javascript:void(0)">' +
                                        ToolbarIcon.getIcon('lock') +
                                    '</a>' +
                                    '<input type="number" class="imageHeight"/>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="jodit_col-lg-3-5 tabsbox"></div>' +
                    '</div>' +
                '</form>', editor.ownerDocument),

            positionTab: HTMLDivElement = <HTMLDivElement>dom('<div style="' + (!editor.options.image.editMargins ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label>' + editor.i18n('Margins') + '</label>' +
                    '<div class="jodit_grid">' +
                        '<input class="jodit_col-lg-1-5 margins marginTop" data-id="marginTop" type="text" placeholder="' + editor.i18n('top') + '"/>' +
                        '<a style="text-align: center;" class="jodit_lock_helper jodit_lock_margin jodit_col-lg-1-5" href="javascript:void(0)">' +
                            ToolbarIcon.getIcon('lock') +
                        '</a>' +
                        '<input disabled="true" class="jodit_col-lg-1-5 margins marginRight" data-id="marginRight" type="text" placeholder="' + editor.i18n('right') + '"/>' +
                        '<input disabled="true" class="jodit_col-lg-1-5 margins marginBottom" data-id="marginBottom" type="text" placeholder="' + editor.i18n('bottom') + '"/>' +
                        '<input disabled="true" class="jodit_col-lg-1-5 margins marginLeft" data-id="marginLeft" type="text" placeholder="' + editor.i18n('left') + '"/>' +
                    '</div>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editStyle ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label>' + editor.i18n('Styles') + '</label>' +
                    '<input type="text" class="style"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editClass ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="classes">' + editor.i18n('Classes') + '</label>' +
                    '<input type="text" class="classes"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editId ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="id">Id</label>' +
                    '<input type="text" class="id"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editBorderRadius ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="border_radius">Border radius</label>' +
                    '<input type="number" class="border_radius"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editAlign ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="align">' + editor.i18n('Align') + '</label>' +
                    '<select class="select align">' +
                        '<option value="">' + editor.i18n('--Not Set--') + '</option>' +
                            '<option value="left">' + editor.i18n('Left') + '</option>' +
                            '<option value="center">' + editor.i18n('Center') + '</option>' +
                            '<option value="right">' + editor.i18n('Right') + '</option>' +
                        '</optgroup>' +
                    '</select>' +
                '</div>', editor.ownerDocument),

            mainTab: HTMLDivElement = <HTMLDivElement>dom('<div style="' + (!editor.options.image.editSrc ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label>' + editor.i18n('Src') + '</label>' +
                    '<div class="jodit_input_group">' +
                        '<input type="text" class="imageSrc"/>' +
                        ((editor.options.filebrowser.ajax.url || editor.options.uploader.url) ?
                        '<div class="jodit_input_group-buttons">' +
                            ((editor.options.filebrowser.ajax.url || editor.options.uploader.url) ? '<a class="jodit_button jodit_rechange" href="javascript:void(0)">' + ToolbarIcon.getIcon('image') + '</a>' : '') +
                            ((editor.options.image.useImageEditor && Jodit.modules.ImageEditor !== undefined && editor.options.filebrowser.ajax.url) ? '<a class="jodit_button jodit_use_image_editor" href="javascript:void(0)">' + ToolbarIcon.getIcon('crop') + '</a>' : '') +
                        '</div>' : '') +
                    '</div>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editTitle ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="imageTitle">' + editor.i18n('Title') + '</label>' +
                    '<input type="text" class="imageTitle"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editAlt ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="imageAlt">' + editor.i18n('Alternative') + '</label>' +
                    '<input type="text" class="imageAlt"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editLink ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="imageLink">' + editor.i18n('Link') + '</label>' +
                    '<input type="text" class="imageLink"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editLink ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<input type="checkbox" class="imageLinkOpenInNewTab"/> ' + editor.i18n('Open link in new tab') +
                '</div>', editor.ownerDocument),

            ratio: number = image.naturalWidth / image.naturalHeight || 1,

            $w: HTMLInputElement = <HTMLInputElement>prop.querySelector('.imageWidth'),
            $h: HTMLInputElement = <HTMLInputElement>prop.querySelector('.imageHeight'),

            updateAlign = () => {
                if (image.style.cssFloat && ['left', 'right'].indexOf(image.style.cssFloat.toLowerCase()) !== -1) {
                    val(prop, '.align', <string>css(image, 'float'));
                } else {
                    if (<string>css(image, 'display') === 'block' && image.style.marginLeft  === 'auto' && image.style.marginRight === 'auto') {
                        val(prop, '.align', 'center');
                    }
                }
            },
            updateBorderRadius = () => {
                val(prop, '.border_radius', (parseInt(image.style.borderRadius || '0', 10) || '0').toString());
            },
            updateId = () => {
                val(prop, '.id', image.getAttribute('id') || '');
            },

            updateStyle = () => {
                val(prop, '.style', image.getAttribute('style') || '');
            },

            updateClasses = () => {
                val(prop, '.classes', (image.getAttribute('class') || '').replace(/jodit_focused_image[\s]*/, ''));
            },

            updateMargins = () => {
                if (!editor.options.image.editMargins) {
                    return;
                }

                let notequal = false;

                $$('.margins', prop).forEach((elm: HTMLElement) => {
                    let id: string = elm.getAttribute('data-id') || '',
                        value: number | string = <string>(<any>image.style)[id];

                    if (!value) {
                        return;
                    }

                    if (/^[0-9]+(px)?$/.test(value)) {
                        value = parseInt(value, 10);
                    }

                    (<HTMLInputElement>elm).value = value.toString() || '';

                    if (!notequal && id !== 'marginTop' && (<HTMLInputElement>elm).value !== val(prop, '.marginTop')) {
                        notequal = true;
                    }
                });

                lockMargin = !notequal;
                let lock_margin: HTMLAnchorElement|null = prop.querySelector('.jodit_lock_margin');
                if (lock_margin) {
                    lock_margin.innerHTML = ToolbarIcon.getIcon(lockMargin ? 'lock' : 'unlock');
                }

                $$('.margins:not(.marginTop)', prop).forEach((elm:HTMLElement) => !lockMargin ? elm.removeAttribute('disabled') : elm.setAttribute('disabled', 'true'));

            },

            updateSizes = () => {
                $w.value = image.offsetWidth.toString();
                $h.value = image.offsetHeight.toString();
            },
            updateText = () => {
                if (image.hasAttribute('title')) {
                    val(prop, '.imageTitle', image.getAttribute('title') || '');
                }
                if (image.hasAttribute('alt')) {
                    val(prop, '.imageAlt', image.getAttribute('alt') || '');
                }

                let a: HTMLAnchorElement|null = <HTMLAnchorElement>Dom.closest(image, 'a', editor.editor);
                if (a) {
                    val(prop, '.imageLink', a.getAttribute('href') || '');
                    (<HTMLInputElement>prop.querySelector('.imageLinkOpenInNewTab')).checked = a.getAttribute('target') === '_blank';
                }
            },
            updateSrc = () => {
                val(prop, '.imageSrc', image.getAttribute('src') || '');
                let imageViewSrc: HTMLInputElement|null = prop.querySelector('.imageViewSrc');
                if (imageViewSrc) {
                    imageViewSrc.setAttribute('src', image.getAttribute('src') || '');
                }
            },

            update = () => {
                updateSrc();
                updateText();
                updateSizes();
                updateMargins();
                updateClasses();
                updateId();
                updateBorderRadius();
                updateAlign();
                updateStyle();
            };


        let timer: number,
            lockSize: boolean = true,
            lockMargin: boolean = true,
            tabs: {[key: string]: HTMLElement} = {},
            tabsbox: HTMLElement|null = prop.querySelector('.tabsbox');

        tabs[editor.i18n('Image')] = mainTab;
        tabs[editor.i18n('Advanced')] = positionTab;

        if (tabsbox) {
            tabsbox.appendChild(TabsWidget(editor, tabs));
        }

        update();

        editor.events.on(dialog, 'afterClose', () => {
            dialog.destruct();
            if (image.parentNode && editor.options.image.selectImageAfterClose) {
                editor.selection.select(image);
            }
        });

        buttons.remove.addEventListener('click', () => {
            if (image.parentNode) {
                image.parentNode.removeChild(image);
            }
            dialog.close();
        });
        if (editor.options.image.useImageEditor) {
            (<HTMLAnchorElement[]>$$('.jodit_use_image_editor', mainTab)).forEach((btn: HTMLAnchorElement) => {
                editor.events
                    .on(btn,'mousedown touchstart', () => {
                        const url: string = image.getAttribute('src') || '',
                            a: HTMLAnchorElement = editor.ownerDocument.createElement('a'),
                            loadExternal = () => {
                                if (a.host !== location.host) {
                                    Confirm(editor.i18n('You can only edit your own images. Download this image on the host?'), (yes: boolean) => {
                                        if (yes && editor.uploader) {
                                            editor.uploader.uploadRemoteImage(
                                                a.href.toString(),
                                                (resp: UploaderData) => {
                                                    Alert(editor.i18n('The image has been successfully uploaded to the host!'), () => {
                                                        if (typeof resp.newfilename === 'string') {
                                                            image.setAttribute('src', resp.baseurl + resp.newfilename);
                                                            updateSrc();
                                                        }
                                                    });
                                                },
                                                (error: Error) => {
                                                    Alert(editor.i18n('There was an error loading %s',  error.message));
                                                }
                                            );
                                        }
                                    });
                                    return;
                                }
                            };

                        a.href  = url;

                        (<FileBrowser>editor.getInstance('FileBrowser')).getPathByUrl(a.href.toString(), (path: string, name: string, source: string) => {

                            (<FileBrowser>editor.getInstance('FileBrowser'))
                                .openImageEditor(
                                    a.href,
                                    name,
                                    path,
                                    source,
                                    () => {
                                        const timestamp: number = (new Date()).getTime();
                                        image.setAttribute('src', url + (url.indexOf('?') !== -1 ? '' : '?') + '&_tmp=' + timestamp.toString());
                                        updateSrc();
                                    },
                                    (error: Error) => {
                                        Alert(error.message)
                                    }
                                );
                        }, (error: Error) => {
                            Alert(error.message, loadExternal);
                        });
                });
            });
        }


        (<HTMLAnchorElement[]>$$('.jodit_rechange', mainTab)).forEach((imagebtn: HTMLAnchorElement) => {
            imagebtn.addEventListener('mousedown', (e: MouseEvent) => {
                imagebtn.classList.toggle('active');
                const popup: ToolbarPopup = new ToolbarPopup(editor, imagebtn);
                popup.open(FileSelectorWidget(editor, {
                    upload: (data: FileBrowserCallBackData) => {
                        if (data.files && data.files.length) {
                            image.setAttribute('src', data.baseurl + data.files[0]);
                        }
                        update();
                        popup.close();
                    },
                    filebrowser: (data: FileBrowserCallBackData) => {
                        if (data && data.files && Array.isArray(data.files) && data.files.length) {
                            image.setAttribute('src', data.files[0]);
                            popup.close();
                            update();
                        }
                    }
                }, image, popup.close), true);
                e.stopPropagation();
            });
        });

        let jodit_lock_size: HTMLAnchorElement|null = prop.querySelector('.jodit_lock_helper.jodit_lock_size');
        let jodit_lock_margin: HTMLAnchorElement|null = prop.querySelector('.jodit_lock_helper.jodit_lock_margin');

        if (jodit_lock_size) {
            jodit_lock_size.addEventListener('click', function () {
                lockSize = !lockSize;
                this.innerHTML = ToolbarIcon.getIcon(lockSize ? 'lock' : 'unlock');
                editor.events.fire($w, 'change');
            });
        }

        if (jodit_lock_margin) {
            jodit_lock_margin.addEventListener('click', function () {
                lockMargin = !lockMargin;
                this.innerHTML = ToolbarIcon.getIcon(lockMargin ? 'lock' : 'unlock');
                if (!lockMargin) {
                    $$('.margins', prop).forEach((elm) => {if (!elm.matches('.marginTop')) elm.removeAttribute('disabled');})
                } else {
                    $$('.margins', prop).forEach((elm) => {if (!elm.matches('.marginTop')) elm.setAttribute('disabled', 'true');})
                }
            });
        }


        const changeSizes = (e: any) => {
            let w: number = parseInt($w.value, 10),
                h: number = parseInt($h.value, 10);
            
            if (e.target === $w) {
                $h.value = Math.round(w / ratio).toString();
            } else {
                $w.value = Math.round(h * ratio).toString();
            }
        };

        editor.events.on([$w, $h], 'change keydown mousedown paste', (e: any) => {
            if (!lockSize) {
                return;
            }

            if (editor.defaultTimeout) {
                clearTimeout(timer);
                timer = window.setTimeout(changeSizes.bind(this, e), editor.defaultTimeout);
            } else {
                changeSizes(e);
            }
        });

        dialog.setTitle([editor.i18n('Image properties'), buttons.remove]);

        dialog.setContent(prop);


        cancel.addEventListener('click', () => {
            dialog.close();
        });
        check.addEventListener('click', () => {
            // styles
            if (editor.options.image.editStyle) {
                if (val(prop, '.style')) {
                    image.setAttribute('style', val(prop, '.style'));
                } else {
                    image.removeAttribute('style');
                }
            }
            // Src
            if (val(prop, '.imageSrc')) {
                image.setAttribute('src', val(prop, '.imageSrc'));
            } else {
                if (image.parentNode) {
                    image.parentNode.removeChild(image);
                }
                dialog.close();
                return;
            }

            // Border radius

            if (val(prop, '.border_radius') !== '0' && /^[0-9]+$/.test(val(prop, '.border_radius'))) {
                image.style.borderRadius = val(prop, '.border_radius') + 'px';
            } else {
                image.style.borderRadius = '';
            }

            // Title
            if (val(prop, '.imageTitle')) {
                image.setAttribute('title',val(prop, '.imageTitle'));
            } else {
                image.removeAttribute('title');
            }

            // Alt
            if (val(prop, '.imageAlt')) {
                image.setAttribute('alt', val(prop, '.imageAlt'));
            } else {
                image.removeAttribute('alt');
            }

            // Link
            let link: HTMLAnchorElement|null = <HTMLAnchorElement>Dom.closest(image, 'a', editor.editor);

            if (val(prop, '.imageLink')) {
                if (!link) {
                    link = <HTMLAnchorElement>Dom.wrap(image, 'a', editor);
                }

                link.setAttribute('href', val(prop, '.imageLink'));
                if ((<HTMLInputElement>prop.querySelector('.imageLinkOpenInNewTab')).checked) {
                    link.setAttribute('target', '_blank');
                } else {
                    link.removeAttribute('target');
                }
            } else {
                if (link && link.parentNode) {
                    link.parentNode.replaceChild(image, link);
                }
            }

            const normalSize = (val: string): string => {
                val = trim(val);
                return (/^[0-9]+$/).test(val) ? val + 'px' : val;
            };

            // Size
            if ($w.value !== image.offsetWidth.toString() || $h.value !== image.offsetHeight.toString()) {
                css(image, {
                    width : trim($w.value) ? normalSize($w.value) : null,
                    height : trim($h.value) ? normalSize($h.value) : null
                });
            }


            if (editor.options.image.editMargins) {
                if (!lockMargin) {
                    (<HTMLInputElement[]>$$('.margins', prop)).forEach((margin: HTMLInputElement) => {
                        const id: string = margin.getAttribute('data-id') || '';
                        css(image, id, normalSize(margin.value));
                    });
                } else {
                    css(image, 'margin', normalSize(val(prop, '.marginTop')));
                }
            }

            if (editor.options.image.editClass) {
                if (val(prop, '.classes')) {
                    image.setAttribute('class', val(prop, '.classes'));
                } else {
                    image.removeAttribute('class');
                }
            }

            if (editor.options.image.editId) {
                if (val(prop, '.id')) {
                    image.setAttribute('id', val(prop, '.id'));
                } else {
                    image.removeAttribute('id');
                }
            }

            const clearCenterAlign = () => {
                if (css(image, 'display') === 'block') {
                    css(image, 'display', '');
                }
                if (image.style.marginLeft === 'auto' && image.style.marginRight === 'auto') {
                    image.style.marginLeft =  '';
                    image.style.marginRight =  '';
                }
            };

            if (editor.options.image.editAlign) {
                if (val(prop, '.align')) {
                    if (['right', 'left'].indexOf(val(prop, '.align').toLowerCase()) !== -1) {
                        css(image, 'float', val(prop, '.align'));
                        clearCenterAlign();
                    } else {
                        css(image, 'float', '');
                        css(image, {
                            'display': 'block',
                            'margin-left': 'auto',
                            'margin-right': 'auto'
                        });
                    }
                } else {
                    if (css(image, 'float') && ['right', 'left'].indexOf(css(image, 'float').toString().toLowerCase()) !== -1) {
                        css(image, 'float', '');
                    }
                    clearCenterAlign();
                }
            }

            if (!image.getAttribute('style')) {
                image.removeAttribute('style');
            }

            editor.setEditorValue();

            dialog.close();
        });

        dialog.setFooter([
            check,
            cancel
        ]);

        dialog.setSize(500);
        dialog.open();
        if (e) {
            e.preventDefault();
        }
        return false;
    };

    editor.events
        .on('afterInit', () => {
            if (editor.options.image.openOnDblClick) {
                editor.events.on(editor.editor, 'dblclick',  open, 'img');
            } else {
                editor.events.on(editor.editor, 'dblclick',  function (this: HTMLImageElement, event: MouseEvent) {
                    event.stopImmediatePropagation();
                    editor.selection.select(this);
                }, 'img');
            }
        })
        .on('openImageProperties', (image: HTMLImageElement) => {
            open.call(image);
        });
}
