import * as Sentry from '@sentry/node';
import Logger from './Logger';
import djs from 'discord.js';

export interface IErrorManagerOptions {
    /** Sentry DSN */
    sentryDSN?: string;

    /** Discord webhook URL */
    webhookURL?: string; // Only works for Discord webhooks
    //emailLogs?: boolean; Maybe in the future
}

export default class ErrorManager {

    private _webhook?: djs.WebhookClient;

    constructor(public logger: Logger, public config: IErrorManagerOptions) {
        if(config.sentryDSN) {
            Sentry.init({
                dsn: config.sentryDSN,
                tracesSampleRate: 1.0,
                onFatalError: logger.error
            }); 
        }

        if(config.webhookURL) 
            this._webhook = new djs.WebhookClient({ 
                url: config.webhookURL 
            });

        logger.setNotifier(this.catch);

    }

    public catch(err: Error): void {
        if(this.config.sentryDSN)
            Sentry.captureException(err);

        if(this.config.webhookURL)
            this._webhook?.send(err.stack || err.message)
                .catch((err) => this.logger.error(err));

        this.logger.error(err);
    }
}