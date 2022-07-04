import type Client from './Client';

export type eventTarget = 'database' | 'client';

export class BaseEvent {
    constructor(public client: Client, public config: { name: string; target: eventTarget }) {}

    /**
     * Method to execute the event
     * @param { unknown[] } args - Arguments of the event
     **/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(...args: unknown[]) {
        throw new Error('Method not implemented.');
    }
}
