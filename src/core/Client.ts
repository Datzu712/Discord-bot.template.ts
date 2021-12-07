import djs from 'discord.js';
import Logger from './Logger';
import CategoryManager from '../managers/CategoryManager';
import CommandManager from '../managers/CommandManager';
// import Mongodb from '../database/mongoose';
import EventManager from '../managers/EventManager';
import { resolve } from 'path';

class Client extends djs.Client {

    public readonly commands: CommandManager;
    public readonly categories: CategoryManager;
    public readonly logger: Logger;
    // public webhook: djs.WebhookClient;
    private readonly events: EventManager;

    constructor(options: djs.ClientOptions) {
        super(options);

        const debugMode = (process.env.CLIENT_MODE === 'development')
            ? true
            : false;
            
        this.logger = new Logger(resolve(`${__dirname}/../../logs`));
        this.logger.setTextTemplate('[<dateNow>] [<level>] [<serviceName>] - `<message>`');

        this.commands = new CommandManager(this, debugMode);
        this.categories = new CategoryManager(this, debugMode);
        this.events = new EventManager(this, debugMode);
    }

    public async setup(): Promise<Client> {
        this.logger.info('Importing commands and categories...', 'client');
        try {
            await Promise.all([
                this.commands.importCommands(resolve(`${__dirname}/../commands`)), 
                this.categories.importCategories(resolve(`${__dirname}/../categories`)),
                //Mongodb.connect(this.logger),
                this.events.importEvents(resolve(`${__dirname}/../events`))
                
            ]).then(() => this.categories.syncCommands())
                .catch(err => this.logger.error(err, 'client'));

        } catch (error) {
            return Promise.reject(error);
        }
        return this;
    }

}

export default Client;