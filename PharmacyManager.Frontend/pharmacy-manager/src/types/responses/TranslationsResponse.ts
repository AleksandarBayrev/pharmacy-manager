import { Language } from "../base"

export type TranslationsResponse = {
    [Language.Bulgarian]: {[key: string]: string};
    [Language.English]: {[key: string]: string};
}