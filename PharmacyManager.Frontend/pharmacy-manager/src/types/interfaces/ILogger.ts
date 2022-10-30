export type LogLevel = 'info' | 'error' | 'warn';

export interface ILogger {
    Info: (message: string) => void;
    Error: (error: Error) => void;
    Warn: (message: string) => void;
}