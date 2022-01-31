import { Message, ReplyMessageOptions, MessageOptions } from 'discord.js';

const oldReply = Message.prototype.reply;

Message.prototype.reply = async function (options: ReplyMessageOptions): Promise<Message> {
    return options.attemptReply
        ? oldReply.call(this, options).catch(() => this.channel.send(options as MessageOptions))
        : oldReply.call(this, options);
};
