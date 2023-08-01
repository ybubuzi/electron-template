

export function ServiceRegister(serviceName?: string): Function {
    return function (target: unknown) {
        // @ts-ignore
        target.serviceName! = serviceName || target.name;
    }
}

export function ServiceHandler(): Function {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value.serviceHandlerName = propertyKey
        descriptor.value.isServiceHandler = true
    }
}

export const getServices = () => {
    // @ts-ignore
    const modules = import.meta.globEager('./**/index.ts')
    const service: any[] = []
    Object.keys(modules).forEach(path => {
        const clazz = modules[path].default || modules[path]
        service.push(clazz)
    })
    return service
}

export const findServiceName = (target: unknown): string => {
    // @ts-ignore
    return target['serviceName']
}

export const findServiceHandler = (target: unknown): string[] => {
    const ServiceHandler: string[] = []
    // @ts-ignore
    const propertNames = Object.getOwnPropertyNames(target.prototype)
    for (const name of propertNames) {
        // @ts-ignore
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, name)
        if (descriptor?.value && descriptor.value.isServiceHandler) {
            ServiceHandler.push(descriptor.value.serviceHandlerName)
        }
    }
    return ServiceHandler
}