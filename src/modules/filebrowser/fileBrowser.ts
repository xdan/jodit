/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config, OptionsDefault } from '../../Config';
import * as consts from '../../constants';
import { Ajax } from '../Ajax';
import { ContextMenu } from '../ContextMenu';
import { Dialog } from '../dialog/dialog';
import { Alert } from '../dialog/alert';
import { Confirm } from '../dialog/confirm';
import { Promt } from '../dialog/promt';
import { ToolbarIcon } from '../toolbar/icon';

import {
    IFileBrowser,
    IFileBrowserAjaxOptions,
    IFileBrowserAnswer,
    IFileBrowserCallBackData,
    IFileBrowserOptions,
    ISource,
    ISourceFile,
    ISourcesFiles,
} from '../../types/fileBrowser';

import { ActionBox, IPermissions } from '../../types/types';
import { IUploader, IUploaderOptions } from '../../types/uploader';
import { ImageEditor } from '../ImageEditor';
import { LocalStorageProvider } from '../storage/localStorageProvider';
import { Storage } from '../storage/storage';
import { each } from '../helpers/each';
import { normalizePath, normalizeRelativePath } from '../helpers/normalize/';
import { $$ } from '../helpers/selector';
import { ctrlKey } from '../helpers/ctrlKey';
import { extend } from '../helpers/extend';
import { setTimeout } from '../helpers/async/setTimeout';
import { ViewWithToolbar } from '../view/viewWithToolbar';
import { IJodit } from '../../types';
import './config';

export const ITEM_CLASS = 'jodit_filebrowser_files_item';
const DEFAULT_SOURCE_NAME = 'default';

export class FileBrowser extends ViewWithToolbar implements IFileBrowser {
    /**
     * Return default timeout period in milliseconds for some debounce or throttle functions. By default return {observer.timeout} options
     *
     * @return {number}
     */
    get defaultTimeout(): number {
        return this.jodit && this.jodit !== this
            ? this.jodit.defaultTimeout
            : Config.defaultOptions.observer.timeout;
    }

    private loader: HTMLElement;
    private browser: HTMLElement;
    private status_line: HTMLElement;

    private tree: HTMLElement;
    private files: HTMLElement;

    private __currentPermissions: IPermissions | null = null;

    private view: string = 'tiles';
    private sortBy: string = 'changed';

    private dragger: false | HTMLElement = false;

    private statustimer: number;

    private filterWord: string = '';

    private onlyImages: boolean = false;

    private generateFolderTree(sources: ISourcesFiles) {
        const folders: string[] = [];

        each<ISource>(sources, (source_name, source) => {
            if (source_name && source_name !== DEFAULT_SOURCE_NAME) {
                folders.push(
                    '<div class="jodit_filebrowser_source_title">' +
                        source_name +
                        '</div>'
                );
            }

            source.folders.forEach((name: string) => {
                let folder: string =
                    '<a draggable="draggable" ' +
                    'class="jodit_filebrowser_tree_item" ' +
                    'href="javascript:void(0)" ' +
                    'data-path="' +
                    normalizePath(source.path + name) +
                    '/" ' +
                    'data-source="' +
                    source_name +
                    '">' +
                    '<span>' +
                    name +
                    '</span>';

                if (
                    this.options.deleteFolder &&
                    name !== '..' &&
                    name !== '.'
                ) {
                    folder +=
                        '<i class="remove" data-path="' +
                        normalizePath(source.path + name + '/') +
                        '">&times;</i>';
                }

                folder += '</a>';

                folders.push(folder);
            });

            if (this.options.createNewFolder && this.canI('FolderCreate')) {
                folders.push(
                    '<a class="jodit_button addfolder" href="javascript:void(0)" data-path="' +
                        normalizePath(source.path + name) +
                        '/" data-source="' +
                        source_name +
                        '">' +
                        ToolbarIcon.getIcon('plus') +
                        ' ' +
                        this.i18n('Add folder') +
                        '</a>'
                );
            }
        });

        this.tree.innerHTML = folders.join('');
    }

