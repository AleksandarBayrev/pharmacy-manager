import { DILogger, ServiceDescription, ServiceLifespan, DIClassDefinition } from "./types";

export class DependencyInjection {
    private static instance: DependencyInjection | null = null;
    private logger: DILogger;
    private services: Map<string, any>;
    private serviceDescriptors: Map<string, ServiceDescription>;

    private constructor(logger: DILogger) {
        this.logger = logger;
        this.services = new Map();
        this.serviceDescriptors = new Map();
    }

    public static getInstance(): DependencyInjection {
        if (DependencyInjection.instance === null) {
            throw new Error("DependencyInjection container is not set up!");
        }
        return DependencyInjection.instance;
    }

    public static setupInstance(logger: DILogger) {
        logger("Setting up DependencyInjection...");
        if (DependencyInjection.instance !== null) {
            throw new Error("DependencyInjection container is already set up!");
        }
        DependencyInjection.instance = new DependencyInjection(logger);
    }

    public hasService(baseType: string): boolean {
        return this.serviceDescriptors.has(baseType) && this.services.has(baseType);
    }

    public registerService<T>(baseType: string,
        serviceLifespan: ServiceLifespan,
        classDefinition: DIClassDefinition<T>,
        constructorParameters: any[]): void {
        if (this.serviceDescriptors.has(baseType) || this.services.has(baseType)) {
            throw new Error(`Base type ${baseType} already registered in DI`);
        }
        this.logger(`Registering ${baseType} for ${classDefinition.name} class`);
        this.serviceDescriptors.set(baseType, {
            serviceLifespan,
            classDefinition,
            constructorParameters
        });
        this.services.set(baseType,
            new classDefinition(...constructorParameters));
    }

    public getService<T>(baseType: string): T {
        if (!this.serviceDescriptors.has(baseType) || !this.services.has(baseType)) {
            throw new Error(`Base type ${baseType} not registered in DI`);
        }

        const serviceDescription = this.serviceDescriptors.get(baseType) as ServiceDescription;
        this.logger(this.getMessageForServiceFetching(baseType, serviceDescription));
        if (serviceDescription.serviceLifespan === "singleton") {
            return this.services.get(baseType);
        }

        if (serviceDescription.serviceLifespan === "transient") {
            this.services.set(baseType,
                new serviceDescription.classDefinition(...serviceDescription.constructorParameters));
        }
        return this.services.get(baseType) as T;
    }

    private getMessageForServiceFetching(baseType: string, serviceDescription: ServiceDescription) {
        switch (serviceDescription.serviceLifespan) {
            case 'singleton':
                return `Returning ${serviceDescription.classDefinition.className} class instance with lifespan ${serviceDescription.serviceLifespan} for ${baseType}`;
            case 'transient':
                return `Creating and returning new instance of ${serviceDescription.classDefinition.className} class with lifespan ${serviceDescription.serviceLifespan} for ${baseType}`;
            default:
                throw new Error(`Invalid service lifespan!`);
        }
    }
}