import { Client as djsClient, type ClientOptions } from 'discord.js';
import { Logger } from './Logger';
import { resolve } from 'path';

export default class Client extends djsClient {
    public readonly logger: Logger;

    constructor(options: ClientOptions) {
        super(options);

        const debug = process.env.NODE_ENV === 'development' ? true : false;
        this.logger = new Logger({
            debugAllowed: debug,
            folderPath: resolve(__dirname, '../../logs/'),
            textTemplate: '[{timestamp}] - {level:5} {service:15} {message}'
        });
    }
}
