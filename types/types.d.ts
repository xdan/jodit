declare module "*.svg" {
    const content: any;
    export = content;
}
declare type Bound = {
    top: number;
    left: number;
    width: number;
    height: number;
};
declare type Point = {
    x: number;
    y: number;
};
declare type SelectionRange = {
    startContainer: Node | null;
    startOffset: number | null;
    endContainer: Node | null;
    endOffset: number | null;
};
declare type RGB = {
    r: number;
    g: number;
    b: number;
};
declare type Permissions = {
    allowFiles: boolean;
    allowFileMove: boolean;
    allowFileUpload: boolean;
    allowFileUploadRemote: boolean;
    allowFileRemove: boolean;
    allowFileRename: boolean;
    allowFolders: boolean;
    allowFolderCreate: boolean;
    allowFolderMove: boolean;
    allowFolderRemove: boolean;
    allowFolderRename: boolean;
    allowImageResize: boolean;
    allowImageCrop: boolean;
    [key: string]: boolean;
};
declare type CommandType = {
    exec: Function;
    hotkeys?: string | string[];
};
