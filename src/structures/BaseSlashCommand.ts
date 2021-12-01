/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICommand, BaseCommand, CommandTypes } from './BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import Client from '../core/Client';
import { CommandInteraction, Message } from 'discord.js';

export interface IBaseSlashCommand extends ICommand {
    options: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
}

export default class SlashCommand extends BaseCommand implements IBaseSlashCommand {

    public readonly type: CommandTypes;

    public constructor(public readonly client: Client, public data: ICommand['data'], public readonly options: SlashCommandBuilder) {
        super(client, data);

        this.type = 'SLASH_COMMAND';
    }

    public send(messageOptions: unknown): Promise<Message> {
        throw new Error('Method not implemented.');
    }

    public async execute(interaction: CommandInteraction) {
        throw new Error('Not implemented.');
    }
}