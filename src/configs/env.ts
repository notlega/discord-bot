import dotenv from 'dotenv';
import { InvalidENVError } from '../errors';
import { loggers } from '../utils';

dotenv.config();

const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
    DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
    DISCORD_ROLE_ID: process.env.DISCORD_ROLE_ID,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
} as const;

/**
 * - Checks if the environment variables are set
 * - If NODE_ENV is not set, it defaults to development
 * @throws {InvalidENVError} if the environment variables are not set
 */
export const checkEnv = () => {
    const envArray = Object.entries(ENV);

    envArray.forEach((env) => {
        if (env[0] === 'NODE_ENV' && !env[1]) {
            process.env.NODE_ENV = 'development';
            loggers.warn('NODE_ENV is not set, defaulting to development');
        }

        if (!env[1]) {
            throw new InvalidENVError(`${env[0]} is not set`);
        }
    });
};
