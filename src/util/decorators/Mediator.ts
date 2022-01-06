/* eslint-disable @typescript-eslint/no-explicit-any */

export function Mediator(fn: (...args: any[]) => Promise<boolean>): any {
    // TODO: fix this types.
    return (target: any, _: never, propertyDescriptor: PropertyDescriptor) => {
        const oldFn = propertyDescriptor.value;
        if (!oldFn) throw new Error('Invalid target type.');

        propertyDescriptor.value = async (ctx: unknown) => {
            const res = await fn(ctx).catch(() => false);

            if (res === true) return oldFn.apply(target, [ctx]);
        };

        return propertyDescriptor;
    };
}
