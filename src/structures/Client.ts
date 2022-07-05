import { Client as djsClient, type ClientOptions } from 'discord.js';
import { resolve } from 'path';

import { Logger } from '../structures/Logger';
import DatabaseConnection from '../database/Database';
import { clientToken } from '../config/config';
import EventManager from '../managers/EventManager';
import CommandManager from '../managers/CommandManager';
import Util from '../utils/Util';

export default class Client extends djsClient {
    public readonly logger: Logger;
    public readonly utils: Util;

    // managers
    public readonly events: EventManager;
    public readonly commands: CommandManager;

    constructor(options: ClientOptions) {
        super(options);

        const debug = process.env.NODE_ENV === 'development' ? true : false;
        this.logger = new Logger({
            debugAllowed: debug,
            folderPath: resolve(__dirname, '../../logs/'),
            textTemplate: '[{timestamp}] - {level:5} {service:20} {message}',
        });

        this.events = new EventManager(this);
        this.commands = new CommandManager(this);

        this.utils = new Util(this);
    }

    /**
     * Connects to the database and discord client.
     * @returns { Promise<void> }
     */
    public async start(): Promise<Client> {
        await DatabaseConnection.connect(this.logger);
        await this.login(clientToken);

        return this;
    }

    /**
     * Import all the commands, events and all categories and set it in the client.
     * @returns { Promise<client> }
     */
    public async setup(): Promise<Client> {
        await this.commands.importCommands(resolve(__dirname, '../commands'));
        await this.events.initEvents(resolve(__dirname, '../events'));

        return this;
    }
}
