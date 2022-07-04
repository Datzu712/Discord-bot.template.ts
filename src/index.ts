import Client from './structures/Client';

async function bootstrap() {
    const bot = new Client({
        intents: 32767,
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    });

    try {
        await bot.setup();
        await bot.start();

        process.on('unhandledRejection', (error: Error) => bot.logger.error(error, 'index'));
    } catch (error) {
        // We only want to log the error and exit the process, this is for save the error in the logs
        bot.logger.error(error, 'index');
    }
}
bootstrap();
