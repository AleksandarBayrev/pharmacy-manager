import { enhanceClass } from "../base/enhanceClass";
import { ConsoleLoggerFunction, ILogger, LogLevel } from "../types";

class Logger implements ILogger {
    private readonly context: string;
    private readonly logFunctions: Map<LogLevel, ConsoleLoggerFunction>;
    constructor(context: string) {
        this.context = context;
        this.logFunctions = this.setupLogFunctions();
    }

    Info = (message: string) => {
        this.getLoggingFunction('info')(`[${this.context}] (${new Date().toISOString()}) => ${message}`);
    }
    Error = (error: Error) => {
        this.getLoggingFunction('error')(`[${this.context}] (${new Date().toISOString()}) => Error: ${error.name}, Message: ${error.message}, Stack: ${error.stack}`);
    }

    Warn = (message: string) => {
        this.getLoggingFunction('warn')(`[${this.context}] (${new Date().toISOString()}) => Warning: ${message}`);
    }

    private setupLogFunctions() {
        const functions = new Map<LogLevel, ConsoleLoggerFunction>();
        functions.set('info', console.log);
        functions.set('error', console.error);
        functions.set('warn', console.warn);
        return functions;
    }

    private getLoggingFunction(level: LogLevel) {
        return this.logFunctions.get(level) as ConsoleLoggerFunction;
    }
}

enhanceClass(Logger, "Logger");

export { Logger }