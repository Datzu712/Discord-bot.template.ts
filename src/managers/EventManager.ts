import Client from '../core/Client';

export type eventsTypes = 'djs';

/** Load discord.js events and custom events, like distube etc... */
class EventManager {

    public readonly events = ['djs'];

    /**
     * Constructor of the CategoryManager.
     * @param { Client } client - Client instance.
     * @param { boolean } debug - If debug is true, will send more details in the console about importing events.
     */
    public constructor(public client: Client, private debug?: boolean) {}

}

export default EventManager;