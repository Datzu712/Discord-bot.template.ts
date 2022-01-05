/* eslint-disable @typescript-eslint/no-explicit-any */

export function Mediator(fn: (...args: any[]) => Promise<boolean>): any {
    // TODO: fix this types.
    return (target: any, _: string, propertyDescriptor: PropertyDescriptor) => {
        const oldFn = propertyDescriptor.value;

        propertyDescriptor.value = async (ctx: unknown) => {
            console.log('asd');
            const res = await fn(ctx).catch(() => false);

            if (res === true) return oldFn.apply(target, [ctx]);
        };
    };
}
