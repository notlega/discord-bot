import { Client, ClientEvents, GatewayIntentBits } from 'discord.js';
import { DiscordClientError } from '../errors';
import { LogFunction, EventContainerBuilder } from '../types';
import { loggers } from '../utils';
import * as EventModules from '../events';

const events: Record<string, EventContainerBuilder> = Object(EventModules);

/**
 * @todo write tsdoc
 */
export class DiscordClient {
    private _client: Client | null = null;

    private eventsAttached = false;

    private log: LogFunction;

    private errorLog: LogFunction;

    static intents = [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ];

    constructor() {
        this.log = loggers.debug;
        this.errorLog = loggers.error;
    }

    get client() {
        if (this._client === null) {
            this.errorLog('Client not initialized');
            throw new DiscordClientError('Client not initialized');
        }

        return this._client;
    }

    get isReady() {
        return this._client !== null && this._client.isReady();
    }

    buildClient() {
        this.log('Building new client...');
        this._client = new Client({
            intents: DiscordClient.intents,
        });
        this.log('Client built');
    }

    login(token: string) {
        this.log('Logging in...');
        this.client.login(token);
        this.log('Logged in');
    }

    destroy() {
        this.log('Destroying client...');
        this.client.destroy();
        this._client = null;
        this.log('Client destroyed');
    }

    addEvents() {
        this.log('Adding events...');
        if (this.eventsAttached) return;

        Object.values(events).forEach((eventObjectBuilder) => {
            const event = eventObjectBuilder(this.client);

            if (event.once) {
                this.client.once(
                    event.name as keyof ClientEvents,
                    (...args) => {
                        event.execute(...args);
                    },
                );

                return;
            }

            this.client.on(event.name as keyof ClientEvents, (...args) => {
                event.execute(...args);
            });
        });

        this.eventsAttached = true;
        this.log('Events added');
    }
}

export default new DiscordClient();
