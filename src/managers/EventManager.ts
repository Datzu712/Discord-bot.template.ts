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
     * @param { boolean } debug - If debug is true, will send more details in the console about importing events.
     */
    public constructor(public client: Client, private debug?: boolean) {}

    public async importEvents(from: PathLike) {
        try {
            /**
             * Events files names.
             * ['ready.ts', 'messageCreate.ts', 'customEvent.ts'];
             */
            const files: string[] = readdirSync(from);
            if (files.length === 0) return Promise.reject(new Error('Could not find events files.'));

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

                    if (this.debug) this.client.logger.info(`Imported djs event ${event.name}`, 'EventManager');
                } else if (event.type) {
                    // Other events
                } else
                    this.client.logger.warn(`Unknown event type ${event.type} in ${from}/${fileName}`, 'EventManager');
            }
            return this.client.logger.info(`Imported ${files.length} events.`, 'EventManager');
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export default EventManager;
