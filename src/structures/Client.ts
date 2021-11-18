import djs from 'discord.js';
import Logger from '../managers/Logger';
import ErrorManager from '../managers/Error';

export interface IClientOptions extends djs.ClientOptions {
    commandsLog: boolean;
}

export default class Client extends djs.Client {

    /** Controls logs by files and console */
    public logger: Logger;

    /** Control errors and  notify them */
    public errors: ErrorManager;

    public commands: any;

    public categories: any;

    /** <commandName, { users: Map<userId, cooldown> }> (Global cooldowns only for default commands) */
    public readonly cooldowns: Map<string, { users: Map<string, number> }>;

    constructor(public options: IClientOptions) {
        super(options);
        
        this.logger = new Logger('../../logs');

        this.errors = new ErrorManager(this.logger, {
            sentryDSN: process.env.SENTRY_DSN,
            webhookURL: process.env.DISCORD_WEBHOOK_URL
        });

        this.cooldowns = new Map();
    }

    public async start(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve;
            } catch (error) {

                reject(error);   

            } finally {

                resolve();

            }

        });
    }
}