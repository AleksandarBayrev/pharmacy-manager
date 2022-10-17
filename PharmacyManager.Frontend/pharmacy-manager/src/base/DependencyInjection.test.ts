import { DependencyInjection } from "./DependencyInjection";
import { enhanceClass } from "./enhanceClass";

describe("DependencyInjection", () => {
    beforeEach(() => {
        if (DependencyInjection["instance"] === null) {
            DependencyInjection.setupInstance(console.log);
        }
    });
    it("getInstance returns instance", () => {
        const instanceOne = DependencyInjection.getInstance();
        const instanceTwo = DependencyInjection.getInstance();
        expect(instanceOne).toEqual(instanceTwo);
    });
    it("getInstance throws if setup is not performed", () => {
        DependencyInjection["instance"] = null;
        try {
            DependencyInjection.getInstance();
        } catch (err) {
            expect(err).not.toBeUndefined();
        }
    });
    it("registerService registers an instance", () => {
        interface IMyLogger {};
        class MyLogger implements IMyLogger {};
        enhanceClass(MyLogger, "MyLogger");
        DependencyInjection.getInstance().registerService<IMyLogger>("IMyLogger", "singleton", MyLogger, []);
        expect(DependencyInjection.getInstance().hasService("IMyLogger"));
    });
    it("registerService with singleton returns the same instance", () => {
        interface IMyNewLogger {};
        class MyLogger implements IMyNewLogger {};
        enhanceClass(MyLogger, "MyLogger");
        DependencyInjection.getInstance().registerService<IMyNewLogger>("IMyNewLogger", "singleton", MyLogger, []);
        const instanceOne = DependencyInjection.getInstance().getService<IMyNewLogger>("IMyNewLogger");
        const instanceTwo = DependencyInjection.getInstance().getService<IMyNewLogger>("IMyNewLogger");
        expect(instanceOne).toBe(instanceTwo);
    });
    it("registerService with transient does not return the same instance", () => {
        interface IMyNewNewLogger {
            name: string;
        };
        class MyLogger implements IMyNewNewLogger {
            name: string;
            constructor(name: string) {
                this.name = name;
            }
        };
        enhanceClass(MyLogger, "MyLogger");
        DependencyInjection.getInstance().registerService<IMyNewNewLogger>("IMyNewNewLogger", "transient", MyLogger, ["asd"]);
        const instanceOne = DependencyInjection.getInstance().getService<IMyNewNewLogger>("IMyNewNewLogger");
        const instanceTwo = DependencyInjection.getInstance().getService<IMyNewNewLogger>("IMyNewNewLogger");
        expect(instanceOne).not.toBe(instanceTwo);
    });
});