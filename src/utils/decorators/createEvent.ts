import Client from '../../core/Client';
import BaseEvent, { EventsTypes, events } from '../../managers/Event';

/** Create a new command command, use second param only for slash commands */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createCommand({ name, type }: { name: events; type: EventsTypes }): any {
    /**
     * Decorator.
     * @param { Function } Function - Constructor class. BaseEvent (client, type, name) {}
     * @returns { Function } Function - New class without second and third param. BaseEvent (client) {}
     */
    return function decorator<K extends BaseEvent>(
        commandClass: new (...args: unknown[]) => K,
    ): new (client: Client) => K {
        // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        return new Proxy(commandClass, {
            construct: (ctx, [client]): K => new ctx(client, type, name),
        });
    };
}
