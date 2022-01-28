import createEvent from '../util/decorators/createEvent';
import BaseEvent from '../structures/BaseEvent';
import { Message } from 'discord.js';
import prefixModel from '../database/models/guild';

@createEvent({
    name: 'messageCreate',
    type: 'djs',
})
export default class MessageCreate extends BaseEvent {
    public execute = async (message: Message) => {
        if (message.author.bot) return;

        if (message.guild && !message.guild.prefix) {
            const guildConfig = await prefixModel.findOne({ _id: message.guild.id }).catch(() => undefined);

            message.guild.prefix = guildConfig?.prefix ?? process.env.DEFAULT_BOT_PREFIX;
        }
        // You can add multiples prefixes
        const prefixes: string[] = [
            message.guild?.prefix ?? process.env.DEFAULT_BOT_PREFIX,
            `<@!${this.client.user?.id}> `, // TODO Fix this (I'm very bad using regex)
            `<@${this.client.user?.id}> `,
        ];
        // If some user mentioned the bot, the bot will reply with the guild prefix.
        const regMention = new RegExp(`^<@!?${this.client.user?.id}>( |)$`);
        if (message.content.match(regMention)) {
            message
                .reply(`Hello ${'`'}${message.author.username}${'`'}! my prefix is ${'`'}${[prefixes[0]]}${'`'}`)
                .catch(() => undefined);
        }

        for (const prefix of prefixes) {
            this.client.commands.handle(message, prefix);
        }
    };
}
