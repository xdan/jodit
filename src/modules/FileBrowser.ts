import Jodit from '../jodit';
import Component from './Component';
import Dialog, {Confirm, Promt} from '../modules/Dialog';
import config from '../config'
import {$$, ajax, css, ctrlKey, debounce, dom, each, isPlainObject, offset, pathNormalize} from "./Helpers";
import Toolbar from "./Toolbar";
import ContextMenu from "./ContextMenu";
import Uploader from "./Uploader";
/**
 * The module creates a web browser dialog box . In a Web browser , you can select an image , remove , drag it . Upload new
 *
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-filebrowser-options.html|FileBrowser options}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-integrate-filebrowser-in-joomla.html|Integrate filebrowser in Joomla CMS}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-elfinder-integration.html|Integration with ElFinder}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-uploader-settings.html|Uploader options and Drag and Drop files}
 * @module FileBrowser
 * @see {@link module:Dialog|Dialog}
 * @params {Object} parent Jodit main object
 */

/**
 * @prop {object} filebrowser module settings {@link module:FileBrowser|FileBrowser}
 * @prop {int} filebrowser.howLongShowMsg=3000 How long to show an error message in the status bar (ms)
 * @prop {boolean} filebrowser.sort=function (a, b, sortBy, parent) { return b.changed - a.changed;} Items sort functions
 * @prop {boolean} filebrowser.sortBy='changed' Sort by field
 * @prop {boolean} filebrowser.filter=function (item, searchWord) { return item.name.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1} Filter items
 * @prop {boolean} filebrowser.showFileName=true Show filename in thumbs
 * @prop {boolean} filebrowser.showFileSize=true Show filesize in thumbs
 * @prop {boolean} filebrowser.showFileChangeTime=true Show the last modification time in thumbs

 * @prop {boolean} filebrowser.editImage=true use {@link module:ImageEditor|Image editor module} - crop and resize image
 * @prop {boolean} filebrowser.preview=true Show preview button in context menu
 * @prop {boolean} filebrowser.showPreviewNavigation=true Show navigation buttons in preview
 * @prop {boolean} filebrowser.showSelectButtonInPreview=true Show select button in preview
 * @prop {boolean} filebrowser.contextMenu=true use context menu
 * @prop {boolean} filebrowser.createNewFolder=true The ability to create a directory of the web browser
 * @prop {boolean} filebrowser.deleteFolder=true The ability to delete directories from the web browser
 * @prop {boolean} filebrowser.moveFolder=true The ability to move directories from the web browser
 * @prop {boolean} filebrowser.moveFile=true The ability to move file from the web browser
 * @prop {boolean} filebrowser.showFoldersPanel=true Show folders panel
 * @prop {px} filebrowser.width=763px The width of the web browser
 * @prop {px} filebrowser.height=400px The height of the file browser
 * @prop {array} filebrowser.buttons="['upload', 'remove', 'update', 'select', 'edit', 'tiles', 'list']" Toolbar browser
 * @example
 * var editor = new Jodit('#editor', {
 *     filebrowser: {
 *         buttons: ['upload', 'remove', 'update', {
 *             name: 'deleteall',
 *             icon: 'remove',
 *             exec: function () {
 *                 $files.find('a').each(function () {
 *                     remove(editor.filebrowser.currentPath, $(this).data('name'));
 *                 });
 *                 editor.filebrowser.loadTree();
 *             },
 *        }],
 *    }
 * })
 * @prop {function} filebrowser.isSuccess method to check - whether the response positive
 * @prop {function} filebrowser.getMsg method for receiving a message from the response
 * @example
 * new Jodit('#editor', {
 *     filebrowser: {
 *          isSuccess: function (resp) {
 *              return resp.status == 1;
 *          },
 *          getMsg: function (resp) {
 *              return resp.message;
 *          },
 *     }
 * })
 * @prop {string} filebrowser.view='tiles' Filelist view - `tiles` or `list`
 * @prop {object} filebrowser.ajax The default settings for AJAX connections to the server. Most of the settings like here {@link http://api.jquery.com/jQuery.ajax/|jQuery.ajax} but is not jQuery.ajax
 * @prop {function(data)} filebrowser.ajax.prepareData Method of preparation of data to be sent to the server
 * @prop {function(data)} filebrowser.ajax.process The method of processing the data obtained after administration of the server. Must return this PlainObject format `{
 * {
 *     files: resp.files || [], // {array} The names of files or folders, files can be ['image.jpg', 'image.jpg2', 'image3.jpg' ...] and [{file: 'image.jpg', thumb: '_thumbs/image.jpg'}, {file: 'image2.jpg', thumb: '_thumbs/image2.jpg'} ...]
 *     path: resp.path, // {string} Real relative path
 *     baseurl: resp.baseurl, // {string} Base url for filebrowser
 *     error: resp.error, // {int}
 *     msg: resp.msg // {string}
 * };`
 * @prop {string} filebrowser.ajax.url='' Address entry point on the server for AJAX connection
 * @prop {object} filebrowser.ajax.data={} Default data to send to the server
 * @prop {(json|text)} filebrowser.ajax.dataType='json' The format of the returned data
 * @prop {PlainObject} filebrowser.ajax.headers={} An object of additional header key/value pairs to send along with requests using the `XMLHttpRequest` transport. The header `X-Requested-With: XMLHttpRequest` is always added, but its default `XMLHttpRequest` value can be changed here.
 * @prop {object} filebrowser.resize Settings for AJAX connections to the server to resize image. By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
 * @prop {object} filebrowser.crop Settings for AJAX connections to the server to crop image. By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
 * @prop {object} filebrowser.create Settings for AJAX connections to the server to create the category . By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
 * @prop {object} filebrowser.move Settings for AJAX connections to the server for the moving image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=move
 * @prop {object} filebrowser.remove Settings for AJAX connections to the server to delete the image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=remove
 * @prop {object} filebrowser.folder Settings for AJAX connections to the server to download the list of categories . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=folder
 * @prop {object} filebrowser.items Settings for AJAX connections to the server to download the image list in the specified category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=items
 * @prop {object} filebrowser.uploader=null Settings Module {@link module:Jodit/Uploader|Uploader} for fast uploading images in category via Drag&Drop file in the file browser. The default settings of the module {@link module:Uploader|Uploader}
 * @example
 * // default values
 * {
 *     isSuccess: function (resp) {
 *         return !resp.error;
 *     },
 *     getMsg: function (resp) {
 *         return resp.msg;
 *     },
 *     ajax: {
 *         url: '',
 *         async: true,
 *         beforeSend: function () {
 *             return true;
 *         },
 *         data: {},
 *         contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
 *         headers : {},
 *         method : 'POST',
 *         processData  : true,
 *         dataType: 'json',
 *         headers: {},
 *         prepareData: function (data) {
 *             return data;
 *         },
 *         process: function (resp) {
 *             return {
 *                 files: resp.files || [],
 *                 path: resp.path,
 *                 baseurl: resp.baseurl,
 *                 error: resp.error,
 *                 msg: resp.msg
 *             };
 *         }
 *     },
 *     resize: {
 *         data: {action: 'resize'},
 *     },
 *     crop: {
 *         data: {action: 'crop'},
 *     },
 *     create: {
 *         data: {action: 'create'},
 *     },
 *     move: {
 *         data: {action: 'move'},
 *     },
 *     remove: {
 *         data: {action: 'remove'},
 *     },
 *     items: {
 *         data: {action: 'items'},
 *     },
 *     folder: {
 *         data: {action: 'folder'},
 *     },
 *     uploader: null // use default Uploader's settings
 * }
 * @example
 * new Jodit('#editor2', {
 *         filebrowser: {
 *             isSuccess: function (resp) {
 *                 return resp.length !== 0;
 *             },
 *             getMsg: function (resp) {
 *                 return resp;
 *             },
 *             ajax: {
 *                 url: 'ajax.php',
                   method: 'GET',
 *                 dataType: 'text',
 *                 headers: {
 *                     'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
 *                 },
 *                 data: {
 *                     someparameter: 1
 *                 },
 *                 prepareData: function (data) {
 *                     data.someparameter++;
 *                     return data;
 *                 },
 *                 process: function (resp) {
 *                     return resp.split('|'); // return items list
 *                 },
 *             }
 *         }
 *     })
 * @example
 * new Jodit('#jodit', {
 *        uploader: {
 *            url: 'connector/upload.php',
 *            baseurl: 'images/'
 *        },
 *        filebrowser: {
 *            create: {
 *                url: 'connector/create.php',
 *            },
 *            move: {
 *                url: 'connector/move.php',
 *            },
 *            remove: {
 *                url: 'connector/remove.php',
 *            },
 *            items: {
 *                url: 'connector/items.php',
 *            },
 *            folder: {
 *                url: 'connector/tree.php',
 *            }
 *        }
 *    });
 * @memberof Jodit.defaultOptions
 */
