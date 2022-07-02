import { Logger } from './Logger';
import DatabaseConnection from '../database/db';

import { Client as djsClient, type ClientOptions } from 'discord.js';
import { resolve } from 'path';
import { clientToken } from '../config/config';

export default class Client extends djsClient {
    public readonly logger: Logger;

    constructor(options: ClientOptions) {
        super(options);

        const debug = process.env.NODE_ENV === 'development' ? true : false;
        this.logger = new Logger({
            debugAllowed: debug,
            folderPath: resolve(__dirname, '../../logs/'),
            textTemplate: '[{timestamp}] - {level:5} {service:20} {message}',
        });
    }
    public async start(): Promise<Client> {
        await DatabaseConnection.connect(this.logger);
        await this.login(clientToken);

        return this;
    }

    public async setup(): Promise<Client> {
        String;

        return this;
    }
}
