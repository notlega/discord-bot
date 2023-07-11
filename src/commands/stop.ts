import {
    CommandInteraction,
    GuildMemberRoleManager,
    SlashCommandBuilder,
} from 'discord.js';
import {
    DescribeInstancesCommand,
    StopInstancesCommand,
} from '@aws-sdk/client-ec2';
import { ec2Client, loggers } from '../utils';
import { Command } from '../types';

const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop Java Server');

const execute = async (interaction: CommandInteraction) => {
    // check if user has permission to run this command
    if (
        !(interaction.member?.roles as GuildMemberRoleManager).cache.has(
            process.env.DISCORD_ROLE_ID as string,
        )
    ) {
        loggers.warn(
            `${interaction.user.username} does not have permission to run this command`,
        );
        interaction.reply({
            content: 'You do not have permission to run this command',
            ephemeral: true,
        });
        return;
    }

    loggers.info('Stopping Java Server...');

    let instanceId: string;

    const describeInstancesCommand = new DescribeInstancesCommand({
        Filters: [
            {
                Name: 'tag:Name',
                Values: ['java-minecraft-server'],
            },
        ],
    });

    try {
        const { Reservations } = await ec2Client.send(describeInstancesCommand);

        if (!Reservations) {
            loggers.error('No reservations found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (!Reservations[0]?.Instances) {
            loggers.error('No instances found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (
            Reservations[0].Instances[0]?.State?.Code !== 16 ||
            Reservations[0].Instances[0]?.State?.Name === 'stopping' ||
            Reservations[0].Instances[0]?.State?.Name === 'stopped'
        ) {
            loggers.info('Java Server is already stopped');
            interaction.reply({
                content: 'Java Server is already stopped',
            });
            return;
        }

        instanceId = Reservations[0].Instances[0]?.InstanceId as string;
    } catch (error) {
        loggers.error(`Error retrieving data from AWS: ${error}`);
        interaction.reply({
            content: 'something broke, ask hinjourn to fix',
        });
        return;
    }

    const stopInstancesCommand = new StopInstancesCommand({
        InstanceIds: [instanceId],
    });

    try {
        const { StoppingInstances } = await ec2Client.send(
            stopInstancesCommand,
        );

        if (!StoppingInstances) {
            loggers.error('No instances found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (!StoppingInstances[0]?.CurrentState) {
            loggers.error('No current state found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }
    } catch (error) {
        loggers.error(`Error stopping instance: ${error}`);
        interaction.reply({
            content: 'something broke, ask hinjourn to fix',
        });
        return;
    }

    loggers.info('Stopped Java Server');
    interaction.reply({
        content: 'Stopped Java Server',
    });
};

export default {
    data,
    execute,
} as Command;
