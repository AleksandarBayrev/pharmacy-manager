export interface IBaseStore {
    load(): Promise<void>;
    unload(): Promise<void>;
}