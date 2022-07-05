import type Client from '../../structures/Client';
import type { eventTarget, BaseEvent } from '../../structures/BaseEvent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createEvent({ name, target }: { name: string; target: eventTarget }): any {
    return function decorator<E extends BaseEvent>(Event: new (...args: unknown[]) => E): new (client: Client) => E {
        return new Proxy(Event, {
            construct: (ctx, [client]): E => new ctx(client, { name, target }),
        });
    };
}
