import { enhanceClass } from "../base/enhanceClass";
import { IAppStore, ILogger } from "../types";
import { IPageRenderer } from "../types/interfaces/IPageRenderer";

class PageRenderer implements IPageRenderer {
    private readonly pages: Map<string, JSX.Element>;
    private readonly logger: ILogger;
    private readonly appStore: IAppStore;

    constructor(
        logger: ILogger,
        appStore: IAppStore) {
        this.logger = logger;
        this.appStore = appStore;
        this.pages = new Map<string, JSX.Element>();
    }

    add(path: string, instance: JSX.Element): void {
        this.logger.Info(`Registering page for path = ${path}`);
        this.pages.set(path, instance);
    }
    get(path: string): JSX.Element {
        const page = this.pages.get(path);
        if (!page) {
            const error = new Error(`Page path ${path} not registered in PageRenderer`);
            this.logger.Error(error);
            throw error;
        }
        this.logger.Info(`Registering page for path = ${path}`);
        this.appStore.setCurrentPage(path);
        return page;
    }
}

enhanceClass(PageRenderer, "PageRenderer");

export { PageRenderer }