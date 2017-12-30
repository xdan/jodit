declare module "*.svg" {
    const content: any;
    export = content;
}

type Bound = {top: number, left: number,  width: number, height: number};
type RGB = {r: number, g: number, b: number};