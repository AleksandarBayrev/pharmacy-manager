import { enhanceClass } from "../base/enhanceClass";
import { ILogger } from "../types";
import { IPageRenderer } from "../types/interfaces/IPageRenderer";

class PageRenderer implements IPageRenderer {
    private readonly pages: Map<string, JSX.Element>;
    private readonly logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
        this.pages = new Map<string, JSX.Element>();
    }

    add(path: string, instance: JSX.Element): void {
        this.logger.Log(`Registering page for path = ${path}`, 'info');
        this.pages.set(path, instance);
    }
    get(path: string): JSX.Element {
        const page = this.pages.get(path);
        if (!page) {
            this.logger.Log(`Page path ${path} not registered in PageRenderer`, 'error');
            throw new Error(`Page path ${path} not registered in PageRenderer`);
        }
        this.logger.Log(`Registering page for path = ${path}`, 'info');
        return page;
    }
}

enhanceClass(PageRenderer, "PageRenderer");

export { PageRenderer }