import { type Client } from 'discord.js';
import { type eventTarget, BaseEvent } from '../../structures/BaseEvent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createEvent({ name, target }: { name: string; target: eventTarget }): any {
    return function decorator<K extends BaseEvent>(Event: new (...args: unknown[]) => K): new (client: Client) => K {
        return new Proxy(Event, {
            construct: (ctx, [client]): K => new ctx(client, { name, target }),
        });
    };
}
