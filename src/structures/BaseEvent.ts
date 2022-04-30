import type Client from '../core/Client';
import type { EventsTypes, events } from '../managers/Event';
import type { Logger } from '../core/Logger';

export interface IEvent {
    name: events;
    client: Client;
    type: EventsTypes;
    execute(...args: unknown[]): void;
}

abstract class BaseEvent implements IEvent {
    protected logger: Logger;

    public constructor(public client: Client, public type: EventsTypes, public name: events) {
        this.logger = client.logger;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public execute(...args: unknown[]): void {
        throw new Error('Event not implemented');
    }
}

export default BaseEvent;
