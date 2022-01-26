import djs from 'discord.js';
import Logger from './Logger';
import CategoryManager from '../managers/CategoryManager';
import CommandManager from '../managers/CommandManager';
import Mongodb from '../database/mongoose';
import EventManager from '../managers/EventManager';
import { resolve } from 'path';
import Util from '../util/Util';

import('../structures/Guild');

class Client extends djs.Client {
    public readonly commands: CommandManager;
    public readonly categories: CategoryManager;
    public readonly logger: Logger;
    // public webhook: djs.WebhookClient;
    private readonly events: EventManager;
    public readonly utils: Util;

    // provisional
    public readonly team = ['444295883182309378'];

    constructor(options: djs.ClientOptions) {
        super(options);

        const debugMode = process.env.CLIENT_MODE === 'development' ? true : false;

        this.logger = new Logger(resolve(`${__dirname}/../../logs`));
        this.logger.setTextTemplate('[<dateNow>] [<level>] [<serviceName>] - <message>');

        this.commands = new CommandManager(this, debugMode);
        this.categories = new CategoryManager(this, debugMode);
        this.events = new EventManager(this, debugMode);
        this.utils = new Util(this);
    }

    /**
     * Setup connection with the database, and load all the commands, categories, events and sync it (commands with categories)
     * @returns
     */
    public async setup(): Promise<Client> {
        this.logger.info('Importing commands and categories...', 'client');
        try {
            await Promise.all([
                this.commands.importCommands(resolve(`${__dirname}/../commands`)),
                this.categories.importCategories(resolve(`${__dirname}/../categories`)),
                Mongodb.connect(this.logger),
                this.events.importEvents(resolve(`${__dirname}/../events`)),
            ])
                .then(() => this.categories.syncCommands())
                // It's difficult that the promise be rejected.
                .catch((err) => this.logger.error(err, 'client'));
        } catch (error) {
            this.logger.error(error as Error, 'Client');
        }
        return this;
    }
}

export default Client;
