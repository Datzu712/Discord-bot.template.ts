import { Message } from 'discord.js';
import { BaseChannelCommand } from '../../structures/BaseChannelCommand';
import createCommand from '../../util/decorators/createCommand';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
export default class testCommand extends BaseChannelCommand {
    public async execute(msg: Message): Promise<void> {
        return void msg.channel.send('test');
    }
}
