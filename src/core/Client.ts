import djs from 'discord.js';
import Logger from './Logger';
import CategoryManager from '../managers/CategoryManager';
import CommandManager from '../managers/CommandManager';
import Mongodb from '../database/mongoose';

class Client extends djs.Client {

    public readonly commands: CommandManager;
    public readonly categories: CategoryManager;
    public readonly logger: Logger;
    public webhook: djs.WebhookClient;

    constructor(options: djs.ClientOptions) {
        super(options);

        const debugMode = (process.env.CLIENT_MODE === 'development')
            ? true
            : false;
            
        this.logger = new Logger('../../logs');
        this.commands = new CommandManager(this, debugMode);
        this.categories = new CategoryManager(this, debugMode);
    }

    public async start(): Promise<void> {
        // a
    }

    public async setup(): Promise<Client> {
        this.logger.info('Importing commands and categories...');
        try {
            await Promise.all([
                this.commands.importCommands('../commands'), 
                this.categories.importCategories('../categories'),
                Mongodb.connect(this.logger)
            ]).then(() => this.categories.syncCommands());

        } catch (error) {
            return Promise.reject(error);
        }
        return this;
    }

}

export default Client;