export type LogLevel = 'info' | 'error';

export interface ILogger {
    Info: (message: string) => void;
    Error: (error: Error) => void;
}