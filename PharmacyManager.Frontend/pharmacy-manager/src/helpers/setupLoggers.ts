import { ILogManager } from "../types";

export const setupLoggers = (logManager: ILogManager) => {
    logManager.addLogger("App");
    logManager.addLogger("PageRenderer");
}