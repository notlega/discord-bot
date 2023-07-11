import { Client, Events } from 'discord.js';

export interface EventContainer {
    name: Events;
    once?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => void;
}

export type EventContainerBuilder = (client: Client) => EventContainer;
