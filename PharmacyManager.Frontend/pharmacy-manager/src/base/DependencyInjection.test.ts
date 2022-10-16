import { DependencyInjection } from "./DependencyInjection";

describe("DependencyInjection", () => {
    it("getInstance returns instance", () => {
        const instanceOne = DependencyInjection.getInstance(console.log);
        const instanceTwo = DependencyInjection.getInstance(console.log);
        expect(instanceOne).toEqual(instanceTwo);
    });
    it("registerService registers an instance", () => {
        interface IMyLogger {};
        class MyLogger implements IMyLogger {};
        DependencyInjection.getInstance(console.log).registerService<IMyLogger>("IMyLogger", "singleton", MyLogger, []);
        expect(DependencyInjection.getInstance(console.log).hasService("IMyLogger"));
    });
    it("registerService with singleton returns the same instance", () => {
        interface IMyNewLogger {};
        class MyLogger implements IMyNewLogger {};
        DependencyInjection.getInstance(console.log).registerService<IMyNewLogger>("IMyNewLogger", "singleton", MyLogger, []);
        const instanceOne = DependencyInjection.getInstance(console.log).getService<IMyNewLogger>("IMyNewLogger");
        const instanceTwo = DependencyInjection.getInstance(console.log).getService<IMyNewLogger>("IMyNewLogger");
        expect(instanceOne).toBe(instanceTwo);
    });
    it("registerService with transient does not return the same instance", () => {
        interface IMyNewNewLogger {};
        class MyLogger implements IMyNewNewLogger {
            name: string;
            constructor(name: string) {
                this.name = name;
            }
        };
        DependencyInjection.getInstance(console.log).registerService<IMyNewNewLogger>("IMyNewNewLogger", "transient", MyLogger, ["asd"]);
        const instanceOne = DependencyInjection.getInstance(console.log).getService<IMyNewNewLogger>("IMyNewNewLogger");
        const instanceTwo = DependencyInjection.getInstance(console.log).getService<IMyNewNewLogger>("IMyNewNewLogger");
        expect(instanceOne).not.toBe(instanceTwo);
    });
});