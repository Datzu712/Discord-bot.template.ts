import Client from '../core/Client';
import { EventsTypes, events } from '../managers/EventManager';

export interface IEvent {
    name: keyof events;
    client: Client;
    type: EventsTypes;
    execute(...args: unknown[]): void;
}

class BaseEvent implements IEvent {

    public type: EventsTypes;
    public name: keyof events;
    
    constructor(public client: Client, type?: EventsTypes, name?: keyof events) {

        if(!type || !name)
            throw new Error(`Event ${(!type) ? 'type' : 'name'} is required.`);

        this.type = type;
        this.name = name;

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public execute(options: unknown[]): void {
        throw new Error('Event not implemented');
    }
}

export default BaseEvent;