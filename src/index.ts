'use strict';

import Client from './core/Client';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Client({
    intents: 32767
});

bot.setup()
    .then((client) => client.login(process.env.BOT_TOKEN))
    .catch((err) => bot.logger.error(err, 'client_login'));

process.on('unhandledRejection', (err: Error) => bot.logger.error(err, 'unhandled_rejection'));