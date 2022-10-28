import { enhanceClass } from "../base/enhanceClass";
import { ILogger, LogLevel } from "../types";

class Logger implements ILogger {
    private readonly context: string;
    constructor(context: string) {
        this.context = context;
    }

    Info = (message: string) => {
        this.getLoggingFunction('info')(`[${this.context}] (${new Date().toISOString()}) => ${message}`);
    }
    Error = (error: Error) => {
        this.getLoggingFunction('error')(`[${this.context}] (${new Date().toISOString()}) => Error: ${error.name}, Message: ${error.message}, Stack: ${error.stack}`);
    }

    private getLoggingFunction(level: LogLevel) {
        return level === 'info' ? console.log : console.error;
    }
}

enhanceClass(Logger, "Logger");

export { Logger }