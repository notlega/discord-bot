import {
    Client,
    CommandInteraction,
    InteractionResponse,
    SlashCommandBuilder,
} from 'discord.js';

export type CommandInteractionFunction = (
    interaction: CommandInteraction,
    client?: Client,
) => Promise<InteractionResponse | void>;

export type Command = {
    data: SlashCommandBuilder;
    execute: CommandInteractionFunction;
};
