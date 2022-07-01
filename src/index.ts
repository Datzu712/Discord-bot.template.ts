import Client from './structures/Client';

const bot = new Client({
    intents: 32767,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
bot.logger.info('Hello');
