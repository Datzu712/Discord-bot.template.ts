// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Middleware(fn: (ctx: any, next: () => unknown) => void | Promise<void>): any {
    // TODO: fix this types.
    return (target: new (...args: unknown[]) => unknown, _: never, propertyDescriptor: PropertyDescriptor) => {
        const oldFn = propertyDescriptor.value;
        if (!oldFn) throw new Error('Invalid target type.');

        propertyDescriptor.value = async function Middleware(ctx: unknown) {
            fn(ctx, () => oldFn.apply(this, [ctx]))?.catch(() => false);
        };
        return propertyDescriptor;
    };
}
