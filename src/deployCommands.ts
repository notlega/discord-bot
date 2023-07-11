import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { checkEnv } from './configs';
import { Command } from './types';
import { loggers } from './utils';

import * as commandModules from './commands';

checkEnv();

const commandsArray = Object.values<Command>(commandModules).map(
    (commandModule) => commandModule.data,
);

const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_BOT_TOKEN!,
);

loggers.info(`Refreshing ${commandsArray.length} application (/) commands...`);

rest.put(
    Routes.applicationGuildCommands(
        process.env.DISCORD_APPLICATION_ID!,
        process.env.DISCORD_GUILD_ID!,
    ),
    {
        body: commandsArray,
    },
)
    .then(() => {
        loggers.info(
            `Successfully refreshed ${commandsArray.length} application (/) commands`,
        );
    })
    .catch((error) => {
        loggers.error('Failed to refresh application (/) commands');
        loggers.error(error.message);
    });
