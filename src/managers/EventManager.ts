import { PathLike, readdirSync } from 'fs-extra';
import Client from '../core/Client';
import { ClientEvents } from  'discord.js';
import BaseEvent from '../structures/BaseEvent';

// Events types here, like discord.js, distube or others
export type EventsTypes = 'djs' | 'dbBackup';

// custom events here
export interface events extends ClientEvents {
    example: [unknown];
}


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
            // ['ready.ts', 'messageCreate.ts', ...]
            const files: string[] = readdirSync(from);
            if(files.length === 0)
                return Promise.reject(new Error('Could not find events files.'));
    
            for(const fileName of files) {
                const eventClass: { 
                    default: typeof BaseEvent 
                } = await import(`${from}/${fileName}`)
                    .catch((error) => this.client.logger.error(
                        new Error(`Failed to import category ${fileName}` + error)
                    ));
    
                if(!eventClass?.default)
                    continue;

                const event = new eventClass.default(this.client);

                if(event.type === 'djs') {
                    this.client.on(event.name as keyof ClientEvents, (...args: unknown[]) => event.execute({ ...args }));

                    if(this.debug)
                        this.client.logger.info(`Imported djs event ${event.name}`, 'EventManager');

                } else if(event.type) {
                    // Other events
                }
            }
            this.client.logger.info(`Imported ${files.length} events.`, 'EventManager');
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default EventManager;