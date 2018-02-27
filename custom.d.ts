declare module "*.svg" {
    const content: any;
    export = content;
}

type Bound = {top: number, left: number,  width: number, height: number};
type Point = {x: number, y: number};
type SelectionRange = {
    startContainer: Node|null,
    startOffset: number|null,
    endContainer: Node|null,
    endOffset: number|null,
};

type RGB = {r: number, g: number, b: number};

type Permissions = {
    allowFiles: boolean,
    allowFileMove: boolean,
    allowFileUpload: boolean,
    allowFileUploadRemote: boolean,
    allowFileRemove: boolean,
    allowFileRename: boolean,
    allowFolders: boolean,
    allowFolderCreate: boolean,
    allowFolderMove: boolean,
    allowFolderRemove: boolean,
    allowFolderRename: boolean,
    allowImageResize: boolean,
    allowImageCrop: boolean,
    [key: string]: boolean;
};


type CommandType = {
    exec: Function,
    hotkeys?: string | string[]
}