    private generateItemsBox(sources: ISourcesFiles) {
        const files: string[] = [];

        each<ISource>(sources, (source_name, source) => {
            if (source_name && source_name !== DEFAULT_SOURCE_NAME) {
                files.push(
                    `<div class="jodit_filebrowser_source_title">${source_name +
                        (source.path ? ' - ' + source.path : '')}</div>`
                );
            }

            if (source.files && source.files.length) {
                if (typeof this.options.sort === 'function') {
                    source.files.sort((a: ISourceFile, b: ISourceFile) => {
                        return this.options.sort(a, b, this.sortBy);
                    });
                }

                source.files.forEach((item: ISourceFile) => {
                    if (
                        this.options.filter === undefined ||
                        this.options.filter(item, this.filterWord)
                    ) {
                        if (
                            !this.onlyImages ||
                            item.isImage === undefined ||
                            item.isImage
                        ) {
                            files.push(
                                this.options.getThumbTemplate.call(
                                    this,
                                    item,
                                    source,
                                    source_name.toString()
                                )
                            );
                        }
                    }
                });
            } else {
                files.push(`<div>${this.i18n('There are no files')}</div>`);
            }
        });

        this.files.innerHTML = files.join('');
    }

    private someSelectedWasChanged() {
        this.events.fire('changeSelection');
    }

    /**
     *
     * @param {string} name
     * @param {Function} success
     * @param {Function} error
     * @return {Promise}
     */
    private send(
        name: string,
        success: (resp: IFileBrowserAnswer) => void,
        error: (error: Error) => void
    ): Promise<void> {
        const opts: IFileBrowserAjaxOptions = extend(
            true,
            {},
            this.options.ajax,
            this.options[name] !== undefined
                ? this.options[name]
                : this.options.ajax
        );

        if (opts.prepareData) {
            opts.data = opts.prepareData.call(this, opts.data);
        }

        const ajax: Ajax = new Ajax(this.jodit || this, opts);

        return ajax
            .send()
            .then(success)
            .catch(error);
    }

    private loadItems = (path: string, source: string): Promise<void> => {
        const self: FileBrowser = this;

        if (!self.options.items) {
            return Promise.reject('Set Items api options');
        }

        self.options.items.data.path = path;
        self.options.items.data.source = source;

        self.files.classList.add('active');
        self.files.appendChild(self.loader.cloneNode(true));

        return self.send(
            'items',
            resp => {
                let process:
                    | ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
                    | undefined = (self.options.items as any).process;
                if (!process) {
                    process = this.options.ajax.process;
                }

                if (process) {
                    const respData: IFileBrowserAnswer = process.call(
                        self,
                        resp
                    ) as IFileBrowserAnswer;
                    self.generateItemsBox(respData.data.sources);
                    self.someSelectedWasChanged();
                }
            },
            (error: Error) => {
                Alert(error.message);
                self.errorHandler(error);
            }
        );
    };

    private loadPermissions(path: string, source: string): Promise<void> {
        const self: FileBrowser = this;

        if (!self.options.permissions) {
            return Promise.resolve();
        }

        self.options.permissions.data.path = path;
        self.options.permissions.data.source = source;

        if (self.options.permissions.url) {
            return self.send(
                'permissions',
                (resp: IFileBrowserAnswer) => {
                    let process:
                        | ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
                        | undefined = (self.options.permissions as any).process;
                    if (!process) {
                        process = this.options.ajax.process;
                    }

                    if (process) {
                        const respData: IFileBrowserAnswer = process.call(
                            self,
                            resp
                        ) as IFileBrowserAnswer;
                        if (respData.data.permissions) {
                            this.__currentPermissions =
                                respData.data.permissions;
                        }
                    }
                },
                (error: Error) => {
                    Alert(error.message);
                    self.errorHandler(error);
                }
            );
        } else {
            return Promise.resolve();
        }
    }
    private loadTree(path: string, source: string): Promise<any> {
        path = normalizeRelativePath(path);
        return this.loadPermissions(path, source).then(() => {
            const self: FileBrowser = this;

            if (!self.options.folder) {
                return Promise.reject('Set Folder Api options');
            }

            self.options.folder.data.path = path;
            self.options.folder.data.source = source;

            if (self.uploader) {
                self.uploader.setPath(path);
                self.uploader.setSource(source);
            }

            const tree: Array<Promise<void>> = [];

            if (self.options.showFoldersPanel) {
                if (self.options.folder.url) {
                    self.tree.classList.add('active');
                    self.tree.innerHTML = '';
                    self.tree.appendChild(self.loader.cloneNode(true));

                    tree.push(
                        this.send(
                            'folder',
                            resp => {
                                let process:
                                    | ((
                                          resp: IFileBrowserAnswer
                                      ) => IFileBrowserAnswer)
                                    | undefined = (self.options.folder as any)
                                    .process;
                                if (!process) {
                                    process = this.options.ajax.process;
                                }
                                if (process) {
                                    const respData = process.call(
                                        self,
                                        resp
                                    ) as IFileBrowserAnswer;
                                    self.generateFolderTree(
                                        respData.data.sources
                                    );
                                }
                            },
                            () => {
                                self.errorHandler(
                                    new Error(
                                        self.jodit.i18n('Error on load folders')
                                    )
                                );
                            }
                        )
                    );
                } else {
                    self.tree.classList.remove('active');
                }
            }

            tree.push(this.loadItems(path, source));

            return Promise.all(tree);
        });
    }

