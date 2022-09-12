import { ILogger } from "./ILogger";

export interface ILogManager {
    addLogger: (context: string) => void;
    getLogger: (context: string) => ILogger;
}