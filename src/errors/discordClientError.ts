export class DiscordClientError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DiscordClientError';
    }
}
