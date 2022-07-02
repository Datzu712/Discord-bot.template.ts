import Client from './structures/Client';

const bot = new Client({
    intents: 32767,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
bot.setup().then(() => bot.start());

process.on('unhandledRejection', (error: Error) => bot.logger.error(error, 'index'));
