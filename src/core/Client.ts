import djs from 'discord.js';
import Logger from './Logger';

class Client extends djs.Client {

    public commands: Map<string, unknown>;
    public categories: Map<string, unknown>;
    public logger: Logger;
    public webhook: djs.WebhookClient;

    constructor(options: djs.ClientOptions) {
        super(options);

        this.logger = new Logger('../../logs');
        this.commands = new Map();
        this.categories = new Map();
    }

    public async start(): Promise<void> {

        // a

    }

}

export default Client;