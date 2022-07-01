import { Client as djsClient, type ClientOptions } from 'discord.js';

export default class Client extends djsClient {
    constructor(options: ClientOptions) {
        super(options);
        console.log('zzzz');
    }
}
