/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBaseCommand, BaseCommand, CommandTypes } from './BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import Client from '../core/Client';
import { CommandInteraction, Message } from 'discord.js';

export interface IBaseSlashCommand extends IBaseCommand {
    builder: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
}

export default abstract class SlashCommand extends BaseCommand implements IBaseSlashCommand {
    /** Command type. (Enable slash command decorators)  */
    static readonly type: CommandTypes = 'SLASH_COMMAND';
    public data: IBaseCommand['data'];
    public builder: SlashCommandBuilder;

    public constructor(public readonly client: Client, data: IBaseCommand['data'], builder: SlashCommandBuilder) {
        super(client, data);

        this.data = data;
        this.builder = builder;
    }

    public async execute(interaction: CommandInteraction) {
        throw new Error('Not implemented.');
    }

    public checkPermissions(context: CommandInteraction): boolean {
        if (context instanceof Message) throw new Error('Context must be CommandInteraction.');

        return true;
    }
}