    private onSelect(callback: (data: IFileBrowserCallBackData) => void) {
        return () => {
            const actives = this.getActiveElements();

            if (actives.length) {
                const urls: string[] = [];
                actives.forEach((elm: HTMLElement) => {
                    const url: string | null = elm.getAttribute('data-url');
                    url && urls.push(url);
                });

                this.close();

                if (typeof callback === 'function') {
                    callback({
                        baseurl: '',
                        files: urls,
                    } as IFileBrowserCallBackData);
                }
            }

            return false;
        };
    }

    private errorHandler = (resp: Error | IFileBrowserAnswer) => {
        if (resp instanceof Error) {
            this.status(this.i18n(resp.message));
        } else {
            this.status(this.options.getMessage(resp));
        }
    };

    private uploadHandler = () => {
        this.loadItems(this.currentPath, this.currentSource);
    };
    public options: IFileBrowserOptions;

    public currentPath: string = '';
    public currentSource: string = DEFAULT_SOURCE_NAME;
    public currentBaseUrl: string = '';

    public dialog: Dialog;

    /**
     * Container for set/get value
     * @type {Storage}
     */
    public storage: Storage = new Storage(new LocalStorageProvider());

    public uploader: IUploader;

    public canI(action: string): boolean {
        return (
            this.__currentPermissions === null ||
            (this.__currentPermissions['allow' + action] === undefined ||
                this.__currentPermissions['allow' + action])
        );
    }

    /**
     *
     * @return {boolean}
     */
    public isOpened(): boolean {
        return this.dialog.isOpened() && this.browser.style.display !== 'none';
    }

    /**
     * It displays a message in the status bar of filebrowser
     *
     * @method status
     * @param {string} message Message
     * @param {boolean} [success] true It will be shown a message light . If no option is specified ,
     * ßan error will be shown the red
     * @example
     * ```javascript
     * parent.filebrowser.status('There was an error uploading file', false);
     * ```
     */
    public status(message: string, success?: boolean) {
        clearTimeout(this.statustimer);
        this.status_line.classList.remove('success');

        this.status_line.classList.add('active');

        this.status_line.innerHTML = message;

        if (success) {
            this.status_line.classList.add('success');
        }

        this.statustimer = setTimeout(() => {
            this.status_line.classList.remove('active');
        }, this.options.howLongShowMsg);
    }

    public getActiveElements(): HTMLElement[] {
        return $$(':scope>a.active', this.files);
    }

    /**
     * Get path by url. You can use this method in another modules
     *
     * @method getPathByUrl
     * @param {string} url Full url
     * @param {function} success
     * @param {string} success.path path toWYSIWYG file from connector's root (without filename)
     * @param {string} success.name filename
     * @param {function} onFailed filename
     * @param {string} onFailed.message
     */
    public getPathByUrl = (
        url: string,
        success: (path: string, name: string, source: string) => void,
        onFailed: (error: Error) => void
    ): Promise<any> => {
        const action: string = 'getLocalFileByUrl',
            self: FileBrowser = this;

        this.options[action].data.url = url;
        return this.send(
            action,
            (resp: IFileBrowserAnswer) => {
                if (self.options.isSuccess(resp)) {
                    success(resp.data.path, resp.data.name, resp.data.source);
                } else {
                    onFailed(new Error(this.options.getMessage(resp)));
                }
            },
            (resp: Error) => {
                onFailed(resp);
            }
        );
    };

    /**
     * Create a directory on the server
     *
     * @method create
     * @param {string} name Name the new folder
     * @param {string} path Relative toWYSIWYG the directory in which you want toWYSIWYG create a folder
     * @param {string} source Server source key
     */
    createFolder = (
        name: string,
        path: string,
        source: string
    ): Promise<void> => {
        if (!this.options.create) {
            return Promise.reject('Set Create api options');
        }

        this.options.create.data.source = source;
        this.options.create.data.path = path;
        this.options.create.data.name = name;

        return this.send(
            'create',
            resp => {
                if (this.options.isSuccess(resp)) {
                    this.currentPath = path;
                    this.currentSource = source;
                    this.loadTree(path, source);
                } else {
                    this.status(this.options.getMessage(resp));
                }
            },
            (error: Error) => {
                this.status(error.message);
            }
        );
    };

