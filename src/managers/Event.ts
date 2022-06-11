import { PathLike, readdirSync } from 'fs-extra';
import Client from '../core/Client';
import { ClientEvents } from 'discord.js';
import BaseEvent from '../structures/BaseEvent';

// Events types here, like discord.js, distube or others
export type EventsTypes = 'djs' | 'dbBackup' | 'timers';

// custom events here
interface extendedEvents extends ClientEvents {
    example: [test: unknown];
}

export type events = keyof extendedEvents;

/** Load discord.js events and custom events, like distube etc... */
class EventManager {
    /**
     * Constructor of the CategoryManager.
     * @param { Client } client - Client instance.
     */
    public constructor(public client: Client) {}

    public async initEvents(from: PathLike) {
        try {
            /**
             * Events files names.
             * ['ready.ts', 'messageCreate.ts', 'customEvent.ts'];
             */
            const files: string[] = readdirSync(from);
            if (files.length === 0) throw new Error(`Could not find events files in ${from}.`);

            this.client.logger.debug(
                `Found ${files.length} events files in ${from}. (${files.join(', ')})`,
                'EventManager',
            );

            for (const fileName of files) {
                /*
                    Event: { default: [BaseEvent] };
                    When you create events, you need to export it by default.
                    If some error occurs (.catch) BaseEvent is converted in undefined and we handle the error and continue registering events.
                */
                const Event: {
                    default: { type: EventsTypes } & (new (client: Client) => BaseEvent);
                } = await import(`${from}/${fileName}`).catch((error) =>
                    this.client.logger.error(new Error(`Failed to import category ${fileName}` + error)),
                );

                if (!Event?.default) continue;

                const event = new Event.default(this.client);
                if (event.type === 'djs') {
                    this.client.on(event.name as keyof ClientEvents, (...args: unknown[]) => event.execute(...args));
                } else if (event.type) {
                    // Other events
                } else {
                    this.client.logger.warn(`Unknown event type ${event.type} in ${from}/${fileName}`, 'EventManager');
                }

                this.client.logger.debug(`Imported ${event.name} as ${event.type} event.`, 'EventManager');
            }
            return this.client.logger.info(`Imported ${files.length} events.`, 'EventManager');
        } catch (error) {
            this.client.logger.error(error, 'EventManager');
        }
    }
}
export default EventManager;
