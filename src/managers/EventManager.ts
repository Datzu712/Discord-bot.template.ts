import type Client from '../structures/Client';
import BaseManager from '../structures/BaseManager';
import { BaseEvent } from '../structures/BaseEvent';
import { Logger } from '../structures/Logger';

export default class EventManager extends BaseManager {
    #logger: Logger;
    constructor(client: Client) {
        super(client);
        this.#logger = client.logger.createContextLogger('EventManager');
    }
    public async initEvents(from: string): Promise<void> {
        this.#logger.info(`Importing events from ${from}`);
        const files = await this.importAllFilesFromPath<new (client: Client) => BaseEvent>(from, true);
        this.#logger.debug(`Detected ${files.length} events`);

        for (const file of [...files]) {
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
            // Check if the event has all required properties
            if (!event.execute || !event.config?.name || !event.config?.target) {
                throw new Error(
                    `An invalid event was provided in ${file.path} without ${
                        !event.execute ? 'execute function' : 'required event config'
                    }.`,
                );
            }
            this.#logger.debug(`Registering event ${event.config.name} from ${event.config.target}`);

            // Listen to the event depending on the target
            if (event.config.target === 'client') {
                this.client.on(event.config.name, event.execute.bind(event));
            } else {
                this.#logger.error(`Unknown target ${event.config.target} for event ${event.config.name}`);
                files.splice(files.indexOf(file), 1);
            }
        }
        this.#logger.info(`Successfully imported ${files.length} events`);
    }
}
