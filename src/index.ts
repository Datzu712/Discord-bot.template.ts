import Client from './structures/Client';

new Client({
    intents: 32767,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
