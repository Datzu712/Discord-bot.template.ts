import { ChannelCommand, ChannelExecuteContext } from '../../structures/ChannelCommand';
import { createCommand, OnlyForDevelopers } from '../../util/decorators/createCommand';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
export default class testCommand extends ChannelCommand {
    @OnlyForDevelopers()
    public async execute({ msg }: ChannelExecuteContext): Promise<void> {
        console.log('despuies');
        return void msg.channel.send('test');
    }
}