    /**
     * Move a file / directory on the server
     *
     * @method move
     * @param {string} filepath The relative path toWYSIWYG the file / folder source
     * @param {string} path Relative toWYSIWYG the directory where you want toWYSIWYG move the file / folder
     * @param {string} source Source
     */
    move = (filepath: string, path: string, source: string, isFile: boolean): Promise<void> => {
        const mode: 'fileMove' | 'folderMove' = isFile ? 'fileMove' : 'folderMove';

        const option = this.options[mode];
        if (!option) {
            return Promise.reject('Set Move api options');
        }

        option.data.from = filepath;
        option.data.path = path;
        option.data.source = source;

        return this.send(
            isFile ? 'fileMove' : 'folderMove',
            resp => {
                if (this.options.isSuccess(resp)) {
                    this.loadTree(path, source);
                } else {
                    this.status(this.options.getMessage(resp));
                }
            },
            (error: Error) => {
                this.status(error.message);
            }
        );
    };

    /**
     * Deleting a file
     *
     * @param path Relative path
     * @param file The filename
     * @param source Source
     */
    fileRemove(path: string, file: string, source: string): Promise<void> {
        if (!this.options.fileRemove) {
            return Promise.reject('Set fileRemove api options');
        }

        this.options.fileRemove.data.path = path;
        this.options.fileRemove.data.name = file;
        this.options.fileRemove.data.source = source;

        return this.send(
            'fileRemove',
            (resp: IFileBrowserAnswer) => {
                if (this.options.remove && this.options.remove.process) {
                    resp = this.options.remove.process.call(this, resp);
                }
                if (!this.options.isSuccess(resp)) {
                    this.status(this.options.getMessage(resp));
                } else {
                    this.someSelectedWasChanged();
                    this.status(this.options.getMessage(resp), true);
                }
            },
            (error: Error) => {
                this.status(error.message);
            }
        );
    }

    /**
     * Deleting a folder
     *
     * @param path Relative path
     * @param file The filename
     * @param source Source
     */
    folderRemove(path: string, file: string, source: string): Promise<void> {
        if (!this.options.folderRemove) {
            return Promise.reject('Set folderRemove api options');
        }

        this.options.folderRemove.data.path = path;
        this.options.folderRemove.data.name = file;
        this.options.folderRemove.data.source = source;

        return this.send(
            'folderRemove',
            (resp: IFileBrowserAnswer) => {
                if (this.options.remove && this.options.remove.process) {
                    resp = this.options.remove.process.call(this, resp);
                }
                if (!this.options.isSuccess(resp)) {
                    this.status(this.options.getMessage(resp));
                } else {
                    this.someSelectedWasChanged();
                    this.status(this.options.getMessage(resp), true);
                }
            },
            (error: Error) => {
                this.status(error.message);
            }
        );
    }

    /**
     * Close dialog
     * @method close
     */
    close = () => {
        this.dialog.close();
    };

    /**
     * It opens a web browser window
     *
     * @param {Function} callback The function that will be called after the file selection in the browser
     * @param {boolean} [onlyImages=false] Show only images
     * @example
     * ```javascript
     * var fb = new Jodit.modules.FileBrowser(parent);
     * fb.open(function (data) {
     *     var i;
     *     for (i = 0;i < data.files.length; i += 1) {
     *         parent.selection.insertImage(data.baseurl + data.files[i]);
     *     }
     * });
     * ```
     * @return Promise
     */
    open = (
        callback: (data: IFileBrowserCallBackData) => void,
        onlyImages: boolean = false
    ): Promise<void> => {
        this.onlyImages = onlyImages;
        this.buffer.fileBrowserOnlyImages = onlyImages;

        return new Promise(resolve => {
            if (!this.options.items || !this.options.items.url) {
                throw new Error('Need set options.filebrowser.ajax.url');
            }

            let localTimeout: number = 0;

            this.events
                .off(this.files, 'dblclick')
                .on(this.files, 'dblclick', this.onSelect(callback), 'a')
                .on(
                    this.files,
                    'touchstart',
                    () => {
                        const now: number = new Date().getTime();
                        if (
                            now - localTimeout <
                            consts.EMULATE_DBLCLICK_TIMEOUT
                        ) {
                            this.onSelect(callback)();
                        }
                        localTimeout = now;
                    },
                    'a'
                )
                .off('select.filebrowser')
                .on('select.filebrowser', this.onSelect(callback));

            const header = this.create.div();

            this.toolbar.build(this.options.buttons, header);

            this.dialog.dialogbox_header.classList.add(
                'jodit_filebrowser_title_box'
            );
            this.dialog.open(this.browser, header);

            this.events.fire('sort.filebrowser', this.sortBy);

            this.loadTree(this.currentPath, this.currentSource).then(resolve);
        });
    };

