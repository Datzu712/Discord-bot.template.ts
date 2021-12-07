import Client from '../core/Client';
import { EventsTypes, events } from '../managers/EventManager';

export interface IEvent {
    name: events;
    client: Client;
    type: EventsTypes;
    execute(...args: unknown[]): void;
}

class BaseEvent implements IEvent {
    
    constructor(public client: Client, public type: EventsTypes, public name: events) {}
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public execute(...args: unknown[]): void {
        throw new Error('Event not implemented');
    }
}

export default BaseEvent;