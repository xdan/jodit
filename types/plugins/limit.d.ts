import { Jodit } from "../Jodit";
declare module "../Config" {
    interface Config {
        limitWords: false | number;
        limitChars: false | number;
        limitHTML: false;
    }
}
export declare function limit(jodit: Jodit): void;
