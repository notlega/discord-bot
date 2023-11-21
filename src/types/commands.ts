import { SlashCommandBuilder } from '@discordjs/builders';
import { APIApplicationCommandInteraction } from 'discord-api-types/v10';

export type CommandInteractionFunction = (
  interaction: APIApplicationCommandInteraction,
) => void;

export type Command = {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: CommandInteractionFunction;
};
