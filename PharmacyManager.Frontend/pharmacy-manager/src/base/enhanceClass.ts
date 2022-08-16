import { DIClassDefinition } from "./types";

export type EnhancedClass<T> = DIClassDefinition<T> & {
    className: string;
}

export const enhanceClass = <T>(classDefiniton: DIClassDefinition<T>, className: string) => {
    (classDefiniton as EnhancedClass<T>).className = className;
    return classDefiniton;
}