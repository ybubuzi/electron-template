

export function ServiceRegister(serviceName?: string): Function {
    return function (target: unknown) {
        const proto = Object.getPrototypeOf(target)
        // @ts-ignore
        target.serviceName! = serviceName || target.name;
        // @ts-ignore
        proto.serviceName! = serviceName || target.name;
    }
}

export function ServiceHandler(): Function {
    return function (_: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value.serviceHandlerName = propertyKey
        descriptor.value.isServiceHandler = true
        // @ts-ignore
        descriptor.serviceHandlerName = propertyKey
        // @ts-ignore
        descriptor.isServiceHandler = true
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
    // 静态方法
    const staticPropert = Object.getOwnPropertyNames(target)
    for (const name of staticPropert) {
        // @ts-ignore
        const descriptor = Object.getOwnPropertyDescriptor(target, name)
        if (descriptor?.value && descriptor.value.isServiceHandler) {
            ServiceHandler.push(descriptor.value.serviceHandlerName)
        }
    }

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