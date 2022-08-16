export type DILogger = (message: string) => void;
export type ServiceLifespan = "singleton" | "transient";
export type ServiceDescription = {
    classDefinition: any;
    serviceLifespan: ServiceLifespan;
    constructorParameters: any[];
}

export type DIClassDefinition<T> = new (...params: any[]) => T;