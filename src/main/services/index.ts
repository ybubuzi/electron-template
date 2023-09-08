import { Preload } from '@common/@types'

export function ServiceRegister(serviceName?: string): Function {
    return function (target: unknown) {
        const proto = Object.getPrototypeOf(target)
        // @ts-ignore
        target.serviceName! = serviceName || target.name;
        // @ts-ignore
        proto.serviceName! = serviceName || target.name;
    }
}

export function ServiceHandler({ requireEvent }: Preload.ServiceField = { requireEvent: false }): Function {
    return function (_: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value.serviceHandlerName = propertyKey
        descriptor.value.isServiceHandler = true
        descriptor.value.requireEvent = requireEvent
        // @ts-ignore
        descriptor.serviceHandlerName = propertyKey
        // @ts-ignore
        descriptor.isServiceHandler = true
        // @ts-ignore
        descriptor.requireEvent = requireEvent
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

export const findServiceHandler = (target: unknown): Array<Preload.ServiceHandler> => {
    const ServiceHandler: Array<Preload.ServiceHandler> = []
    // 静态方法
    const staticPropert = Object.getOwnPropertyNames(target)
    for (const name of staticPropert) {
        // @ts-ignore
        const descriptor = Object.getOwnPropertyDescriptor(target, name)
        if (descriptor?.value && descriptor.value.isServiceHandler) {
            ServiceHandler.push({
                name: descriptor.value.serviceHandlerName,
                requireEvent: descriptor.value.requireEvent
            })
        }
    }

    // @ts-ignore
    const propertNames = Object.getOwnPropertyNames(target.prototype)
    for (const name of propertNames) {
        // @ts-ignore
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, name)
        if (descriptor?.value && descriptor.value.isServiceHandler) {
            ServiceHandler.push({
                name: descriptor.value.serviceHandlerName,
                requireEvent: descriptor.value.requireEvent
            })
        }
    }
    return ServiceHandler
}