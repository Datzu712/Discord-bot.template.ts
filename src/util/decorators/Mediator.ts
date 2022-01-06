// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Mediator(fn: (...args: any[]) => Promise<boolean>): any {
    // TODO: fix this types.
    return (target: new (...args: unknown[]) => unknown, _: never, propertyDescriptor: PropertyDescriptor) => {
        const oldFn = propertyDescriptor.value;
        if (!oldFn) throw new Error('Invalid target type.');

        propertyDescriptor.value = async function Mediator(ctx: unknown) {
            const res = await fn(ctx).catch(() => false);

            if (res === true) return oldFn.apply(this, [ctx]);
        };

        return propertyDescriptor;
    };
}
