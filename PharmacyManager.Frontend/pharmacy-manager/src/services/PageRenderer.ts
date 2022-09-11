import { IPageRenderer } from "../types/interfaces/IPageRenderer";

export class PageRenderer implements IPageRenderer {
    private readonly pages: Map<string, JSX.Element>;

    constructor() {
        this.pages = new Map<string, JSX.Element>();
    }

    add(path: string, instance: JSX.Element): void {
        this.pages.set(path, instance);
    }
    get(path: string): JSX.Element {
        const page = this.pages.get(path);
        if (!page) {
            throw new Error(`Page path ${path} not registered in PageRenderer`);
        }
        return page;
    }

}