export type LogLevel = 'info' | 'error';

export interface ILogger {
    Log: (message: string, level: LogLevel) => void;
}