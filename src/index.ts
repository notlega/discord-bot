/* eslint-disable @typescript-eslint/no-explicit-any */
import { DiscordClientInstance as client } from './classes';
import { checkEnv } from './configs';
import { loggers } from './utils';

checkEnv();

client.buildClient();
client.login(process.env.DISCORD_BOT_TOKEN!);
client.addEvents();

process.on('uncaughtException', (error, origin) => {
    loggers.error(`An uncaught error at ${origin}`);
    loggers.error(`Message: ${error.message}`);
    loggers.error(`Stack: ${error.stack}`);
    client.destroy();
    process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    loggers.error('Uncaught rejection', reason.toString());
    promise.catch((e: Error) => {
        loggers.error('The error in promise', e.toString());
    });
});
