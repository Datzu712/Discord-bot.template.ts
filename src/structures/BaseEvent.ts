import type Client from './Client';
import { Base } from './Base';

export type eventTarget = 'database' | 'client';

export class BaseEvent extends Base {
    constructor(public client: Client, public config: { name: string; target: eventTarget }) {
        super();
    }

    /**
     * Method to execute the event
     * @param { unknown[] } args - Arguments of the event
     **/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(...args: unknown[]) {
        throw new Error('Method not implemented.');
    }
}
