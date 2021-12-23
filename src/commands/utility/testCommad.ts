import { Message } from 'discord.js';
import { ChannelCommand } from '../../structures/ChannelCommand';
import createCommand from '../../util/decorators/createCommand';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
export default class testCommand extends ChannelCommand {
    public async execute(msg: Message): Promise<void> {
        return void msg.channel.send('test');
    }
}
