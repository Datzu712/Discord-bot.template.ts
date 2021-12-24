/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBaseCommand, BaseCommand, CommandTypes } from './BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import Client from '../core/Client';
import { CommandInteraction, Message } from 'discord.js';

export interface ISlashCommand extends IBaseCommand {
    data: IBaseCommand['data'];
    execute(interaction: CommandInteraction): Promise<void>;
}

export abstract class SlashCommand extends BaseCommand implements ISlashCommand {
    /** Command type. (Enable slash command decorators)  */
    static readonly type: CommandTypes = 'SLASH_COMMAND';
    public data: IBaseCommand['data'];
    builder?: SlashCommandBuilder;

    public constructor(public readonly client: Client, data: IBaseCommand['data']) {
        super(client, data);

        this.data = data;
    }

    public async execute(interaction: CommandInteraction) {
        throw new Error('Not implemented.');
    }

    public checkPermissions(context: CommandInteraction): boolean {
        if (context instanceof Message) throw new Error('Context must be CommandInteraction.');

        return true;
    }
}
