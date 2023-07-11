import { Events } from 'discord.js';
import { EventContainerBuilder } from '../types';
import { loggers } from '../utils';

const ready: EventContainerBuilder = (client) => ({
    name: Events.ClientReady,
    once: true,
    execute: () => {
        const { id, tag } = client.user!;
        loggers.event(`Logged in as ${tag}`, `ID: ${id}`);
    },
});

export default ready;
