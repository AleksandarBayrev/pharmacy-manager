export const enhanceClass = (classDefiniton: new (...args: any[]) => any, className: string) => {
    (classDefiniton as any).className = className;
    return classDefiniton;
}