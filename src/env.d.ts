declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        DISCORD_BOT_TOKEN: string;
        DISCORD_APPLICATION_ID: string;
        DISCORD_PUBLIC_KEY: string;
        DISCORD_GUILD_ID: string;
        DISCORD_ROLE_ID: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
        AWS_REGION: string;
    }
}
