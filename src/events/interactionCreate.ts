import { CommandInteractionOptionResolver, Events, Interaction } from 'discord.js';
import { Command, EventContainerBuilder } from '../types';
import { loggers } from '../utils';

import * as commandModules from '../commands';

const commands: Record<string, Command> = Object(commandModules);

const interactionCreate: EventContainerBuilder = (client) => ({
    name: Events.InteractionCreate,
    execute: (interaction: Interaction) => {
        if (interaction.isCommand()) {
			const { commandName, options } = interaction;
			const commandNameArray: string[] = [commandName];

			try {
				const subcommand = (
					options as CommandInteractionOptionResolver
				).getSubcommand();
				const subcommandGroup = (
					options as CommandInteractionOptionResolver
				).getSubcommandGroup();

				if (subcommandGroup !== null) commandNameArray.push(subcommandGroup);
				if (subcommand !== null) commandNameArray.push(subcommand);
			} catch (e) {
				loggers.debug((e as TypeError).message);
			}

			loggers.event(`Command: \`/${commandNameArray.join(' ')}\` User: \`${interaction.user.tag}\``);
			commands[commandName]?.execute(interaction, client);
		}
    },
});

export default interactionCreate;
