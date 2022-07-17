import createEvent from '../core/decorators/event.decorator';
import { BaseEvent } from '../core/structures/BaseEvent';
import { Message } from 'discord.js';

@createEvent({ name: 'messageCreate', target: 'client' })
export default class MessageCreate extends BaseEvent {
    public async execute(message: Message): Promise<void> {
        this.client.logger.info('I listened one message of ' + message.author.username, 'Message');
    }
}
