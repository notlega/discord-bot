import { SlashCommandBuilder } from '@discordjs/builders';
import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';

export type CommandInteractionFunction = (
  interaction: APIApplicationCommandInteraction,
) => void;

export type Command = {
  data: SlashCommandBuilder;
  execute: CommandInteractionFunction;
};