config.filebrowser = {
    filter: function (item, search) {
        search = search.toLowerCase();
        if (typeof item === 'string') {
            return item.toLowerCase().indexOf(search) !== -1;
        }
        if (typeof item.name === 'string') {
            return item.name.toLowerCase().indexOf(search) !== -1;
        }
        if (typeof item.file === 'string') {
            return item.file.toLowerCase().indexOf(search) !== -1;
        }
        return true;
    },

    sortBy: 'changed',

    sort: function (a, b, sortBy, parent) {
        var compareStr = function (f, s) {
                if (f < s) {
                    return -1;
                }
                if (f > s) {
                    return 1;
                }
                return 0;
            },
            first,
            second;

        if (typeof a === 'string') {
            return compareStr(a.toLowerCase(), b.toLowerCase());
        }

        if (a[sortBy] === undefined || sortBy === 'name') {
            if (typeof a.name === 'string') {
                return compareStr(a.name.toLowerCase(), b.name.toLowerCase());
            }
            if (typeof a.file === 'string') {
                return compareStr(a.file.toLowerCase(), b.file.toLowerCase());
            }
            return 0;
        }
        switch (sortBy) {
        case 'changed':
            first = new Date(a.changed);
            second = new Date(b.changed);

            return second - first;
        case 'size':
            return parent.helper.humanSizeToBytes(a.size) - parent.helper.humanSizeToBytes(b.size);
        }
    },

    editImage: true,
    preview: true,
    showPreviewNavigation: true,
    showSelectButtonInPreview: true,
    contextMenu: true,

    howLongShowMsg: 3000,

    createNewFolder: true,
    deleteFolder: true,
    moveFolder: true,
    moveFile: true,
    showFoldersPanel: true,

    width: 763,
    height: 400,
    buttons: ['upload', 'remove', 'update', 'select', 'edit', 'tiles', 'list', 'filter', 'sort'],

    view: 'tiles',

    isSuccess: function (resp) {
        return !resp.error;
    },
    getMsg: function (resp) {
        return resp.msg;
    },

    showFileName: true,
    showFileSize: true,
    showFileChangeTime: true,

    getThumbTemplate: function (item, path, baseurl) {
        var name, thumb, info, options = this.options.filebrowser, timestamp = (new Date()).getTime();

        if (typeof item === 'string') {
            name = item;
            thumb = item;
        } else {
            if (item.file !== undefined) {
                name = item.file;
                thumb = item.file;
            }
            if (item.thumb) {
                thumb = item.thumb;
            }
        }

        info = '<div class="jodit_filebrowser_files_item-info">' +
            (options.showFileName ? '<span class="jodit_filebrowser_files_item-info-filename">' + name + '</span>' : '') +
            ((options.showFileSize && item.size) ? '<span class="jodit_filebrowser_files_item-info-filesize">' + item.size + '</span>' : '') +
            ((options.showFileChangeTime && item.changed) ? '<span class="jodit_filebrowser_files_item-info-filesize">' + item.changed + '</span>' : '') +
            '</div>';

        return '<a class="jodit_filebrowser_files_item" href="' + this.helper.urlNormalize(baseurl + path +  name) + '" data-path="' + this.helper.pathNormalize(path ? path + '/' : '/') + '" data-name="' + name + '" title="' + name + '" data-url="' + this.helper.urlNormalize(baseurl + path + name) + '">' +
                '<img src="' + this.helper.urlNormalize(baseurl + path + thumb) + '?_tmst=' + timestamp + '" alt="' + name + '">' +
                ((options.showFileName || (options.showFileSize && item.size) || (options.showFileChangeTime && item.changed)) ? info : '') +
            '</a>';
    },

    ajax: {
        url: '',
        async: true,
        beforeSend: function () {
            return true;
        },
        data: {},
        cache : true,
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',

        type : 'POST',
        processData  : true,
        dataType: 'json',

        headers: {},

        prepareData: function (data) {
            return data;
        },

        process: function (resp) {
            return {
                files: resp.files || [],
                path: resp.path,
                baseurl: resp.baseurl,
                error: resp.error,
                msg: resp.msg
            };
        }
    },
    create: {
        data: {action: 'create'},
    },
    getfilebyurl: {
        data: {action: 'getfilebyurl'},
    },
    resize: {
        data: {action: 'resize'},
    },
    crop: {
        data: {action: 'crop'},
    },
    move: {
        data: {action: 'move'},
    },
    remove: {
        data: {action: 'remove'},
    },
    items: {
        data: {action: 'items'},
    },
    folder: {
        data: {action: 'folder'},
    },
    uploader: null // use default Uploader's settings
}
export default class FileBrowser extends Component {
        options;
        currentPath = ''
        private currentBaseUrl = ''