    /**
     * Open Image Editor
     *
     * @method openImageEditor
     */
    openImageEditor = (
        href: string,
        name: string,
        path: string,
        source: string,
        onSuccess?: () => void,
        onFailed?: (error: Error) => void
    ): Promise<Dialog> => {
        return (this.getInstance('ImageEditor') as ImageEditor).open(
            href,
            (
                newname: string | void,
                box: ActionBox,
                success: () => void,
                failed: (error: Error) => void
            ) => {
                if (this.options[box.action] === undefined) {
                    this.options[box.action] = {};
                }
                if (this.options[box.action].data === undefined) {
                    this.options[box.action].data = {
                        action: box.action,
                    };
                }

                this.options[box.action].data.newname = newname || name;
                this.options[box.action].data.box = box.box;
                this.options[box.action].data.path = path;
                this.options[box.action].data.name = name;
                this.options[box.action].data.source = source;

                this.send(
                    box.action,
                    resp => {
                        if (this.options.isSuccess(resp)) {
                            this.loadTree(
                                this.currentPath,
                                this.currentSource
                            ).then(() => {
                                success();

                                if (onSuccess) {
                                    onSuccess();
                                }
                            });
                        } else {
                            failed(new Error(this.options.getMessage(resp)));

                            if (onFailed) {
                                onFailed(
                                    new Error(this.options.getMessage(resp))
                                );
                            }
                        }
                    },
                    (error: Error) => {
                        failed(error);

                        if (onFailed) {
                            onFailed(error);
                        }
                    }
                );
            }
        );
    };

