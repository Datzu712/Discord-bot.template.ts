import type Client from './Client';
import Base from './Base';

export type eventTarget = 'database' | 'client';

export abstract class BaseEvent extends Base {
    constructor(public client: Client, public config: { name: string; target: eventTarget }) {
        super();
    }

    /**
     * Method to execute the event
     * @param { unknown[] } args - Arguments of the event
     **/
    abstract execute(...args: unknown[]): void;
}