        dialog: Dialog;
        loader: Element;
        browser: Element;
        statusline: Element;
        tree: Element;
        files: Element;

        buttons;

        uploader;

        constructor(editor: Jodit) {
            super(editor);
            const self = this;

            self.options = self.parent.options.filebrowser;
            self.dialog = new Dialog(editor, {
                fullsizeButton: true
            })
            self.loader = dom('<div class="jodit_filebrowser_loader"><i class="jodit_icon-loader"></i></div>')
            self.browser = dom('<div class="jodit_filebrowser non-selected">' +
                (self.options.showFoldersPanel ? '<div class="jodit_filebrowser_tree"></div>' : '') +
                '<div class="jodit_filebrowser_files"></div>' +
                '<div class="jodit_filebrowser_status"></div>' +
             '</div>');
            self.statusline = self.browser.querySelector('.jodit_filebrowser_status');



            self.buttons = {
                upload : dom('<div class="jodit_uploadfile_button jodit_button">' + Toolbar.getIcon('plus') + '<input type="file" accept="image/*" tabindex="-1" dir="auto" multiple=""/></div>'),
                remove : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('bin') + '</div>'),
                update : dom('<div class="jodit_button">' + Toolbar.getIcon('update') + '</div>'),
                select : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('check') + '</div>'),
                edit : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('pencil') + '</div>'),
                addfolder : dom('<a class="jodit_button addfolder" href="javascript:void(0)">' + Toolbar.getIcon('plus') + ' Folder</div>'),
                tiles : dom('<div class="jodit_button jodit_button_tiles disabled" href="javascript:void(0)">' + Toolbar.getIcon('th') + '</div>'),
                list : dom('<div class="jodit_button disabled" href="javascript:void(0)">' + Toolbar.getIcon('th-list') + '</div>'),
                filter: dom('<input class="jodit_input" type="text" placeholder="' + editor.i18n('Filter') + '"/>'),

                sort: dom('<select class="jodit_input">' +
                    '<option value="changed">' + editor.i18n('Sort by changed') + '</option>' +
                    '<option value="name">' + editor.i18n('Sort by name') + '</option>' +
                    '<option value="size">' + editor.i18n('Sort by size') + '</option>' +
                    '</select>'),
            }


            self.tree = self.browser.querySelector('.jodit_filebrowser_tree')
            self.files = self.browser.querySelector('.jodit_filebrowser_files')

            self.__on([self.buttons.tiles, self.buttons.list], 'click', (event: Event) => {
                let target = <Element>event.target;
                if (target.classList.contains('jodit_button_tiles')) {
                    self.view = 'tiles';
                    self.buttons.list.classList.add('disabled');
                } else {
                    self.view = 'list';
                    self.buttons.tiles.classList.add('disabled');
                }

                target.classList.remove('disabled');
                self.files.classList.remove('jodit_filebrowser_files_view-tiles', 'jodit_filebrowser_files_view-list');
                self.files.classList.add('jodit_filebrowser_files_view-' + self.view);

                editor.cookie.set('jodit_filebrowser_view', self.view, 31);
            })

            self.__on(self.buttons.sort, 'change', () => {
                self.sortBy = self.buttons.sort.val();
                editor.cookie.set('jodit_filebrowser_sortby', self.sortBy, 31);
                self.generateItemsBox();
            })

            self.__on(self.buttons.sort, 'click mousedown', (e) => {
                e.stopPropagation();
            });


            self
                .__on(self.buttons.filter, 'click mousedown', (e) => {
                    e.stopPropagation();
                })
                .__on(self.buttons.filter, 'keydown', debounce(() => {
                    self.filterWord = self.buttons.filter.val();
                    self.generateItemsBox();
                }, 300));

            self.__on(self.buttons.remove, 'click', () => {
                if ($$('>a.active', self.files).length) {
                    Confirm(editor.i18n('Are you shure?'), '', (yes) => {
                        if (yes) {
                            $$('>a.active', self.files).forEach((a) => {
                                self.remove(self.currentPath, a.dataset.name);
                            });
                            self.someSelectedWasChanged();
                            self.loadTree(self.currentPath);
                        }
                    });
                }
            });

            self.__on(self.buttons.edit, 'click', () => {
                let files = $$('>a.active', self.files);
                if (files.length === 1) {
                    self.openImageEditor(files[0].getAttribute('href'), files[0].dataset.name);
                }
            });

            self.__on(self.buttons.update, 'click', () => {
                self.loadTree();
            });

            self
                .__on(self.tree, 'click', 'a>i.remove', function (e)  {
                    let a = this.parentNode, path = a.dataset.path;
                    Confirm(editor.i18n('Are you shure?'), '', (yes) => {
                        if (yes) {
                            self.remove(path, a.dataset.name);
                            self.loadTree(self.currentPath);
                        }
                    });
                    e.stopImmediatePropagation();
                    return false;
                })
                .__on(self.tree, 'click', 'a', function () {
                    if (this.classList.contains('addfolder')) {
                        Promt(self.parent.i18n('Enter Directory name'), self.parent.i18n('Create directory'), (name) => {
                            self.create(name, self.currentPath);
                        }, self.parent.i18n('type name'));
                    } else {
                        self.loadTree(this.dataset.path);
                    }
                })
                .__on(this.tree, 'dragstart', 'a', function () {
                    self.dragger = this;
                })
                .__on(this.tree, 'drop',  'a', function () {
                    if (self.options.moveFolder && self.dragger) {
                        let path = self.dragger.dataset.path;

                        //move folder
                        if (!self.options.moveFolder && self.dragger.classList.contains('jodit_filebrowser_tree_item')) {
                            return false;
                        }

                        //move file
                        if (self.dragger.classList.contains('jodit_filebrowser_files_item')) {
                            path += self.dragger.dataset.name;
                            if (!self.options.moveFile) {
                                return false;
                            }
                        }

                        self.move(path, this.dataset.path);
                    }
                });

            const contextmenu = new ContextMenu(this.parent);
            self
                .__on(self.files, 'mousedown', 'a>img', function (this: HTMLElement, e) {
                    self.client.x = e.clientX;
                    self.client.y = e.clientY;

                    self.start = offset(this);

                    self.draggble = <Element>this.cloneNode(true);

                    css(<Element>self.draggble, {
                        'z-index': 100000000000000,
                        position: 'fixed',
                        display: 'none',
                        left: self.start.left,
                        top: self.start.top,
                        width: this.offsetWidth,
                        height: this.offsetHeight
                    });

                    document.body.appendChild(self.draggble)
                })
                .__on(self.files, 'dragstart', 'a', function (this: HTMLElement, e) {
                    self.dragger = this;
                    e.originalEvent.dataTransfer.setData('text/plain', this.getAttribute('href'));
                    e.stopPropagation();
                })
                .__on(self.files, 'contextmenu', 'a', function (this: HTMLElement, e) {
                    if (self.options.contextMenu) {
                        let item = this;
                        contextmenu.show(e.pageX, e.pageY, [
                            self.options.editImage && Jodit.modules.ImageEditor !== undefined ? {
                                icon: 'pencil',
                                title: 'Edit',
                                exec: () => {
                                    self.openImageEditor(item.getAttribute('href'), item.dataset.name);
                                }
                            } : false,
                            {
                                icon: 'bin',
                                title: 'Delete',
                                exec: () => {
                                    self.remove(self.currentPath, item.dataset.name);
                                    self.someSelectedWasChanged();
                                    self.loadTree(self.currentPath);
                                }
                            },
                            self.options.preview ? {
                                icon: 'eye',
                                title: 'Preview',
                                exec: () => {
                                    let preview = new Dialog(self.parent),
                                        temp_content: HTMLElement = dom('<div class="jodit_filebrowser_preview"><i class="jodit_icon-loader"></i></div>'),
                                        src = item.getAttribute('href'),
                                        selectBtn = self.buttons.select.cloneNode(true),
                                        image = document.createElement('img'),
                                        addLoadHandler = () => {
                                            let onload = function () {
                                                this.removeEventListener('load', <EventListenerOrEventListenerObject>onload);
                                                temp_content.innerHTML = '';
                                                if (self.options.showPreviewNavigation) {
                                                    let next = dom('<a href="javascript:void(0)" class="jodit_filebrowser_preview_navigation jodit_filebrowser_preview_navigation-next">' + Toolbar.getIcon('angle-right') + '</a>'),
                                                        prev = dom('<a href="javascript:void(0)" class="jodit_filebrowser_preview_navigation jodit_filebrowser_preview_navigation-prev">' + Toolbar.getIcon('angle-left') + '</a>');

                                                    if (item.previousSibling) {
                                                        temp_content.appendChild(item.previousSibling);
                                                    }
                                                    if (item.nextSibling) {
                                                        temp_content.appendChild(item.nextSibling);
                                                    }

                                                    self.__on([next, prev], 'click', function (this: HTMLElement, e) {
                                                        if (this.classList.contains('jodit_filebrowser_preview_navigation-next')) {
                                                            item = <HTMLElement>item.nextSibling;
                                                        } else {
                                                            item = <HTMLElement>item.previousSibling;
                                                        }
                                                        temp_content.innerHTML = '<i class="jodit_icon-loader"></i>';
                                                        src = item.getAttribute('href');
                                                        image.setAttribute('src', src);
                                                        addLoadHandler();
                                                    });
                                                }

                                                temp_content.appendChild(image);
                                                preview.setPosition();
                                            };

                                            image.addEventListener("load", onload)
                                            if (image.complete) {
                                                onload.call(this);
                                            }
                                        }

                                    addLoadHandler();
                                    image.setAttribute('src', src);
                                    preview.setContent(temp_content);

                                    if (self.options.showSelectButtonInPreview) {
                                        selectBtn.removeAttr('disabled');
                                        preview.setTitle(selectBtn);
                                        selectBtn.on('click', function () {
                                            self.files.querySelector('a.active').classList.add('active');
                                            item.classList.add('active');
                                            self.buttons.select.trigger('click');
                                            preview.close();
                                        });
                                    }

                                    preview.open();
                                }
                            } : false,
                            {
                                icon: 'upload',
                                title: 'Download',
                                exec: function () {
                                    window.open(item.getAttribute('href'));
                                }
                            }
                        ]);
                        return false;
                    }
                })
                .__on(self.files, 'click', (e) => {
                    if (!ctrlKey(e)) {
                        $$('>a', self.files).forEach((elm: HTMLElement) => {
                            elm.classList.remove('active');
                        })
                        self.someSelectedWasChanged();
                    }
                })
                .__on(self.files, 'click', 'a', function (this: HTMLElement,e) {
                    if (!ctrlKey(e)) {
                        $$('>a', self.files).forEach((elm: HTMLElement) => {
                            elm.classList.remove('active');
                        })
                    }
                    this.classList.toggle('active');
                    self.someSelectedWasChanged();
                    e.stopPropagation();
                    return false;
                })
                .__on(document, 'dragover', function (e) {
                    if (self.isOpened() && self.draggble && e.originalEvent.clientX !== undefined) {
                        css(self.draggble, {
                            left: e.originalEvent.clientX + 20,
                            top: e.originalEvent.clientY + 20,
                            display: 'block'
                        });
                    }
                })
                .__on(window, 'keydown', (e) => {
                    if (self.isOpened() && e.which === 46) {
                        //TODO
                        //self.buttons.remove.trigger('click');
                    }
                })
                .__on(window, 'mouseup dragend',() => {
                    if (self.draggble) {
                        self.draggble.parentNode.removeChild(self.draggble)
                        self.draggble = false;
                    }
                });

            this.dialog.setSize(this.options.width, this.options.height);

            this.options.getfilebyurl = {...this.options.ajax, ...this.options.getfilebyurl};
            this.options.crop = {...this.options.ajax, ...this.options.crop};
            this.options.resize = {...this.options.ajax, ...this.options.resize};
            this.options.create = {...this.options.ajax, ...this.options.create};
            this.options.move = {...this.options.ajax, ...this.options.move};
            this.options.remove = {...this.options.ajax, ...this.options.remove};
            this.options.folder = {...this.options.ajax, ...this.options.folder};
            this.options.items = {...this.options.ajax, ...this.options.items};
        }

        view = 'tiles'
        sortBy = 'changed'

        /**
         * Get base url. You can use this method in another modules
         *
         * @method getBaseUrl
         */
        getBaseUrl () {
            return this.currentBaseUrl;
        }

        dragger:false|HTMLElement = false




        isOpened () {
            return this.dialog.isOpened() && !this.browser.matches(':hidden');
        }
        statustimer = 0

        /**
         * It displays a message in the status bar of filebrowser
         *
         * @method status
         * @param {string} msg Message
         * @param {boolean} [success] true It will be shown a message light . If no option is specified , an error will be shown the red
         * @example
         * parent.filebrowser.status('There was an error uploading file', false);
         */
        status (msg, success?: boolean) {
            clearTimeout(this.statustimer);
            this.statusline
                .classList.remove('success')
            this.statusline
                .classList.add('active')
            this.statusline.innerHTML = msg

            if (success) {
                this.statusline
                    .classList.add('success');
            }
            this.statustimer = setTimeout(() => {
                this.statusline
                    .classList.remove('active')
            }, this.options.howLongShowMsg);
        }

        generateFolderTree(tree: string[], path: string) {
            let folders = [];
            tree.forEach((name: string) => {
                let $folder = dom('<a class="jodit_filebrowser_tree_item" href="javascript:void(0)" data-path="' + pathNormalize(path + name) + '/"><span>' + name + '</span></a>');
                folders.push($folder);
                if (this.options.deleteFolder && name !== '..' && name !== '.') {
                    $folder.append(dom('<i class="remove" data-path="' + pathNormalize(path + name + '/') + '">&times;</i>'));
                }
            });
            this.tree.innerHTML = folders.join('');
            if (this.options.createNewFolder) {
                this.tree.appendChild(this.buttons.addfolder);
            }
        }

        currentItems
        currentItemsPath
        currentItemsBaseurl
        filterWord = ''

        generateItemsBox(items = null, path = '' , baseurl = '') {

            if (items === null && this.currentItems !== undefined) {
                items = this.currentItems;
                path = this.currentItemsPath;
                baseurl = this.currentItemsBaseurl;
            }

            if (items === undefined) {
                items = [];
            }

            let images = [],
                tmpl = this.options.getThumbTemplate;

            if (typeof this.options.sort === 'function') {
                items.sort((a, b) => {
                    return this.options.sort(a, b, this.sortBy, parent);
                });
            }

            each(items, (i, item) => {
                if (this.options.filter === undefined ||this.options.filter(item, this.filterWord)) {
                    images.push(tmpl.call(parent, item, path, baseurl));
                }
            });

            this.files.innerHTML = images.join('');

            this.currentItems = items;
            this.currentItemsPath = path;
            this.currentItemsBaseurl = baseurl;
        }

        someSelectedWasChanged() {
            let actives = $$('>a.active', this.files);
            this.buttons.remove.classList.toggle('disabled', !actives.length);
            this.buttons.select.classList.toggle('disabled', !actives.length);
            this.buttons.edit.classList.toggle('disabled', actives.length !== 1);
        }

        xhr2: XMLHttpRequest;
        send(name, success, error) {
            let xhr, opts = {...this.options[name] !== undefined ? this.options[name] : this.options.ajax};
            opts.data = opts.prepareData(opts.data);
            xhr = ajax(opts);
            xhr.done(success);
            xhr.error(error);
            return xhr;
        }

        /**
         * Get path by url. You can use this method in another modules
         *
         * @method getPathByUrl
         * @param {string} full url
         * @param {function} success
         * @param {string} success.path path to file from connector's root (without filename)
         * @param {string} success.name filename
         * @param {function} failed filename
         * @param {string} failed.message
         */
        getPathByUrl = (url, success, failed) => {
            let action = 'getfilebyurl';
            this.options[action].data.url = url;
            this.send(action, (resp) => {
                if (this.options.isSuccess(resp)) {
                    success(resp.path, resp.name);
                } else {
                    failed(this.options.getMsg(resp));
                }
            }, (resp)  => {
                failed(this.options.getMsg(resp));
            });
        }
        loadItems = (path?: string) => {
            if (path) {
                this.options.items.data.path = path;
            } else {
                path = this.options.items.data.path || '';
            }
            if (this.options.items.url) {
                this.files.classList.add('active');
                this.files.appendChild(this.loader.cloneNode(true));

                if (this.xhr2.abort) {
                    this.xhr2.abort();
                }
                this.xhr2 = this.send('items', (resp) => {
                    let data = this.options.items.process.call(this, resp);
                    this.currentBaseUrl = data.baseurl;
                    this.generateItemsBox(data.files, data.path, data.baseurl);
                    this.someSelectedWasChanged();
                }, (error) => {
                    this.status(this.parent.i18n('Error on load list'));
                });
            }
        }

        xhr: XMLHttpRequest;
        loadTree(path?: string) {
            if (path) {
                this.options.folder.data.path = path;
            }

            this.currentPath = path;
            if (this.uploader) {
                this.uploader.setPath(this.currentPath);
            }

            if (this.options.showFoldersPanel) {
                if (this.options.folder.url) {
                    this.tree.classList.add('active');
                    this.tree.innerHTML = '';
                    this.tree.appendChild(this.loader.cloneNode(true));
                    if (this.xhr.abort) {
                        this.xhr.abort();
                    }
                    this.xhr = this.send('folder', (resp) => {
                        let data = this.options.folder.process.call(this, resp);
                        this.currentPath = data.path;
                        this.generateFolderTree(data.files, data.path);
                    }, () => {
                        this.status(this.parent.i18n('Error on load folders'));
                    });
                } else {
                    this.tree.classList.remove('active');
                }
            }

            this.loadItems(path);
        }

        /**
         * Create a directory on the server
         *
         * @method create
         * @param {string} name Name the new folder
         * @param {string} path Relative to the directory in which you want to create a folder
         */
        create = (name, path) => {
            this.options.create.data.path = path;
            this.options.create.data.name = name;
            this.send('create', (resp) => {
                if (this.options.isSuccess(resp)) {
                    this.loadTree(path);
                } else {
                    this.status(this.options.getMsg(resp));
                }
            }, (error) => {
                this.status(error);
            });
        }

        /**
         * Move a file / directory on the server
         *
         * @method move
         * @param {string} filepath The relative path to the file / folder source
         * @param {string} path Relative to the directory where you want to move the file / folder
         */
        move = (filepath, path) => {
            this.options.move.data.filepath = filepath;
            this.options.move.data.path = path;
            this.send('move', (resp) => {
                if (this.options.isSuccess(resp)) {
                    this.loadTree(path);
                } else {
                    this.status(this.options.getMsg(resp));
                }
            }, (error) => {
                this.status(error);
            });
        }

        /**
         * Deleting a file / directory on the server
         *
         * @method remove
         * @param {string} path Relative to the directory
         * @param {string} file The filename
         */
        remove(path, file) {
            this.options.remove.data.path = path;
            this.options.remove.data.target = file;
            this.send('remove', (resp) => {
                resp = this.options.remove.process.call(self, resp);
                if (!this.options.isSuccess(resp)) {
                    this.status(this.options.getMsg(resp));
                } else {
                    this.someSelectedWasChanged();
                    this.status(this.options.getMsg(resp), true);
                }
            }, (error) => {
                this.status(error);
            });
        }

        /**
         * Close dialog
         * @method close
         */
        close() {
            this.dialog.close();
        }
        onSelect(callback) {
            return () => {
                let actives = $$('>a.active', this.files);
                if (actives.length) {
                    let urls = [];
                    actives.forEach((elm) => {
                        urls.push(elm.dataset.url);
                    });
                    this.close();
                    if (typeof callback === 'function') {
                        callback({
                            baseurl: '',
                            files: urls
                        });
                    }
                }
                return false;
            };
        }

        /**
         * It opens a web browser window
         *
         * @method open
         * @param {function(imagelist)} callback The function that will be called after the file selection in the browser
         * @example
         * var fb = new Jodit.modules.FileBrowser(parent);
         * fb.open(function (images) {
         *     var i;
         *     for (i = 0;i < images.length; i += 1) {
         *         parent.selection.insertImage(images[i]);
         *     }
         * });
         */
        open = (callback) => {
            if (this.options.items.url) {
                this
                    .__off(this.files, 'dblclick')
                    .__on(this.files, 'dblclick', '>a', this.onSelect(callback))

                this
                    .__off(this.buttons.select, 'click')
                    .__on(this.buttons.select, 'click', this.onSelect(callback))

                this.loadTree(this.currentPath);


                let header = [
                        '<span class="jodit_dialog_header_title">' + this.parent.i18n('File Browser') + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '</span>'
                    ],
                    i,
                    button;

                for (i = 0; i < this.options.buttons.length; i += 1) {
                    if (this.buttons[this.options.buttons[i]] !== undefined && ((this.options.editImage && Jodit.modules.ImageEditor !== undefined) || this.options.buttons[i] !== 'edit')) {
                        header.push(this.buttons[this.options.buttons[i]]);
                    } else {
                        if (typeof this.options.buttons[i] === 'function') {
                            header.push(this.options.buttons[i].call(parent));
                        } else if (isPlainObject(this.options.buttons[i]) && this.options.buttons[i].exec && this.options.buttons[i].name) {
                            button = dom('<div class="jodit_button">' + Toolbar.getIcon(this.options.buttons[i].icon || this.options.buttons[i].name) + '</div>');
                            header.push(button);
                            button.addEventListener('click', this.options.buttons[i].exec);
                        }
                    }
                }
                this.dialog.open(this.browser, header);
            }
        }

        errorHandler = (resp) => {
            this.status(this.options.getMsg(resp));
        }

        uploadHandler = (data, resp) => {
            if (this.options.isSuccess(resp)) {
                this.status(this.parent.i18n('Files [1$] was uploaded', data.files.join(',')), true);
            } else {
                this.status(this.options.getMsg(resp));
            }
            this.loadItems();
        }

        init () {
            this.view = this.options.view === 'list' ? 'list' : 'tiles';
            if (this.parent.cookie.get('jodit_filebrowser_view')) {
                this.view = this.parent.cookie.get('jodit_filebrowser_view') === 'list' ? 'list' : 'tiles';
            }
            this.buttons[this.view].classList.remove('disabled');
            this.files.classList.add('jodit_filebrowser_files_view-' + this.view);

            this.sortBy = (['changed', 'name', 'size']).indexOf(this.options.sortBy) !== -1 ? this.options.sortBy : 'changed';
            if (this.parent.cookie.get('jodit_filebrowser_sortby')) {
                this.sortBy = (['changed', 'name', 'size']).indexOf(this.parent.cookie.get('jodit_filebrowser_sortby')) !== -1 ? this.parent.cookie.get('jodit_filebrowser_sortby') : 'changed';
            }
            this.buttons.sort.valuse = this.sortBy;

            this.currentBaseUrl = $$('base', this.parent.doc).length ? $$('base', this.parent.doc)[0].getAttribute('href') : location.protocol + '//' + location.host;
            if (Jodit.modules.Uploader !== undefined) {
                this.uploader = new Uploader(this.parent, {...this.parent.options.uploader, ...this.options.uploader});
                this.uploader.setPath(this.currentPath);
                this.uploader.bind(this.browser, this.uploadHandler, this.errorHandler);
                this.uploader.bind(this.buttons.upload, this.uploadHandler, this.errorHandler);
            }
        }

        /**
         * Open Image Editor
         *
         * @method openImageEditor
         * @param {string} href Full url for edited image
         * @param {string} name Filename for edited image
         * @param {string} [pth] Path for edited image
         */
        openImageEditor = function (href: string, name: string, pth?: string, onSuccess?: Function, onFailed?: Function) {
            if (this.parent.imageeditor) {
                this.parent.imageeditor.open(href, (newname, box, success, failed) => {
                    if (this.options[box.action] === undefined) {
                        this.options[box.action] = {};
                    }
                    if (this.options[box.action].data === undefined) {
                        this.options[box.action].data = {
                            action: box.action
                        };
                    }

                    this.options[box.action].data.newname = newname;
                    this.options[box.action].data.box = box.box;
                    this.options[box.action].data.path = pth || this.currentPath;
                    this.options[box.action].data.file = name;

                    this.send(box.action, (resp) => {
                        if (this.options.isSuccess(resp)) {
                            this.loadTree();
                            success();
                            if (onSuccess) {
                                onSuccess();
                            }
                        } else {
                            failed(this.options.getMsg(resp));
                            if (onFailed) {
                                onFailed(this.options.getMsg(resp));
                            }
                        }
                    }, (resp) => {
                        failed(this.options.getMsg(resp));
                        if (onFailed) {
                            onFailed(this.options.getMsg(resp));
                        }
                    });
                });
            }
        }
        draggble: Element|false = false
        start = {top: 0, left: 0}
        client = {x: 0, y: 0}
}
