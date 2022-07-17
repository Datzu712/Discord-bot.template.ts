import type Client from '../structures/Client';
import BaseManager from './BaseManager';
import { BaseEvent } from '../structures/BaseEvent';

export default class EventManager extends BaseManager<string, BaseEvent> {
    constructor(private client: Client) {
        super();

        this.setLogger(client.logger.createContextLogger('EventManager'));
    }

    /**
     * Import and init all events from a given path.
     * @param { string } path - Path to the directory to import all events.
     */
    public async initEvents(path: string): Promise<void> {
        const files = await this.importAllFilesFromPath<new (client: Client) => BaseEvent>(path, true);
        this.logger.info(`Importing events from ${path} (Detected ${files.length} events)`);

        for (const file of files) {
            // Check if the file's content is an constructor of BaseEvent
            if (!file.content?.constructor || !(file.content.prototype instanceof BaseEvent)) {
                throw new Error(
                    `An invalid constructor event was provided in ${file.path}. Check the file's content if it is exporting a class extended to BaseEvent.`,
                );
            }
            const eventClass = file.content;
            /**
             * If the class was created with the @createEvent decorator, we only need to assign the client into the event constructor.
             * Inside the decorator, we return an Proxy object that will be used to create the event instance.
             */
            const event = new eventClass(this.client);
            // Create a specific logger for the event
            event.setLogger(this.client.logger.createContextLogger(event.config.name));
            // Check if the event has all required properties
            if (!event.execute || !event.config?.name || !event.config?.target) {
                throw new Error(
                    `An invalid event was provided in ${file.path} without ${
                        !event.execute ? 'execute function' : 'required event config'
                    }.`,
                );
            }
            this.logger.debug(
                `Registering {c:yellow}${event.config.name}{c:reset} in {c:yellow}${event.config.target}{c:reset} from {c:blue}${file.path}{c:reset}`,
            );
            // Listen to the event depending on the target
            if (event.config.target === 'client') {
                this.client.on(event.config.name, event.execute.bind(event));

                this.set(event.config.name, event);
            } else {
                this.logger.error(
                    `Unknown target {c:red}${event.config.target}{c:reset} for event {c:red}${event.config.name}{c:reset}`,
                );
            }
        }
        this.logger.info(`{c:green}Successfully imported ${this.size} events{c:reset}`);
    }
}
