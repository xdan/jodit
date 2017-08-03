import Jodit from '../Jodit';
import {Config} from '../Config'
import {$$, css, dom, trim, val} from "../modules/Helpers";
import {Alert, Confirm, default as Dialog} from "../modules/Dialog";
import Toolbar from "../modules/Toolbar";
//import {} from "../modules/Widget";
import FileBrowser, {FileBrowserCallBcackData} from "../modules/FileBrowser";
import Dom from "../modules/Dom";
import {UploaderData} from "../modules/Uploader";
import {Widget} from "../modules/Widget";
import TabsWidget = Widget.TabsWidget;
import ImageSelectorWidget = Widget.ImageSelectorWidget;
/**
 * Plug-in for image editing window
 *
 * @module Image
 */
/**
 * @prop {object} image Plugin {@link module:Image|Image}'s options
 * @prop {boolean} image.openOnDblClick=true Open editing dialog after double click on image
 * @prop {boolean} image.editSrc=true Show edit 'src' input
 * @prop {boolean} image.useImageEditor=true Show crop/resize btn
 * @prop {boolean} image.editTitle=true Show edit 'title' input
 * @prop {boolean} image.editAlt=true Show edit 'alt' input
 * @prop {boolean} image.editLink=true Show edit image link's options
 * @prop {boolean} image.editSize=true Show edit image size's inputs
 * @prop {boolean} image.editMargins=true Show edit margin inputs
 * @prop {boolean} image.editStyle=true Show style edit input
 * @prop {boolean} image.editClass=true Show edit classNames input
 * @prop {boolean} image.editId=true Show edit ID input
 * @prop {boolean} image.editAlign=true Show Alignment selector
 * @prop {boolean} image.showPreview=true Show preview image
 * @prop {boolean} image.selectImageAfterClose=true Select image after close dialog
 * @memberof Jodit.defaultOptions
 * @example
 * var editor = new Jodit('#editor', {
 *     image: {
 *         editSrc: false,
 *         editLink: false
 *     }
 * });
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
     editMargins: true,
     editClass: true,
     editStyle: true,
     editId: true,
     editAlign: true,
     showPreview: true,
     selectImageAfterClose: true,
};

Jodit.plugins.imageProperties = function (editor: Jodit) {
    /**
     * Open dialog editing image properties
     *
     * @method open
     * @static
     * @memberof module:Image
     * @this HTMLImageElement
     * @example
     * var editor = new Jodit('#editor');
     *     img = editor.doc.createElement('img');
     *
     * img.setAttribute('src', 'images/someimage.png');
     * editor.{@link Selection~select|select}(img);
     * // open the properties of the editing window
     * editor.plugins.image.open.call(img); // `this` must be HTMLImageElement
     */
    const open = function (e ?: MouseEvent) {
        const image = <HTMLImageElement>this,
            dialog: Dialog = new Dialog(editor),
            cancel: HTMLElement = dom('<a href="javascript:void(0)" style="float:right;" class="jodit_button">' + Toolbar.getIcon('cancel') + '<span>' + editor.i18n('Cancel') + '</span></a>'),
            check: HTMLElement  = dom('<a href="javascript:void(0)" style="float:left;" class="jodit_button">' + Toolbar.getIcon('check') + '<span>' +  editor.i18n('Ok') + '</span></a>'),

            buttons = {
                remove: dom('<a href="javascript:void(0)" class="jodit_button">' + Toolbar.getIcon('bin') + ' ' + editor.i18n('Delete') + '</a>')
            },


            prop: HTMLDivElement = <HTMLDivElement>dom('<form class="jodit_properties">' +
                    '<div class="jodit_grid">' +
                        '<div class="jodit_col-lg-2-5">' +
                            '<div class="jodit_properties_view_box">' +
                                '<div style="' + (!editor.options.image.showPreview ? 'display:none' : '') + '" class="jodit_properties_image_view">' +
                                    '<img id="imageViewSrc" src="" alt=""/>' +
                                '</div>' +
                                '<div style="' + (!editor.options.image.editSize ? 'display:none' : '') + '" class="jodit_form_group jodit_properties_image_sizes">' +
                                    '<input type="number" id="imageWidth"/>' +
                                    '<a class="jodit_lock_helper jodit_lock_size" href="javascript:void(0)">' +
                                        Toolbar.getIcon('lock') +
                                    '</a>' +
                                    '<input type="number" id="imageHeight"/>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div id="tabsbox" class="jodit_col-lg-3-5"></div>' +
                    '</div>' +
                '</form>'),

            positionTab: HTMLDivElement = <HTMLDivElement>dom('<div style="' + (!editor.options.image.editMargins ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="marginTop">' + editor.i18n('Margins') + '</label>' +
                    '<div class="jodit_grid">' +
                        '<input class="jodit_col-lg-1-5 margins" type="text" placeholder="' + editor.i18n('top') + '" id="marginTop"/>' +
                        '<a style="text-align: center;" class="jodit_lock_helper jodit_lock_margin jodit_col-lg-1-5" href="javascript:void(0)">' +
                            Toolbar.getIcon('lock') +
                        '</a>' +
                        '<input disabled="true" class="jodit_col-lg-1-5 margins" type="text" placeholder="' + editor.i18n('right') + '" id="marginRight"/>' +
                        '<input disabled="true" class="jodit_col-lg-1-5 margins" type="text" placeholder="' + editor.i18n('bottom') + '" id="marginBottom"/>' +
                        '<input disabled="true" class="jodit_col-lg-1-5 margins" type="text" placeholder="' + editor.i18n('left') + '" id="marginLeft"/>' +
                    '</div>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editStyle ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="style">' + editor.i18n('Styles') + '</label>' +
                    '<input type="text" id="style"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editClass ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="classes">' + editor.i18n('Classes') + '</label>' +
                    '<input type="text" id="classes"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editId ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="id">Id</label>' +
                    '<input type="text" id="id"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editAlign ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="align">' + editor.i18n('Align') + '</label>' +
                    '<select class="select"  id="align">' +
                        '<option value="">' + editor.i18n('--Not Set--') + '</option>' +
                            '<option value="left">' + editor.i18n('Left') + '</option>' +
                            '<option value="center">' + editor.i18n('Center') + '</option>' +
                            '<option value="right">' + editor.i18n('Right') + '</option>' +
                        '</optgroup>' +
                    '</select>' +
                '</div>'),
            mainTab: HTMLDivElement = <HTMLDivElement>dom('<div style="' + (!editor.options.image.editSrc ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="imageSrc">' + editor.i18n('Src') + '</label>' +
                    '<div class="jodit_input_group">' +
                        '<input type="text" id="imageSrc"/>' +
                        ((editor.options.filebrowser.ajax.url || editor.options.uploader.url) ?
                        '<div class="jodit_input_group-buttons">' +
                            ((editor.options.filebrowser.ajax.url || editor.options.uploader.url) ? '<a class="jodit_button jodit_rechange" href="javascript:void(0)">' + Toolbar.getIcon('image') + '</a>' : '') +
                            ((editor.options.image.useImageEditor && Jodit.modules.ImageEditor !== undefined && editor.options.filebrowser.ajax.url) ? '<a class="jodit_button jodit_use_image_editor" href="javascript:void(0)">' + Toolbar.getIcon('crop') + '</a>' : '') +
                        '</div>' : '') +
                    '</div>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editTitle ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="imageTitle">' + editor.i18n('Title') + '</label>' +
                    '<input type="text" id="imageTitle"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editAlt ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="imageAlt">' + editor.i18n('Alternative') + '</label>' +
                    '<input type="text" id="imageAlt"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editLink ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<label for="imageLink">' + editor.i18n('Link') + '</label>' +
                    '<input type="text" id="imageLink"/>' +
                '</div>' +
                '<div style="' + (!editor.options.image.editLink ? 'display:none' : '') + '" class="jodit_form_group">' +
                    '<input type="checkbox" id="imageLinkOpenInNewTab"/> ' + editor.i18n('Open link in new tab') +
                '</div>'),
            ratio: number = image.naturalWidth / image.naturalHeight || 1,

            $w: HTMLInputElement = <HTMLInputElement>prop.querySelector('#imageWidth'),
            $h: HTMLInputElement = <HTMLInputElement>prop.querySelector('#imageHeight'),

            updateAlign = () => {
                if (image.style.cssFloat && ['left', 'right'].indexOf(image.style.cssFloat.toLowerCase()) !== -1) {
                    val(prop, '#align', css(image, 'float'));
                } else {
                    if (css(image, 'display') === 'block' && image.style.marginLeft  === 'auto' && image.style.marginRight === 'auto') {
                        val(prop, '#align', 'center');
                    }
                }
            },

            updateId = () => {
                val(prop, '#id', image.getAttribute('id'));
            },

            updateStyle = () => {
                val(prop, '#style', image.getAttribute('style'));
            },

            updateClasses = () => {
                val(prop, '#classes', (image.getAttribute('class') || '').replace(/jodit_focused_image[\s]*/, ''));
            },

            updateMargins = () => {
                if (!editor.options.image.editMargins) {
                    return;
                }
                let notequal = false;
                $$('.margins', prop).forEach((elm: HTMLInputElement) => {
                    let value: number|string = <string>image.style[elm.id];
                    if (!value) {
                        return;
                    }
                    if (/^[0-9]+$/.test(value) || /^[0-9]+px$/i.test(value)) {
                        value = parseInt(value, 10);
                    }
                    elm.value = value.toString() || '';
                    if (!notequal && elm.id !== 'marginTop' && elm.value !== val(prop, '#marginTop')) {
                        prop.querySelector('.jodit_lock_margin').innerHTML = Toolbar.getIcon('unlock');
                        $$('.margins', prop).forEach((elm:HTMLElement) => elm.classList.remove('disabled'));
                        notequal = true;
                    }
                });
            },

            updateSizes = () => {
                $w.value = image.offsetWidth.toString();
                $h.value = image.offsetHeight.toString();
            },
            updateText = () => {
                if (image.hasAttribute('title')) {
                    val(prop, '#imageTitle', image.getAttribute('title'));
                }
                if (image.hasAttribute('alt')) {
                    val(prop, '#imageAlt', image.getAttribute('alt'));
                }
                if (Dom.closest(image, 'a', editor.editor)) {
                    val(prop, '#imageLink', (<HTMLAnchorElement>Dom.closest(image, 'a', editor.editor)).getAttribute('href'));
                    (<HTMLInputElement>prop.querySelector('#imageLinkOpenInNewTab')).checked = (<HTMLAnchorElement>Dom.closest(image, 'a', editor.editor)).getAttribute('target') === '_blank';
                }
            },
            updateSrc = () => {
                val(prop, '#imageSrc', image.getAttribute('src'));
                prop.querySelector('#imageViewSrc').setAttribute('src', image.getAttribute('src'));
            },

            update = () => {
                updateSrc();
                updateText();
                updateSizes();
                updateMargins();
                updateClasses();
                updateId();
                updateAlign();
                updateStyle();
            };


        let timer,
            lockSize = true,
            lockMargin = true,
            tabs = {};

        tabs[editor.i18n('Image')] = mainTab;
        tabs[editor.i18n('Advansed')] = positionTab;
        prop.querySelector('#tabsbox').appendChild(TabsWidget(editor, tabs));

        update();

        editor.events.on(dialog, 'afterClose', () => {
            dialog.destruct();
            if (image.parentNode && editor.options.image.selectImageAfterClose) {
                editor.selection.select(image);
            }
        });

        buttons.remove.addEventListener('click', () => {
            image.parentNode.removeChild(image);
            dialog.close();
        });

        $$('.jodit_use_image_editor', mainTab).forEach((btn) => {
            btn.addEventListener('mousedown', () => {
                if (editor.options.image.useImageEditor) {
                    let url = image.getAttribute('src'),
                        a = document.createElement('a'),
                        loadExternal = () => {
                            if (a.host !== location.host) {
                                Confirm(editor.i18n('You can only edit your own images. Download this image on the host?'), (yes) => {
                                    if (yes && editor.uploader) {
                                        editor.uploader.uploadRemoteImage(a.href.toString(), (resp: UploaderData) => {
                                            Alert(editor.i18n('The image has been successfully uploaded to the host!'), () => {
                                                if (typeof resp.newfilename === 'string') {
                                                    image.setAttribute('src', resp.baseurl + resp.newfilename);
                                                    updateSrc();
                                                }
                                            });
                                        }, (error) => {
                                            Alert(editor.i18n('There was an error loading %s',  error.message));
                                        });
                                    }
                                });
                                return;
                            }
                        };

                    a.href = url;

                    (<FileBrowser>editor.getInstance('FileBrowser')).getPathByUrl(a.href.toString(), (path: string, name: string, source: string) => {
                        (<FileBrowser>editor.getInstance('FileBrowser')).openImageEditor(a.href, name, path, source, () => {
                            let timestamp = (new Date()).getTime();
                            image.setAttribute('src', url + (url.indexOf('?') !== -1 ? '' : '?') + '&_tmp=' + timestamp);
                            updateSrc();
                        }, Alert);
                    }, (message) => {
                        Alert(message, loadExternal);
                    });
                }
            });
        });


        $$('.jodit_rechange', mainTab).forEach((imagebtn: HTMLAnchorElement) => {
            imagebtn.addEventListener('mousedown', (e: MouseEvent) => {
                imagebtn.classList.toggle('active');
                editor.toolbar.openPopup(imagebtn, ImageSelectorWidget(editor, {
                    upload: (data: FileBrowserCallBcackData) => {
                        if (data.files && data.files.length) {
                            image.setAttribute('src', data.baseurl + data.files[0]);
                        }
                        update();
                        editor.toolbar.closeAll();
                    },
                    filebrowser: (data: FileBrowserCallBcackData) => {
                        if (data && data.files && Array.isArray(data.files) && data.files.length) {
                            image.setAttribute('src', data.files[0]);
                            editor.toolbar.closeAll();
                            update();
                        }
                    }
                }, image), true);
                e.stopPropagation();
            });
        });

        prop.querySelector('.jodit_lock_helper.jodit_lock_size').addEventListener('click', function () {
            lockSize = !lockSize;
            this.innerHTML = Toolbar.getIcon(lockSize ? 'lock' : 'unlock');
            editor.__fire($w, 'change');
        });

        prop.querySelector('.jodit_lock_helper.jodit_lock_margin').addEventListener('click', function () {
            lockMargin = !lockMargin;
            this.innerHTML = Toolbar.getIcon(lockMargin ? 'lock' : 'unlock');
            if (!lockMargin) {
                $$('.margins', prop).forEach((elm) => {if (!elm.matches('#marginTop')) elm.removeAttribute('disabled');})
            } else {
                $$('.margins', prop).forEach((elm) => {if (!elm.matches('#marginTop')) elm.setAttribute('disabled', 'true');})
            }
        });

        editor.__on($$('#imageWidth,#imageHeight', prop), 'change keydown mousedown paste', (e: any) => {
            if (!lockSize) {
                return;
            }
            clearTimeout(timer);
            timer = setTimeout(() => {
                let w = parseInt($w.value, 10),
                    h = parseInt($h.value, 10);
                if (e.target.getAttribute('id') === 'imageWidth') {
                    $h.value = Math.round(w / ratio).toString();
                } else {
                    $w.value = Math.round(h * ratio).toString();
                }
            }, 100);
        });

        dialog.setTitle([editor.i18n('Image properties'), buttons.remove]);

        dialog.setContent(prop);


        cancel.addEventListener('click', () => {
            dialog.close();
        });
        check.addEventListener('click', () => {
            let link;
            // styles
            if (editor.options.image.editStyle) {
                if (val(prop, '#style')) {
                    image.setAttribute('style', val(prop, '#style'));
                } else {
                    image.removeAttribute('style');
                }
            }
            // Src
            if (val(prop, '#imageSrc')) {
                image.setAttribute('src', val(prop, '#imageSrc'));
            } else {
                image.parentNode.removeChild(image);
                dialog.close();
                return;
            }

            // Title
            if (val(prop, '#imageTitle')) {
                image.setAttribute('title',val(prop, '#imageTitle'));
            } else {
                image.removeAttribute('title');
            }

            // Alt
            if (val(prop, '#imageAlt')) {
                image.setAttribute('alt', val(prop, '#imageAlt'));
            } else {
                image.removeAttribute('alt');
            }

            // Link
            if (val(prop, '#imageLink')) {
                if (!Dom.closest(image, 'a', editor.editor)) {
                    Dom.wrap(image, 'a', editor);
                }
                link = Dom.closest(image, 'a', editor.editor);
                link.setAttribute('href', val(prop, '#imageLink'));
                if ((<HTMLInputElement>prop.querySelector('#imageLinkOpenInNewTab')).checked) {
                    link.setAttribute('target', '_blank');
                } else {
                    link.removeAttribute('target');
                }
            } else {
                if (Dom.closest(image, 'a', editor.editor)) {
                    link = Dom.closest(image, 'a', editor.editor);
                    link.parentNode.replaceChild(image, link);
                }
            }

            const normalSize = (val) => {
                val = trim(val);
                return (/^[0-9]+$/).test(val) ? val + 'px' : val;
            };

            // Size

            css(image, {
                width : trim($w.value) ? normalSize($w.value) : null,
                height : trim($h.value) ? normalSize($h.value) : null
            });

            if (editor.options.image.editMargins) {
                if ((<HTMLElement>prop.querySelector('.jodit_lock_margin').firstChild).classList.contains('jodit_icon_unlock')) {
                    $$('.margins', prop).forEach(function () {
                        css(image, this.id, normalSize(this.value));
                    });
                } else {
                    css(image, 'margin', normalSize(val(prop, '#marginTop')));
                }
            }

            if (editor.options.image.editClass) {
                if (val(prop, '#classes')) {
                    image.setAttribute('class', val(prop, '#classes'));
                } else {
                    image.removeAttribute('class');
                }
            }

            if (editor.options.image.editId) {
                if (val(prop, '#id')) {
                    image.setAttribute('id', val(prop, '#id'));
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
                if (val(prop, '#align')) {
                    if (['right', 'left'].indexOf(val(prop, '#align').toLowerCase()) !== -1) {
                        css(image, 'float', val(prop, '#align'));
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
                    if (css(image, 'float') && ['right', 'left'].indexOf(css(image, 'float').toLowerCase()) !== -1) {
                        css(image, 'float', '');
                    }
                    clearCenterAlign();
                }
            }

            if (!image.getAttribute('style')) {
                image.removeAttribute('style');
            }

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

    if (editor.options.image.openOnDblClick) {
        editor.__on(editor.editor, 'dblclick', 'img', open);
    } else {
        editor.__on(editor.editor, 'dblclick', 'img', function () {
            editor.selection.select(this);
        });
    }

    editor.events.on(editor, 'openImageProperties', (image: HTMLImageElement) => {
        open.call(image);
    });
};