export const enhanceClass = (classDefiniton: new (...args: any[]) => any, className: string) => {
    (classDefiniton as any).serviceName = className;
    return classDefiniton;
}