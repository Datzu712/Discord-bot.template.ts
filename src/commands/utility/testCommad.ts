import { ChannelCommand } from '../../structures/ChannelCommand';
import { createCommand, OnlyForDevelopers } from '../../util/decorators/createCommand';
import { Message } from '../../util/decorators/commandParams';
import { Message as djsMsg } from 'discord.js';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
export default class testCommand extends ChannelCommand {
    // @OnlyForDevelopers()
    public async execute(@Message() msg: djsMsg): Promise<void> {
        console.log('msg');
        msg;
    }

    //test = () => 'test';
}
