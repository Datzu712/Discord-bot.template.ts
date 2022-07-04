import Client from './structures/Client';

async function bootstrap() {
    const bot = new Client({
        intents: 32767,
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    });

    await bot.setup();
    await bot.start();

    process.on('unhandledRejection', (error: Error) => bot.logger.error(error, 'index'));
}
bootstrap();
