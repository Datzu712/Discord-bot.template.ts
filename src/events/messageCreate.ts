import createEvent from '../util/decorators/createEvent';
import BaseEvent from '../structures/BaseEvent';
import { Message } from 'discord.js';

@createEvent({
    name: 'messageCreate',
    type: 'djs',
})
export default class MessageCreate extends BaseEvent {
    public async execute(message: Message) {
        message.reply('Si funca');
    }
}
