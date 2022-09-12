import { enhanceClass } from "../base/enhanceClass";
import { ILogger, ILogManager } from "../types";
import { Logger } from "./Logger";

class LogManager implements ILogManager {
    private readonly loggers: Map<string, ILogger>;

    constructor() {
        this.loggers = new Map<string, ILogger>();
    }

    addLogger(context: string) {
        this.loggers.set(context, new Logger(context));
    }

    getLogger(context: string) {
        const logger = this.loggers.get(context);
        if (!logger) {
            throw new Error(`Logger not registered for context: ${context}`);
        }
        return logger;
    }
}

enhanceClass(LogManager, "LogManager");

export { LogManager }