    constructor(editor?: IJodit, options?: IFileBrowserOptions) {
        super(editor, options);

        const self: FileBrowser = this,
            doc: HTMLDocument = editor ? editor.ownerDocument : document,
            editorDoc: HTMLDocument = editor ? editor.editorDocument : doc;

        if (editor) {
            this.id = editor.id;
        }

        self.options = new OptionsDefault(
            extend(
                true,
                {},
                self.options,
                Config.defaultOptions.filebrowser,
                options,
                editor ? editor.options.filebrowser : void 0
            )
        ) as IFileBrowserOptions;

        self.dialog = new Dialog(editor || self, {
            fullsize: self.options.fullsize,
            buttons: ['dialog.fullsize', 'dialog.close'],
        });

        self.loader = self.create.div(
            'jodit_filebrowser_loader',
            '<i class="jodit_icon-loader"></i>'
        );

        self.browser = self.create.fromHTML(
            '<div class="jodit_filebrowser non-selected">' +
                (self.options.showFoldersPanel
                    ? '<div class="jodit_filebrowser_tree"></div>'
                    : '') +
                '<div class="jodit_filebrowser_files"></div>' +
                '<div class="jodit_filebrowser_status"></div>' +
                '</div>'
        );

        self.status_line = self.browser.querySelector(
            '.jodit_filebrowser_status'
        ) as HTMLElement;

        self.tree = self.browser.querySelector(
            '.jodit_filebrowser_tree'
        ) as HTMLElement;
        self.files = self.browser.querySelector(
            '.jodit_filebrowser_files'
        ) as HTMLElement;

        self.events
            .on('view.filebrowser', (view: string) => {
                if (view !== self.view) {
                    self.view = view;
                    self.buffer.fileBrowserView = view;
                    self.files.classList.remove(
                        'jodit_filebrowser_files_view-tiles'
                    );
                    self.files.classList.remove(
                        'jodit_filebrowser_files_view-list'
                    );
                    self.files.classList.add(
                        'jodit_filebrowser_files_view-' + self.view
                    );

                    self.storage.set('jodit_filebrowser_view', self.view);
                }
            })
            .on('sort.filebrowser', (value: string) => {
                if (value !== self.sortBy) {
                    self.sortBy = value;
                    this.storage.set('jodit_filebrowser_sortby', self.sortBy);
                    self.loadItems(self.currentPath, self.currentSource);
                }
            })
            .on('filter.filebrowser', (value: string) => {
                if (value !== self.filterWord) {
                    self.filterWord = value;
                    self.loadItems(self.currentPath, self.currentSource);
                }
            })
            .on('fileRemove.filebrowser', () => {
                if (this.getActiveElements().length) {
                    Confirm(self.i18n('Are you sure?'), '', (yes: boolean) => {
                        if (yes) {
                            const promises: Array<Promise<any>> = [];

                            self.getActiveElements().forEach(
                                (a: HTMLElement) => {
                                    promises.push(
                                        self.fileRemove(
                                            self.currentPath,
                                            a.getAttribute('data-name') || '',
                                            a.getAttribute('data-source') || ''
                                        )
                                    );
                                }
                            );

                            Promise.all(promises).then(() => {
                                self.someSelectedWasChanged();
                                self.loadTree(
                                    self.currentPath,
                                    self.currentSource
                                );
                            });
                        }
                    });
                }
            })
            .on('edit.filebrowser', () => {
                const files: HTMLElement[] = this.getActiveElements();
                if (files.length === 1) {
                    self.openImageEditor(
                        files[0].getAttribute('href') || '',
                        files[0].getAttribute('data-name') || '',
                        files[0].getAttribute('data-path') || '',
                        files[0].getAttribute('data-source') || ''
                    );
                }
            })
            .on('update.filebrowser', () => {
                self.loadTree(this.currentPath, this.currentSource);
            })
            .on(
                self.tree,
                'click',
                function(this: HTMLElement, e: MouseEvent) {
                    const a: HTMLAnchorElement = this
                            .parentNode as HTMLAnchorElement,
                        path: string = a.getAttribute('data-path') || '';

                    Confirm(self.i18n('Are you sure?'), '', (yes: boolean) => {
                        if (yes) {
                            self.folderRemove(
                                path,
                                a.getAttribute('data-name') || '',
                                a.getAttribute('data-source') || ''
                            ).then(() => {
                                self.loadTree(
                                    self.currentPath,
                                    self.currentSource
                                );
                            });
                        }
                    });

                    e.stopImmediatePropagation();
                    return false;
                },
                'a>i.remove'
            )
            .on(
                self.tree,
                'click',
                function(this: HTMLAnchorElement) {
                    if (this.classList.contains('addfolder')) {
                        Promt(
                            self.i18n('Enter Directory name'),
                            self.i18n('Create directory'),
                            (name: string) => {
                                self.createFolder(
                                    name,
                                    this.getAttribute('data-path') || '',
                                    this.getAttribute('data-source') || ''
                                );
                            },
                            self.i18n('type name')
                        );
                    } else {
                        self.currentPath = this.getAttribute('data-path') || '';
                        self.currentSource =
                            this.getAttribute('data-source') || '';
                        self.loadTree(self.currentPath, self.currentSource);
                    }
                },
                'a'
            )
            .on(
                this.tree,
                'dragstart',
                function(this: HTMLAnchorElement) {
                    if (self.options.moveFolder) {
                        self.dragger = this;
                    }
                },
                'a'
            )
            .on(
                this.tree,
                'drop',
                function(this: HTMLAnchorElement): boolean | void {
                    if (
                        (self.options.moveFile || self.options.moveFolder) && self.dragger
                    ) {
                        let path: string =
                            self.dragger.getAttribute('data-path') || '';

                        // move folder
                        if (
                            !self.options.moveFolder &&
                            self.dragger.classList.contains(
                                'jodit_filebrowser_tree_item'
                            )
                        ) {
                            return false;
                        }

                        // move file
                        if (self.dragger.classList.contains(ITEM_CLASS)) {
                            path += self.dragger.getAttribute('data-name');
                            if (!self.options.moveFile) {
                                return false;
                            }
                        }

                        self.move(
                            path,
                            this.getAttribute('data-path') || '',
                            this.getAttribute('data-source') || '',
                            self.dragger.classList.contains(ITEM_CLASS)
                        );

                        self.dragger = false;
                    }
                },
                'a'
            );

        const contextmenu: ContextMenu = new ContextMenu(this.jodit || this);

        self.events
            .on(
                self.files,
                'contextmenu',
                function(this: HTMLElement, e: DragEvent): boolean | void {
                    if (self.options.contextMenu) {
                        let item: HTMLElement = this;

                        setTimeout(() => {
                            contextmenu.show(
                                e.pageX,
                                e.pageY,
                                [
                                    item.getAttribute('data-is-file') !== '1' &&
                                    self.options.editImage &&
                                    (self.canI('ImageResize') ||
                                        self.canI('ImageCrop'))
                                        ? {
                                            icon: 'pencil',
                                            title: 'Edit',
                                            exec: () => {
                                                self.openImageEditor(
                                                    item.getAttribute('href') ||
                                                    '',
                                                    item.getAttribute(
                                                        'data-name'
                                                    ) || '',
                                                    item.getAttribute(
                                                        'data-path'
                                                    ) || '',
                                                    item.getAttribute(
                                                        'data-source'
                                                    ) || ''
                                                );
                                            },
                                        }
                                        : false,
                                    self.canI('FileRemove')
                                        ? {
                                            icon: 'bin',
                                            title: 'Delete',
                                            exec: () => {
                                                self.fileRemove(
                                                    self.currentPath,
                                                    item.getAttribute(
                                                        'data-name'
                                                    ) || '',
                                                    item.getAttribute(
                                                        'data-source'
                                                    ) || ''
                                                );
                                                self.someSelectedWasChanged();
                                                self.loadTree(
                                                    self.currentPath,
                                                    self.currentSource
                                                );
                                            },
                                        }
                                        : false,
                                    self.options.preview
                                        ? {
                                            icon: 'eye',
                                            title: 'Preview',
                                            exec: () => {
                                                let src: string =
                                                    item.getAttribute('href') ||
                                                    '';
                                                const preview: Dialog = new Dialog(
                                                    self
                                                    ),
                                                    temp_content: HTMLElement = self.create.fromHTML(
                                                        '<div class="jodit_filebrowser_preview">' +
                                                        '<i class="jodit_icon-loader"></i>' +
                                                        '</div>'
                                                    ),
                                                    image: HTMLImageElement = doc.createElement(
                                                        'img'
                                                    ),
                                                    addLoadHandler = () => {
                                                        const onload = () => {
                                                            this.removeEventListener(
                                                                'load',
                                                                onload as EventListenerOrEventListenerObject
                                                            );
                                                            temp_content.innerHTML =
                                                                '';
                                                            if (
                                                                self.options
                                                                    .showPreviewNavigation
                                                            ) {
                                                                const next = self.create.fromHTML(
                                                                    '<a ' +
                                                                    'href="javascript:void(0)" ' +
                                                                    'class="' +
                                                                    'jodit_filebrowser_preview_navigation ' +
                                                                    'jodit_filebrowser_preview_navigation-next' +
                                                                    '">' +
                                                                    ToolbarIcon.getIcon(
                                                                        'angle-right'
                                                                    ) +
                                                                    '</a>'
                                                                    ),
                                                                    prev = self.create.fromHTML(
                                                                        '<a ' +
                                                                        'href="javascript:void(0)" ' +
                                                                        'class="' +
                                                                        'jodit_filebrowser_preview_navigation ' +
                                                                        'jodit_filebrowser_preview_navigation-prev' +
                                                                        '">' +
                                                                        ToolbarIcon.getIcon(
                                                                            'angle-left'
                                                                        ) +
                                                                        '</a>'
                                                                    );

                                                                if (
                                                                    item.previousSibling &&
                                                                    (item.previousSibling as HTMLElement)
                                                                        .classList &&
                                                                    (item.previousSibling as HTMLElement).classList.contains(
                                                                        ITEM_CLASS
                                                                    )
                                                                ) {
                                                                    temp_content.appendChild(
                                                                        prev
                                                                    );
                                                                }
                                                                if (
                                                                    item.nextSibling &&
                                                                    (item.nextSibling as HTMLElement)
                                                                        .classList &&
                                                                    (item.nextSibling as HTMLElement).classList.contains(
                                                                        ITEM_CLASS
                                                                    )
                                                                ) {
                                                                    temp_content.appendChild(
                                                                        next
                                                                    );
                                                                }

                                                                self.events.on(
                                                                    [next, prev],
                                                                    'click',
                                                                    function(
                                                                        this: HTMLElement
                                                                    ) {
                                                                        if (
                                                                            this.classList.contains(
                                                                                'jodit_filebrowser_preview_navigation-next'
                                                                            )
                                                                        ) {
                                                                            item = item.nextSibling as HTMLElement;
                                                                        } else {
                                                                            item = item.previousSibling as HTMLElement;
                                                                        }
                                                                        temp_content.innerHTML =
                                                                            '<i class="jodit_icon-loader"></i>';
                                                                        src =
                                                                            item.getAttribute(
                                                                                'href'
                                                                            ) ||
                                                                            '';
                                                                        image.setAttribute(
                                                                            'src',
                                                                            src
                                                                        );
                                                                        addLoadHandler();
                                                                    }
                                                                );
                                                            }

                                                            temp_content.appendChild(
                                                                image
                                                            );
                                                            preview.setPosition();
                                                        };

                                                        image.addEventListener(
                                                            'load',
                                                            onload
                                                        );
                                                        if (image.complete) {
                                                            onload();
                                                        }
                                                    };

                                                addLoadHandler();
                                                image.setAttribute('src', src);
                                                preview.setContent(temp_content);

                                                preview.open();
                                            },
                                        }
                                        : false,
                                    {
                                        icon: 'upload',
                                        title: 'Download',
                                        exec: () => {
                                            const url:
                                                | string
                                                | null = item.getAttribute('href');

                                            if (url) {
                                                self.ownerWindow.open(url);
                                            }
                                        },
                                    },
                                ],
                                self.dialog.getZIndex() + 1
                            );
                        }, self.defaultTimeout)

                        e.stopPropagation();
                        e.preventDefault();

                        return false;
                    }
                },
                'a'
            )
            .on(self.files, 'click', (e: MouseEvent) => {
                if (!ctrlKey(e)) {
                    this.getActiveElements().forEach((elm: HTMLElement) => {
                        elm.classList.remove('active');
                    });
                    self.someSelectedWasChanged();
                }
            })
            .on(
                self.files,
                'click',
                function(this: HTMLElement, e: MouseEvent) {
                    if (!ctrlKey(e)) {
                        self.getActiveElements().forEach((elm: HTMLElement) => {
                            elm.classList.remove('active');
                        });
                    }

                    this.classList.toggle('active');

                    self.someSelectedWasChanged();
                    e.stopPropagation();
                    return false;
                },
                'a'
            )
            .on(
                self.files, 'dragstart', function () {
                    if (self.options.moveFile) {
                        self.dragger = this;
                    }
                },
            'a')
            .on(self.dialog.container, 'drop', (e: DragEvent) =>
                e.preventDefault()
            );

        this.dialog.setSize(this.options.width, this.options.height);

        [
            'getLocalFileByUrl',
            'crop',
            'resize',
            'create',
            'fileMove',
            'folderMove',
            'fileRemove',
            'folderRemove',
            'folder',
            'items',
            'permissions',
        ].forEach(key => {
            if (this.options[key] !== null) {
                this.options[key] = extend(
                    true,
                    {},
                    this.options.ajax,
                    this.options[key]
                );
            }
        });

        if (
            this.storage.get('jodit_filebrowser_view') &&
            this.options.view === null
        ) {
            this.view =
                this.storage.get('jodit_filebrowser_view') === 'list'
                    ? 'list'
                    : 'tiles';
        } else {
            this.view = this.options.view === 'list' ? 'list' : 'tiles';
        }

        this.files.classList.add('jodit_filebrowser_files_view-' + this.view);
        self.buffer.fileBrowserView = this.view;

        this.sortBy =
            ['changed', 'name', 'size'].indexOf(this.options.sortBy) !== -1
                ? this.options.sortBy
                : 'changed';

        if (this.storage.get('jodit_filebrowser_sortby')) {
            this.sortBy =
                ['changed', 'name', 'size'].indexOf(
                    this.storage.get('jodit_filebrowser_sortby') || ''
                ) !== -1
                    ? this.storage.get('jodit_filebrowser_sortby') || ''
                    : 'changed';
        }

        this.currentBaseUrl = $$('base', editorDoc).length
            ? $$('base', editorDoc)[0].getAttribute('href') || ''
            : location.protocol + '//' + location.host;

        const uploaderOptions: IUploaderOptions<IUploader> = extend(
            true,
            {},
            Config.defaultOptions.uploader,
            self.options.uploader,
            editor && editor.options && editor.options.uploader !== null
                ? {
                      ...(editor.options.uploader as IUploaderOptions<
                          IUploader
                      >),
                  }
                : {}
        ) as IUploaderOptions<IUploader>;

        this.uploader = this.getInstance('Uploader', uploaderOptions);
        this.uploader.setPath(this.currentPath);
        this.uploader.setSource(this.currentSource);
        this.uploader.bind(this.browser, this.uploadHandler, this.errorHandler);
        this.events.on('bindUploader.filebrowser', (button: HTMLElement) => {
            this.uploader.bind(button, this.uploadHandler, this.errorHandler);
        });
    }
    destruct() {
        this.dialog.destruct();
        delete this.dialog;
        this.events && this.events.off('.filebrowser');
        this.uploader && this.uploader.destruct();
        delete this.uploader;
        super.destruct();
    }
}
