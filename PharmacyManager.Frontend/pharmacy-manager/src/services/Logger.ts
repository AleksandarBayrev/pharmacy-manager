import { enhanceClass } from "../base/enhanceClass";
import { ILogger, LogLevel } from "../types";

class Logger implements ILogger {
    private readonly context: string;
    constructor(context: string) {
        this.context = context;
    }

    Log = (message: string, level: LogLevel) => {
        this.getLoggingFunction(level)(`[${this.context}] (${new Date().toISOString()}) => ${message}`);
    }

    private getLoggingFunction(level: LogLevel) {
        return level === 'info' ? console.log : console.error;
    }
}

enhanceClass(Logger, "Logger");

export { Logger }