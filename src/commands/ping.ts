import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping your mother');

const execute = (interaction: CommandInteraction) =>
    interaction.reply({ content: 'pong', ephemeral: true });

export default {
    data,
    execute,
} as Command;
