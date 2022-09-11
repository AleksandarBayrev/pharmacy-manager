export interface IPageRenderer {
    add(path: string, instance: JSX.Element): void;
    get(path: string): JSX.Element;
}